import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FolderIcon } from 'lucide-react';
import { FolderSelectionModalProps } from '../types';

export const FolderSelectionModal: React.FC<FolderSelectionModalProps> = ({
  show,
  folderName,
  customFolderName,
  setCustomFolderName,
  onSelect,
  onCustomSubmit,
  onClose
}) => {
  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Recording</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-4">Choose where to save your recording:</p>
          
          <div className="space-y-2">
            <button 
              onClick={() => onSelect("general")}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm border ${
                folderName === "general" ? "border-primary bg-primary/5" : "border-gray-200"
              }`}
            >
              <FolderIcon className="w-4 h-4" />
              <span>General</span>
            </button>
            
            <button 
              onClick={() => onSelect("custom")}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm border ${
                folderName === "custom" ? "border-primary bg-primary/5" : "border-gray-200"
              }`}
            >
              <FolderIcon className="w-4 h-4" />
              <span>Custom folder</span>
            </button>
          </div>
          
          {folderName === "custom" && (
            <div className="mt-4">
              <Input
                placeholder="Enter folder name"
                value={customFolderName}
                onChange={(e) => setCustomFolderName(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {folderName === "custom" ? (
            <Button onClick={onCustomSubmit} disabled={!customFolderName.trim()}>
              Save
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 