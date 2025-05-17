"use client";

import { motion } from "framer-motion";
import { BookOpen, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:border-t text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            className="col-span-1 md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center">
              <motion.div whileHover={{ rotate: 10 }}>
                <BookOpen className="h-8 w-8 text-amber-500" />
              </motion.div>
              <span className="ml-2 text-xl font-serif font-semibold text-white">
                PlotCraft
              </span>
            </Link>
            <p className="mt-4 text-gray-300 text-sm">
              Craft compelling book plots and outlines that captivate readers
              and bring your stories to life.
            </p>
            <div className="flex space-x-4 mt-6">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-amber-500"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-amber-500"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-amber-500"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/documentation"
                  className="text-gray-300 hover:text-amber-500 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-gray-300 hover:text-amber-500 transition-colors"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/api-status"
                  className="text-gray-300 hover:text-amber-500 transition-colors"
                >
                  API Status
                </Link>
              </li>
              <li>
                <Link
                  href="/generator"
                  className="text-gray-300 hover:text-amber-500 transition-colors"
                >
                  Plot Generator
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-amber-500 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-amber-500 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-300 hover:text-amber-500 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-amber-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-amber-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-amber-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 border-t border-gray-700 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} PlotCraft. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
