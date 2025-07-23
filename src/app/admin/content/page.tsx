"use client";

import { useState } from "react";
import { FileText, Image, Video, Upload, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "images" | "documents">("all");

  // Mock data - replace with real API call
  const content = [
    {
      id: 1,
      name: "Introduction to Sign Language.mp4",
      type: "video",
      size: "25.6 MB",
      uploadDate: "2024-01-15",
      course: "Sign Language Basics",
      status: "Published",
      views: 1245,
      thumbnail: "/images/banner.png",
    },
    {
      id: 2,
      name: "Alphabet Practice Guide.pdf",
      type: "document",
      size: "2.3 MB",
      uploadDate: "2024-01-14",
      course: "Sign Language Basics",
      status: "Published",
      downloads: 567,
    },
    {
      id: 3,
      name: "Hand Gestures Reference.jpg",
      type: "image",
      size: "890 KB",
      uploadDate: "2024-01-13",
      course: "Advanced Sign Language",
      status: "Draft",
      views: 234,
    },
    {
      id: 4,
      name: "Business Meeting Scenarios.mp4",
      type: "video",
      size: "45.2 MB",
      uploadDate: "2024-01-12",
      course: "Business Sign Language",
      status: "Published",
      views: 892,
      thumbnail: "/images/banner.png",
    },
    {
      id: 5,
      name: "Kids Activity Worksheet.pdf",
      type: "document",
      size: "1.8 MB",
      uploadDate: "2024-01-11",
      course: "Sign Language for Kids",
      status: "Published",
      downloads: 445,
    },
  ];

  const filteredContent = content.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "videos") return item.type === "video";
    if (activeTab === "images") return item.type === "image";
    if (activeTab === "documents") return item.type === "document";
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5 text-red-500" />;
      case "image":
        return <Image className="h-5 w-5 text-green-500" />;
      case "document":
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage videos, images, and documents</p>
        </div>
        <Button className="bg-[#6947A8] hover:bg-[#5a3d8c]">
          <Upload className="h-4 w-4 mr-2" />
          Upload Content
        </Button>
      </div>

      {/* Content Type Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          onClick={() => setActiveTab("all")}
          className={activeTab === "all" ? "bg-[#6947A8] hover:bg-[#5a3d8c]" : ""}
        >
          All Content
        </Button>
        <Button
          variant={activeTab === "videos" ? "default" : "outline"}
          onClick={() => setActiveTab("videos")}
          className={activeTab === "videos" ? "bg-[#6947A8] hover:bg-[#5a3d8c]" : ""}
        >
          <Video className="h-4 w-4 mr-2" />
          Videos ({content.filter(c => c.type === "video").length})
        </Button>
        <Button
          variant={activeTab === "images" ? "default" : "outline"}
          onClick={() => setActiveTab("images")}
          className={activeTab === "images" ? "bg-[#6947A8] hover:bg-[#5a3d8c]" : ""}
        >
          <Image className="h-4 w-4 mr-2" />
          Images ({content.filter(c => c.type === "image").length})
        </Button>
        <Button
          variant={activeTab === "documents" ? "default" : "outline"}
          onClick={() => setActiveTab("documents")}
          className={activeTab === "documents" ? "bg-[#6947A8] hover:bg-[#5a3d8c]" : ""}
        >
          <FileText className="h-4 w-4 mr-2" />
          Documents ({content.filter(c => c.type === "document").length})
        </Button>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{content.length}</p>
            </div>
          </div>
        </div>

                 <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
           <div className="flex items-center">
             <Video className="h-8 w-8 text-red-500" />
             <div className="ml-3">
               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Videos</p>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">
                 {content.filter(c => c.type === "video").length}
               </p>
             </div>
           </div>
         </div>

         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
           <div className="flex items-center">
             <div className="h-8 w-8 bg-green-500 rounded flex items-center justify-center">
               <span className="text-white text-xs">IMG</span>
             </div>
             <div className="ml-3">
               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Images</p>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">
                 {content.filter(c => c.type === "image").length}
               </p>
             </div>
           </div>
         </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Upload className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2.4 GB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Thumbnail/Preview */}
            <div className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative">
              {item.type === "video" && item.thumbnail ? (
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.thumbnail})` }}>
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                </div>
              ) : (
                getTypeIcon(item.type)
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                  {item.name}
                </h3>
                <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>Course: <span className="font-medium">{item.course}</span></div>
                <div>Size: <span className="font-medium">{item.size}</span></div>
                <div>Uploaded: <span className="font-medium">{item.uploadDate}</span></div>
                
                {item.views && (
                  <div>Views: <span className="font-medium">{item.views.toLocaleString()}</span></div>
                )}
                {item.downloads && (
                  <div>Downloads: <span className="font-medium">{item.downloads.toLocaleString()}</span></div>
                )}
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center">
                  {getTypeIcon(item.type)}
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {item.type}
                  </span>
                </div>

                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" title="View">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Edit">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Delete" className="text-red-600">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
                 <div className="mx-auto mb-4">
           <Upload className="h-12 w-12 text-gray-400" />
         </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Upload new content
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Drag and drop files here, or click to browse
        </p>
        <Button className="bg-[#6947A8] hover:bg-[#5a3d8c]">
          Choose Files
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Supports: MP4, PDF, JPG, PNG (Max: 100MB)
        </p>
      </div>
    </div>
  );
} 