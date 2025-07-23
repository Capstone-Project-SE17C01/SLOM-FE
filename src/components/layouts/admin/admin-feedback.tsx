"use client";

import { Clock, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  useDeleteFeedbackMutation,
  useGetListFeedbackMutation,
} from "@/api/AdminApi";
import { Feedback } from "@/types/IFeedback";
import { toast } from "sonner";

export default function AdminFeedback() {
  const [getFeedbacks, { isLoading: isLoadingFeedbacks }] =
    useGetListFeedbackMutation();
  const [deleteFeedback] = useDeleteFeedbackMutation();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const paginatedFeedbacks = feedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //call api mutation get feedbacks AdminApi, and set feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      await getFeedbacks()
        .unwrap()
        .then((res) => {
          setFeedbacks(
            res.map((fb) => ({
              ...fb,
              id: String(fb.id),
            }))
          );
        });
    };
    fetchFeedbacks();
  }, [getFeedbacks]);

  //handle delete feedback
  const handleDeleteFeedback = (id: string) => {
    deleteFeedback(id)
      .unwrap()
      .then(() => {
        setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
        toast.success("Feedback deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to delete feedback");
      });
  };
  //calc total feedbacks and total users send feedback by unique email
  const totalFeedbacks = feedbacks.length;
  const totalUsers = new Set(feedbacks.map((fb) => fb.email)).size;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Feedback Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage feedbacks from users
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Feedback
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalFeedbacks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalUsers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {/* if isLoadingFeedbacks, show loading , if length of feedbacks is 0, show no feedbacks found*/}
              {isLoadingFeedbacks && (
                <tr>
                  <td colSpan={5} className="text-center">
                    Loading...
                  </td>
                </tr>
              )}
              {!isLoadingFeedbacks && feedbacks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    No feedbacks found
                  </td>
                </tr>
              )}
              {!isLoadingFeedbacks &&
                paginatedFeedbacks.length > 0 &&
                paginatedFeedbacks.map((feedback) => (
                  <tr
                    key={feedback.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 w-1/4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {feedback.name}
                        </div>
                        <div className="mt-1"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {feedback.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {feedback.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {feedback.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => handleDeleteFeedback(feedback.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            variant={currentPage === idx + 1 ? "default" : "outline"}
          >
            {idx + 1}
          </Button>
        ))}
        <Button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
