import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  prepareHeaders: (headers) => {
    const accessToken = getClientCookie(constants.ACCESS_TOKEN);

    headers.set("Content-Type", "application/json");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

export const baseApi = createApi({
  baseQuery: baseQuery,
  endpoints: () => ({}),
  tagTypes: [
    "Librarys",
    "Topics",
    "News",
    "Admin",
    "Supervisions",
    "Manager",
    "Organizations",
    "students",
    "citizens",
  ],
});
