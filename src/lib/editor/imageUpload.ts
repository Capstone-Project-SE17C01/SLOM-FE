import Quill from "quill";

class ImageUpload {
  quill: Quill;
  options: any;
  range: any;

  constructor(quill: Quill, options = {}) {
    this.quill = quill;
    this.options = options;
    this.range = null;

    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);

    this.quill.root.addEventListener("drop", this.handleDrop, true);
    this.quill.root.addEventListener("paste", this.handlePaste, true);

    this.quill.on("editor-change", (eventName, ...args) => {
      if (eventName === "selection-change") {
        this.range = args[0];
      }
    });
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files.length &&
      !this.quill.options.readOnly
    ) {
      this.readFiles(event.dataTransfer.files);
    }
  }

  handlePaste(event: ClipboardEvent) {
    if (
      event.clipboardData &&
      event.clipboardData.files &&
      event.clipboardData.files.length &&
      !this.quill.options.readOnly
    ) {
      event.preventDefault();
      this.readFiles(event.clipboardData.files);
    }
  }

  async readFiles(files: FileList) {
    const { image } = this.options;

    if (typeof image !== "function") {
      return;
    }

    Array.from(files).forEach(async (file) => {
      if (
        !file.type.match(
          /^image\/(gif|jpe?g|png|svg|webp|bmp|vnd\.microsoft\.icon)$/i,
        )
      ) {
        return;
      }

      const imageUrl = await image(file);

      if (imageUrl) {
        this.insertToEditor(imageUrl);
      }
    });
  }

  insertToEditor(url: string) {
    const index = this.range ? this.range.index : this.quill.getLength();

    this.quill.insertEmbed(index, "image", url, "user");
    this.quill.setSelection(index + 1, 0); // Di chuyển con trỏ sau ảnh
    this.range = null; // Reset lại range
  }
}

export default ImageUpload;
