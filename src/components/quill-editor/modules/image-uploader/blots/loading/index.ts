import Quill from "quill";
import './style.css';
const InlineBlot = Quill.import("blots/block");

class LoadingImage extends InlineBlot {
    static create(src: string) {
        const node = super.create(src);

        const image = document.createElement("img");
        image.setAttribute("src", src);
        node.appendChild(image);
        return node;
    }
    deleteAt(index: number, length: number) {
        super.deleteAt(index, length);
        this.cache = {};
    }
    static value(domNode: HTMLElement) {
        const { src, custom } = domNode.dataset;
        return { src, custom };
    }
}

LoadingImage.blotName = "imageBlot";
LoadingImage.className = "image-uploading";
LoadingImage.tagName = "span";
Quill.register({ "formats/imageBlot": LoadingImage });

export default LoadingImage;