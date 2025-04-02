"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next-nprogress-bar";

import { useAddNewCitizenMutation } from "../../api/citizen.api";
import { formCitizenSchema } from "../../user.schema";

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
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { PhoneInput } from "@/components/ui/phone-input";
import { DateTimeInput } from "@/components/ui/datetime-input";
const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  organization: "",
};

export default function AddNewCitizenModule() {
  const router = useRouter();

  useBreadcrumb([
    {
      label: "Công dân",
      href: "/nguoi-dung?tab=citizen",
    },
    {
      label: "Thêm công dân mới",
    },
  ]);
  const [createCitizenAccount] = useAddNewCitizenMutation();

  const form = useForm<z.infer<typeof formCitizenSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formCitizenSchema),
    defaultValues: initialForm,
  });
  const handleBack = () => {
    router.replace("/nguoi-dung?tab=Citizen");
  };

  async function onSubmit(data: z.infer<typeof formCitizenSchema>) {
    const toasID = toast.loading("đang tạo tài khoản...");

    try {
      await createCitizenAccount({
        ...data,
        date_of_birth: data?.date_of_birth?.toISOString(),
      }).unwrap();
      toast.success("Tạo tài khoản thành công", { id: toasID });
      handleBack();
    } catch (error) {
      toast.error("Tạo tài khoản thất bại", { id: toasID });
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
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <DateTimeInput format="dd/MM/yyyy" {...field} />
                    </FormControl>
                    <FormDescription>ngày sinh của bạn.</FormDescription>
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
