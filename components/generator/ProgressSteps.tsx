"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
  icon: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  goToStep: (index: number) => void;
}

export default function ProgressSteps({
  steps,
  currentStep,
  completedSteps,
  goToStep,
}: ProgressStepsProps) {
  return (
    <div className="mb-10">
      <div className="relative">
        {/* Fancy Background for Progress Bar */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full transform -translate-y-1/2 z-0">
          {/* Animated dots in the background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white dark:bg-gray-500 opacity-60"
                style={{
                  left: `${i * 5 + Math.random() * 5}%`,
                  top: Math.random() * 100 + "%",
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Animated Progress Fill */}
        <motion.div
          className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 dark:from-indigo-500 dark:via-purple-400 dark:to-indigo-500 rounded-full transform -translate-y-1/2 z-1"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: "0 0 10px 2px rgba(79, 70, 229, 0.4)",
            }}
            animate={{
              boxShadow: [
                "0 0 10px 2px rgba(79, 70, 229, 0.2)",
                "0 0 20px 4px rgba(79, 70, 229, 0.6)",
                "0 0 10px 2px rgba(79, 70, 229, 0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>

        {/* Step Indicators */}
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => (
            <motion.button
              key={step.id}
              onClick={() => {
                // Only allow clicking on completed steps or the next available step
                if (
                  completedSteps.includes(index) ||
                  index === 0 ||
                  completedSteps.includes(index - 1)
                ) {
                  goToStep(index);
                }
              }}
              className={`flex flex-col items-center ${
                completedSteps.includes(index) ||
                index === 0 ||
                completedSteps.includes(index - 1)
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              }`}
              whileHover={
                completedSteps.includes(index) ||
                index === 0 ||
                completedSteps.includes(index - 1)
                  ? { scale: 1.05 }
                  : {}
              }
              whileTap={
                completedSteps.includes(index) ||
                index === 0 ||
                completedSteps.includes(index - 1)
                  ? { scale: 0.95 }
                  : {}
              }
            >
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  currentStep === index
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 text-white shadow-lg"
                    : completedSteps.includes(index)
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                }`}
                animate={
                  currentStep === index
                    ? {
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          "0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.2)",
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: currentStep === index ? Number.POSITIVE_INFINITY : 0,
                }}
              >
                {completedSteps.includes(index) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}
              </motion.div>
              <span
                className={`text-xs font-medium ${
                  currentStep === index
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
