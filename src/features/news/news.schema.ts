import * as z from "zod";

export const formNewsSchema = z.object({
  title: z
    .string({
      required_error: "Đây là trường bắt buộc.",
    })
    .min(5, { message: "Tiêu đề phải lớn hơn 5 chữ" })
    .max(100, { message: "Tiêu đề quá dài" })
    .trim(),
  author: z
    .string({
      required_error: "Đây là trường bắt buộc.",
    })
    .min(5, { message: "tên tác phải lớn hơn 5 chữ" })
    .max(40, { message: "tên tác quá dài" })
    .trim(),
  image: z.string({
    required_error: "Đây là trường bắt buộc.",
  }),
  content: z
    .string({
      required_error: "Đây là trường bắt buộc.",
    })
    .min(5, { message: "Mô tả phải lớn hơn 5 chữ" })
    .trim(),
  topic_id: z.string({
    required_error: "Đây là trường bắt buộc.",
  }),
});
