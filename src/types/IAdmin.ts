export interface SummaryAdminDTO {
  totalUsers: number;
  totalCourses: number;
  totalMeetings: number;
  totalRevenue: number;
  userInUseToday: number;
  revenueToday: number;
  newUserToday: number;
  newUserStats: { date: string; value: number }[];
  revenueStats: { date: string; value: number }[];
}
