import { ConfirmRegisterationForm } from "@/components/layouts/auth/confirm-registeration-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm Registeration",
};

function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <ConfirmRegisterationForm />
      </div>
    </div>
  );
}

export default Page;
