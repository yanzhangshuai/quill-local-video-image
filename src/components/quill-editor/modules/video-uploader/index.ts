import Quill, { RangeStatic } from 'quill';
import LoadingVideo from './blots/loading';
class VideoUploader {
  quill: Quill;
  options: {
    limit?: number;
    limitError?: (limit: number) => void;
    upload: (file: File) => Promise<string>;
  };
  range: RangeStatic;
  fileHolder: HTMLInputElement;

  constructor(
    quill: Quill,
    options: {
      limit?: number;
      limitError?: (limit: number) => void;
      upload: (file: File) => Promise<string>;
    }
  ) {
    this.quill = quill;
    this.options = options;
    this.range = null;

    if (typeof this.options?.upload !== 'function')
      console.warn('[Missing config] upload function that returns a promise is required');

    const toolbar = this.quill.getModule('toolbar');
    toolbar.addHandler('video', this.selectLocalImage.bind(this));

    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);

    // 支持拖拽
    this.quill.root.addEventListener('drop', this.handleDrop, false);
    this.quill.root.addEventListener('paste', this.handlePaste, false);
  }

  selectLocalImage(): void {
    this.range = this.quill.getSelection();
    this.fileHolder = document.createElement('input');
    this.fileHolder.setAttribute('type', 'file');
    this.fileHolder.setAttribute('accept', 'video/*');
    this.fileHolder.setAttribute('style', 'visibility:hidden');

    this.fileHolder.onchange = this.fileChanged.bind(this);

    document.body.appendChild(this.fileHolder);

    this.fileHolder.click();

    window.requestAnimationFrame(() => {
      document.body.removeChild(this.fileHolder);
    });
  }

  handleDrop(evt: DragEvent): void {
    evt.stopPropagation();
    evt.preventDefault();
    if (evt.dataTransfer && evt.dataTransfer.files && evt.dataTransfer.files.length) {
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(evt.clientX, evt.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(
            range.startContainer,
            range.startOffset,
            range.startContainer,
            range.startOffset
          );
        }
      } else {
        const selection = document.getSelection();
        const range = document.caretPositionFromPoint(evt.clientX, evt.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(
            range.offsetNode,
            range.offset,
            range.offsetNode,
            range.offset
          );
        }
      }

      this.range = this.quill.getSelection();
      const file = evt.dataTransfer.files[0];

      setTimeout(() => {
        this.range = this.quill.getSelection();
        this.readAndUploadFile(file);
      }, 0);
    }
  }

  handlePaste(evt: ClipboardEvent): void {
    //@ts-ignore
    const clipboard = evt.clipboardData || window.clipboardData;

    // IE 11 is .files other browsers are .items
    if (clipboard && (clipboard.items || clipboard.files)) {
      const items = clipboard.items || clipboard.files;
      const IMAGE_MIME_REGEX = /^video\/*.$/i;

      for (let i = 0; i < items.length; i++) {
        if (IMAGE_MIME_REGEX.test(items[i].type)) {
          const file = items[i].getAsFile ? items[i].getAsFile() : items[i];

          if (file) {
            this.range = this.quill.getSelection();
            evt.preventDefault();
            setTimeout(() => {
              this.range = this.quill.getSelection();
              this.readAndUploadFile(file);
            }, 0);
          }
        }
      }
    }
  }

  readAndUploadFile(file: File): void {
    if (this.options?.limit > 0 && this.options?.limit < file.size) {
      this.options?.limitError && this.options?.limitError(this.options.limit);
      return;
    }

    const fileReader = new FileReader();
    if (file) {
      fileReader.readAsDataURL(file);
    }
    fileReader.addEventListener(
      'load',
      () => {
        const base64ImageSrc = fileReader.result;
        
        this.insertBase64Image(base64ImageSrc);

        this.options.upload(file).then(
          (imageUrl) => {
            this.insertToEditor(imageUrl);
          },
          (error) => {
            this.removeBase64Image();
            console.warn(error);
          }
        );
      },
      false
    );
  }

  fileChanged(): void {
    const file = this.fileHolder.files[0];
    this.readAndUploadFile(file);
  }

  insertBase64Image(url: string | ArrayBuffer): void {
    const range = this.range;
    this.quill.insertEmbed(range.index, LoadingVideo.blotName, `${url}`, 'user');
  }

  insertToEditor(url: string): void {
    const range = this.range;
    // Delete the placeholder video
    this.quill.deleteText(range.index, 3, 'user');

    console.log(this.quill.getText());

    // Insert the server saved video
    this.quill.insertEmbed(range.index, 'video', `${url}`, 'user');

    range.index++;
    this.quill.setSelection(range, 'user');
  }

  removeBase64Image(): void {
    const range = this.range;
    this.quill.deleteText(range.index, 3, 'user');
  }
}

//@ts-ignore
window.VideoUploader = VideoUploader;
export default VideoUploader;
