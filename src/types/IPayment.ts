export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  orderCode: number;
  amount: number;
  currency: string;
  paymentMethod: string | null;
  status: string;
  transactionId: string | null;
  createdAt: string;
  reports?: PaymentReport[];
}

export interface PaymentReport {
  id: string;
  title: string;
  content: string;
  reportTypeId: string;
  reportType: string | null;
  createdAt: string;
  status: boolean;
  userId: string;
  transactionId: string;
  transaction: unknown | null;
  user: unknown | null;
} 