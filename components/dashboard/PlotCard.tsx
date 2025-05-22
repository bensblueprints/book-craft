"use client";

import Button from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Calendar, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlotCardProps {
  plot: {
    id: string;
    title: string;
    shortSummary: string;
    createdAt: string;
    chapterCount: number;
    genre: string | null;
    totalWords: number;
  };
}

export default function PlotCard({ plot }: PlotCardProps) {
  const router = useRouter();

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
            {plot.title}
          </h3>
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm">
            {plot.genre}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {plot.shortSummary}
        </p>

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(plot.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{plot.chapterCount} chapters</span>
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span>{plot.totalWords.toLocaleString()} words</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1"
          >
            <Button
              variant="outline"
              fullWidth
              onClick={() => router.push(`/books/${plot.id}`)}
            >
              View
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1"
          >
            {/* <Button
              variant="primary"
              fullWidth
              onClick={() => router.push(`/books/${plot.id}/edit`)}
            >
              Edit
            </Button> */}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
