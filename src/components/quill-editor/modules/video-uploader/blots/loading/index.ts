import Quill from 'quill';
const InlineBlot: any = Quill.import('blots/block');

const BlockEmbed: any = Quill.import('blots/block/embed');
const Link = Quill.import('formats/link');

const ATTRIBUTES = ['height', 'width'];
import './style.css';

class VideoBlock extends BlockEmbed {
	static create(src: string): void {
		const node = super.create(src);

		// 添加video标签所需的属性
		node.setAttribute('controls', 'controls');
		node.setAttribute('type', 'video/mp4');
		node.setAttribute('src', this.sanitize(src));
		return node;
	}

	static formats(domNode: HTMLElement) {
		return ATTRIBUTES.reduce((formats: Record<string, string>, attribute) => {
			if (domNode.hasAttribute(attribute)) {
				formats[attribute] = domNode.getAttribute(attribute);
			}
			return formats;
		}, {});
	}

	static sanitize(url: string) {
		return Link.sanitize(url);
	}

	static value(domNode: HTMLElement) {
		return domNode.getAttribute('src');
	}
}
VideoBlock.blotName = 'video';
VideoBlock.className = 'ql-video';
VideoBlock.tagName = 'video';
Quill.register(VideoBlock);

class LoadingVideo extends InlineBlot {
	static create(src: string): HTMLElement {
		const node = super.create(src);
		const video = document.createElement('video');
		video.setAttribute('src', src);
		node.appendChild(video);
		return node;
	}

	deleteAt(index: number, length: number): void {
		super.deleteAt(index, length);
		this.cache = {};
	}
	static value(domNode: HTMLElement): { src: string; custom: string } {
		const { src, custom } = domNode.dataset;
		return { src, custom };
	}
}
LoadingVideo.blotName = 'videoBlot';
LoadingVideo.className = 'video-uploading';
LoadingVideo.tagName = 'span';
Quill.register({ 'formats/videoBlot': LoadingVideo });
export default LoadingVideo;
