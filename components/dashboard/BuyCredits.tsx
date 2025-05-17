"use client";

import { useBuyCredits } from "@/api/buyCredits";
import Button from "@/components/ui/button";
import { useProfileStore } from "@/store/useProfileStore";
import { motion } from "framer-motion";
import { AlertCircle, Check, CreditCard, Info, Sparkles } from "lucide-react";
import { useState } from "react";

export default function BuyCredits() {
  const user = useProfileStore();

  const [quantity, setQuantity] = useState(1);

  const { mutate, isPending, error, isError } = useBuyCredits();

  // Credit package details
  const creditPackage = {
    name: "Standard Credit Package",
    baseCredits: 25,
    bonusCredits: 5,
    pricePerUnit: 1.99,
    description: "Use credits to generate comprehensive book plots with our AI",
  };

  const totalCredits =
    creditPackage.baseCredits * quantity +
    (quantity >= 2 ? creditPackage.bonusCredits : 0);
  const totalPrice = (creditPackage.pricePerUnit * quantity).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
          Buy Credits
        </h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Info className="h-4 w-4 mr-1" />
          <span>Current balance: {user?.credits} credits</span>
        </div>
      </div>

      {isError && (
        <motion.div
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800 dark:text-red-300">
              Payment Error
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
          </div>
        </motion.div>
      )}

      {/* {success && (
        <motion.div
          className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Check className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-300">
              Purchase Successful!
            </h3>
            <p className="text-sm text-green-600 dark:text-green-400">
              {totalCredits} credits have been added to your account.
            </p>
          </div>
        </motion.div>
      )} */}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {creditPackage.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {creditPackage.description}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Select Quantity
              </label>
              <div className="flex items-center">
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  disabled={isPending}
                >
                  <option value={1}>
                    1 package ({creditPackage.baseCredits} credits)
                  </option>
                  <option value={2}>
                    2 packages (
                    {creditPackage.baseCredits * 2 + creditPackage.bonusCredits}{" "}
                    credits - includes bonus!)
                  </option>
                  <option value={3}>
                    3 packages (
                    {creditPackage.baseCredits * 3 + creditPackage.bonusCredits}{" "}
                    credits - includes bonus!)
                  </option>
                  <option value={5}>
                    5 packages (
                    {creditPackage.baseCredits * 5 + creditPackage.bonusCredits}{" "}
                    credits - includes bonus!)
                  </option>
                </select>
              </div>
              {quantity >= 2 && (
                <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Includes {creditPackage.bonusCredits} bonus credits!
                </p>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">
                  Price per package:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${creditPackage.pricePerUnit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">
                  Quantity:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {quantity}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Total credits:
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {totalCredits} credits
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Total price:
                </span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  ${totalPrice}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() =>
                    mutate({
                      credits: totalCredits,
                      userId: user?.id!,
                      price: Number(totalPrice),
                    })
                  }
                  icon={<CreditCard className="h-5 w-5" />}
                >
                  {isPending ? "Processing..." : `Purchase for $${totalPrice}`}
                </Button>
              </motion.div>

              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                Secure payment processing. You'll be redirected to our payment
                provider.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            What you can do with credits:
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
              <span>
                Generate complete book plots with chapter-by-chapter outlines
              </span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
              <span>Create detailed character profiles and story arcs</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
              <span>
                Export your plots in multiple formats (PDF, DOCX, TXT)
              </span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
              <span>Revise and regenerate sections of your plot</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
