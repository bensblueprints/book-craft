"use client";

import type React from "react";

import Button from "@/components/ui/button";
import { motion } from "framer-motion";
import { Key, Mail, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AccountSettings() {
  const { data: sessionData } = useSession();
  const { user } = sessionData || {};
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProfileSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setProfileSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");

    // Reset success message after 3 seconds
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
        Account Settings
      </h2>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Profile Information
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  disabled
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block disabled:opacity-65 w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" variant="primary">
                Update Profile
              </Button>
            </motion.div>

            {profileSuccess && (
              <motion.span
                className="text-green-600 dark:text-green-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Profile updated successfully!
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <form onSubmit={handleChangePassword} className="p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Change Password
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                variant="primary"
                disabled={!currentPassword || !newPassword}
              >
                Change Password
              </Button>
            </motion.div>

            {passwordSuccess && (
              <motion.span
                className="text-green-600 dark:text-green-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Password changed successfully!
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
