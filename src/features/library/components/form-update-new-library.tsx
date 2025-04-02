"use client";
import React, { useEffect } from "react";
import { useRouter } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { useParams } from "next/navigation";

import { formLibrarySchema } from "../library.schema";
import { useGetLibraryQuery, useUpdateLibraryMutation } from "../api";

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
import useBreadcrumb from "@/hooks/useBreadcrumb";
const initialLibrary = {
  category_name: "",
  image: "",
  description: "<p></p>",
  topic_id: "",
};
const FormUpdateLibrary = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: library } = useGetLibraryQuery({ id });
  const [addTopic, { isLoading: isAddTopicLoading }] = useAddNewTopicMutation();
  const [updateLibrary, { isLoading: isUpdateLibraryLoading }] =
    useUpdateLibraryMutation();
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

  useBreadcrumb([
    { label: "Thư viện", href: "/thu-vien" },
    { label: library?.category_name },
  ]);

  const form = useForm<z.infer<typeof formLibrarySchema>>({
    resolver: zodResolver(formLibrarySchema),
    mode: "onSubmit",
    defaultValues: initialLibrary,
  });

  useEffect(() => {
    form.reset({
      category_name: library?.category_name,
      image: library?.image,
      description: library?.description,
      topic_id: library?.topic_id,
    });
  }, [library]);

  const handleRouterBack = () => {
    router.replace("/thu-vien");
  };

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

  const onSubmit = async (data: z.infer<typeof formLibrarySchema>) => {
    try {
      await updateLibrary({ params: { id }, body: data }).unwrap();
      toast.success("Thay đổi nội dung thư viện thành công");
      router.replace("/thu-vien");
    } catch (err) {}
  };

  return (
    <>
      <TitlePage
        isReplace
        contentHref="Xem mô tả"
        href={`/thu-vien/${id}`}
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
            name="category_name"
            render={({ field }) => (
              <>
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
                    defaultValue={field.value}
                    disabled={isTopicLoading}
                    onValueChange={(e) => {
                      if (e) field.onChange(e);
                    }}
                    {...field}
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
                    content={field.value}
                    onChange={field.onChange}
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
              isLoading={isUpdateLibraryLoading}
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

export default FormUpdateLibrary;
