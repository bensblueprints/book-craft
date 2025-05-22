"use client";

import {
  useExportBook,
  useGenerateBookChapter,
  useGetBook,
} from "@/api/useBook";
import { LoadingDots } from "@/components/Loading";
import Button from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Character } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Book,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Share2,
} from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function PlotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("chapters");
  const [activeChapter, setActiveChapter] = useState(0);
  const [showChapterContent, setShowChapterContent] = useState(true);

  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState<number | null>(null);

  const queryClient = useQueryClient();

  // get book data
  const { data: bookData, isLoading, error } = useGetBook(id);

  useEffect(() => {
    if (!isLoading && !bookData) {
      return notFound();
    }

    if (error) {
      return notFound();
    }
  }, [error, isLoading, bookData]);

  // generate chapter content api
  const {
    mutate: generateChapterContent,
    isPending: chapterContentLoading,
    data: generateChapterData,
  } = useGenerateBookChapter();

  useEffect(() => {
    if (!chapterContentLoading && generateChapterData) {
      queryClient.invalidateQueries({ queryKey: ["get-book", bookData?.id] });
    }
  }, [chapterContentLoading, generateChapterData]);

  // export book
  const {
    mutate: exportBook,
    isPending: isExportBookPending,
    data: exportBookData,
  } = useExportBook();

  useEffect(() => {
    if (exportBookData) {
      const blob = new Blob([exportBookData], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${id}.pdf`;
      document.body.appendChild(link); // Needed for Firefox
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up
    }
  }, [exportBookData]);

  const handleGenerateChapter = async (index: number) => {
    try {
      // get chapter data
      const chapter = bookData?.chapters[index];

      generateChapterContent({
        json: {
          chapterTitle: chapter?.title || "",
          title: bookData?.title || "",
          summary: chapter?.summary || "",
          id: chapter?.id || "",
          keyEvents: chapter?.keyEvents || [],
          pacing: chapter?.pacing || "",
          pov: chapter?.pov || "",
          scenes: chapter?.scenes || [],
          wordCount: chapter?.wordCount || 0,
        },
        param: {
          bookId: bookData?.id || "",
        },
      });

      // Show success toast
      toast({
        title: "Chapter generated",
        description: "Your chapter has been successfully created.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating chapter:", error);
      toast({
        title: "Generation failed",
        description:
          "There was an error generating your chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyContent = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopySuccess(index);

    // Show success toast
    toast({
      title: "Copied to clipboard",
      description: "Chapter content has been copied to your clipboard.",
      variant: "default",
    });

    // Reset copy success state after 2 seconds
    setTimeout(() => {
      setCopySuccess(null);
    }, 2000);
  };

  const handleBack = () => {
    router.push("/generator");
  };

  if (!bookData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  icon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
              </motion.div>
              <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-gray-100 ml-2">
                {bookData?.title}
              </h2>
            </div>
            <div className="flex space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Share2 className="h-4 w-4" />}
                >
                  Share
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    exportBook({
                      json: {
                        id: bookData?.id,
                      },
                    })
                  }
                  icon={<Download className="h-4 w-4" />}
                >
                  Export
                </Button>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-indigo-700 dark:text-indigo-400 mt-1 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="font-medium text-indigo-900 dark:text-indigo-300">
                  Plot Synopsis
                </h3>
                <p className="text-indigo-800 dark:text-indigo-200">
                  {bookData?.shortSummary}
                </p>
              </div>
            </div>
          </motion.div>

          <Tabs defaultValue="chapters" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger
                value="chapters"
                onClick={() => setActiveTab("chapters")}
              >
                Chapters
              </TabsTrigger>
              <TabsTrigger
                value="characters"
                onClick={() => setActiveTab("characters")}
              >
                Characters
              </TabsTrigger>
              {/* <TabsTrigger
                value="settings"
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="themes"
                onClick={() => setActiveTab("themes")}
              >
                Themes & Conflicts
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="chapters">
              <AnimatePresence mode="wait">
                <motion.div
                  key="chapters"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100">
                        Chapter Progression
                      </h3>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setShowChapterContent(!showChapterContent)
                          }
                          icon={<Book className="h-4 w-4" />}
                        >
                          {showChapterContent ? "Hide Content" : "Show Content"}
                        </Button>
                      </motion.div>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-indigo-600 dark:bg-indigo-500 h-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            ((activeChapter + 1) / bookData?.chapters.length) *
                            100
                          }%`,
                        }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>Beginning</span>
                      <span>Middle</span>
                      <span>End</span>
                    </div>
                  </div>

                  <div className="flex mb-4 overflow-x-auto pb-2 hide-scrollbar">
                    {bookData?.chapters.map((chapter, index) => (
                      <motion.button
                        key={chapter.id}
                        onClick={() => setActiveChapter(index)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg mr-2 text-sm transition-colors
                          ${
                            activeChapter === index
                              ? "bg-indigo-600 dark:bg-indigo-700 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Chapter {index + 1}
                      </motion.button>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          Chapter {activeChapter + 1}:{" "}
                          {bookData?.chapters[activeChapter].title}
                        </h3>

                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                            Summary
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {bookData?.chapters[activeChapter].summary}
                          </p>
                        </div>

                        {showChapterContent && (
                          <>
                            <div className="mb-6">
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                                Scenes
                              </h4>
                              <ul className="space-y-2">
                                {bookData?.chapters[activeChapter].scenes.map(
                                  (scene, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <span className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs flex items-center justify-center mr-2 mt-0.5">
                                        {index + 1}
                                      </span>
                                      <span className="text-gray-700 dark:text-gray-300">
                                        {scene}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>

                            <div className="mb-6">
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                                Key Events
                              </h4>
                              <ul className="space-y-2">
                                {bookData?.chapters[
                                  activeChapter
                                ].keyEvents.map((event, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-indigo-600 dark:text-indigo-400 mr-2">
                                      •
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                      {event}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                                  Pacing
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 capitalize">
                                  {bookData?.chapters[activeChapter].pacing}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                                  Word Count
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {bookData?.chapters[activeChapter].wordCount}{" "}
                                  words
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Chapter {activeChapter + 1} Content
                          </h3>
                          <div className="flex space-x-2">
                            {!bookData?.chapters[activeChapter].content && (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleGenerateChapter(activeChapter)
                                  }
                                  disabled={chapterContentLoading}
                                >
                                  Generate Content
                                </Button>
                              </motion.div>
                            )}

                            {bookData?.chapters[activeChapter].content && (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleCopyContent(
                                      bookData?.chapters[activeChapter]
                                        .content || "",
                                      activeChapter
                                    )
                                  }
                                  icon={
                                    copySuccess ===
                                    activeChapter ? undefined : (
                                      <Copy className="h-4 w-4" />
                                    )
                                  }
                                >
                                  {copySuccess === activeChapter
                                    ? "Copied!"
                                    : "Copy"}
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        {bookData?.chapters[activeChapter]?.content ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <textarea
                              className="w-full h-[500px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              value={bookData?.chapters[activeChapter].content}
                              readOnly
                            />
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            {chapterContentLoading ? (
                              <div className="space-y-4">
                                <LoadingDots />
                              </div>
                            ) : (
                              'Click "Generate Content" to create this chapter'
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActiveChapter(Math.max(0, activeChapter - 1))
                        }
                        disabled={activeChapter === 0}
                        icon={<ChevronLeft className="h-4 w-4" />}
                      >
                        Previous
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActiveChapter(
                            Math.min(
                              bookData?.chapters.length - 1,
                              activeChapter + 1
                            )
                          )
                        }
                        disabled={
                          activeChapter === bookData?.chapters.length - 1
                        }
                        icon={<ChevronRight className="h-4 w-4 ml-1" />}
                      >
                        Next
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="characters">
              <AnimatePresence mode="wait">
                <motion.div
                  key="characters"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {bookData?.characters.map(
                    (character: Character, index: number) => (
                      <motion.div
                        key={character.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="p-6">
                          <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {character.name}
                          </h3>
                          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase mb-2">
                            {character.role}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {character?.biography}
                          </p>

                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                                Traits
                              </h4>
                              {/* <div className="flex flex-wrap gap-1 mt-1">
                              {character.traits?.map((trait, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                                >
                                  {trait}
                                </span>
                              ))}
                            </div> */}
                            </div>

                            {/* <div>
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                              Motivation
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {character.motivation}
                            </p>
                          </div> */}

                            {/* <div>
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                              Character Arc
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {character.arc}
                            </p>
                          </div> */}
                          </div>
                        </div>
                      </motion.div>
                    )
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            {/* <TabsContent value="settings">
              <AnimatePresence mode="wait">
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {plot.settings.map((setting, index) => (
                    <motion.div
                      key={setting.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="p-6">
                        <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {setting.name}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          {setting.description}
                        </p>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                              Location
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {setting.location}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                              Time Period
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {setting.timeperiod}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                              Atmosphere
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {setting.atmosphere}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                              Significance
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {setting.significance}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="themes">
              <AnimatePresence mode="wait">
                <motion.div
                  key="themes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Main Themes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plot.themes.map((theme, index) => (
                        <motion.div
                          key={index}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 p-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {theme}
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            This theme appears throughout the narrative,
                            particularly in chapters{" "}
                            {Array.from(
                              { length: 3 },
                              () =>
                                Math.floor(
                                  Math.random() * plot.chapters.length
                                ) + 1
                            )
                              .sort((a, b) => a - b)
                              .join(", ")}
                            .
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Conflicts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plot.conflicts.map((conflict, index) => (
                        <motion.div
                          key={index}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 p-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.2 + index * 0.1,
                          }}
                        >
                          <p className="text-gray-700 dark:text-gray-300">
                            {conflict}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </TabsContent> */}
          </Tabs>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}
