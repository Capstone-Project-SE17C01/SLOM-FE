"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next-nprogress-bar";

import { useAddNewStudentMutation } from "../../api/student.api";
import { formStudentSchema } from "../../user.schema";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllOrganizationQuery } from "@/features/organizations/organization.api";
import { Organization } from "@/features/organizations/types";
import { DateTimeInput } from "@/components/ui/datetime-input";
const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  organization: "",
};

export default function AddNewStudentModule() {
  const router = useRouter();

  useBreadcrumb([
    {
      label: "Học sinh",
      href: "/nguoi-dung?tab=student",
    },
    {
      label: "Thêm học sinh mới",
    },
  ]);
  const [createStudentAccount] = useAddNewStudentMutation();
  const { organizations } = useGetAllOrganizationQuery(undefined, {
    selectFromResult: ({ data }) => ({
      organizations:
        data?.items?.map((item: Organization) => ({
          label: item?.name,
          value: item?._id,
        })) ?? [],
    }),
  });

  const form = useForm<z.infer<typeof formStudentSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formStudentSchema),
    defaultValues: initialForm,
  });
  const handleBack = () => {
    router.replace("/nguoi-dung?tab=student");
  };

  async function onSubmit(data: z.infer<typeof formStudentSchema>) {
    const toasID = toast.loading("đang tạo tài khoản...");

    try {
      await createStudentAccount({
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
      <TitlePage title="Thêm học sinh" />
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
          <FormField
            control={form.control}
            name="organizationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tổ chức quản lí</FormLabel>
                <FormControl className="w-full">
                  <Select
                    {...field}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khu vực tổ chức" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations?.map(
                        ({
                          label,
                          value,
                        }: {
                          label: string;
                          value: string;
                        }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Chọn tổ chức quản lí của quản lí viên này.
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
