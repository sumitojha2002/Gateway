import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";
import { URLS } from "@/constants";

export const api = createApi({
  reducerPath: "apiService",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["JobSeekerProfile", "EmployerProfile"],
  endpoints: (builder) => ({
    // Job Seeker
    getJobSeekerProfile: builder.query({
      query: () => URLS.JS_PROFILE,
      providesTags: ["JobSeekerProfile"],
    }),

    updateJobSeekerProfile: builder.mutation({
      query: (body) => ({
        url: URLS.JS_PROFILE,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["JobSeekerProfile"],
    }),

    deleteJobSeekerExperience: builder.mutation<void, number>({
      query: (id) => ({
        url: URLS.DEL_JS_EXP(id),
        method: "DELETE",
      }),
      invalidatesTags: ["JobSeekerProfile"],
    }),

    deleteJobSeekerEducation: builder.mutation<void, number>({
      query: (id) => ({
        url: URLS.DEL_JS_EDU(id),
        method: "DELETE",
      }),
      invalidatesTags: ["JobSeekerProfile"],
    }),

    // Employer
    getEmployerProfile: builder.query({
      query: () => URLS.EMP_PROFILE,
      providesTags: ["EmployerProfile"],
    }),

    updateEmployerProfile: builder.mutation({
      query: (body) => ({
        url: URLS.EMP_PROFILE,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmployerProfile"],
    }),

    // Account
    login: builder.mutation({
      query: (body) => ({
        url: URLS.LOGIN,
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation({
      query: (body) => ({
        url: URLS.REGISTER,
        method: "POST",
        body,
      }),
    }),

    passwordResetRequest: builder.mutation({
      query: (body) => ({
        url: URLS.PWD_RE_REQ,
        method: "POST",
        body,
      }),
    }),

    passwordResetVerifyOTP: builder.mutation({
      query: (body) => ({
        url: URLS.PWD_RE_OTP_VER,
        method: "POST",
        body,
      }),
    }),

    passwordResetSetNew: builder.mutation({
      query: (body) => ({
        url: URLS.PWD_RE_N_PASS,
        method: "POST",
        body,
      }),
    }),

    // Jobs
    postJobs: builder.mutation({
      query: (body) => ({
        url: URLS.CREATE_JOBS,
        method: "POST",
        body,
      }),
    }),

    updateJob: builder.mutation<any, { id: number | string; body: FormData }>({
      query: ({ id, body }) => ({
        url: URLS.UPDATE_JOBS(id),
        method: "PUT",
        body,
      }),
    }),

    patchJob: builder.mutation<any, { id: number | string; body: FormData }>({
      query: ({ id, body }) => ({
        url: URLS.UPDATE_JOBS(id),
        method: "PUT",
        body,
      }),
    }),

    deleteJob: builder.mutation({
      query: (id: string | number) => ({
        url: URLS.DELETE_JOB(id),
        method: "DELETE",
      }),
    }),

    applyApplication: builder.mutation<any, { job_id: number; body: FormData }>(
      {
        query: ({ job_id, body }) => ({
          url: URLS.APPLY_APP(job_id),
          method: "POST",
          body,
        }),
      },
    ),

    acceptJobSeeker: builder.mutation<any, { body: string; id: number }>({
      query: ({ id, body }) => ({
        url: URLS.ACCEPT_JOB(id),
        method: "PATCH",
        body: { application_status: body },
      }),
    }),

    addBookMark: builder.mutation<
      any,
      { job_id: number | string; token?: string }
    >({
      query: ({ job_id, token }) => ({
        url: URLS.ADD_BOOKMARK,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: { "job": job_id },
      }),
    }),

    removeBookMark: builder.mutation<
      any,
      { id: number | string; token?: string }
    >({
      query: ({ id, token }) => ({
        url: URLS.REMOVE_BOOKMARK(id),
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
    }),


    rejectJobSeeker: builder.mutation({
      query: (id: number) => ({
        url: URLS.REJECT_JOB(id),
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetJobSeekerProfileQuery,
  useUpdateJobSeekerProfileMutation,
  useDeleteJobSeekerEducationMutation,
  useDeleteJobSeekerExperienceMutation,
  useGetEmployerProfileQuery,
  usePatchJobMutation,
  useAcceptJobSeekerMutation,
  useAddBookMarkMutation,
  useRemoveBookMarkMutation,
  useApplyApplicationMutation,
  useUpdateEmployerProfileMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  usePostJobsMutation,
  useLoginMutation,
  useRegisterMutation,
  usePasswordResetRequestMutation,
  usePasswordResetVerifyOTPMutation,
  usePasswordResetSetNewMutation,
} = api;
