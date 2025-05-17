export interface ILogin {
  email: string;
  password: string;
}
export interface IRegister {
  fullName: string;
  email: string;
  password: string;
}
export interface IVerifyEmail {
  otp: string;
}

export interface IForgotPassword {
  email: string;
}
export interface IResetPassword {
  password: string;
}
