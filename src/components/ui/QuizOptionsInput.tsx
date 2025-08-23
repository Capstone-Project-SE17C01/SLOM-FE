"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuizOption } from "@/types/IQuiz";
import { Trash2, Plus } from "lucide-react";

interface QuizOptionsInputProps {
  quizOptions: QuizOption[];
  onQuizOptionsChange: (options: QuizOption[]) => void;
}

export default function QuizOptionsInput({
  quizOptions,
  onQuizOptionsChange,
}: QuizOptionsInputProps) {
  const updateOption = (index: number, field: keyof QuizOption, value: string | boolean) => {
    const updatedOptions = quizOptions.map((option, i) => {
      if (i === index) {
        // If setting isCorrect to true, set all others to false
        if (field === 'isCorrect' && value === true) {
          return { ...option, [field]: value };
        }
        return { ...option, [field]: value };
      }
      // If setting another option as correct, uncheck this one
      if (field === 'isCorrect' && value === true) {
        return { ...option, isCorrect: false };
      }
      return option;
    });
    onQuizOptionsChange(updatedOptions);
  };

  const addOption = () => {
    const newOption: QuizOption = {
      id: Date.now().toString(),
      text: "",
      isCorrect: false,
    };
    onQuizOptionsChange([...quizOptions, newOption]);
  };

  const removeOption = (index: number) => {
    if (quizOptions.length > 2) {
      const updatedOptions = quizOptions.filter((_, i) => i !== index);
      onQuizOptionsChange(updatedOptions);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Quiz Options</Label>
      <div className="space-y-3">
        {quizOptions.map((option, index) => (
          <div key={option.id} className="flex items-center space-x-3">
            <Input
              placeholder={`Option ${index + 1}`}
              value={option.text}
              onChange={(e) => updateOption(index, "text", e.target.value)}
              className="flex-1"
            />
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={option.isCorrect || false}
                onChange={() => updateOption(index, "isCorrect", true)}
                className="w-4 h-4 text-blue-600"
              />
              <Label className="text-sm">Correct</Label>
            </div>
            {quizOptions.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addOption}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Option
      </Button>
    </div>
  );
}
