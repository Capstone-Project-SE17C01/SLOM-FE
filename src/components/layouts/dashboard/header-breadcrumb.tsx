import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Menu, X, LogOut, UserCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import ThemeSwitcher from "./theme-switcher";
import LanguageSwitcher from "./language-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RootState } from "@/middleware/store";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/redux/auth/slice";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface HeaderProps {
  toggleMenu: () => void;
  toggleDarkMode: () => void;
  menuOpen: boolean;
  navItems: { name: string; href: string }[];
}

export default function Header({
  toggleMenu,
  toggleDarkMode,
  menuOpen,
  navItems,
}: HeaderProps) {
  const { isDarkMode } = useTheme();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const t = useTranslations("header");
  const t3 = useTranslations("successMessages.authMessage");
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
    toast.success(t3("successLogout"));
  };

  return (
    <header
      className={cn(
        "transition-all duration-300 ease-in-out",
        isDarkMode
          ? "bg-black/90 backdrop-blur-md border-b border-gray-800"
          : "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Image
                  src="/images/logo.png"
                  alt="SLOM Logo"
                  width={32}
                  height={32}
                />
              </div>
              <span className="font-bold text-xl text-[#6947A8]">SLOM</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={t(`${item.name}`)}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors px-3 py-2 rounded-md relative",
                    isActive
                      ? "text-[#6947A8] after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-0 after:h-0.5 after:bg-[#6947A8]"
                      : isDarkMode
                      ? "hover:bg-white/10 hover:text-white"
                      : "hover:bg-black/5 hover:text-black"
                  )}
                >
                  {t(`${item.name}`)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <ThemeSwitcher
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
              <LanguageSwitcher />
            </div>

            {userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center justify-center rounded-full overflow-hidden",
                      "h-8 w-8 mx-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    )}
                  >
                    <Avatar>
                      <AvatarImage
                        src={userInfo.avatarUrl}
                        alt={`${userInfo.username}`}
                      />
                      <AvatarFallback>{userInfo.username}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userInfo.username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="text-destructive">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 bg-[#6947A8] text-white hover:bg-[#5a3d8c] hover:text-white flex items-center gap-2"
                >
                  <UserCircle className="h-4 w-4" />
                  {t("signIn")}
                </Button>
              </Link>
            )}

            <button
              onClick={toggleMenu}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md md:hidden"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
