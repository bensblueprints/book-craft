"use client";

import { useGetBooks } from "@/api/useBook";
import PlotCard from "@/components/dashboard/PlotCard";
import Button from "@/components/ui/button";
import { useProfileStore } from "@/store/useProfileStore";
import { motion } from "framer-motion";
import { Book, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyBooks() {
  const router = useRouter();
  const { id } = useProfileStore();

  const { data: books, isLoading, refetch } = useGetBooks(id || "");

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
          My Books
        </h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="primary"
            onClick={() => router.push("/generator")}
            icon={<Plus className="h-5 w-5" />}
          >
            New Book
          </Button>
        </motion.div>
      </div>

      {books?.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-12 text-center">
            <Book className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No books yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start creating your first book with our AI-powered generator.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                variant="primary"
                onClick={() => router.push("/generator")}
              >
                Create Your First Book
              </Button>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books?.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PlotCard plot={book} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
