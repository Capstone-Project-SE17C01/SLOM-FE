import {
  CreateReportRequestDTO,
  HistoryPaymentDTO,
  ReportType,
} from "../../../types/IProfile";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ReportDialog from "./report-dialog";
import { useGetReportTypeMutation, useReportPaymentMutation } from "../../../api/ProfileApi";
import { toast } from "sonner";

interface TableTransactionProps {
  data: HistoryPaymentDTO[];
  userId: string;
}

export default function TableTransaction({
  data,
  userId,
}: TableTransactionProps) {
  const t = useTranslations();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  //report mutation
  const [reportPayment] = useReportPaymentMutation();
  const [getReportType] = useGetReportTypeMutation();
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleReport = async (transactionId: string) => {
    await getReportType()
      .unwrap()
      .then((res) => {
        if (res.result) {
          setReportTypes(res.result);
        }
      });
    setSelectedPayment(transactionId);
  };

  const handleCloseDialog = () => {
    setSelectedPayment(null);
  };

  const handleSubmitReport = async (
    createReportRequestDTO: CreateReportRequestDTO
  ) => {
    console.log(createReportRequestDTO);
    await reportPayment(createReportRequestDTO)
      .unwrap()
      .then((res) => {
        console.log(res);
        toast.success(t("profile.report.success"));
        handleCloseDialog();
      })
      .catch((err) => {
        console.log(err);
        toast.error(t("profile.report.error"));
        handleCloseDialog();
      });
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                {t("profile.transaction.date")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("profile.transaction.paymentMethod")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("profile.transaction.status")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("profile.transaction.amount")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("profile.transaction.action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((payment) => (
              <tr
                key={payment.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
              >
                <td className="px-6 py-4">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{payment.paymentMethod}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === "SUCCESS"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "FAILED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4">{formatCurrency(payment.amount)}</td>
                <td className="px-6 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleReport(payment.id)}
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  {t("profile.transaction.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedPayment && (
        <ReportDialog
          isOpen={!!selectedPayment}
          onClose={handleCloseDialog}
          userId={userId}
          transactionId={selectedPayment}
          onSubmit={handleSubmitReport}
          reportTypes={reportTypes}
        />
      )}
    </>
  );
}
