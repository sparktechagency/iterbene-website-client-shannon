export interface ILogin {
  email: string;
  password: string;
}
export interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string
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
