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
} 