"use client";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Eye, EyeOff, Lock } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { RootState } from "@/middleware/store";
import { useUpdatePasswordMutation } from "@/api/AuthApi";
import constants from "@/config/constants";
import { useGetHistoryPaymentMutation } from "@/api/ProfileApi";
import { HistoryPaymentDTO } from "@/types/IProfile";
import TableTransaction from "@/components/layouts/profile/table-transaction";

export default function ProfilePage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const t = useTranslations();
  const [updatePassword] = useUpdatePasswordMutation();
  const [getHistoryPayment, { isLoading: isLoadingHistoryPayment }] =
    useGetHistoryPaymentMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [historyPayment, setHistoryPayment] = useState<HistoryPaymentDTO[]>([]);
  const [activeTab, setActiveTab] = useState(t("profile.tabs.personal"));

  const [passwordForm, setPasswordForm] = useState({
    accessToken: "",
    newPassword: "",
    oldPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.id]: e.target.value,
    });
  };

  const togglePasswordVisibility = (
    field: "oldPassword" | "newPassword" | "confirmPassword"
  ) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = Cookies.get(constants.ACCESS_TOKEN);

    if (!accessToken) {
      toast.error(t("profile.security.errors.notAuthorizedException"));
      return;
    }

    if (passwordForm.newPassword !== confirmPassword) {
      setError(t("profile.security.errors.passwordsNotMatch"));
      return;
    }

    setIsLoading(true);

    updatePassword({
      ...passwordForm,
      accessToken,
    })
      .unwrap()
      .then((payload) => {
        if (payload.data?.result) {
          toast.success(t(`profile.security.success.${payload.data?.result}`));
          setError("");
          setPasswordForm({
            accessToken: "",
            newPassword: "",
            oldPassword: "",
          });
          setConfirmPassword("");
        }
      })
      .catch((error) => {
        const errorMessage = Array.isArray(error.data?.errorMessages)
          ? error.data.errorMessages[0]
          : "updateFailed";
        setError(t("profile.security.errors." + errorMessage));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTransaction = async () => {
    setActiveTab(t("profile.tabs.transaction"));
    if (userInfo?.id) {
      try {
        const response = await getHistoryPayment(userInfo?.id).unwrap();
        setHistoryPayment(response.result || []);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{t("profile.loginRequired")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">{t("profile.title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={userInfo.avatarUrl}
                    alt={`${userInfo.firstname} ${userInfo.lastname}`}
                  />
                  <AvatarFallback className="text-4xl">
                    {userInfo.firstname?.[0]}
                    {userInfo.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">
                {userInfo.firstname} {userInfo.lastname}
              </CardTitle>
              <CardDescription>{userInfo.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Button variant="outline" className="w-full">
                  {t("profile.updateProfilePicture")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("profile.accountDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("profile.memberSince")}
                  </span>
                  <p>April 2023</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("profile.lastLogin")}
                  </span>
                  <p>{t("profile.today")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value={t("profile.tabs.personal")}>
                {t("profile.tabs.personal")}
              </TabsTrigger>
              <TabsTrigger value={t("profile.tabs.security")}>
                {t("profile.tabs.security")}
              </TabsTrigger>
              <TabsTrigger value={t("profile.tabs.preferences")}>
                {t("profile.tabs.preferences")}
              </TabsTrigger>
              <TabsTrigger
                value={t("profile.tabs.transaction")}
                onClick={handleTransaction}
              >
                {t("profile.tabs.transaction")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={t("profile.tabs.personal")}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.personalInfo.title")}</CardTitle>
                  <CardDescription>
                    {t("profile.personalInfo.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">
                          {t("profile.personalInfo.firstName")}
                        </Label>
                        <Input
                          id="firstName"
                          defaultValue={userInfo.firstname}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          {t("profile.personalInfo.lastName")}
                        </Label>
                        <Input id="lastName" defaultValue={userInfo.lastname} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t("profile.personalInfo.email")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={userInfo.email}
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">
                        {t("profile.personalInfo.bio")}
                      </Label>
                      <Textarea
                        id="bio"
                        placeholder={t("profile.personalInfo.bioPlaceholder")}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">
                        {t("profile.personalInfo.location")}
                      </Label>
                      <Input
                        id="location"
                        placeholder={t(
                          "profile.personalInfo.locationPlaceholder"
                        )}
                      />
                    </div>

                    <Button type="submit">
                      {t("profile.personalInfo.saveChanges")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value={t("profile.tabs.security")}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.security.title")}</CardTitle>
                  <CardDescription>
                    {t("profile.security.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleUpdatePassword}>
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword">
                        {t("profile.security.currentPassword")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="oldPassword"
                          type={showPasswords.oldPassword ? "text" : "password"}
                          value={passwordForm.oldPassword}
                          onChange={handlePasswordChange}
                          disabled={isLoading}
                          required
                          className="pr-10 pl-9"
                        />
                        <Lock className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("oldPassword")
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                          aria-label={
                            showPasswords.oldPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPasswords.oldPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">
                        {t("profile.security.newPassword")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.newPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          disabled={isLoading}
                          required
                          className="pr-10 pl-9"
                        />
                        <Lock className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("newPassword")
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                          aria-label={
                            showPasswords.newPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPasswords.newPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword">
                        {t("profile.security.confirmPassword")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmNewPassword"
                          type={
                            showPasswords.confirmPassword ? "text" : "password"
                          }
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                          required
                          className="pr-10 pl-9"
                        />
                        <Lock className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("confirmPassword")
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                          aria-label={
                            showPasswords.confirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPasswords.confirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="text-sm text-red-500 mt-2">{error}</div>
                    )}

                    <Button type="submit" disabled={isLoading}>
                      {isLoading
                        ? t("profile.security.updating")
                        : t("profile.security.updatePassword")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value={t("profile.tabs.preferences")}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.preferences.title")}</CardTitle>
                  <CardDescription>
                    {t("profile.preferences.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {t("profile.preferences.notifications")}
                    </h3>
                    <div className="space-y-4">
                      {/* Add notification preferences here */}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {t("profile.preferences.display")}
                    </h3>
                    <div className="space-y-4">
                      {/* Add display preferences here */}
                    </div>
                  </div>

                  <Button>{t("profile.preferences.savePreferences")}</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value={t("profile.tabs.transaction")}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.transaction.title")}</CardTitle>
                  <CardDescription>
                    {t("profile.transaction.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingHistoryPayment ? (
                    <div className="flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    <TableTransaction
                      data={historyPayment}
                      userId={userInfo?.id || ""}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
