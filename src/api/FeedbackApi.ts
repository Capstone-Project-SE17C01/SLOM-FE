import { baseApi } from "@/services";

export interface Feedback {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const feedbackAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createFeedback: build.mutation<Feedback, Omit<Feedback, "id">>({
      query: (data) => ({
        url: "/api/feedback",
        method: "POST",
        body: data,
        flashError: false,
      }),
    }),
    getFeedbacks: build.query<Feedback[], void>({
      query: () => ({
        url: "/api/feedback",
        method: "GET",
        flashError: false,
      }),
    }),
    getFeedbackById: build.query<Feedback, number>({
      query: (id) => ({
        url: `/api/feedback/${id}`,
        method: "GET",
        flashError: false,
      }),
    }),
    updateFeedback: build.mutation<Feedback, Feedback>({
      query: (data) => ({
        url: `/api/feedback/${data.id}`,
        method: "PUT",
        body: data,
        flashError: false,
      }),
    }),
    deleteFeedback: build.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/api/feedback/${id}`,
        method: "DELETE",
        flashError: false,
      }),
    }),
  }),
});

export const {
  useCreateFeedbackMutation,
  useGetFeedbacksQuery,
  useGetFeedbackByIdQuery,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} = feedbackAPI;