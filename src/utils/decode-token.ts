import { jwtDecode } from "jwt-decode";
export const decodeToken = (token: string) => {
  try {
    const decoded = jwtDecode(token);

    return decoded;
  } catch (error) {
    return null;
  }
};
