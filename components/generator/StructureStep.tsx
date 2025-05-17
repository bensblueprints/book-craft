"use client";

interface StructureStepProps {
  chapters: string;
  setChapters: (chapters: string) => void;
  complexity: string;
  setComplexity: (complexity: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  pov: string;
  setPov: (pov: string) => void;
  chapterOptions: Array<{ value: string; label: string }>;
  complexityOptions: Array<{ value: string; label: string }>;
  toneOptions: Array<{ value: string; label: string }>;
  povOptions: Array<{ value: string; label: string }>;
}

export default function StructureStep({
  chapters,
  setChapters,
  complexity,
  setComplexity,
  tone,
  setTone,
  pov,
  setPov,
  chapterOptions,
  complexityOptions,
  toneOptions,
  povOptions,
}: StructureStepProps) {
  return (
    <div>
      <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Book Structure
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Number of Chapters */}
        <div>
          <label
            htmlFor="chapters"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Number of Chapters
          </label>
          <select
            id="chapters"
            value={chapters}
            onChange={(e) => setChapters(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            {chapterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Each chapter will be exactly 2,500 words
          </p>
        </div>

        {/* Complexity */}
        <div>
          <label
            htmlFor="complexity"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Complexity
          </label>
          <select
            id="complexity"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            {complexityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Determines plot intricacy
          </p>
        </div>

        {/* Tone */}
        <div>
          <label
            htmlFor="tone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            {toneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Overall mood and atmosphere
          </p>
        </div>

        {/* Point of View */}
        <div>
          <label
            htmlFor="pov"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Point of View
          </label>
          <select
            id="pov"
            value={pov}
            onChange={(e) => setPov(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            {povOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Narrative perspective
          </p>
        </div>
      </div>
    </div>
  );
}
