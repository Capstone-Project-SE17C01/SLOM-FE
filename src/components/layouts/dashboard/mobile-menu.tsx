import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

interface MobileMenuProps {
    menuOpen: boolean;
    navItems: { name: string; href: string }[];
    setMenuOpen: (open: boolean) => void;
}

export default function MobileMenu({ menuOpen, navItems, setMenuOpen }: MobileMenuProps) {
    const { isDarkMode } = useTheme();
    const pathname = usePathname();
    const t = useTranslations("header");
    
    if (!menuOpen) return null;

    return (
        <div className={cn(
            "fixed inset-0 top-16 z-20 md:hidden",
            isDarkMode ? "bg-black" : "bg-white"
        )}>
            <nav className="px-4 pt-6 pb-20 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-4 text-base font-medium border-b",
                                isActive ? "text-[#6947A8] border-[#6947A8]" : 
                                isDarkMode ? "border-gray-800" : "border-gray-100"
                            )}
                            onClick={() => setMenuOpen(false)}
                        >
                            {t(item.name)}
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}