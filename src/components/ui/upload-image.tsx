import React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Cross2Icon as Cancel, UploadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

import { Spinner } from "./spinner";

import { useUploadImageMutation } from "@/services/common/upload/api.upload";

export interface ImportModalProps
  extends Omit<
    ControllerRenderProps<FieldValues, FieldPath<FieldValues>>,
    "onChange" | "onBlur" | "value" | "ref" | "name"
  > {
  onChange?: Function;
  onBlur?: Function;
  value?: any;
  ref?: React.Ref<any>;
  name?: string;
}

interface DragZoneProps {
  setFormData: Function;
  onChange: Function;
  isLoading: boolean;
  value: string;
  error: any;
  disabled: boolean;
}

interface ErrorLineProps {
  children: React.ReactNode;
}

function ErrorLine({ children }: ErrorLineProps) {
  return (
    <div className="border-1.5 border-red-500 rounded-3xl mx-2 my-1 bg-red-50 flex">
      <Cancel />
      <p className="text-red-600 px-1">{children}</p>
    </div>
  );
}

function DragZone({
  setFormData,
  isLoading,
  value,
  error,
  disabled,
}: DragZoneProps) {
  const ref = useRef<any>();
  const [dragActive, setDragActive] = useState<number>(0);
  const [file, setFile] = useState<any>();

  const handleClick = () => {
    if (ref.current) ref.current.click();
  };

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      const items = e.dataTransfer.items;

      if (items.length > 1) {
        setDragActive(2);
      } else {
        const fileType = items[0].type;

        if (fileType.startsWith("image/")) {
          setDragActive(1);
        } else setDragActive(2);
      }
    } else if (e.type === "dragleave") {
      setDragActive(0);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(0);

    if (e.dataTransfer.files && e.dataTransfer.files.length === 1) {
      const droppedFile = e.dataTransfer.files[0];

      if (ref.current) {
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(droppedFile);
        ref.current.files = dataTransfer.files;

        const changeEvent = new Event("change", { bubbles: true });

        ref.current.dispatchEvent(changeEvent);
      }
    } else {
      toast.error("Không thể thêm được nhìu ảnh cùng một lúc!");
    }
  };

  const handleFileChange = async (e: any) => {
    if (e.target.files && e.target.files.length === 1) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;

      if (fileType.startsWith("image/")) {
        setFile(selectedFile);
        const formData = new FormData();

        formData.append("image", selectedFile);
        await setFormData(formData);
      } else {
        toast.error("Chỉ thêm được ảnh!");
        e.target.value = ""; // Reset the input if invalid
      }
    }
  };

  return (
    <React.Fragment>
      <button
        className={`${value ? "" : "max-h-[300px] py-10"} w-full text-center overflow-y-auto ${value ? "border-solid" : "border-dashed"} border-2 rounded-md h-fit ${dragActive == 2 ? "cursor-not-allowed" : "cursor-pointer"} ${file ? (error ? "border-red-500" : "border-green-500") : dragActive === 2 ? "border-primary" : dragActive === 1 ? "border-orange-200" : "border-primary/40"}`}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {disabled || (
          <input
            ref={ref}
            accept="image/*"
            className="hidden"
            type="file"
            onChange={handleFileChange}
          />
        )}
        {isLoading || (
          <>
            {!value && (
              <div className="my-auto text-center">
                <UploadIcon className="mx-auto" />
                <div className="pointer-events-none">
                  <strong>Kéo và Thả vào đây</strong>
                  <p className="text-gray-400">
                    Hoặc nhấn vào để chọn ảnh trong thư mục
                  </p>
                </div>
              </div>
            )}
            {value && !error && (
              <div className="flex w-full justify-center p-4">
                <Image
                  alt="image upload"
                  height={400}
                  src={value}
                  width={400}
                />
              </div>
            )}
          </>
        )}
        {isLoading && (
          <div className="w-full h-full py-8 flex flex-col gap-3 justify-center items-center">
            <Spinner />
            <p>đang tải ảnh lên...</p>
          </div>
        )}
      </button>
    </React.Fragment>
  );
}

function ImportExcelModal({
  onChange = () => {},
  value = "",
  disabled = false,
}: ImportModalProps) {
  const [upload, { isLoading }] = useUploadImageMutation();
  const [error, setError] = useState<any>();

  const onUploadImage = async (formData: FormData) => {
    if (formData) {
      try {
        const res = await upload(formData).unwrap();

        onChange({ target: { value: res?.data } });
        setError(null);
      } catch (err) {
        setError(err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <DragZone
        disabled={disabled}
        error={error}
        isLoading={isLoading}
        setFormData={onUploadImage}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default ImportExcelModal;
