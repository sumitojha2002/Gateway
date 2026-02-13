import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";
import { URLS } from "@/constants";
import { NotificationItem } from "@/components/providers/NotificationProvider";

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

    // Password Reset / Change Password Flow (uses these 3 endpoints)
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

    // OTP — fixed: was builder.query, must be builder.mutation (POST calls)
    sendOTPRegister: builder.mutation<any, { email: string; otp: string }>({
      query: ({ email, otp }) => ({
        url: URLS.POST_OTP_API_REGISTER,
        method: "POST",
        body: { email, otp_code: otp },
      }),
    }),

    resendOTPRegister: builder.mutation<any, { email: string }>({
      query: ({ email }) => ({
        url: URLS.RESEND_OTP_REGISTER,
        method: "POST",
        body: { email, purpose: "registration" },
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

    applyApplication: builder.mutation<
      any,
      { job_id: number; body?: FormData }
    >({
      query: ({ job_id, body }) => ({
        url: URLS.APPLY_APP(job_id),
        method: "POST",
        body: body || undefined,
      }),
    }),

    acceptJobSeeker: builder.mutation<any, { body: string; id: number }>({
      query: ({ id, body }) => ({
        url: URLS.ACCEPT_JOB(id),
        method: "PATCH",
        body: { application_status: body },
      }),
    }),

    addBookMark: builder.mutation<any, { job_id: number | string }>({
      query: ({ job_id }) => ({
        url: URLS.ADD_BOOKMARK,
        method: "POST",
        body: { job: job_id },
      }),
    }),

    removeBookMark: builder.mutation<any, { id: number | string }>({
      query: ({ id }) => ({
        url: URLS.REMOVE_BOOKMARK(id),
        method: "DELETE",
      }),
    }),

    chatInitiate: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: URLS.CHAT_INITIATE,
        method: "POST",
        body: { job_application: id },
      }),
    }),

    rejectJobSeeker: builder.mutation({
      query: (id: number) => ({
        url: URLS.REJECT_JOB(id),
        method: "DELETE",
      }),
    }),

    markAsRead: builder.mutation<any, { id: number | string; stat: boolean }>({
      query: ({ id, stat }) => ({
        url: URLS.MARK_AS_READ(id),
        method: "PATCH",
        body: { is_read: stat },
      }),
    }),

    getNotifications: builder.query<NotificationItem[], void>({
      query: () => URLS.GET_NOTIFICATION,
      transformResponse: (res: any) => res.data ?? [],
    }),

    requestPasswordReset: builder.query<any, { email: string }>({
      query: ({ email }) => ({
        url: URLS.REQ_PASSWORD_RESET,
        method: "POST",
        body: { email: email },
      }),
    }),

    sendNewPassword: builder.query<
      any,
      { email: string; new_password: string; confirm_new_password: string }
    >({
      query: ({ email, new_password, confirm_new_password }) => ({
        url: URLS.REQ_PASSWORD_RESET_OTP,
        method: "POST",
        body: {
          email: email,
          new_password: new_password,
          confirm_new_password,
        },
      }),
    }),

    sendOTPPassword: builder.query<any, { email: string; otp_code: string }>({
      query: ({ email, otp_code }) => ({
        url: URLS.SEND_PASSWORD_RESET_OPT,
        method: "POST",
        body: {
          email: email,
          otp_code: otp_code,
        },
      }),
    }),
    resendOTPPassword: builder.query<any, { email: string }>({
      query: ({ email }) => ({
        url: URLS.REQ_PASSWORD_RESET_OTP,
        method: "POST",
        body: {
          email: email,
        },
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
  useMarkAsReadMutation,
  useSendOTPRegisterMutation,
  useResendOTPRegisterMutation,
  useGetNotificationsQuery,
  useChatInitiateMutation,
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
