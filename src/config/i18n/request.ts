import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import constants from "@/config/constants";
import { defaultLocale } from "./config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get(constants.LOCALE)?.value || defaultLocale;

  return {
    locale,
    messages: (await import(`../../../public/locales/${locale}.json`)).default,
  };
});
