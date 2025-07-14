import { LoginForm } from "@/components/layouts/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm />
      </div>
    </div>
  );
}

export default Page;
