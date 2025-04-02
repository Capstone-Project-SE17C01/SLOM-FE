import { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

import { getClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";
import { ManagerRole } from "@/settings/enums";
interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}
const useRoles = (): {
  isAdmin: boolean;
  isSupervision: boolean;
  isManager: boolean;
} => {
  const [role, setRole] = useState<ManagerRole | null>(null);
  const token = getClientCookie(constants.ACCESS_TOKEN);
  const isAdmin = role === ManagerRole.admin;
  const isSupervision = role === ManagerRole.supervision;
  const isManager = role === ManagerRole.manager;

  console.log("first", role);
  useEffect(() => {
    if (!token) {
      setRole(null);

      return;
    }

    try {
      const decoded: CustomJwtPayload = jwtDecode(token) ?? {};

      setRole(decoded?.role as ManagerRole);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        setRole(null);
      }
    } catch (error) {
      setRole(null);
    }
  }, [token]);

  return { isAdmin, isSupervision, isManager };
};

export default useRoles;
