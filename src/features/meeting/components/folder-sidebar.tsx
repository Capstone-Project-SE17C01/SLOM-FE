"use client";

import * as React from "react";
import { FolderIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FolderSidebarProps {
  folders: string[];
  selectedFolder: string;
  onSelectFolder: (folder: string) => void;
}

export function FolderSidebar({ 
  folders, 
  selectedFolder, 
  onSelectFolder 
}: FolderSidebarProps): JSX.Element {
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  
  const handleCreateFolder = () => {
    // In a real implementation, this would call an API to create a folder
    // For now, we just close the dialog since we can't create folders without backend support
    setIsNewFolderDialogOpen(false);
    setNewFolderName("");
  };
  
  const formatFolderName = (folder: string) => {
    if (folder === "all") return "All Recordings";
    if (folder === "general") return "General";
    
    if (folder.startsWith("custom/")) {
      return folder.split("/")[1];
    }
    
    return folder;
  };
  
  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Folders</h2>
        <button 
          onClick={() => setIsNewFolderDialogOpen(true)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-1">
        {folders.map((folder) => (
          <button
            key={folder}
            onClick={() => onSelectFolder(folder)}
            className={cn(
              "flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm",
              selectedFolder === folder 
                ? "bg-gray-200 dark:bg-gray-800 font-medium" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <FolderIcon className="w-4 h-4" />
            <span className="truncate">{formatFolderName(folder)}</span>
          </button>
        ))}
      </div>
      
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="mb-4"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 