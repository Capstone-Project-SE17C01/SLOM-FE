"use client";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllProvince: build.query({
      query: (params) => ({
        url: "/provinces/provinces",
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
  }),
});

export const { useGetAllProvinceQuery } = authAPI;
