export const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_BASE_URL;
export const API_BASE_URL = BASE_URL + "/api";

export const URLS = {
  //account POST
  LOGIN: `${API_BASE_URL}/account/login/`,
  PWD_RE_OTP_VER: `${API_BASE_URL}/account/password-reset-otp-verify/`,
  PWD_RE_REQ: `${API_BASE_URL}/account/password-reset-request/`,
  PWD_RE_N_PASS: `${API_BASE_URL}/account/password-reset-set-new-password/`,
  REGISTER: `${API_BASE_URL}/account/register/`,
  RE_OTP: `${API_BASE_URL}/resend-otp/`,
  REFRESH: `${API_BASE_URL}/account/token/refresh/`,
  VERIFY_EMAIL: `${API_BASE_URL}/account/verify-email/`,
  //employer GET PUT PATCH
  EMP_PROFILE: `${API_BASE_URL}/employer/profile/`,

  //job-seeker GET PUT PATCH
  JS_PROFILE: `${API_BASE_URL}/job-seeker/profile/`,
  DEL_JS_EXP: (id: number | string) =>
    `${API_BASE_URL}/job-seeker/experience-delete/${id}/`,
  DEL_JS_EDU: (id: number | string) =>
    `${API_BASE_URL}/job-seeker/education-delete/${id}/`,
  //skills GET
  JS_SKILLS: `${API_BASE_URL}/job-seeker/skill-list/`,
  //jobs
  GET_JOB_BY_ID: (id: number | string) =>
    `${API_BASE_URL}/job/job-detail/${id}/`,
  GET_JOB_LIST: `${API_BASE_URL}/job/job-list/`,
  GET_JOB_FOR_EMP: `${API_BASE_URL}/job/employer-job-list/`,
  //create job
  CREATE_JOBS: `${API_BASE_URL}/job/job-create/`,
  //put job
  UPDATE_JOBS: (id: number | string) => `${API_BASE_URL}/job/job-access/${id}/`,
  //delete job
  DELETE_JOB: (id: number | string) => `${API_BASE_URL}/job/job-access/${id}/`,
  //draft-list
  DRAFT_JOBS: `${API_BASE_URL}/job/job-draft-list/`,
  //job-applicants-list
  APPLY_APP: (job_id: number | string) =>
    `${API_BASE_URL}/job/job-application-create/${job_id}/`,
  //get applicants list
  GET_APPLICANTS_LIST: (job_id: number) =>
    `${API_BASE_URL}/job/job-applicants-list/${job_id}`,
  //get user from id
  GET_JS_FROM_ID: (id: number) =>
    `${API_BASE_URL}/job/job-application-detail/${id}/`,
};

export const ROLES = {
  JOB_SEEKER: "job_seeker",
  EMPLOYER: "employer",
};
