import * as z from "zod";
const phoneRegex = new RegExp(
  /^\+?[1-9]\d{0,2}[-\s]?(\(\d{2,4}\)|\d{2,4})[-\s]?\d{3}[-\s]?\d{3,4}$/,
);

export const formAdminSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .max(25, { message: "Tên quá dài" })
    .trim(),

  last_name: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .max(25, { message: "Tên quá dài" })
    .trim(),
  email: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .email({ message: "Email không đúng định dạng." })
    .max(50, { message: "Mô tả phải lớn hơn 10 chữ" })
    .trim(),
  phone_number: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .regex(phoneRegex, "SDT không đúng định dạng"),
});
export const formSupervisionSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .max(25, { message: "Tên quá dài" })
    .trim(),

  last_name: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .max(25, { message: "Tên quá dài" })
    .trim(),
  email: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .email({ message: "Email không đúng định dạng." })
    .max(50, { message: "Mô tả phải lớn hơn 10 chữ" })
    .trim(),
  province_ids: z
    .string()
    .array()
    .min(1, { message: "Đây là trường bắt buộc." }),
});
export const formManagerSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .max(25, { message: "Tên quá dài" })
    .trim(),

  last_name: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .max(25, { message: "Tên quá dài" })
    .trim(),
  email: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .email({ message: "Email không đúng định dạng." })
    .max(50, { message: "Mô tả phải lớn hơn 10 chữ" })
    .trim(),
  phone_number: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .regex(phoneRegex, "SDT không đúng định dạng"),
  organizationId: z.string().min(1, { message: "Đây là trường bắt buộc." }),
});
export const formStudentSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .max(25, { message: "Tên quá dài" })
    .trim(),

  last_name: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .max(25, { message: "Tên quá dài" })
    .trim(),
  phone_number: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .regex(phoneRegex, "SDT không đúng định dạng"),
  organizationId: z.string().min(1, { message: "Đây là trường bắt buộc." }),
  date_of_birth: z.date({ message: "Đây là trường bắt buộc." }),
});
export const formCitizenSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .max(25, { message: "Tên quá dài" })
    .trim(),
  last_name: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .max(25, { message: "Tên quá dài" })
    .trim(),
  phone_number: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .regex(phoneRegex, "SDT không đúng định dạng"),
  date_of_birth: z.date({ message: "Đây là trường bắt buộc." }),
});
