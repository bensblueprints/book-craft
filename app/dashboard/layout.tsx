"use client";

import Button from "@/components/ui/button";
import { useProfileStore } from "@/store/useProfileStore";
import { AnimatePresence, motion } from "framer-motion";
import { Book, CreditCard, LogOut, Settings, ShoppingCart } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { status } = useSession();
  const { isLoading, ...user } = useProfileStore();

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Handle logout
  const handleLogout = async () => {
    signOut();
  };

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            className="w-full md:w-64 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                    {user?.name?.[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <motion.button
                  onClick={() => router.push("/dashboard")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Book className="h-5 w-5" />
                  <span>My Books</span>
                </motion.button>

                <motion.button
                  onClick={() => router.push("/dashboard/credits")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    pathname === "/dashboard/credits"
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Credits</span>
                </motion.button>

                <motion.button
                  onClick={() => router.push("/dashboard/buy-credits")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    pathname === "/dashboard/buy-credits"
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Buy Credits</span>
                </motion.button>

                <motion.button
                  onClick={() => router.push("/dashboard/settings")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    pathname === "/dashboard/settings"
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </motion.button>

                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30 mt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Available Credits
              </h3>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                {user?.credits || 0}
              </div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => router.push("/dashboard/buy-credits")}
                >
                  Buy Credits
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
