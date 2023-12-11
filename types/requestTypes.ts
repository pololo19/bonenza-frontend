export type VerifyRequestType = 'reset' | '';

export type SignUpEmailRequest = {
  email: string;
  password: string;
  referralCode?: string;
};

export type VerifyCodeRequest = {
  email?: string;
  phone?: string;
  code: string;
  request: VerifyRequestType;
};

export type SignUpPhoneRequest = {
  phone: string;
  password: string;
  referralCode?: string;
};

export type LoginRequest = {
  email?: string;
  phone?: string;
  password: string;
};

export type ResetPasswordRequest = {
  password: string;
  confirmPassword: string;
};

export type ParamsRequest = {
  q?: string | number;
  limit?: string | number;
  page?: string | number;
};
