"use client";

import { useGetProfile } from "@/api/useProfile";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/ui/button";
import { useProfileStore } from "@/store/useProfileStore";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Menu, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { updateInfo, ...user } = useProfileStore();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  // get user data
  const { data, isLoading } = useGetProfile(
    sessionData?.user?.id as string,
    sessionData?.user?.id as string
  );

  useEffect(() => {
    if (data?.id) {
      updateInfo({
        name: data?.name || "",
        email: data?.email || "",
        id: data?.id || "",
        credits: data?.credits,
      });
    }

    updateInfo({
      isLoading,
    });
  }, [data, isLoading]);

  return (
    <motion.header
      className="bg-white dark:border-b dark:bg-gray-900 shadow-sm sticky top-0 z-[100]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <BookOpen className="h-8 w-8 text-indigo-900 dark:text-indigo-400" />
              </motion.div>
              <span className="ml-2 text-xl font-serif font-semibold text-indigo-900 dark:text-indigo-400">
                PlotCraft
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/documentation"
              className={`text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium ${
                pathname === "/documentation"
                  ? "text-indigo-900 dark:text-indigo-400"
                  : ""
              }`}
            >
              Documentation
            </Link>
            <Link
              href="/guides"
              className={`text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium ${
                pathname === "/guides"
                  ? "text-indigo-900 dark:text-indigo-400"
                  : ""
              }`}
            >
              Guides
            </Link>
            <Link
              href="/blog"
              className={`text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium ${
                pathname === "/blog"
                  ? "text-indigo-900 dark:text-indigo-400"
                  : ""
              }`}
            >
              Blog
            </Link>
            <Link
              href="/support"
              className={`text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium ${
                pathname === "/support"
                  ? "text-indigo-900 dark:text-indigo-400"
                  : ""
              }`}
            >
              Support
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {user?.id ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm">{user.name}</span>
                </motion.button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute border right-0 w-48 mt-2 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50"
                    >
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                        <span>Credits:</span>
                        <span>{user?.credits}</span>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push("/signup")}
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/documentation"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link
                href="/guides"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Guides
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/support"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>

              {!user && (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-indigo-900 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-900 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
