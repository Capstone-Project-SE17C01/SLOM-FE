import Quill from "quill";
import left from "@img/icon/left.svg";
import center from "@img/icon/center.svg";
import right from "@img/icon/right.svg";
class ImageResize {
  quill: Quill;
  options: any;
  currentImg: HTMLElement | null;
  overlay: HTMLElement | null;
  handle: HTMLElement | null;
  icon: Array<any>;

  constructor(quill: Quill, options: any) {
    this.quill = quill;
    this.options = options;
    this.currentImg = null;
    this.overlay = null;
    this.handle = null;
    this.icon = [left, center, right];

    this.quill.root.addEventListener("click", this.handleClick.bind(this));
    this.quill.root.addEventListener("scroll", this.handleScroll.bind(this));

    // Add CSS for image alignment
    const style = document.createElement("style");

    style.textContent = `
      .ql-align-left { display:flex; justify-content: flex-start;; margin-right: 1em; }
      .ql-align-center { display: flex; justify-content: center; align-items: center; margin-left: auto; margin-right: auto;}
      .ql-align-right {display:flex; justify-content: flex-end; margin-left: 1em; }
    `;
    document.head.appendChild(style);
  }

  handleClick(evt: MouseEvent) {
    if (
      evt.target &&
      (evt.target as HTMLElement).tagName === "IMG" &&
      !this.quill.options.readOnly
    ) {
      if (this.currentImg === evt.target) return;
      if (this.currentImg) this.hide();
      this.show(evt.target as HTMLElement);
    } else if (this.currentImg) {
      this.hide();
    }
  }

  show(img: HTMLElement) {
    this.currentImg = img;
    this.showOverlay();
    this.showHandle();
  }

  showOverlay() {
    if (this.overlay) {
      this.hideOverlay();
    }
    this.overlay = document.createElement("div");
    this.overlay.classList.add("image-resize-overlay");
    Object.assign(this.overlay.style, {
      position: "absolute",
      boxSizing: "border-box",
      border: "1px dashed #444",
    });
    this.quill.root.parentNode?.appendChild(this.overlay);
    this.positionOverlay();

    // Add alignment buttons
    const alignmentContainer = document.createElement("div");

    alignmentContainer.classList.add("image-alignment-container");
    Object.assign(alignmentContainer.style, {
      position: "absolute",
      top: "-30px",
      left: "0",

      right: "0",
      display: "flex",
      justifyContent: "center",
      gap: "5px",
    });

    const alignments = ["left", "center", "right"];

    alignments.forEach((alignment, index) => {
      const button = document.createElement("button");

      button.type = "button";
      const imgElement = document.createElement("img");

      imgElement.setAttribute("src", this.icon[index].src); // Đặt src cho ảnh
      imgElement.setAttribute("alt", `Icon for ${alignment} direction`); // Đặt alt cho ảnh
      button.appendChild(imgElement);
      button.classList.add("image-align-button");
      Object.assign(button.style, {
        border: "1px solid #ccc",
        cursor: "pointer",
        backgroundColor: "#fff",
        padding: "4px",
        borderRadius: "4px",
        transition: "opacity 0.3s ease, border-color 0.3s ease",
      });
      button.addEventListener("mouseover", () => {
        button.style.opacity = "0.8"; // Màu nền khi hover
      });

      button.addEventListener("mouseout", () => {
        button.style.opacity = "1"; // Màu nền khi hover
      });
      button.addEventListener("click", () =>
        this.alignImage(alignment as "left" | "center" | "right"),
      );
      alignmentContainer.appendChild(button);
    });

    this.overlay.appendChild(alignmentContainer);
  }

  hideOverlay() {
    if (!this.overlay) return;
    this.overlay.parentNode?.removeChild(this.overlay);
    this.overlay = null;
  }

  showHandle() {
    if (this.handle) {
      this.hideHandle();
    }
    this.handle = document.createElement("div");
    this.handle.classList.add("image-resize-handle");
    Object.assign(this.handle.style, {
      position: "absolute",
      height: "12px",
      width: "12px",
      backgroundColor: "white",
      border: "1px solid #777",
      boxSizing: "border-box",
      opacity: "0.80",
      cursor: "se-resize",
    });
    this.handle.addEventListener("mousedown", this.handleMousedown.bind(this));
    this.quill.root.parentNode?.appendChild(this.handle);
    this.positionHandle();
  }

  hideHandle() {
    if (!this.handle) return;
    this.handle.removeEventListener(
      "mousedown",
      this.handleMousedown.bind(this),
    );
    this.handle.parentNode?.removeChild(this.handle);
    this.handle = null;
  }

  positionOverlay() {
    if (!this.overlay || !this.currentImg) return;
    const rect = this.currentImg.getBoundingClientRect();
    const containerRect = (
      this.quill.root.parentNode as any
    )?.getBoundingClientRect();

    if (containerRect) {
      Object.assign(this.overlay.style, {
        left: `${rect.left - containerRect.left - 1 + this.quill.root.scrollLeft}px`,
        top: `${rect.top - containerRect.top + this.quill.root.scrollTop}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
    }
  }

  positionHandle() {
    if (!this.handle || !this.currentImg) return;
    const rect = this.currentImg.getBoundingClientRect();
    const containerRect = (
      this.quill.root.parentNode as any
    )?.getBoundingClientRect();

    if (containerRect) {
      Object.assign(this.handle.style, {
        left: `${rect.left - containerRect.left + rect.width - 6 + this.quill.root.scrollLeft}px`,
        top: `${rect.top - containerRect.top + rect.height - 6 + this.quill.root.scrollTop}px`,
      });
    }
  }

  hide() {
    if (this.overlay) {
      const alignmentContainer = this.overlay.querySelector(
        ".image-alignment-container",
      );

      if (alignmentContainer) {
        alignmentContainer.remove();
      }
    }
    this.hideOverlay();
    this.hideHandle();
    this.currentImg = null;
  }

  handleMousedown(evt: MouseEvent) {
    if (!this.currentImg) return;
    const start = {
      x: evt.clientX,
      y: evt.clientY,
      width: this.currentImg.offsetWidth,
      height: this.currentImg.offsetHeight,
    };
    const mousemove = (e: MouseEvent) => {
      const deltaX = e.clientX - start.x;
      const deltaY = e.clientY - start.y;
      const width = start.width + deltaX;
      const height = start.height + deltaY;
      const aspectRatio = start.width / start.height;
      const newWidth = Math.round(Math.max(width, height * aspectRatio));
      const newHeight = Math.round(newWidth / aspectRatio);

      (this.currentImg as any)?.setAttribute("width", newWidth.toString());
      (this.currentImg as any)?.setAttribute("height", newHeight.toString());
      this.positionOverlay();
      this.positionHandle();
    };
    const mouseup = () => {
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    };

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  }

  handleScroll() {
    this.positionOverlay();
    this.positionHandle();
  }

  alignImage(alignment: "left" | "center" | "right") {
    if (!this.currentImg) return;

    // Remove existing alignment classes
    this.currentImg.parentElement?.classList.remove(
      "ql-align-left",
      "ql-align-center",
      "ql-align-right",
    );

    // Add new alignment class
    this.currentImg.parentElement?.classList.add(`ql-align-${alignment}`);
    // Update Quill's contents to reflect the change

    this.positionOverlay();
    this.positionHandle();
  }
}

export default ImageResize;
