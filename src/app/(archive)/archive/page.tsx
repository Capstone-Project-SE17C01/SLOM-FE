"use client";

import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetUserRecordingsQuery } from "@/features/meeting/api";
import { RecordingsGrid } from "@/features/meeting/components/recordings-grid";
import { FolderSidebar } from "@/features/meeting/components/folder-sidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ArchivePage(): JSX.Element {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [selectedFolder, setSelectedFolder] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  
  const { 
    data: recordings, 
    isLoading,
    refetch
  } = useGetUserRecordingsQuery(userInfo?.id || "", {
    skip: !userInfo?.id,
  });

  // Get unique folders from recordings
  const folders = React.useMemo(() => {
    if (!recordings) return ["all"];
    
    const folderSet = new Set<string>();
    folderSet.add("all");
    
    recordings.forEach((recording) => {
      const path = recording.storagePath;
      
      if (path.includes("cloudinary")) {
        // Parse folder from Cloudinary URL
        // Example URL: cloudinary://folder/subfolder/file.mp4
        const  pathParts = path.split("/");
        if (pathParts.length >= 3) {
          const folder = pathParts[3]; // Get the folder name
          if (folder === "custom" && pathParts.length >= 4) {
            folderSet.add(`custom/${pathParts[4]}`);
          } else {
            folderSet.add(folder);
          }
        } else {
          folderSet.add("general");
        }
      }
    });
    
    return Array.from(folderSet);
  }, [recordings]);

  // Filter recordings by folder and search query
  const filteredRecordings = React.useMemo(() => {
    if (!recordings) return [];
    
    return recordings.filter((recording) => {
      // Filter by folder
      const folderMatch = selectedFolder === "all" || (
        recording.storagePath.includes(selectedFolder)
      );
      
      // Filter by search query
      const searchMatch = !searchQuery || (
        (recording.meetingTitle && recording.meetingTitle.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      return folderMatch && searchMatch;
    });
  }, [recordings, selectedFolder, searchQuery]);

  return (
    <div className="flex h-screen">
      <FolderSidebar 
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
      />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {selectedFolder === "all" 
              ? "All Recordings" 
              : `Folder: ${selectedFolder}`}
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search recordings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
          </div>
        </div>
        
        <RecordingsGrid 
          recordings={filteredRecordings} 
          isLoading={isLoading} 
          onRefetch={refetch}
        />
      </div>
    </div>
  );
} 