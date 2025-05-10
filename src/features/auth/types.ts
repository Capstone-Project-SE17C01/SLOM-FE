export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginWithGoogleRequestDTO {
  code: string;
  redirectUri: string;
  role: string;
  languageCode?: string;
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

export interface APIResponse<T = unknown> {
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

export interface CreatePaymentLinkResponseDTO {
  checkoutUrl?: string | null;
  message?: string | null;
}

export interface CreatePaymentRequestDTO {
  subscriptionId: string;
  userId: string;
  paymentMethod: string;
  status: "PAID" | "PENDING" | "PROCESSING" | "CANCELLED";
  durationMonth: number;
  productName?: string | null;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  price: number;
}

export interface ReturnUrlQueryDTO {
  period: number;
  userId: string;
  code: string;
  id: string;
  cancel: boolean;
  status: "PAID" | "PENDING" | "PROCESSING" | "CANCELLED";
  orderCode: number;
}

export interface CreatePaymentLinkResponseDTO {
  checkoutUrl?: string | null;
  message?: string | null;
}

export interface CreatePaymentRequestDTO {
  subscriptionId: string;
  userId: string;
  paymentMethod: string;
  status: "PAID" | "PENDING" | "PROCESSING" | "CANCELLED";
  durationMonth: number;
  productName?: string | null;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  price: number;
}

export interface ReturnUrlQueryDTO {
  code: string;
  id: string;
  cancel: boolean;
  status: "PAID" | "PENDING" | "PROCESSING" | "CANCELLED";
  orderCode: number;
}

export interface SubscriptionPlanDTO {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  description: string;
  features?: string | null;
  isActive: boolean;
}

export interface UpdatePasswordRequestDTO {
  accessToken: string;
  newPassword: string;
  oldPassword: string;
}
