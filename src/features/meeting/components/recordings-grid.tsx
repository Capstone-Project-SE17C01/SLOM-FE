"use client";

import * as React from "react";
import { Recording } from "../types";
import { Play, MoreHorizontal, Folder, Trash2, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { FolderSelectionModal } from "./folder-selection-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useMoveRecordingMutation, useDeleteRecordingMutation } from "../api";

interface RecordingsGridProps {
  recordings: Recording[];
  isLoading: boolean;
  onRefetch: () => void;
}

export function RecordingsGrid({
  recordings,
  isLoading,
  onRefetch
}: RecordingsGridProps): JSX.Element {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [selectedRecording, setSelectedRecording] = React.useState<Recording | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [showFolderModal, setShowFolderModal] = React.useState(false);
  const [folderName, setFolderName] = React.useState("");
  const [customFolderName, setCustomFolderName] = React.useState("");
  
  const [moveRecording] = useMoveRecordingMutation();
  const [deleteRecording] = useDeleteRecordingMutation();
  
  const handlePlay = (recording: Recording) => {
    setSelectedRecording(recording);
    setIsPlayerOpen(true);
  };
  
  const handleDeleteClick = (recording: Recording) => {
    setSelectedRecording(recording);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!selectedRecording || !userInfo?.id) return;
    
    try {
      await deleteRecording({
        id: selectedRecording.id,
        request: { userId: userInfo.id }
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedRecording(null);
      onRefetch();
    } catch (error) {
      console.error("Failed to delete recording:", error);
    }
  };
  
  const handleMoveToFolderClick = (recording: Recording) => {
    setSelectedRecording(recording);
    setShowFolderModal(true);
  };
  
  const handleFolderSelect = (folder: string) => {
    setFolderName(folder);
    
    if (folder !== "custom") {
      handleMoveToFolder(folder);
    }
  };
  
  const handleCustomFolderSubmit = () => {
    if (customFolderName.trim()) {
      handleMoveToFolder(`custom/${customFolderName.trim()}`);
    }
  };
  
  const handleMoveToFolder = async (targetFolder: string) => {
    if (!selectedRecording || !userInfo?.id) return;
    
    try {
      await moveRecording({
        id: selectedRecording.id,
        request: {
          targetFolder,
          userId: userInfo.id
        }
      });
      
      setShowFolderModal(false);
      setSelectedRecording(null);
      onRefetch();
    } catch (error) {
      console.error("Failed to move recording:", error);
    }
  };
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleDownload = (recording: Recording) => {
    if (recording.storagePath) {
      window.open(recording.storagePath, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 h-48 rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  if (recordings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No recordings found</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Recordings from your meetings will appear here
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recordings.map((recording) => (
          <Card key={recording.id} className="overflow-hidden">
            <div className="relative h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  onClick={() => handlePlay(recording)}
                  size="icon" 
                  variant="ghost" 
                  className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/60"
                >
                  <Play className="h-5 w-5 text-white" />
                </Button>
              </div>
              
              {recording.duration && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(recording.duration)}
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium truncate">
                  {recording.meetingTitle || "Unnamed Recording"}
                </h3>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handlePlay(recording)}>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMoveToFolderClick(recording)}>
                      <Folder className="h-4 w-4 mr-2" />
                      Move to folder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(recording)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteClick(recording)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {recording.createdAt && 
                  formatDistanceToNow(new Date(recording.createdAt), { addSuffix: true })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Video player dialog */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedRecording?.meetingTitle || "Recording"}</DialogTitle>
          </DialogHeader>
          
          {selectedRecording?.storagePath && (
            <div className="relative aspect-video">
              <video 
                src={selectedRecording.storagePath} 
                controls 
                autoPlay
                className="w-full h-full rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recording</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this recording? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Folder selection modal */}
      <FolderSelectionModal
        show={showFolderModal}
        folderName={folderName}
        customFolderName={customFolderName}
        setCustomFolderName={setCustomFolderName}
        onSelect={handleFolderSelect}
        onCustomSubmit={handleCustomFolderSubmit}
        onClose={() => setShowFolderModal(false)}
      />
    </>
  );
} 