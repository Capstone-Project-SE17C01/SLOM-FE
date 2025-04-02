"use client";
import React from "react";
import { useRouter } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { formNewsSchema } from "../news.schema";
import { useAddNewNewsMutation } from "../api";

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
const initialNews = {
  title: undefined,
  thumbnail: undefined,
  desc: undefined,
  topic: undefined,
};
const FormAddNews = () => {
  const router = useRouter();

  const { dataTopic, isTopicLoading } = useGetAllTopicQuery(undefined, {
    selectFromResult: ({ data: topic, isFetching }) => {
      const data = topic?.data?.filter((topic) => topic.isActive) ?? [];

      return {
        dataTopic: data?.map((topic) => ({
          value: topic?._id,
          label: topic?.topic_name,
        })),
        isTopicLoading: isFetching,
      };
    },
  });
  const [addTopic, { isLoading: isAddTopicLoading }] = useAddNewTopicMutation();
  const [deleteTopic] = useDeleteTopicMutation();
  const [addNewNews, { isLoading: isAddNews }] = useAddNewNewsMutation();

  const handleDeleteTopic = async (id: string) => {
    if (id === form.getValues("topic_id")) {
      toast.error("Không thể xóa chủ đề đang chọn");

      return;
    }
    try {
      await deleteTopic({ id }).unwrap();
      toast.success("Xóa chủ đề mới thành công");
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

  const form = useForm<z.infer<typeof formNewsSchema>>({
    resolver: zodResolver(formNewsSchema),
    mode: "onSubmit",
    defaultValues: initialNews,
  });
  const onSubmit = async (data: z.infer<typeof formNewsSchema>) => {
    let toastID = toast.loading("Đang thêm bài báo mới");

    try {
      await addNewNews(data).unwrap();
      toast.success("Thêm bài báo thành công", { id: toastID });
      router.replace("/tin-tuc");
    } catch (err) {
      toast.error("Thêm bài báo thất bại", { id: toastID });
    }
  };

  const handleRouterBack = () => {
    router.replace("/tin-tuc");
  };

  return (
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
            <FormItem>
              <FormLabel>Chủ đề</FormLabel>
              <Select
                {...field}
                defaultValue={field.value}
                onValueChange={field.onChange}
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
                  <Input placeholder="nhập tên tác giả" {...field} />
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
                <CustomEditor onChange={field.onChange} />
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
          <Button className="font-medium" isLoading={isAddNews} type="submit">
            Thêm
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormAddNews;
