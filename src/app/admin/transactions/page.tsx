"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useGetAllPaymentsQuery } from "@/api/PaymentApi";
import { useGetAllProfilesQuery } from "@/api/ProfileApi";
import { Payment } from "@/types/IPayment";
import { IProfile } from "@/types/IProfile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TransactionsPage() {
  const { data: paymentsData, isLoading, error } = useGetAllPaymentsQuery();
  const { data: profilesData } = useGetAllProfilesQuery();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [profiles, setProfiles] = useState<IProfile[]>([]);

  useEffect(() => {
    if (paymentsData?.result) {
      setPayments(paymentsData.result);
    }
    if (profilesData?.result) {
      setProfiles(profilesData.result);
    }
  }, [paymentsData, profilesData]);

  const getUsernameById = (userId: string) => {
    const user = profiles.find(profile => profile.id === userId);
    return user?.username || "Unknown User";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleExport = () => {
    if (payments.length === 0) {
      toast.error("No payment data to export");
      return;
    }

    try {
      // Create headers for CSV file
      const headers = [
        "Transaction ID",
        "User ID",
        "Amount",
        "Currency",
        "Payment Method",
        "Status",
        "Order Code",
        "Subscription ID",
        "Date"
      ];

      // Create data for CSV file
      const csvData = payments.map((payment) => [
        payment.transactionId || "N/A",
        payment.userId,
        payment.amount,
        payment.currency,
        payment.paymentMethod || "N/A",
        payment.status,
        payment.orderCode,
        payment.subscriptionId,
        new Date(payment.createdAt).toLocaleString()
      ]);

      // Combine headers and data
      const csvContent = [
        headers.join(","),
        ...csvData.map(row => row.join(","))
      ].join("\n");

      // Create Blob and URL for download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      // Create element a to download
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `payment_transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      // Add to DOM, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Payment data exported successfully");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export payment data");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-gray-600 dark:text-gray-400">Track payment status and user engagement</p>
      </div>

      {/* Payment Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payment Transactions</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleExport}
            disabled={isLoading || payments.length === 0}
          >
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">Error loading payment data</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Username</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Payment Method</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{payment.transactionId || 'N/A'}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{getUsernameById(payment.userId)}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{formatCurrency(payment.amount)}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{payment.paymentMethod || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'SUCCESS' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : payment.status === 'FAILED'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{formatDate(payment.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">No payment transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 