"use client";

import Button from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, Check, Key } from "lucide-react";
import { useState } from "react";

export default function APISettings() {
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    openrouter: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const trimmedOpenAI = apiKeys.openai.trim();
      const trimmedOpenRouter = apiKeys.openrouter.trim();

      if (!trimmedOpenAI && !trimmedOpenRouter) {
        throw new Error("At least one API key is required");
      }

      if (trimmedOpenAI && !trimmedOpenAI.startsWith("sk-")) {
        throw new Error(
          'Invalid OpenAI API key format. Should start with "sk-"'
        );
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save API keys");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Key className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            API Settings
          </h3>
        </div>

        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Connection Error
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Check className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-300">
                Success
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                API keys saved successfully!
              </p>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="openai-key"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              OpenAI API Key
            </label>
            <input
              id="openai-key"
              type="password"
              value={apiKeys.openai}
              onChange={(e) => {
                setError(null);
                setSuccess(false);
                setApiKeys((prev) => ({ ...prev, openai: e.target.value }));
              }}
              placeholder="sk-..."
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your OpenAI API key for primary generation
            </p>
          </div>

          <div>
            <label
              htmlFor="openrouter-key"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              OpenRouter API Key
            </label>
            <input
              id="openrouter-key"
              type="password"
              value={apiKeys.openrouter}
              onChange={(e) => {
                setError(null);
                setSuccess(false);
                setApiKeys((prev) => ({ ...prev, openrouter: e.target.value }));
              }}
              placeholder="sk-..."
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your OpenRouter API key for scene generation
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={!apiKeys.openai && !apiKeys.openrouter}
              >
                Save API Keys
              </Button>
            </motion.div>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>Don't have API keys?</p>
            <div className="space-y-2 mt-2">
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 block"
              >
                Get OpenAI API key →
              </a>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 block"
              >
                Get OpenRouter API key →
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
