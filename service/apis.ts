
const authBaseUrl=process.env.NEXT_PUBLIC_AUTH_API_URL
const notificationBaseUrl=process.env.NEXT_PUBLIC_NOTIFICATION_API_URL
const attendanceBaseUrl=process.env.NEXT_PUBLIC_ATTENDANCE

export const LOGIN=authBaseUrl + "/auth/login"

export const REFRESH_TOKEN=authBaseUrl + "/auth/refreshToken"

export const SEND_LOGIN_OTP=authBaseUrl + "/auth/login/sendOTP"

export const FORGOT_PASSWORD=authBaseUrl + "/auth/login/forgotPassword"

export const RESET_PASSWORD=authBaseUrl + "/auth/reset-password"

export const GET_NOTIFICATION=notificationBaseUrl + "/notification"

export const GET_SECURITY_PERSON=notificationBaseUrl + "/securityPerson"

export const SEND_NOTIFICATION=notificationBaseUrl + "/notification/send-notification"

export const GET_USERS=authBaseUrl + "/user"

export const LOGOUT=authBaseUrl + "/auth/logout"

export const CREATE_MODULE=authBaseUrl + "/module"

export const SEARCH_USER = attendanceBaseUrl + "/user"