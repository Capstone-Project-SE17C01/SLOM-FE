"use client";

import { useState } from "react";
import { Search, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAllProfilesQuery, useDeleteProfileMutation } from "@/api/ProfileApi";
import { IProfile } from "@/types/IProfile";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, refetch } = useGetAllProfilesQuery();
  const [deleteProfile, { isLoading: deleting }] = useDeleteProfileMutation();

  const profiles: IProfile[] = data?.result ?? [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProfile(String(deleteId)).unwrap();
      setShowModal(false);
      setDeleteId(null);
      refetch();
    } catch {
      console.error("Failed to delete profile");}
  };

  const filteredProfiles = profiles.filter(
    (user) =>
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all users in the system</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#6947A8] focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Avatar
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Bio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  VIP User
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {isLoading ? (
               <tr>
                 <td colSpan={7} className="text-center py-8">
                   Loading data...
                 </td>
               </tr>
             ) : filteredProfiles.length === 0 ? (
               <tr>
                 <td colSpan={7} className="text-center py-8">
                   No profiles found.
                 </td>
               </tr>
             ) : (
               filteredProfiles.map((user) => (
                 <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                   <td className="px-4 py-4 whitespace-nowrap">
                     <Avatar className="h-10 w-10">
                       <AvatarImage src={user.avatarUrl || ""} alt={user.userName} />
                       <AvatarFallback>{user.userName?.[0]}</AvatarFallback>
                     </Avatar>
                   </td>
                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.userName}</td>
                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.email}</td>
                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.bio ?? "-"}</td>
                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.location ?? "-"}</td>
                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                     {user.vipUser ? (
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                         VIP
                       </span>
                     ) : (
                       "-"
                     )}
                   </td>
                   <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="sm">
                           <MoreHorizontal className="h-4 w-4" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         <DropdownMenuItem
                           className="text-red-600"
                           onClick={() => {
                             setDeleteId(user.id);
                             setShowModal(true);
                           }}
                         >
                           <Trash2 className="mr-2 h-4 w-4" />
                           Delete
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                   </td>
                 </tr>
               ))
             )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {filteredProfiles.length} profiles
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
            <p>Are you sure you want to delete this profile?</p>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setDeleteId(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
