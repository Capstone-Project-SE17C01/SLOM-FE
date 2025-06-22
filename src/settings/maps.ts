export const genderMap = {
  0: "Nam",
  1: "Nữ",
  2: "Khác",
  3: "Chưa rõ",
};

export const roleMap = {
  ADMIN: "Quản trị viên",
  EXAMINER: "Khảo thí",
  IT: "Hỗ trợ IT",
  STAFF: "Giám thị",
};

export const buildingMap = {
  1: "Alpha",
  2: "Gamma",
  3: "Beta",
};

export const excelTemplate: Record<string, string> = {
  users: process.env.NEXT_PUBLIC_TEMPLATE_USERS_URL || "",
  departments: process.env.NEXT_PUBLIC_TEMPLATE_DEPARTMENTS_URL || "",
  courses: process.env.NEXT_PUBLIC_TEMPLATE_COURSES_URL || "",
  semesters: process.env.NEXT_PUBLIC_TEMPLATE_SEMESTERS_URL || "",
  examTypes: process.env.NEXT_PUBLIC_TEMPLATE_EXAM_TYPES_URL || "",
  examFormats: process.env.NEXT_PUBLIC_TEMPLATE_EXAM_FORMATS_URL || "",
  rooms: process.env.NEXT_PUBLIC_TEMPLATE_ROOMS_URL || "",
  examSchedule: process.env.NEXT_PUBLIC_TEMPLATE_EXAM_SCHEDULE_URL || "",
};
