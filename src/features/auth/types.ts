export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface ConfirmRegisterationRequestDTO {
  username?: string | null;
  email: string;
  confirmationCode: string;
  newPassword?: string | null;
  confirmNewPassword: string;
  role: string;
  isPasswordReset?: boolean;
}

export interface RegisterationRequestDTO {
  email: string;
  password: string;
  role: string;
}

export interface ResendConfirmationCodeDTO {
  email: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export interface APIResponse<T = any> {
  errorMessages: string[];
  result: T | null;
  pagination?: Pagination | null;
}

export interface LoginResponseDTO {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  userEmail?: string | null;
}

export interface MessageResponse {
  message: string;
}

