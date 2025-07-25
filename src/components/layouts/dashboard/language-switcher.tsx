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
import { locales } from "@/config/i18n/config";
import Cookies from "js-cookie";
import constants from "@/config/constants";
import { useChangeLanguageMutation } from "@/api/AuthApi";
import Spinner from "@/components/ui/spinner";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function LanguageSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [changeLanguage, { isLoading }] = useChangeLanguageMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const handleLanguageChange = async (
    event: React.MouseEvent,
    newLocale: string
  ) => {
    event.preventDefault();

    if (userInfo) {
      await changeLanguage({
        email: userInfo.email,
        languageId: userInfo.preferredLanguageId,
        newLanguageCode: newLocale,
      })
        .unwrap()
        .then((res) => {
          if (res.result) {
            Cookies.set(constants.LOCALE, res.result.languageCode);
            router.refresh();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      router.refresh();
      Cookies.set(constants.LOCALE, newLocale);
    }
  };
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 mr-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                locale === "en" ? "/images/us-flag.png" : "/images/vn-flag.png"
              }
              alt={locale === "en" ? "US Flag" : "VN Flag"}
              style={{ objectFit: "cover" }}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={(event) => handleLanguageChange(event, lang)}
            className={locale === lang ? "bg-accent" : ""}
          >
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage
                src={
                  lang === "en" ? "/images/us-flag.png" : "/images/vn-flag.png"
                }
                alt={lang === "en" ? "US Flag" : "VN Flag"}
                style={{ objectFit: "cover" }}
              />
            </Avatar>
            {t(`language.${lang}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
