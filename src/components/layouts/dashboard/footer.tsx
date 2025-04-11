'use client';

import Link from "next/link";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export default function Footer() {
    const { isDarkMode } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const darkModeClass = mounted && isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900";

    return (
        <footer className={cn(
            "py-12 px-4 sm:px-6 lg:px-8 border-t",
            isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-100"
        )}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About SLOM</h3>
                        <p className={cn(
                            "text-sm",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}>
                            A modern platform for managing digital resources and services.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Products</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className={isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}>Content Management</Link></li>
                            <li><Link href="#" className={isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}>Digital Resources</Link></li>
                            <li><Link href="#" className={isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}>Analytics</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className={isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}>Documentation</Link></li>
                            <li><Link href="#" className={darkModeClass}>Help Center</Link></li>
                            <li><Link href="#" className={isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}>API</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Email: contact@slom.com</li>
                            <li className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Phone: +1 (123) 456-7890</li>
                        </ul>
                    </div>
                </div>
                <div className={cn(
                    "mt-12 pt-8 border-t text-center text-sm",
                    isDarkMode ? "border-gray-800 text-gray-400" : "border-gray-100 text-gray-500"
                )}>
                    © {new Date().getFullYear()} SLOM. All rights reserved.
                </div>
            </div>
        </footer>
    );
}