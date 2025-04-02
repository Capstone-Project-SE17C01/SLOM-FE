"use client";
import React, { useEffect } from "react";
import { useRouter } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { useParams } from "next/navigation";

import { formNewsSchema } from "../news.schema";
import { useGetNewsQuery, useUpdateNewsMutation } from "../api";

import { Button } from "@/components/ui/button";
import CustomEditor from "@/components/ui/custom-editor";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import UploadImage from "@/components/ui/upload-image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/topic-select";
import {
  useAddNewTopicMutation,
  useDeleteTopicMutation,
  useGetAllTopicQuery,
} from "@/features/topic/api";
import TitlePage from "@/components/ui/title-page";

const initialNews = {
  title: "",
  image: "",
  content: "",
  author: "",
  topic_id: "",
};
const FormUpdateNews = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: news } = useGetNewsQuery({ id });
  const [addTopic, { isLoading: isAddTopicLoading }] = useAddNewTopicMutation();
  const [updateNews, { isLoading: isUpdateNewsLoading }] =
    useUpdateNewsMutation();
  const [deleteTopic] = useDeleteTopicMutation();
  const { dataTopic, isTopicLoading } = useGetAllTopicQuery(undefined, {
    selectFromResult: ({ data: topic, isFetching }) => {
      const data = topic?.data?.filter((topic) => topic.isActive) ?? [];

      return {
        dataTopic: data?.map((topic) => ({
          value: topic._id,
          label: topic.topic_name,
        })),
        isTopicLoading: isFetching,
      };
    },
  });

  const form = useForm<z.infer<typeof formNewsSchema>>({
    resolver: zodResolver(formNewsSchema),
    mode: "onSubmit",
    defaultValues: initialNews,
  });

  useEffect(() => {
    form.reset({
      title: news?.title,
      image: news?.image,
      content: news?.content,
      author: news?.author,
      topic_id: news?.topic_id,
    });
  }, [news]);

  const handleDeleteTopic = async (id: string) => {
    if (id === form.getValues("topic_id")) {
      toast.error("Không thể xóa chủ đề đang chọn");

      return;
    }
    try {
      const promise = () =>
        new Promise((resolve) => {
          resolve(deleteTopic({ id }).unwrap());
        });

      toast.promise(promise, {
        loading: "đang xóa chủ đề...",
        success: "Xóa chủ đề thành công",
        error: "Không thể xóa",
      });
    } catch (err) {}
  };
  const handleAddNewTopic = async (topic_name: string) => {
    try {
      await addTopic({
        topic_name,
        description: topic_name,
      });
      toast.success("Thêm chủ đề mới thành công");
    } catch (err) {}
  };

  const onSubmit = async (data: z.infer<typeof formNewsSchema>) => {
    let toastID = toast.loading("Đang thay đổi bài báo mới");

    try {
      await updateNews({ params: { id: id }, body: data }).unwrap();
      toast.success("Thay đổi bài báo thành công", { id: toastID });
      router.replace("/tin-tuc");
    } catch (err) {
      toast.error("Thay đổi bài báo thất bại", { id: toastID });
    }
  };

  const handleRouterBack = () => {
    router.replace("/tin-tuc");
  };

  return (
    <>
      <TitlePage
        isReplace
        contentHref="Xem mô tả"
        href={`/tin-tuc/${id}`}
        startIcon={<Eye className=" h-4 w-4" />}
        title="Chỉnh sửa nội dung"
      />
      <Form {...form}>
        <form
          className="space-y-8 flex flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="nhập tiêu đề" {...field} />
                  </FormControl>
                  <FormDescription>
                    Đây là tiêu đề được hiển thị ở bên ngoài tin tức
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="topic_id"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Chủ đề</FormLabel>
                  <Select
                    {...field}
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger isLoading={isTopicLoading}>
                        <SelectValue placeholder="Chọn chủ đề" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      isAddItem
                      isAddItemLoading={isAddTopicLoading}
                      onAddItem={handleAddNewTopic}
                    >
                      {dataTopic.map(({ label, value }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          onDeleteItem={handleDeleteTopic}
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Đây là chủ đề của bài viết được nói đến
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Tác giả</FormLabel>
                  <FormControl>
                    <Input placeholder="nhập tiêu đề" {...field} />
                  </FormControl>
                  <FormDescription>Đây là tác giả của bài báo</FormDescription>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh Bìa</FormLabel>
                <FormControl>
                  <UploadImage {...field} />
                </FormControl>
                <FormDescription>
                  Đây là Ảnh Bìa được hiển thị ở bên ngoài tin tức
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <CustomEditor
                    content={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Đây là mô tả được hiển thị ở bên trong tin tức
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-center">
            <Button
              className="font-medium"
              type="button"
              variant="destructive"
              onClick={handleRouterBack}
            >
              Hủy tác vụ
            </Button>
            <Button
              className="font-medium"
              isLoading={isUpdateNewsLoading}
              type="submit"
            >
              Thay đổi
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default FormUpdateNews;
