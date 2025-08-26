"use client";

import { useEffect, useState } from "react";
import { Download, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useGetAllPaymentsQuery } from "@/api/PaymentApi";
import { useGetAllProfilesQuery } from "@/api/ProfileApi";
import { Payment } from "@/types/IPayment";
import { IProfile } from "@/types/IProfile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function TransactionsPage() {
  const { data: paymentsData, isLoading, error } = useGetAllPaymentsQuery();
  const { data: profilesData } = useGetAllProfilesQuery();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [profiles, setProfiles] = useState<IProfile[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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

  const handleViewReports = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsReportDialogOpen(true);
  };

  return (
    <TooltipProvider>
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
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reports</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-3 text-sm text-gray-900 dark:text-white font-medium">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="max-w-[120px] truncate" title={payment.transactionId || 'N/A'}>
                                {truncateText(payment.transactionId || 'N/A', 10)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-mono">{payment.transactionId || 'N/A'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-900 dark:text-white">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="max-w-[120px] truncate">
                                {getUsernameById(payment.userId)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getUsernameById(payment.userId)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</td>
                        <td className="py-3 px-3 text-sm text-gray-900 dark:text-white">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="max-w-[80px] truncate">
                                {payment.paymentMethod || 'N/A'}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{payment.paymentMethod || 'N/A'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'SUCCESS' || payment.status === 'PAID'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : payment.status === 'FAILED'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-900 dark:text-white">
                          <div className="whitespace-nowrap">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {payment.reports && payment.reports.length > 0 ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/30"
                              onClick={() => handleViewReports(payment)}
                            >
                              <FileText className="h-4 w-4" /> {payment.reports.length}
                            </Button>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">No payment transactions found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reports Dialog */}
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Payment Reports</span>
              </DialogTitle>
            </DialogHeader>
            
            {selectedPayment && selectedPayment.reports && selectedPayment.reports.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Transaction</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-mono truncate max-w-[150px]">
                            {truncateText(selectedPayment.transactionId || 'N/A', 10)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-mono">{selectedPayment.transactionId || 'N/A'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">User</span>
                      <span className="truncate max-w-[150px]">
                        {getUsernameById(selectedPayment.userId)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Amount</span>
                      <span className="font-semibold">{formatCurrency(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex w-fit ${
                        selectedPayment.status === 'SUCCESS' || selectedPayment.status === 'PAID'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : selectedPayment.status === 'FAILED'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {selectedPayment.status}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Date</span>
                      <span>{new Date(selectedPayment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Method</span>
                      <span className="truncate max-w-[150px]">{selectedPayment.paymentMethod || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Reports ({selectedPayment.reports.length})</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
                      <span className="text-gray-700 dark:text-gray-300">Pending</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
                      <span className="text-gray-700 dark:text-gray-300">Resolved</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {selectedPayment.reports.map((report) => (
                    <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className={`py-3 px-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 ${
                        report.status ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'
                      }`}>
                        <h4 className="font-medium text-base flex items-center gap-2 text-gray-900 dark:text-white">
                          {report.status ? 
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" /> : 
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          }
                          {report.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          report.status 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        }`}>
                          {report.status ? 'Resolved' : 'Pending'}
                        </span>
                      </div>
                      <div className="p-4">
                        <Tabs defaultValue="content">
                          <TabsList className="mb-2">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                          </TabsList>
                          <TabsContent value="content" className="mt-0">
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm whitespace-pre-line text-gray-800 dark:text-gray-200">
                              {report.content}
                            </div>
                          </TabsContent>
                          <TabsContent value="details" className="mt-0">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Report ID:</span> 
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="font-mono ml-1 text-gray-900 dark:text-white">{truncateText(report.id, 8)}</span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="font-mono">{report.id}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Report Type:</span> 
                                <span className="ml-1 text-gray-900 dark:text-white">{report.reportType || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">User ID:</span> 
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="font-mono ml-1 text-gray-900 dark:text-white">{truncateText(report.userId, 8)}</span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="font-mono">{report.userId}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Created:</span> 
                                <span className="ml-1 text-gray-900 dark:text-white">{formatDate(report.createdAt)}</span>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No reports available for this transaction
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
} 