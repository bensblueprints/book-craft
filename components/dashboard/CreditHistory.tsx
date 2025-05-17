"use client";

import { useGetPurchaseHistory } from "@/api/useCredit";
import { useProfileStore } from "@/store/useProfileStore";
import { motion } from "framer-motion";
import { Clock, CreditCard } from "lucide-react";

export default function CreditHistory() {
  const { updateInfo: _, ...user } = useProfileStore();

  const { data: purchaseHistories, isLoading } = useGetPurchaseHistory(
    user.id || "",
    user.id || ""
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
        Credit History
      </h2>

      {purchaseHistories?.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-12 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No transactions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Purchase credits to start generating your books.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {purchaseHistories?.map((history, index) => (
            <motion.div
              key={history.id}
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {history?.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {history?.credits} credits
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    ${history.price.toFixed(2)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(history.created_at).toISOString().split("T")[0]}
                  </div>
                </div>
              </div>
              <div
                className={`text-sm ${
                  history.status.toLowerCase() === "completed"
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {history.status.charAt(0).toUpperCase() +
                  history.status.slice(1)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
