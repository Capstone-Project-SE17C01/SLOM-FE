import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { NewQuestionPopupProps, PostQuestionRequestDTO, UpdateQuestionRequestDTO } from "../../../types/IQa";
import { useEffect, useState, useRef } from "react";
import { uploadImageToCloudinary } from "@/services/cloudinary/config";
import { usePostQuestionMutation, useUpdateQuestionMutation, useGetTagsQuery } from "../../../api/QaApi";
import UploadImage from "./upload-image";
import { OpenRouterService, TagGenerationRequest } from "@/services/openrouter/config";
import { X, Tag, Loader2, Plus } from "lucide-react";

// You should replace this with your actual OpenRouter API key
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
const openRouterService = new OpenRouterService(OPENROUTER_API_KEY);

export default function NewQuestionPopup({ userInfo, setIsNewQuestion, isUpdateQuestion, question, setIsUpdateQuestion, setQuestion }: Readonly<NewQuestionPopupProps>) {
    const [newQuestion, setNewQuestion] = useState<string | undefined>("");
    const [privacy, setPrivacy] = useState("All can view and answer your question");
    const [files, setFiles] = useState<File[]>([]);
    const [postQuestionAPI] = usePostQuestionMutation();
    const [updateQuestionAPI] = useUpdateQuestionMutation();
    const [existImages, setExistImages] = useState<string[]>();
    const [tags, setTags] = useState<string[]>([]);
    const [customTag, setCustomTag] = useState("");
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const tagInputRef = useRef<HTMLInputElement>(null);
    
    // Get existing tags from API
    const { data: tagsData } = useGetTagsQuery();
    const existingTags = tagsData?.result || [];

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewQuestion(e.target.value);
    };

    const uploadImage = async (): Promise<string[]> => {
        if (!files?.length) return [];
        const promises = files.map(f =>
            uploadImageToCloudinary(f).then(res => res.url)
        );
        const urls = await Promise.all(promises);
        return urls;
    };

    const generateTags = async () => {
        if (!newQuestion || newQuestion.trim().length < 10) {
            return;
        }
        
        setIsGeneratingTags(true);
        try {
            const request: TagGenerationRequest = {
                content: newQuestion,
                maxTags: 5
            };
            
            const generatedTags = await openRouterService.generateTags(request);
            setTags(generatedTags);
        } catch (error) {
            console.error("Error generating tags:", error);
        } finally {
            setIsGeneratingTags(false);
        }
    };

    const handleAddCustomTag = () => {
        if (customTag && !tags.includes(customTag)) {
            setTags([...tags, customTag]);
            setCustomTag("");
            setShowTagDropdown(false);
            if (tagInputRef.current) {
                tagInputRef.current.focus();
            }
        }
    };

    const handleExistingTagClick = (tag: string) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setShowTagDropdown(false);
        setCustomTag("");
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const postQuestion = async () => {
        const request: PostQuestionRequestDTO = {
            creatorId: userInfo?.id,
            content: newQuestion,
            privacy: privacy,
            tags: tags.length > 0 ? tags : undefined
        };

        if (!files?.length) {
            await postQuestionAPI(request);
            setIsNewQuestion(false);
            return;
        }

        const resUrls = await uploadImage();
        request.images = resUrls;
        await postQuestionAPI(request);
        setIsNewQuestion(false);
    };

    const updateQuestion = async (allImages: string[] | undefined) => {
        if (!question) return;

        const request: UpdateQuestionRequestDTO = {
            questionId: question.questionId,
            content: newQuestion ?? question.content,
            privacy: privacy,
            tags: tags.length > 0 ? tags : undefined
        };

        if (!files?.length) {
            request.images = allImages;
            await updateQuestionAPI(request);
            setIsNewQuestion(false);
            setIsUpdateQuestion(false);
            setQuestion(undefined);
            return;
        }

        const resUrls = await uploadImage();
        request.images = [...(allImages || []), ...resUrls];
        await updateQuestionAPI(request);
        setIsNewQuestion(false);
        setIsUpdateQuestion(false);
        setQuestion(undefined);
    };

    useEffect(() => {
        if (isUpdateQuestion && question != undefined) {
            setNewQuestion(question.content);
            setExistImages(question.images);
            setTags(question.tags || []);
        }
    }, [question, isUpdateQuestion]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && customTag) {
            e.preventDefault();
            handleAddCustomTag();
        }
    };

    // Filter suggestions based on input
    const filteredTags = customTag 
        ? existingTags.filter(tag => tag.toLowerCase().includes(customTag.toLowerCase()) && !tags.includes(tag))
        : existingTags.filter(tag => !tags.includes(tag));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isUpdateQuestion ? "Edit Question" : "New Question"}
                    </h2>
                    <button 
                        onClick={() => { 
                            setIsNewQuestion(false); 
                            setIsUpdateQuestion(false); 
                            setQuestion(undefined); 
                        }} 
                        className="text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={userInfo?.avatarUrl}
                                alt={`${userInfo?.username}`}
                            />
                            <AvatarFallback>{userInfo?.username?.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-4">
                            <div className="font-medium">{userInfo?.username}</div>
                            
                            <textarea
                                onChange={handleChange}
                                placeholder="What would you like to ask?"
                                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                value={newQuestion}
                                onBlur={() => {
                                    if (newQuestion && newQuestion.length > 10 && tags.length === 0) {
                                        generateTags();
                                    }
                                }}
                            />

                            {/* Tags Section */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <Tag className="h-4 w-4 mr-1.5 text-blue-600" />
                                        Topics
                                    </label>
                                    <button 
                                        type="button"
                                        onClick={generateTags}
                                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
                                        disabled={isGeneratingTags || !newQuestion || newQuestion.length < 10}
                                    >
                                        {isGeneratingTags ? (
                                            <>
                                                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>Auto-generate topics</>
                                        )}
                                    </button>
                                </div>
                                
                                <div className="relative">
                                    <div className="flex gap-2 items-center">
                                        <div className="relative flex-1">
                                            <input
                                                ref={tagInputRef}
                                                type="text"
                                                value={customTag}
                                                onChange={(e) => {
                                                    setCustomTag(e.target.value);
                                                    setShowTagDropdown(true);
                                                }}
                                                onFocus={() => setShowTagDropdown(true)}
                                                onBlur={() => {
                                                    // Delay hiding dropdown to allow for clicks
                                                    setTimeout(() => setShowTagDropdown(false), 150);
                                                }}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Enter or select topics..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {showTagDropdown && filteredTags.length > 0 && (
                                                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                                    <div className="p-2 text-xs text-gray-500 border-b bg-gray-50">
                                                        Select from existing topics or create new ones
                                                    </div>
                                                    {filteredTags.map((tag, index) => (
                                                        <div
                                                            key={index}
                                                            className="px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center"
                                                            onClick={() => handleExistingTagClick(tag)}
                                                        >
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                                            {tag}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddCustomTag}
                                            disabled={!customTag}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 bg-gray-50 rounded-lg border border-gray-200">
                                    {tags.length > 0 ? (
                                        tags.map((tag, index) => (
                                            <div 
                                                key={index} 
                                                className="bg-white border border-gray-300 shadow-sm text-gray-800 px-2.5 py-1.5 rounded-md text-sm flex items-center gap-2 group"
                                            >
                                                {tag}
                                                <button 
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="text-gray-400 hover:text-red-600 group-hover:bg-gray-100 rounded-full p-0.5"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-400 flex items-center justify-center w-full h-full">
                                            No topics selected
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">Topics help others find your question and connect with relevant content</p>
                            </div>

                            <UploadImage 
                                setFiles={setFiles} 
                                images={question != undefined ? question.images : []} 
                                setExistImages={setExistImages} 
                                existImage={existImages} 
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                    <div>
                        <Listbox value={privacy} onChange={setPrivacy}>
                            <div className="relative">
                                <ListboxButton className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 flex items-center">
                                    {privacy}
                                </ListboxButton>
                                <ListboxOptions className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <ListboxOption value="All can view and answer your question" className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100">
                                        All can view and answer your question
                                    </ListboxOption>
                                    <ListboxOption value="Only admin can view and answer" className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100">
                                        Only admin can view and answer
                                    </ListboxOption>
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>
                    
                    <button 
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={async () => { 
                            if (isUpdateQuestion) { 
                                await updateQuestion(existImages);
                            } else {
                                await postQuestion();
                            }
                        }}
                    >
                        {isUpdateQuestion ? "Update Question" : "Post Question"}
                    </button>
                </div>
            </div>
        </div>
    );
}