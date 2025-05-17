"use client";

import Button from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Character {
  id: number;
  name: string;
  role: string;
  biography: string;
}

interface ReviewStepProps {
  title: string;
  description: string;
  genre: string;
  apiChoice: string;
  chapters: string;
  complexity: string;
  tone: string;
  pov: string;
  characters: Character[];
  selectedElements: string[];
  isGenerating: boolean;
  handleGenerateBook: () => void;
  genres: Array<{ value: string; label: string }>;
  apiOptions: Array<{ value: string; label: string }>;
  chapterOptions: Array<{ value: string; label: string }>;
  complexityOptions: Array<{ value: string; label: string }>;
  toneOptions: Array<{ value: string; label: string }>;
  povOptions: Array<{ value: string; label: string }>;
  roleOptions: Array<{ value: string; label: string }>;
  storyElements: Array<{ id: string; label: string }>;
}

export default function ReviewStep({
  title,
  description,
  genre,
  apiChoice,
  chapters,
  complexity,
  tone,
  pov,
  characters,
  selectedElements,
  isGenerating,
  handleGenerateBook,
  genres,
  apiOptions,
  chapterOptions,
  complexityOptions,
  toneOptions,
  povOptions,
  roleOptions,
  storyElements,
}: ReviewStepProps) {
  return (
    <div>
      <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Review & Generate
      </h2>

      <div className="space-y-6">
        {/* Basic Info Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Title
              </p>
              <p className="text-gray-900 dark:text-gray-100">{title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Genre
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                {genres.find((g) => g.value === genre)?.label}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                AI Model
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                {apiOptions.find((a) => a.value === apiChoice)?.label}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Description
              </p>
              <p className="text-gray-900 dark:text-gray-100">{description}</p>
            </div>
          </div>
        </div>

        {/* Structure Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Book Structure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Chapters
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                {chapterOptions.find((c) => c.value === chapters)?.label}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Complexity
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                {complexityOptions.find((c) => c.value === complexity)?.label}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tone
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                {toneOptions.find((t) => t.value === tone)?.label}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Point of View
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                {povOptions.find((p) => p.value === pov)?.label}
              </p>
            </div>
          </div>
        </div>

        {/* Characters Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Characters
          </h3>
          <div className="space-y-3">
            {characters.map((character) => (
              <div
                key={character.id}
                className="border-b border-gray-200 dark:border-gray-600 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex justify-between">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {character.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {roleOptions.find((r) => r.value === character.role)?.label}
                  </p>
                </div>
                {character.biography && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {character.biography}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Story Elements Summary */}
        {selectedElements.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Story Elements
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedElements.map((elementId) => (
                <span
                  key={elementId}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm"
                >
                  {storyElements.find((e) => e.id === elementId)?.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center pt-4">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerateBook}
              disabled={isGenerating}
              icon={isGenerating ? undefined : <Sparkles className="h-5 w-5" />}
              className="px-8"
            >
              {isGenerating ? "Generating..." : "Generate Book"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
