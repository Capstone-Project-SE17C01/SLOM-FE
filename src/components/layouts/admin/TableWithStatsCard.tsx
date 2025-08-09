import React from "react";

interface StatsCard {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface TableWithStatsCardProps<T> {
  tableHeaders: React.ReactNode;
  renderRow: (item: T) => React.ReactNode;
  data: T[];
  statsTitle: string;
  statsData: StatsCard[];
  pagination: PaginationProps;
}

export default function TableWithStatsCard<T>({
  tableHeaders,
  renderRow,
  data,
  statsTitle,
  statsData,
  pagination,
}: TableWithStatsCardProps<T>) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">{statsTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statsData.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex items-center"
            >
              {stat.icon}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {Array.isArray(tableHeaders) 
                  ? tableHeaders.map((header, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {header}
                      </th>
                    ))
                  : tableHeaders
                }
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {data.map((item) => renderRow(item))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center p-4 space-x-2">
        <button
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          onClick={() =>
            pagination.onPageChange(Math.max(pagination.currentPage - 1, 1))
          }
          disabled={pagination.currentPage === 1}
        >
          Previous
        </button>
        
        {(() => {
          const pages = [];
          const totalPages = pagination.totalPages;
          const currentPage = pagination.currentPage;
          
          if (totalPages <= 5) {
            // Show all pages if 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
              pages.push(
                <button
                  key={i}
                  className={`px-3 py-1 rounded ${
                    currentPage === i
                      ? "bg-[#6947A8] text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                  onClick={() => pagination.onPageChange(i)}
                >
                  {i}
                </button>
              );
            }
          } else {
            // Show smart pagination with ellipsis
            if (currentPage <= 3) {
              // Show first 3 pages + ellipsis + last page
              for (let i = 1; i <= 3; i++) {
                pages.push(
                  <button
                    key={i}
                    className={`px-3 py-1 rounded ${
                      currentPage === i
                        ? "bg-[#6947A8] text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                    onClick={() => pagination.onPageChange(i)}
                  >
                    {i}
                  </button>
                );
              }
              pages.push(
                <span key="ellipsis1" className="px-2 text-gray-500">
                  ...
                </span>
              );
              pages.push(
                <button
                  key={totalPages}
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  onClick={() => pagination.onPageChange(totalPages)}
                >
                  {totalPages}
                </button>
              );
            } else if (currentPage >= totalPages - 2) {
              // Show first page + ellipsis + last 3 pages
              pages.push(
                <button
                  key={1}
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  onClick={() => pagination.onPageChange(1)}
                >
                  1
                </button>
              );
              pages.push(
                <span key="ellipsis2" className="px-2 text-gray-500">
                  ...
                </span>
              );
              for (let i = totalPages - 2; i <= totalPages; i++) {
                pages.push(
                  <button
                    key={i}
                    className={`px-3 py-1 rounded ${
                      currentPage === i
                        ? "bg-[#6947A8] text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                    onClick={() => pagination.onPageChange(i)}
                  >
                    {i}
                  </button>
                );
              }
            } else {
              // Show first page + ellipsis + current page + ellipsis + last page
              pages.push(
                <button
                  key={1}
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  onClick={() => pagination.onPageChange(1)}
                >
                  1
                </button>
              );
              pages.push(
                <span key="ellipsis3" className="px-2 text-gray-500">
                  ...
                </span>
              );
              pages.push(
                <button
                  key={currentPage}
                  className="px-3 py-1 rounded bg-[#6947A8] text-white"
                  onClick={() => pagination.onPageChange(currentPage)}
                >
                  {currentPage}
                </button>
              );
              pages.push(
                <span key="ellipsis4" className="px-2 text-gray-500">
                  ...
                </span>
              );
              pages.push(
                <button
                  key={totalPages}
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  onClick={() => pagination.onPageChange(totalPages)}
                >
                  {totalPages}
                </button>
              );
            }
          }
          
          return pages;
        })()}
        
        <button
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          onClick={() =>
            pagination.onPageChange(
              Math.min(pagination.currentPage + 1, pagination.totalPages)
            )
          }
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
