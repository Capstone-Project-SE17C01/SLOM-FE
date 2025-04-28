"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import constants from "@/settings/constants";

interface DecodedToken {
  email: string;
  exp: number;
  iat: number;
  role: string;
  sub: string;
}

export default function Page() {
  const [userInfo, setUserInfo] = useState<{
    email?: string;
    tokenInfo?: DecodedToken;
    idTokenInfo?: DecodedToken;
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
  }>({});

  useEffect(() => {
    const accessToken = Cookies.get(constants.ACCESS_TOKEN);
    const refreshToken = Cookies.get(constants.REFRESH_TOKEN);
    const idToken = Cookies.get("idToken");
    const userEmail = Cookies.get("userEmail");

    let tokenInfo: DecodedToken | undefined;
    let idTokenInfo: DecodedToken | undefined;

    if (accessToken) {
      try {
        tokenInfo = jwtDecode<DecodedToken>(accessToken);
      } catch (error) {
        console.error("Error decoding access token:", error);
      }
    }

    if (idToken) {
      try {
        idTokenInfo = jwtDecode<DecodedToken>(idToken);
      } catch (error) {
        console.error("Error decoding ID token:", error);
      }
    }

    setUserInfo({
      email: userEmail,
      tokenInfo,
      idTokenInfo,
      accessToken,
      refreshToken,
      idToken,
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Thông tin người dùng</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Thông tin từ Cookie</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Thông tin từ Access Token
          </h2>
          <div className="bg-gray-100 p-4 rounded space-y-2">
            {userInfo.tokenInfo ? (
              <>
                <p>
                  <strong>Email:</strong> {userInfo.tokenInfo.email}
                </p>
                <p>
                  <strong>Role:</strong> {userInfo.tokenInfo.role}
                </p>
                <p>
                  <strong>Subject:</strong> {userInfo.tokenInfo.sub}
                </p>
                <p>
                  <strong>Issued At:</strong>{" "}
                  {new Date(userInfo.tokenInfo.iat * 1000).toLocaleString()}
                </p>
                <p>
                  <strong>Expires At:</strong>{" "}
                  {new Date(userInfo.tokenInfo.exp * 1000).toLocaleString()}
                </p>
              </>
            ) : (
              <p>Không thể giải mã access token hoặc token không tồn tại</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Thông tin từ ID Token</h2>
          <div className="bg-gray-100 p-4 rounded space-y-2">
            {userInfo.idTokenInfo ? (
              <>
                <p>
                  <strong>Email:</strong> {userInfo.idTokenInfo.email}
                </p>
                <p>
                  <strong>Role:</strong> {userInfo.idTokenInfo.role}
                </p>
                <p>
                  <strong>Subject:</strong> {userInfo.idTokenInfo.sub}
                </p>
                <p>
                  <strong>Issued At:</strong>{" "}
                  {new Date(userInfo.idTokenInfo.iat * 1000).toLocaleString()}
                </p>
                <p>
                  <strong>Expires At:</strong>{" "}
                  {new Date(userInfo.idTokenInfo.exp * 1000).toLocaleString()}
                </p>
              </>
            ) : (
              <p>Không thể giải mã ID token hoặc token không tồn tại</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
