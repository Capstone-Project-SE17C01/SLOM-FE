import * as z from "zod";

export const formLibrarySchema = z.object({
  category_name: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .min(5, { message: "Tiêu đề phải lớn hơn 5 chữ" })
    .max(100, { message: "Tiêu đề quá dài" })
    .trim(),
  image: z.string().min(1, { message: "Đây là trường bắt buộc." }),
  description: z
    .string()
    .min(1, { message: "Đây là trường bắt buộc." })
    .min(10, { message: "Mô tả phải lớn hơn 10 chữ" })
    .trim(),
  topic_id: z.string().min(1, { message: "Đây là trường bắt buộc." }),
});
