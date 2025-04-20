import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { locales } from "@/i18n/config";
import Cookies from "js-cookie";
import constants from "@/settings/constants";

export default function LanguageSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // Save locale to cookie
    Cookies.set(constants.LOCALE, newLocale);
    // Refresh page to apply new locale
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                locale === "en" ? "/images/us-flag.png" : "/images/vn-flag.png"
              }
              alt={locale === "en" ? "US Flag" : "VN Flag"}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={locale === lang ? "bg-accent" : ""}
          >
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage
                src={
                  lang === "en" ? "/images/us-flag.png" : "/images/vn-flag.png"
                }
                alt={lang === "en" ? "US Flag" : "VN Flag"}
              />
            </Avatar>
            {t(`language.${lang}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
