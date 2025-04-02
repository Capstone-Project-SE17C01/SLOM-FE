"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "@/config/editor.css";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";

import { useUploadImageMutation } from "@/services/common/upload/api.upload";
import ImageResize from "@/lib/editor/imageResize";
import ImageUpload from "@/lib/editor/imageUpload";

Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/imageUpload", ImageUpload);

export interface EditorContentChanged {
  html: string;
  markdown: string;
}

export interface EditorProps {
  content?: string;
  onChange?: (value: string) => void;
  label?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  required?: boolean;
  editable?: boolean;
}

export default function QuillEditor({
  content = "",
  onChange = () => {},
  label,
  errorMessage,
  isInvalid = false,
  required = false,
  editable = true,
}: EditorProps) {
  const [value, setValue] = useState<string>(content);
  const reactQuillRef = useRef<ReactQuill>(null);
  const [upload] = useUploadImageMutation();

  const handleOnChange = (content: string) => {
    setValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  useEffect(() => {
    setValue(content);
  }, [content]);

  const handleUploadImage = useCallback(async (file: any) => {
    const formData = new FormData();

    let toastId = toast.loading("Đảng tải ảnh...");

    formData.append("image", file);
    try {
      const res = await upload(formData).unwrap();

      toast.success("Tải ảnh thành công", {
        id: toastId,
      });

      return res?.data;
    } catch (err) {
      toast.error("Tải ảnh lên thất bại", {
        id: toastId,
      });
    }
  }, []);

  const imageHandler = useCallback(() => {
    const quill = reactQuillRef?.current;

    if (quill?.props?.readOnly) return;
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const formData = new FormData();

        formData.append("image", file);
        let toastId: string | number;

        toastId = toast.loading("Đảng tải ảnh...");
        try {
          const res = await upload(formData).unwrap();

          const url = res?.data;

          toast.success("Tải ảnh thành công", {
            id: toastId,
          });

          if (quill) {
            const range = (quill as any)!.getEditorSelection();

            range &&
              (quill as any)!
                .getEditor()
                .insertEmbed(range.index, "image", url);
          }
        } catch (error) {
          toast.error("Tải ảnh lên thất bại", {
            id: toastId,
          });
        }
      }
    };
  }, []);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <ReactQuill
        ref={reactQuillRef}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "align",
          "underline",
          "strike",
          "blockquote",
          "list",
          "indent",
          "link",
          "image",
          "video",
          "code-block",
        ]}
        modules={{
          toolbar: {
            container: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ size: [] }],
              [
                { align: "" },
                { align: "center" },
                { align: "right" },
                { align: "justify" },
              ],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image", "video"],
              ["code-block"],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
          imageResize: {},
          imageUpload: {
            image: handleUploadImage,
          },
          clipboard: {
            matchVisual: false,
          },
        }}
        placeholder="viết..."
        readOnly={!editable}
        theme="snow"
        value={value}
        onChange={handleOnChange}
      />
      {isInvalid && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
