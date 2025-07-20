export interface HistoryPaymentDTO {
  id: string;
  userId: string;
  paymentMethod: string;
  status: string;
  amount: number;
  createdAt: string;
}

export interface CreateReportRequestDTO {
  title: string;
  content?: string;
  reportTypeId: string;
  createdAt?: string;
  status: boolean;
  userId: string;
}

export interface ReportType {
  id: string;
  name: string;
}

export interface IProfile {
  id: string;
  userName: string;
  email: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  vipUser?: boolean;
}
