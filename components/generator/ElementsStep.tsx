"use client";

import { motion } from "framer-motion";

interface ElementsStepProps {
  selectedElements: string[];
  toggleStoryElement: (elementId: string) => void;
  storyElements: Array<{ id: string; label: string }>;
}

export default function ElementsStep({
  selectedElements,
  toggleStoryElement,
  storyElements,
}: ElementsStepProps) {
  return (
    <div>
      <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Story Elements
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Select the elements you want to include in your story. These will guide
        the AI in generating a plot that incorporates your chosen themes and
        elements.
      </p>

      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {storyElements.map((element) => (
            <motion.div
              key={element.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg border-2 cursor-pointer ${
                selectedElements.includes(element.id)
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-600"
              }`}
              onClick={() => toggleStoryElement(element.id)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`element-${element.id}`}
                  checked={selectedElements.includes(element.id)}
                  onChange={() => toggleStoryElement(element.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label
                  htmlFor={`element-${element.id}`}
                  className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {element.label}
                </label>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
