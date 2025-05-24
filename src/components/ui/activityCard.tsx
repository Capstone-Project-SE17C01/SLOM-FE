import { FaChartBar, FaChevronRight, FaCaretUp } from "react-icons/fa";

function ActivityCard({
  title,
  value,
  subLabel,
  diff,
}: {
  title: string;
  value: number;
  subLabel: string;
  diff: number;
}) {
  return (
    <div className="bg-primary rounded-2xl p-4 shadow flex flex-col gap-2 w-[270px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold">
          <FaChartBar className="text-lg" />
          <span>{title}</span>
        </div>
        <FaChevronRight className="text-white" />
      </div>
      <div className="bg-white rounded-xl px-4 py-3 flex flex-col gap-1 relative">
        <span className="text-sm">{subLabel}</span>
        <span className="text-3xl font-bold">{value}</span>
        <span className="absolute right-4 bottom-3 flex items-center gap-1 text-green-600 font-bold text-sm">
          <FaCaretUp />
          {diff}
        </span>
      </div>
    </div>
  );
}

export default ActivityCard;
