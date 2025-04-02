import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

export const usersStatus = [
  {
    value: "active",
    label: "Hoạt động",
    icon: CheckCircledIcon,
  },
  {
    value: "inactive",
    label: "Tạm dừng",
    icon: CrossCircledIcon,
  },
];

export const usersRole = [
  {
    value: "admin",
    label: "Quản trị viên",
  },
  {
    value: "moderator",
    label: "Quản lí",
  },
  {
    value: "resident",
    label: "Người dân",
  },
  {
    value: "student",
    label: "Học sinh",
  },
];
