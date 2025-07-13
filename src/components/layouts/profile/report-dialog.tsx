import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReportForm from "./report-form";
import { CreateReportRequestDTO, ReportType } from "../../../types/IProfile";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReportRequestDTO) => Promise<void>;
  userId: string;
  transactionId: string;
  reportTypes: ReportType[];
}

export default function ReportDialog({
  isOpen,
  onClose,
  onSubmit,
  userId,
  transactionId,
  reportTypes,
}: ReportDialogProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateReportRequestDTO) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="report-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>{t("profile.report.title")}</DialogTitle>
        </DialogHeader>
        <div id="report-dialog-description" className="sr-only">
          Form to report issues with your transaction
        </div>
        <ReportForm
          userId={userId}
          transactionId={transactionId}
          onSubmit={handleSubmit}
          onCancel={onClose}
          reportTypes={reportTypes}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
