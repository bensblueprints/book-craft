"use client";

import { useSetApiKey } from "@/api/useAccount";
import Button from "@/components/ui/button";
import { useProfileStore } from "@/store/useProfileStore";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ExternalLink,
  Key,
  Loader2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type ApiKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialProvider?: "openai" | "openrouter";
  apiType: "openai" | "openrouter";
};

type ApiKeyState = {
  value: string;
  isValid: boolean | null;
  isTesting: boolean;
  error: string | null;
};

export default function ApiKeyModal({
  isOpen,
  onClose,
  initialProvider = "openai",
  apiType,
}: ApiKeyModalProps) {
  const [activeProvider, setActiveProvider] = useState<"openai" | "openrouter">(
    initialProvider
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    if (apiType) {
      setActiveProvider(apiType);
    }
  }, [apiType]);

  const [apiKeys, setApiKeys] = useState<{
    openai: ApiKeyState;
    openrouter: ApiKeyState;
  }>({
    openai: {
      value: "",
      isValid: null,
      isTesting: false,
      error: null,
    },
    openrouter: {
      value: "",
      isValid: null,
      isTesting: false,
      error: null,
    },
  });

  const queryClient = useQueryClient();

  const { id } = useProfileStore();

  // api
  const { data, error, mutate, isPending } = useSetApiKey();

  useEffect(() => {
    if (data && data.valid) {
      setSuccess("API keys saved successfully!");
      setGlobalError(null);
      setApiKeys((prev) => ({
        ...prev,
        openai: {
          ...prev.openai,
          isValid: true,
          error: null,
        },
        openrouter: {
          ...prev.openrouter,
          isValid: true,
          error: null,
        },
      }));

      queryClient.invalidateQueries({ queryKey: ["check-api-configuration"] });

      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 2000);
    } else if (!data?.valid) {
      setApiKeys((prev) => ({
        ...prev,
        ["openai"]: {
          ...prev["openai"],
          error: data?.error || "",
          isValid: false,
        },
        ["openrouter"]: {
          ...prev["openrouter"],
          error: data?.error || "",
          isValid: false,
        },
      }));
    }
  }, [error, data]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      // Simulate fetching existing keys
      setTimeout(() => {
        setApiKeys((prev) => ({
          ...prev,
          openai: {
            ...prev.openai,
            value: "",
          },
          openrouter: {
            ...prev.openrouter,
            value: "",
          },
        }));
      }, 100);
    }
  }, [isOpen]);

  const handleInputChange = (
    provider: "openai" | "openrouter",
    value: string
  ) => {
    setApiKeys((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        value,
        isValid: null,
        error: null,
      },
    }));
    setGlobalError(null);
    setSuccess(null);
  };

  const validateKey = async (provider: "openai" | "openrouter") => {
    const key = apiKeys[provider].value.trim();

    // Basic validation
    if (!key) {
      setApiKeys((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          error: "API key is required",
          isValid: false,
        },
      }));
      return false;
    }

    if (provider === "openai" && !key.startsWith("sk-")) {
      setApiKeys((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          error: 'OpenAI API key should start with "sk-"',
          isValid: false,
        },
      }));
      return false;
    }

    try {
      setApiKeys((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          isTesting: false,
          isValid: true,
          error: null,
        },
      }));
      return true;
    } catch (error) {
      setApiKeys((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          isTesting: false,
          isValid: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to validate API key",
        },
      }));
      return false;
    }
  };

  const handleSave = async () => {
    setGlobalError(null);

    try {
      const openaiValid = apiKeys.openai.value
        ? await validateKey("openai")
        : true;
      const openrouterValid = apiKeys.openrouter.value
        ? await validateKey("openrouter")
        : true;

      if (!openaiValid || !openrouterValid) {
        throw new Error("Please fix the errors before saving");
      }

      if (!apiKeys.openai.value && !apiKeys.openrouter.value) {
        throw new Error("At least one API key is required");
      }

      mutate({
        json: {
          openAIKey: apiKeys.openai.value,
          userId: id || "",
          openRouterKey: apiKeys.openrouter.value,
        },
      });
    } catch (error) {
      setGlobalError(
        error instanceof Error ? error.message : "Failed to save API keys"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                API Key Settings
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
                activeProvider === "openai"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveProvider("openai")}
            >
              OpenAI
              {activeProvider === "openai" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                  layoutId="activeTab"
                />
              )}
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
                activeProvider === "openrouter"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveProvider("openrouter")}
            >
              OpenRouter
              {activeProvider === "openrouter" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                  layoutId="activeTab"
                />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Global messages */}
            <AnimatePresence mode="wait">
              {globalError && (
                <motion.div
                  className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    marginBottom: 0,
                    overflow: "hidden",
                  }}
                >
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {globalError}
                  </p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    marginBottom: 0,
                    overflow: "hidden",
                  }}
                >
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {success}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* API Key Input */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProvider}
                initial={{
                  opacity: 0,
                  x: activeProvider === "openai" ? -20 : 20,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeProvider === "openai" ? 20 : -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={`${activeProvider}-key`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {activeProvider === "openai"
                        ? "OpenAI API Key"
                        : "OpenRouter API Key"}
                    </label>

                    <div className="relative">
                      <input
                        id={`${activeProvider}-key`}
                        type="password"
                        value={apiKeys[activeProvider].value}
                        onChange={(e) =>
                          handleInputChange(activeProvider, e.target.value)
                        }
                        placeholder={
                          activeProvider === "openai"
                            ? "sk-..."
                            : "Enter your API key"
                        }
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white ${
                          apiKeys[activeProvider].isValid === false
                            ? "border-red-300 dark:border-red-700"
                            : apiKeys[activeProvider].isValid === true
                            ? "border-green-300 dark:border-green-700"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />

                      {apiKeys[activeProvider].isTesting && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
                        </div>
                      )}

                      {apiKeys[activeProvider].isValid === true &&
                        !apiKeys[activeProvider].isTesting && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Check className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                    </div>

                    {apiKeys[activeProvider].error && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {apiKeys[activeProvider].error}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {activeProvider === "openai"
                        ? "Your OpenAI API key for primary generation"
                        : "Your OpenRouter API key for scene generation"}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-750 rounded-md p-3 text-xs">
                    <p className="font-medium !text-black dark:text-gray-300 mb-1">
                      Don't have an API key?
                    </p>
                    <a
                      href={
                        activeProvider === "openai"
                          ? "https://platform.openai.com/api-keys"
                          : "https://openrouter.ai/keys"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-800 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      Get{" "}
                      {activeProvider === "openai" ? "OpenAI" : "OpenRouter"}{" "}
                      API key
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <Button variant="secondary" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={
                isPending ||
                (!apiKeys.openai.value && !apiKeys.openrouter.value)
              }
            >
              {isPending ? "Saving..." : "Save API Key"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
