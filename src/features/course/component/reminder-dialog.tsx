import { BellIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ButtonCourse } from "@/components/ui/buttonCourse";
import { ReminderForm } from "./reminder-form";
import { useTranslations } from "next-intl";

interface ReminderDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userEmail?: string;
  userId?: string;
}

export function ReminderDialog({
  isOpen,
  onOpenChange,
  userEmail,
  userId,
}: ReminderDialogProps) {
  const tCourseDashBoard = useTranslations("courseDashboard");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <ButtonCourse
          variant="primaryOutline"
          className="bg-white text-primary hover:bg-primary hover:text-white group"
        >
          <BellIcon className="w-4 h-4 group-hover:animate-[ring_1s_ease-in-out_infinite]" />
        </ButtonCourse>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tCourseDashBoard("setReminder")}</DialogTitle>
        </DialogHeader>
        <ReminderForm
          userEmail={userEmail}
          userId={userId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
