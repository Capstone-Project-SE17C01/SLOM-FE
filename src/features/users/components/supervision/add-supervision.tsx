"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next-nprogress-bar";

import { useAddNewSupervisionMutation } from "../../api/supervison.api";
import { formSupervisionSchema } from "../../user.schema";
import { useGetAllProvinceQuery } from "../../api/province.api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TitlePage from "@/components/ui/title-page";
import { MultiSelect } from "@/components/ui/custom-multi-select";
import useBreadcrumb from "@/hooks/useBreadcrumb";
const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  province_ids: [],
};

export default function AddNewSupervisionModule() {
  const router = useRouter();

  useBreadcrumb([
    {
      label: "Quản lí",
      href: "/nguoi-dung?tab=supervision",
    },
    {
      label: "Thêm quan sát viên mới",
    },
  ]);
  const [createSupervisionAccount] = useAddNewSupervisionMutation();
  const { pronvinces } = useGetAllProvinceQuery(undefined, {
    selectFromResult: ({ data }) => ({
      pronvinces:
        data?.items.map((item: { name: string; _id: string }) => ({
          label: item?.name,
          value: item?._id,
        })) ?? [],
    }),
  });

  const form = useForm<z.infer<typeof formSupervisionSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSupervisionSchema),
    defaultValues: initialForm,
  });
  const handleBack = () => {
    router.replace("/nguoi-dung?tab=supervision");
  };

  async function onSubmit(data: z.infer<typeof formSupervisionSchema>) {
    const toasID = toast.loading("đang tạo tài khoản...");

    try {
      await createSupervisionAccount(data).unwrap();
      toast.success("Tạo tài khoản thành công", { id: toasID });
      handleBack();
    } catch (error) {
      toast.error("Tạo tài khoản thất bại", { id: toasID });
    }
  }
  console.log("fi", form.getValues());

  return (
    <>
      <TitlePage title="Thêm Quản trị viên" />
      <Form {...form}>
        <form
          className="space-y-8 flex flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ</FormLabel>
                    <FormControl>
                      <Input placeholder="nhập họ..." type="text" {...field} />
                    </FormControl>
                    <FormDescription>Nhập họ và tên của bạn</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="nhập tên..." type="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="nhập email..." type="email" {...field} />
                </FormControl>
                <FormDescription>Email làm việc của bạn.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="province_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tỉnh/Thành phố quan sát</FormLabel>
                <FormControl className="w-full">
                  <MultiSelect
                    animation={2}
                    maxCount={6}
                    options={pronvinces}
                    placeholder="Chọn Tỉnh/Thành phố"
                    variant="inverted"
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Chọn tỉnh thành quan sát của quan sát viên này.
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
              onClick={handleBack}
            >
              Hủy tác vụ
            </Button>
            <Button className="font-medium" type="submit">
              Thêm
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
