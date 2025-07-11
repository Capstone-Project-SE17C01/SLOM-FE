import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { CreateReportRequestDTO, ReportType } from "../../../types/IProfile";
import { Loader2 } from "lucide-react";

interface ReportFormProps {
  userId: string;
  transactionId: string;
  onSubmit: (data: CreateReportRequestDTO) => Promise<void>;
  onCancel: () => void;
  reportTypes: ReportType[];
  isSubmitting?: boolean;
}

interface FormErrors {
  title?: string;
  reportTypeId?: string;
  content?: string;
}

const initialFormState = (userId: string): CreateReportRequestDTO => ({
  title: "",
  content: "",
  reportTypeId: "",
  status: false,
  userId,
});

export default function ReportForm({
  userId,
  transactionId,
  onSubmit,
  onCancel,
  reportTypes,
  isSubmitting = false,
}: ReportFormProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState<CreateReportRequestDTO>(() =>
    initialFormState(userId)
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const defaultReportType = reportTypes.find((type) =>
      type.name.toLowerCase().includes("payment")
    );

    setFormData({
      title: t("profile.report.paymentIssue"),
      content: `${t("profile.report.transactionId")}: ${transactionId}\n${t(
        "profile.report.contentPlaceholder"
      )}`,
      reportTypeId: defaultReportType?.id ?? "",
      status: false,
      userId,
    });
  }, [transactionId, t, reportTypes, userId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t("profile.report.errors.titleRequired");
    } else if (formData.title.length < 5) {
      newErrors.title = t("profile.report.errors.titleTooShort");
    }

    if (!formData.reportTypeId) {
      newErrors.reportTypeId = t("profile.report.errors.typeRequired");
    }

    if (!formData.content?.trim()) {
      newErrors.content = t("profile.report.errors.contentRequired");
    } else if (formData.content.length < 10) {
      newErrors.content = t("profile.report.errors.contentTooShort");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      reportTypeId: value,
    }));
    // Clear error when user selects a type
    if (errors.reportTypeId) {
      setErrors((prev) => ({
        ...prev,
        reportTypeId: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">{t("profile.report.title")}</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={t("profile.report.titlePlaceholder")}
          required
          disabled={isSubmitting}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reportType">{t("profile.report.type")}</Label>
        <Select
          value={formData.reportTypeId}
          onValueChange={handleSelectChange}
          disabled={isSubmitting}
          defaultValue={formData.reportTypeId}
        >
          <SelectTrigger
            className={errors.reportTypeId ? "border-red-500" : ""}
          >
            <SelectValue placeholder={t("profile.report.selectType")} />
          </SelectTrigger>
          <SelectContent>
            {reportTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.reportTypeId && (
          <p className="text-sm text-red-500">{errors.reportTypeId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">{t("profile.report.content")}</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder={t("profile.report.contentPlaceholder")}
          rows={4}
          disabled={isSubmitting}
          className={errors.content ? "border-red-500" : ""}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("profile.report.cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("profile.report.submitting")}
            </>
          ) : (
            t("profile.report.submit")
          )}
        </Button>
      </div>
    </form>
  );
}
