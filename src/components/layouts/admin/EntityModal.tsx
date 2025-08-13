import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGetAllModuleByCourseIdMutation, useGetLessonByModuleIdMutation } from "@/api/CourseApi";

export interface FieldConfig {
  label: string;
  name: string;
  type: "text" | "textarea" | "number" | "select";
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}

interface EntityModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  fields: FieldConfig[];
  title: string;
  initialValues?: Record<string, string>;
  children?: React.ReactNode;
}

const EntityModal: React.FC<EntityModalProps> = ({
  open,
  onClose,
  onSubmit,
  fields,
  title,
  initialValues = {},
  children,
}) => {
  const [form, setForm] = useState<Record<string, string>>(initialValues);
  const [getAllModuleByCourseId] = useGetAllModuleByCourseIdMutation();
  const [getLessonByModuleId] = useGetLessonByModuleIdMutation();
  const [fieldOptions, setFieldOptions] = useState<FieldConfig[]>([]);

  useEffect(() => {
    setForm(initialValues || {});
  }, [initialValues, open]);

  useEffect(() => {
    setFieldOptions(fields);
  }, [fields]);

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if(e.target.name === "courseId") {
      if(e.target.value && e.target.value != "") {
        const value = await getAllModuleByCourseId(e.target.value).unwrap()
          .then(response => {
            return Array.isArray(response.result) ? response.result.map(item => ({ label: item.title, value: item.id })) : [];
          })
  
        setFieldOptions((prev) => prev.map(field => field.name === "moduleId" ? { ...field, options: value } : field));
      }
      setFieldOptions((prev) => prev.map(field => field.name === "lessonId" ? { ...field, options: [] } : field));
    }

    if(e.target.name === "moduleId") {
      if(e.target.value && e.target.value != "") {
        const value = await getLessonByModuleId(e.target.value).unwrap()
          .then(response => {
            return Array.isArray(response.result) ? response.result.map(item => ({ label: item.title, value: item.id })) : [];
          })

        setFieldOptions((prev) => prev.map(field => field.name === "lessonId" ? { ...field, options: value } : field));
      } else {
        setFieldOptions((prev) => prev.map(field => field.name === "lessonId" ? { ...field, options: [] } : field));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={fieldOptions.length >= 6 ? "sm:max-w-4xl" : "sm:max-w-lg"}>
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        
        {children ? (
          <div className="py-2">
            {children}
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button onClick={() => onSubmit(form)}>Confirm</Button>
            </DialogFooter>
          </div>
                 ) : (
           <form onSubmit={handleSubmit} className={`py-2 ${fieldOptions.length >= 6 ? 'grid grid-cols-2 gap-6' : 'space-y-4'}`}>
             {fieldOptions.map((field) => (
               <div key={field.name} className={field.type === "textarea" ? "col-span-2" : ""}>
                <label
                  className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300"
                  htmlFor={field.name}
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === "text" && (
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                  />
                )}
                {field.type === "number" && (
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                  />
                )}
                {field.type === "textarea" && (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    rows={3}
                  />
                )}
                {field.type === "select" && field.options && (
                  <select
                    id={field.name}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="">Select...</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EntityModal;
