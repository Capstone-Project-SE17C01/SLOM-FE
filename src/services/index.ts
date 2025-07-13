import { getClientCookie } from "@/utils/jsCookies";
import constants from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  prepareHeaders: (headers) => {
    const accessToken = getClientCookie("accessToken");

    headers.set("Content-Type", "application/json");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

export const baseApi = createApi({
  baseQuery: baseQuery,
  tagTypes: ['Meeting', 'Recording', 'Translation'],
  endpoints: () => ({}),
});
