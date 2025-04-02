"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { useEffect } from "react";

import { formAdminSchema } from "../../user.schema";
import { useGetAdminQuery, useUpdateAdminMutation } from "../../api/admin.api";

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
import { PhoneInput } from "@/components/ui/phone-input";
import TitlePage from "@/components/ui/title-page";
const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  number_phone: "",
  password: "",
  confirm_password: "",
};

export default function AddNewAdminModule() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [updateAdminAccount] = useUpdateAdminMutation();
  const { data: admin } = useGetAdminQuery({ id });
  const form = useForm<z.infer<typeof formAdminSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formAdminSchema),
    defaultValues: initialForm,
  });
  const handleBack = () => {
    router.replace("/nguoi-dung");
  };

  useEffect(() => {
    form.reset({
      first_name: admin?.first_name,
      last_name: admin?.last_name,
      email: admin?.email,
      phone_number: admin?.phone_number,
    });
  }, [admin]);

  async function onSubmit(data: z.infer<typeof formAdminSchema>) {
    const toasID = toast.loading("đang tạo tài khoản...");

    try {
      await updateAdminAccount({
        params: { id: id },
        body: data,
      }).unwrap();
      toast.success("Thay đổi tài khoản thành công", { id: toasID });
      handleBack();
    } catch (error) {
      toast.error("Thay đổi tài khoản thất bại", { id: toasID });
    }
  }

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
          <div className="grid grid-cols-12  gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nhập email..."
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Email làm việc của bạn.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl className="w-full">
                      <PhoneInput
                        placeholder="nhập sdt..."
                        {...field}
                        defaultCountry="VN"
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập số điện thoại hiện tại của bạn.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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
