"use client";

import { motion } from "framer-motion";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingBookGeneratorProps {
  title?: string;
  onComplete?: () => void;
  autoComplete?: boolean;
  completionTime?: number;
}

export default function LoadingBookGenerator({
  title = "The Crystal Kingdoms",
  onComplete,
  autoComplete = true,
  completionTime = 3000,
}: LoadingBookGeneratorProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    "Crafting your narrative structure...",
    "Developing character arcs...",
    "Building your world...",
    "Weaving plot elements...",
    "Finalizing your book blueprint...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        return newProgress <= 100 ? newProgress : 100;
      });
    }, completionTime / 100);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        return nextStep < loadingSteps.length ? nextStep : prev;
      });
    }, completionTime / loadingSteps.length);

    if (autoComplete) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, completionTime);

      return () => {
        clearInterval(interval);
        clearInterval(stepInterval);
        clearTimeout(timer);
      };
    }

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [autoComplete, completionTime, loadingSteps.length, onComplete]);

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <motion.div
                  className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(99, 102, 241, 0.4)",
                      "0 0 0 10px rgba(99, 102, 241, 0)",
                      "0 0 0 0 rgba(99, 102, 241, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </motion.div>
              </div>
            </div>

            <h3 className="text-xl font-serif font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
              Generating Your Book
            </h3>

            <h4 className="text-lg text-center text-indigo-600 dark:text-indigo-400 font-serif mb-6">
              "{title}"
            </h4>

            <div className="mb-6">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Initializing</span>
                <span>{progress}%</span>
                <span>Complete</span>
              </div>
            </div>

            <div className="min-h-[60px] flex items-center justify-center">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {loadingSteps[currentStep]}
                </motion.p>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Our AI is crafting your book blueprint with care.</p>
              <p>This may take a few moments.</p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-600"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Powered by PlotCraft AI
        </motion.div>
      </div>
    </div>
  );
}
