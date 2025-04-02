import Cookies from "js-cookie";

/**
 * Set a cookie.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 */
export const setClientCookie = (name: string, value: string): void => {
  Cookies.set(name, value);
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
