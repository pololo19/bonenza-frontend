type LoginRequest = {
  accessToken: string;
};

type LoginRequestWithoutCaptcha = {
  email: string;
  password: string;
  codeOtp?: string;
};

type SignUpRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};

type ForgotPassRequest = {
  email: string;
};

type ResetPassRequest = {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
};

type VerifyTokenRequest = {
  email: string;
  token: string;
};

type UpdatePassRequest = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

type LoginResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: string;
    expiresAt: string;
  };
};
export type {
  SignUpRequest,
  LoginRequest,
  LoginResponse,
  ForgotPassRequest,
  LoginRequestWithoutCaptcha,
  ResetPassRequest,
  UpdatePassRequest,
  VerifyTokenRequest,
};
