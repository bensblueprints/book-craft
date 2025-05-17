"use client";

import Button from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { motion, useInView, useScroll } from "framer-motion";
import {
  Award,
  BookOpen,
  LayoutGrid,
  Lightbulb,
  Sparkles,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef } from "react";
import DemoAnimation from "./DemoAnimation";

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl transition-all duration-300 hover:shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

const PricingCard = ({
  title,
  price,
  features,
  popular = false,
  delay = 0,
}: {
  title: string;
  price: string;
  features: { included: boolean; text: string }[];
  popular?: boolean;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className={`bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md ${
        popular
          ? "border-2 border-indigo-500 relative z-10"
          : "border border-gray-100 dark:border-gray-700"
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {popular && (
        <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
          <motion.span
            className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            Most Popular
          </motion.span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
        <div className="flex justify-center items-baseline">
          <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {price}
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li
            key={index}
            className={`flex items-center ${
              feature.included
                ? "text-gray-600 dark:text-gray-300"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {feature.included ? (
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-gray-300 dark:text-gray-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            )}
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant={popular ? "primary" : "outline"} fullWidth>
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  );
};

const TestimonialCard = ({
  quote,
  author,
  role,
  delay = 0,
}: {
  quote: string;
  author: string;
  role: string;
  delay?: number;
}) => {
  return (
    <motion.div
      className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="text-amber-500 mb-4">★★★★★</div>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{quote}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="ml-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            {author}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const HomePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const handleStartGenerator = () => {
    // Updated to redirect to the generator page
    router.push("/generator");
  };

  const scrollToTestimonials = () => {
    document
      .getElementById("testimonials")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const basicFeatures = [
    { included: true, text: "3 plot generations per month" },
    { included: true, text: "Basic character development" },
    { included: true, text: "TXT export format" },
    { included: false, text: "Advanced genre settings" },
    { included: false, text: "Plot revision tools" },
  ];

  const professionalFeatures = [
    { included: true, text: "10 plot generations per month" },
    { included: true, text: "Advanced character development" },
    { included: true, text: "DOCX, PDF, TXT exports" },
    { included: true, text: "All genre customizations" },
    { included: true, text: "Basic plot revision tools" },
  ];

  const premiumFeatures = [
    { included: true, text: "Unlimited plot generations" },
    { included: true, text: "Expert character development" },
    { included: true, text: "All export formats + Scrivener" },
    { included: true, text: "Advanced plot revision tools" },
    { included: true, text: "Priority support" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500 rounded-full opacity-20 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute top-1/4 right-1/4 w-60 h-60 bg-indigo-400 rounded-full opacity-10 blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 30, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <motion.h1
              className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={
                heroInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
              }
              transition={{ duration: 0.6 }}
            >
              Craft Your Book's Blueprint
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-indigo-100 mb-10"
              initial={{ y: 20, opacity: 0 }}
              animate={
                heroInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
              }
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Generate comprehensive book plots and chapter outlines with
              perfect consistency and compelling narratives.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ y: 20, opacity: 0 }}
              animate={
                heroInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
              }
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleStartGenerator}
                  icon={<Sparkles className="h-5 w-5" />}
                >
                  Generate Your Plot
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-indigo-900"
                  onClick={scrollToTestimonials}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              className="mt-10 flex flex-wrap justify-center md:justify-start gap-8 text-indigo-100"
              initial={{ y: 20, opacity: 0 }}
              animate={
                heroInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
              }
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.1, color: "#f59e0b" }}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                <span>AI-Powered</span>
              </motion.div>
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.1, color: "#f59e0b" }}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                <span>300-400 Page Outlines</span>
              </motion.div>
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.1, color: "#f59e0b" }}
              >
                <LayoutGrid className="h-5 w-5 mr-2" />
                <span>Chapter-by-Chapter</span>
              </motion.div>
            </motion.div>
          </div>

          {/* 3D Book Animation */}
          <div className="md:w-1/2 flex justify-center">
            <motion.div
              className="relative w-64 h-80"
              initial={{ opacity: 0, rotateY: -30 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {/* Book cover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-xl"
                animate={{ rotateY: [-5, 5, -5] }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">
                      The Crystal Kingdoms
                    </h3>
                    <p className="text-sm text-white/80 mt-2">
                      A fantasy epic by PlotCraft AI
                    </p>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-xs text-white/70">
                      Generated with advanced AI technology
                    </p>
                  </div>
                </div>

                {/* Book spine */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-amber-700 to-amber-500 transform -translate-x-4 skew-y-12"></div>

                {/* Book pages */}
                <div className="absolute left-0 right-0 bottom-0 h-2 bg-white transform translate-y-2 skew-x-45"></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Video Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
              See PlotCraft in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Watch how our AI-powered platform helps writers create compelling
              stories in minutes.
            </p>
          </motion.div>

          {/* Replace the placeholder with the animated demo */}
          <DemoAnimation />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
              Craft Your Book with Precision
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our powerful tools give you everything you need to plan,
              structure, and develop your next bestseller.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <Sparkles className="h-6 w-6 text-amber-700 dark:text-amber-500" />
              }
              title="AI Plot Generation"
              description="Generate complete book outlines with consistent plots, character arcs, and thematic elements in seconds."
              delay={0}
            />

            <FeatureCard
              icon={
                <Users className="h-6 w-6 text-indigo-700 dark:text-indigo-500" />
              }
              title="Character Development"
              description="Create multi-dimensional characters with detailed backgrounds, motivations, and transformative arcs."
              delay={0.1}
            />

            <FeatureCard
              icon={
                <LayoutGrid className="h-6 w-6 text-emerald-700 dark:text-emerald-500" />
              }
              title="Chapter Mapping"
              description="Structure your novel with detailed chapter-by-chapter outlines that ensure narrative coherence."
              delay={0.2}
            />

            <FeatureCard
              icon={
                <BookOpen className="h-6 w-6 text-rose-700 dark:text-rose-500" />
              }
              title="Genre Expertise"
              description="Tailored plot generation for any genre, from fantasy and sci-fi to mystery, romance, and literary fiction."
              delay={0.3}
            />

            <FeatureCard
              icon={
                <Lightbulb className="h-6 w-6 text-purple-700 dark:text-purple-500" />
              }
              title="Idea Expansion"
              description="Transform simple concepts into rich, detailed narratives ready for writing, with all the complexity you need."
              delay={0.4}
            />

            <FeatureCard
              icon={
                <Award className="h-6 w-6 text-blue-700 dark:text-blue-500" />
              }
              title="Export & Share"
              description="Download your completed plot in multiple formats or share directly with editors, writing partners, and publishers."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
              Subscription Plans
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your creative needs, with flexible
              options for every writer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Basic"
              price="$9.99"
              features={basicFeatures}
              delay={0.1}
            />
            <PricingCard
              title="Professional"
              price="$19.99"
              features={professionalFeatures}
              popular={true}
              delay={0}
            />
            <PricingCard
              title="Premium"
              price="$39.99"
              features={premiumFeatures}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
              What Writers Are Saying
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of authors who've transformed their writing process
              with our plot generator.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="This tool completely transformed my writing process. What used to take me weeks now takes hours, and the quality of my plots has improved dramatically."
              author="Sarah J."
              role="Fantasy Author"
              delay={0}
            />
            <TestimonialCard
              quote="The character development features alone are worth the subscription. My characters now have depth and consistent arcs that my readers love."
              author="Michael T."
              role="Mystery Writer"
              delay={0.1}
            />
            <TestimonialCard
              quote="As a writing coach, I recommend this to all my clients. It's like having a professional editor and story consultant in your pocket at all times."
              author="Elena R."
              role="Writing Coach"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-indigo-900 dark:bg-indigo-800 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl font-serif font-bold mb-6"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Craft Your Next Bestseller?
          </motion.h2>
          <motion.p
            className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Join thousands of writers who are creating compelling, consistent
            book plots with our AI-powered generator.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={handleStartGenerator}
              icon={<Sparkles className="h-5 w-5" />}
            >
              Start Creating Now
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
