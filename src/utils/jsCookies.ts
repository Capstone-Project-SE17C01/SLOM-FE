import Cookies from "js-cookie";

interface CookieOptions {
  expires?: number; // days
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with options.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param options - Cookie options (expires in days, secure, sameSite)
 */
export const setClientCookie = (name: string, value: string, options?: CookieOptions): void => {
  Cookies.set(name, value, {
    expires: options?.expires || 1, // Default 1 day
    secure: options?.secure !== undefined ? options.secure : process.env.NODE_ENV === 'production',
    sameSite: options?.sameSite || 'strict' // Default strict
  });
};

/**
 * Get a cookie by name.
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie or undefined if not found.
 */
export const getClientCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

/**
 * Get all cookies.
 * @returns An object containing all cookies as key-value pairs.
 */
export const getAllClientCookies = (): { [key: string]: string } => {
  return Cookies.get();
};

/**
 * Delete a cookie.
 * @param name - The name of the cookie to delete.
 */
export const deleteClientCookie = (name: string): void => {
  Cookies.remove(name);
};
