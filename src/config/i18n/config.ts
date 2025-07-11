export type Locale = (typeof locales)[number];

export const locales = ["en", "vn"] as const;

export const defaultLocale: Locale = "en";
