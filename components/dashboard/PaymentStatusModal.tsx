"use client";

import Button from "@/components/ui/button";
import { useProfileStore } from "@/store/useProfileStore";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Check, CreditCard, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentStatusModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const purchaseStatus = searchParams.get("purchase_status");

  const user = useProfileStore();

  const queryClient = useQueryClient();

  // Determine if we should show the modal based on URL params
  useEffect(() => {
    if (purchaseStatus === "success" || purchaseStatus === "cancelled") {
      setIsOpen(true);
    }

    if (searchParams.get("purchase_status") === "success") {
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
    }
  }, [purchaseStatus]);

  // Close the modal and clear the query parameter
  const handleClose = () => {
    setIsOpen(false);
    // Use setTimeout to allow the animation to complete before navigating
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  };

  // If there's no purchase status, don't render anything
  if (!purchaseStatus) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Success Modal */}
            {purchaseStatus === "success" && (
              <div>
                <div className="bg-green-50 dark:bg-green-900/30 p-6 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
                    <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    Your credits have been added to your account and are ready
                    to use.
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-300">
                        Transaction ID:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        TXN-
                        {Math.random()
                          .toString(36)
                          .substring(2, 10)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-300">
                        Date:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        Credits added:
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        25 credits
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={handleClose}
                        icon={<Check className="h-5 w-5" />}
                      >
                        Continue to Dashboard
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => {
                          handleClose();
                          setTimeout(() => router.push("/generator"), 300);
                        }}
                        icon={<ArrowRight className="h-5 w-5" />}
                      >
                        Start Creating Now
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            {/* Cancelled/Error Modal */}
            {purchaseStatus === "cancelled" && (
              <div>
                <div className="bg-red-50 dark:bg-red-900/30 p-6 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-800/50 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
                    Payment Cancelled
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    Your payment was not completed. No charges have been made to
                    your account.
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-600 dark:text-gray-300">
                          The transaction was cancelled or an error occurred
                          during processing.
                        </p>
                      </div>
                      <div className="flex items-start">
                        <CreditCard className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-600 dark:text-gray-300">
                          Your payment method has not been charged for this
                          transaction.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="primary" fullWidth onClick={handleClose}>
                        Return to Dashboard
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => {
                          handleClose();
                          setTimeout(
                            () =>
                              router.push("/dashboard?activeTab=buy-credits"),
                            300
                          );
                        }}
                      >
                        Try Again
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
