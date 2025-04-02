"use client";
import React from "react";
import { useRouter } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { formLibrarySchema } from "../library.schema";
import { useAddNewLibraryMutation } from "../api";

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
import useBreadcrumb from "@/hooks/useBreadcrumb";
const initialLibrary = {
  category_name: "",
  image: "",
  description: "",
  topic_id: "",
};
const FormAddNewLibrary = () => {
  const router = useRouter();

  useBreadcrumb([
    { label: "Thư viện", href: "/thu-vien" },
    { label: "Thêm bài mới" },
  ]);

  const form = useForm<z.infer<typeof formLibrarySchema>>({
    resolver: zodResolver(formLibrarySchema),
    mode: "onSubmit",
    defaultValues: initialLibrary,
  });
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
  const [addNewLibrary, { isLoading: isAddLibrary }] =
    useAddNewLibraryMutation();

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

  const onSubmit = async (data: z.infer<typeof formLibrarySchema>) => {
    let toasID = toast.loading("Đang tải thư viện...");

    try {
      await addNewLibrary(data).unwrap();
      toast.success("Thêm thư viện thành công", { id: toasID });
      router.replace("/thu-vien");
    } catch (err) {
      toast.error("Thêm thư viện thất bại", { id: toasID });
    }
  };
  const handleRouterBack = () => {
    router.replace("/thu-vien");
  };

  return (
    <Form {...form}>
      <form className="w-2/3 space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="category_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="nhập tiêu đề" {...field} />
              </FormControl>
              <FormDescription>
                Đây là tiêu đề được hiển thị ở bên ngoài thư viện
              </FormDescription>
              <FormMessage />
            </FormItem>
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
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <UploadImage {...field} />
              </FormControl>
              <FormDescription>
                Đây là icon được hiển thị ở bên ngoài thư viện
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <CustomEditor
                  {...field}
                  content={field?.value}
                  onChange={field?.onChange}
                />
              </FormControl>
              <FormDescription>
                Đây là mô tả được hiển thị ở bên trong thư viện
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
            isLoading={isAddLibrary}
            type="submit"
          >
            Thêm
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormAddNewLibrary;
