import moment from "moment";
import "moment/locale/vi";

// Set the locale to Vietnamese
moment.locale("vi");

export function formatDate(dateString: string): string {
  return moment(dateString).format("DD MMMM YYYY");
}
