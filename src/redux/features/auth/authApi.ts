import { baseApi } from "../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData) => ({
        url: "/auth/login",
        method: "POST",
        body: loginData,
      }),
    }),
    register: builder.mutation({
      query: (registerData) => ({
        url: "/auth/register",
        method: "POST",
        body: registerData,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (forgotPasswordData) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: forgotPasswordData,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (verifyEmailData) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: verifyEmailData,
      }),
    }),
    resendOtp: builder.mutation({
      query: (email) => {
        return {
          url: "/auth/resend-otp",
          method: "POST",
          body: { email },
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (resetPasswordData) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: resetPasswordData,
      }),
    }),
    changePassword: builder.mutation({
      query: (changePasswordData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: changePasswordData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
