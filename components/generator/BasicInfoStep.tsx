"use client";

import { motion } from "framer-motion";
import { AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import ApiKeyModal from "../ApiKeyModal";

interface BasicInfoStepProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  genre: string;
  setGenre: (genre: string) => void;
  apiChoice: string;
  setApiChoice: (apiChoice: string) => void;
  openAIKey: boolean;
  openRouterKey: boolean;
  handleTitleSuggestion: () => void;
  handleGenreSuggestion: () => void;
  genres: Array<{ value: string; label: string; description: string }>;
  apiOptions: Array<{ value: string; label: string; description: string }>;
}

export default function BasicInfoStep({
  title,
  setTitle,
  description,
  setDescription,
  genre,
  setGenre,
  apiChoice,
  setApiChoice,
  openAIKey,
  openRouterKey,
  handleTitleSuggestion,
  handleGenreSuggestion,
  genres,
  apiOptions,
}: BasicInfoStepProps) {
  const [openApiSettings, setOpenApiSettings] = useState(false);
  const [apiType, setApiType] = useState<"openai" | "openrouter">("openai");

  const getGenreDescription = () => {
    const selectedGenre = genres.find((g) => g.value === genre);
    return selectedGenre?.description || "";
  };

  return (
    <div>
      <ApiKeyModal
        apiType={apiType}
        isOpen={openApiSettings}
        onClose={() => setOpenApiSettings(false)}
      />

      <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Basic Information
      </h2>

      {/* API Selection */}
      <div className="mb-6">
        <label
          htmlFor="api-choice"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          AI Model Selection
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {apiOptions.map((option) => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setApiChoice(option.value)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                apiChoice === option.value
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id={`api-${option.value}`}
                  checked={apiChoice === option.value}
                  onChange={() => setApiChoice(option.value)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                />
                <label
                  htmlFor={`api-${option.value}`}
                  className="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {option.label}
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                {option.description}
              </p>

              {/* Show warning if API key is needed but not present */}
              {((option.value === "openai" && !openAIKey) ||
                (option.value === "openrouter" && !openRouterKey)) &&
                apiChoice === option.value && (
                  <div className="mt-2 ml-6 flex items-start text-xs text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>
                      API key not configured.
                      <span
                        onClick={() => {
                          setApiType(
                            option.value === "openai" ? "openai" : "openrouter"
                          );
                          setOpenApiSettings(true);
                        }}
                        className="ml-1 underline"
                      >
                        Add in settings
                      </span>
                    </span>
                  </div>
                )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Book Title */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Book Title <span className="text-red-500">*</span>
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTitleSuggestion}
            className="text-indigo-600 dark:text-indigo-400 text-sm flex items-center hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Get Suggestion
          </motion.button>
        </div>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your book title"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          required
        />
        {title.trim() === "" && (
          <p className="mt-1 text-sm text-red-500">
            Please enter a title for your book
          </p>
        )}
      </div>

      {/* Book Description */}
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Book Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your book description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          required
        />
        {description.trim() === "" && (
          <p className="mt-1 text-sm text-red-500">
            Please enter a description for your book
          </p>
        )}
      </div>

      {/* Genre */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="genre"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Genre
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenreSuggestion}
            className="text-indigo-600 dark:text-indigo-400 text-sm flex items-center hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Get Suggestion
          </motion.button>
        </div>
        <select
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          {genres.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {getGenreDescription()}
        </p>
      </div>
    </div>
  );
}
