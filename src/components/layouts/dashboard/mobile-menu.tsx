import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";

interface MobileMenuProps {
    menuOpen: boolean;
    navItems: { name: string; href: string }[];
    setMenuOpen: (open: boolean) => void;
}

export default function MobileMenu({ menuOpen, navItems, setMenuOpen }: MobileMenuProps) {
    const { isDarkMode } = useTheme();
    if (!menuOpen) return null;

    return (
        <div className={cn(
            "fixed inset-0 top-16 z-20 md:hidden",
            isDarkMode ? "bg-black" : "bg-white"
        )}>
            <nav className="px-4 pt-6 pb-20 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex items-center justify-between px-3 py-4 text-base font-medium border-b",
                            isDarkMode ? "border-gray-800" : "border-gray-100"
                        )}
                        onClick={() => setMenuOpen(false)}
                    >
                        {item.name}
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ))}
            </nav>
        </div>
    );
}