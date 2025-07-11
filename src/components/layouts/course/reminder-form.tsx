import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { useSetupReminderMutation, useGetReminderMutation } from "../../../api/CourseApi";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ReminderFormProps {
  userEmail?: string;
  userId?: string;
  onSuccess: () => void;
  onActiveChange: (isActive: boolean) => void;
}

export function ReminderForm({
  userEmail,
  userId,
  onSuccess,
  onActiveChange,
}: ReminderFormProps) {
  const tCourseDashBoard = useTranslations("courseDashboard");
  const [setupReminder] = useSetupReminderMutation();
  const [getReminder] = useGetReminderMutation();
  const [message, setMessage] = useState("");
  const [timeToSend, setTimeToSend] = useState("00:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Fetch existing reminder
  useEffect(() => {
    if (userEmail) {
      (async () => {
        try {
          const response = await getReminder(userEmail).unwrap();
          if (response.result) {
            setMessage(response.result.message || "");
            setTimeToSend(response.result.timeToSend);
            setIsActive(response.result.isActive);
          }
        } catch {
          //do nothing
        }
      })();
    }
  }, [userEmail, getReminder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !timeToSend) return;

    setIsSubmitting(true);
    try {
      await setupReminder({
        email: userEmail,
        message,
        userId,
        timeToSend,
        isActive,
      })
        .unwrap()
        .then((response) => {
          if (response.result) {
            console.log(response.result);
            toast.success(tCourseDashBoard("reminderSetSuccessfully"));
            onSuccess();
            //set to form
            setMessage(response.result.message || "");
            setTimeToSend(response.result.timeToSend);
            setIsActive(response.result.isActive);
            onActiveChange(response.result.isActive);
          }
        });
    } catch (error) {
      console.error("Failed to setup reminder:", error);
      toast.error(tCourseDashBoard("reminderSetFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={userEmail} disabled />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={isActive}
          onCheckedChange={setIsActive}
          className="data-[state=unchecked]:bg-primary/50"
        />
        <Label htmlFor="active">{tCourseDashBoard("reminderActive")}</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Time to Send</Label>
        <Input
          id="time"
          type="time"
          value={timeToSend}
          onChange={(e) => setTimeToSend(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Input
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your reminder message"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Setting..." : tCourseDashBoard("setReminder")}
      </Button>
    </form>
  );
}
