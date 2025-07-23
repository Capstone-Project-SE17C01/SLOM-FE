import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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
}

const EntityModal: React.FC<EntityModalProps> = ({
  open,
  onClose,
  onSubmit,
  fields,
  title,
  initialValues = {},
}) => {
  const [form, setForm] = useState<Record<string, string>>(initialValues);

  useEffect(() => {
    setForm(initialValues || {});
  }, [initialValues, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label
                className="block text-sm font-medium mb-1"
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
                  className="w-full border rounded px-3 py-2"
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
                  className="w-full border rounded px-3 py-2"
                />
              )}
              {field.type === "textarea" && (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full border rounded px-3 py-2"
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
                  className="w-full border rounded px-3 py-2"
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
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntityModal;
