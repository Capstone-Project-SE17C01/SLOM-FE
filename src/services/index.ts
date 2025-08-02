import { getClientCookie, setClientCookie, deleteClientCookie } from "@/utils/jsCookies";
import constants from "@/config/constants";
import { createApi, fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { Mutex } from 'async-mutex';

let inMemoryToken: string | null = null;

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

const mutex = new Mutex();

const getAuthToken = (): string | undefined => {
  if (inMemoryToken) {
    return inMemoryToken;
  }
  
  const tokenFromCookie = getClientCookie("accessToken");
  if (tokenFromCookie) {
    inMemoryToken = tokenFromCookie;
  }
  
  return tokenFromCookie;
};

export const updateAuthToken = (token: string | null): void => {
  inMemoryToken = token;
};

const baseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  prepareHeaders: (headers) => {
    const accessToken = getAuthToken();

    headers.set("Content-Type", "application/json");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = getClientCookie("refreshToken");
        if (!refreshToken) {
          deleteClientCookie("accessToken");
          deleteClientCookie("refreshToken");
          updateAuthToken(null);
          window.location.href = "/login";
          return result;
        }

        const refreshResult = await baseQuery(
          {
            url: "/api/auth/refresh-token",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as RefreshResponse;
          setClientCookie("accessToken", accessToken, { expires: 1 });
          setClientCookie("refreshToken", newRefreshToken, { expires: 30 });
          updateAuthToken(accessToken);
          
          result = await baseQuery(args, api, extraOptions);
        } else {
          deleteClientCookie("accessToken");
          deleteClientCookie("refreshToken");
          updateAuthToken(null);
          window.location.href = "/login";
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Meeting', 'Recording', 'Translation'],
  endpoints: () => ({}),
});
