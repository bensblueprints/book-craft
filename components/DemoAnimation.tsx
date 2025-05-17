"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Sparkles, Check, Loader2, ArrowRight, FileText, BookMarked } from "lucide-react"

const TypewriterText = ({
  text,
  delay = 30,
  onComplete,
}: {
  text: string
  delay?: number
  onComplete?: () => void
}) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, delay, onComplete, text])

  return <>{displayedText}</>
}

const DemoAnimation = () => {
  // Animation sequence state
  const [animationStep, setAnimationStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [typedTitle, setTypedTitle] = useState("")
  const [typedGenre, setTypedGenre] = useState("")
  const [showLoading, setShowLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [showDownload, setShowDownload] = useState(false)
  const [autoScroll, setAutoScroll] = useState(false)

  const demoContainerRef = useRef<HTMLDivElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)

  const bookTitle = "The Crystal Kingdoms"
  const bookGenre = "Fantasy"

  // Available export formats
  const exportFormats = ["PDF", "DOCX", "TXT", "EPUB"]

  // Demo plot outline sections
  const plotSections = [
    {
      title: "Plot Overview",
      content:
        "In the mystical realm of Etherium, a young alchemist named Elara discovers a rare crystal with the power to bridge worlds. As ancient forces awaken, she must master the crystal's magic to prevent the collapse of the Five Kingdoms.",
    },
    {
      title: "Main Characters",
      content:
        "Elara Nightshade - A gifted alchemist with a mysterious past\nThorne Blackwood - A rogue knight with ties to the royal family\nQueen Selene - Ruler of the Crystal Kingdom, harboring dark secrets\nMagister Orion - Elara's mentor and guardian of ancient knowledge",
    },
    {
      title: "Chapter 1: The Awakening",
      content:
        "Elara discovers a mysterious crystal in the Whispering Woods that glows in her presence. Strange visions begin to haunt her dreams, showing glimpses of a forgotten history and impending danger.",
    },
    {
      title: "Chapter 2: The Call to Adventure",
      content:
        "A stranger arrives in the village, seeking the bearer of the crystal's power. Elara learns that her discovery is one of the five legendary Ethercrystals, thought to be lost for centuries.",
    },
    {
      title: "Chapter 3: Crossing the Threshold",
      content:
        "After an attack on her village by shadow creatures, Elara must flee with the crystal. She meets Thorne, who reluctantly agrees to escort her to the Crystal Kingdom's capital.",
    },
    {
      title: "Chapter 4: Tests and Allies",
      content:
        "The journey through the Mistlands tests Elara's emerging powers. She begins to form a bond with the crystal, learning to channel its energy. Thorne reveals his own connection to the royal family.",
    },
    {
      title: "Chapter 5: The Inner Sanctum",
      content:
        "Arriving at the capital, Elara is brought before Queen Selene. The queen recognizes Elara's potential but sees her as both an asset and a threat. Magister Orion offers to train Elara in secret.",
    },
  ]

  // Handle auto-scrolling
  useEffect(() => {
    if (autoScroll && resultsContainerRef.current) {
      const scrollInterval = setInterval(() => {
        if (resultsContainerRef.current) {
          resultsContainerRef.current.scrollTop += 2

          // If we've scrolled to the bottom, stop scrolling
          if (
            resultsContainerRef.current.scrollTop + resultsContainerRef.current.clientHeight >=
            resultsContainerRef.current.scrollHeight - 10
          ) {
            clearInterval(scrollInterval)
          }
        }
      }, 30)

      return () => clearInterval(scrollInterval)
    }
  }, [autoScroll])

  // Animation sequence controller
  useEffect(() => {
    const runAnimationSequence = () => {
      // Reset all states
      setAnimationStep(0)
      setTypedTitle("")
      setTypedGenre("")
      setIsTyping(false)
      setShowLoading(false)
      setShowResults(false)
      setSelectedFormat(null)
      setShowDownload(false)
      setAutoScroll(false)

      if (resultsContainerRef.current) {
        resultsContainerRef.current.scrollTop = 0
      }

      // Start typing animation for title
      setTimeout(() => {
        setIsTyping(true)
        let currentText = ""
        const typeInterval = setInterval(() => {
          if (currentText.length < bookTitle.length) {
            currentText = bookTitle.substring(0, currentText.length + 1)
            setTypedTitle(currentText)
          } else {
            clearInterval(typeInterval)

            // Start typing genre after title is complete
            setTimeout(() => {
              let genreText = ""
              const genreInterval = setInterval(() => {
                if (genreText.length < bookGenre.length) {
                  genreText = bookGenre.substring(0, genreText.length + 1)
                  setTypedGenre(genreText)
                } else {
                  clearInterval(genreInterval)
                  setIsTyping(false)

                  // Click generate button
                  setTimeout(() => {
                    setAnimationStep(1)

                    // Show loading
                    setTimeout(() => {
                      setShowLoading(true)

                      // Show results
                      setTimeout(() => {
                        setShowLoading(false)
                        setShowResults(true)
                        setAnimationStep(2)

                        // Start auto-scrolling after results are shown
                        setTimeout(() => {
                          setAutoScroll(true)

                          // Select an export format after scrolling
                          setTimeout(() => {
                            const randomFormat = exportFormats[Math.floor(Math.random() * exportFormats.length)]
                            setSelectedFormat(randomFormat)

                            // Show download animation
                            setTimeout(() => {
                              setShowDownload(true)

                              // Reset after showing download
                              setTimeout(() => {
                                // Loop the animation
                                runAnimationSequence()
                              }, 3000)
                            }, 1500)
                          }, 5000)
                        }, 1000)
                      }, 2500)
                    }, 1000)
                  }, 500)
                }
              }, 50)
            }, 300)
          }
        }, 50)
      }, 1000)
    }

    // Start the animation sequence
    runAnimationSequence()

    // Cleanup
    return () => {
      // Clear any remaining timeouts
    }
  }, [])

  return (
    <div
      ref={demoContainerRef}
      className="overflow-hidden rounded-xl border bg-white dark:bg-gray-950 shadow-xl relative"
    >
      {/* Browser chrome */}
      <div className="flex items-center justify-between border-b px-4 py-2 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-gray-500 px-3 py-1 bg-white dark:bg-gray-800 rounded-full">plotcraft.app</div>
        <div className="w-16"></div>
      </div>

      {/* App interface - fixed height container */}
      <div className="p-6" style={{ height: "600px" }}>
        {/* App header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-serif font-bold">PlotCraft</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800"></div>
          </div>
        </div>

        {/* Generator form section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-serif font-bold mb-2">Book Plot Generator</h3>
            <p className="text-gray-500 dark:text-gray-400">Create a comprehensive book plot with just a few details</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Book Title</label>
              <input
                type="text"
                value={typedTitle}
                className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter your book title"
                readOnly
              />
              {isTyping && typedTitle.length < bookTitle.length && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 animate-blink"></div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre</label>
              <input
                type="text"
                value={typedGenre}
                className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Select a genre"
                readOnly
              />
              {isTyping && typedTitle === bookTitle && typedGenre.length < bookGenre.length && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 animate-blink"></div>
              )}
            </div>

            <motion.button
              className={`w-full h-12 px-6 rounded-lg flex items-center justify-center gap-2 ${
                animationStep >= 1 ? "bg-amber-600 text-white" : "bg-amber-500 text-white"
              }`}
              animate={animationStep === 1 ? { scale: [1, 0.95, 1] } : {}}
              transition={{ duration: 0.2 }}
            >
              {animationStep === 1 ? (
                <>
                  Generating... <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  Generate Plot <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Content container with fixed height and scrollable */}
        <div ref={resultsContainerRef} className="overflow-y-auto" style={{ height: "380px" }}>
          {/* Loading state */}
          <AnimatePresence>
            {showLoading && (
              <motion.div
                className="flex flex-col items-center justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  </div>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Crafting your book plot and character arcs...</p>

                <div className="w-full max-w-md mt-6">
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.3, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Creating characters</span>
                    <span>Building plot</span>
                    <span>Finalizing</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Book overview */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-serif font-bold">{bookTitle}</h3>
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm">
                      {bookGenre}
                    </span>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-serif font-bold text-white">{bookTitle}</h3>
                            <p className="text-sm text-white/80 mt-2">
                              A {bookGenre.toLowerCase()} epic by PlotCraft AI
                            </p>
                          </div>
                          <div className="border-t border-white/20 pt-4">
                            <p className="text-xs text-white/70">Generated with advanced AI technology</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-3">Book Summary</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        In the mystical realm of Etherium, a young alchemist named Elara discovers a rare crystal with
                        the power to bridge worlds. As ancient forces awaken, she must master the crystal's magic to
                        prevent the collapse of the Five Kingdoms.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BookMarked className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">5 chapters outlined</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">~12,500 words</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plot sections */}
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-6">Plot Outline</h2>
                  <div className="space-y-6">
                    {plotSections.map((section, index) => (
                      <motion.div
                        key={index}
                        className="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line">
                          {section.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Export options */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                  <h3 className="text-lg font-medium mb-4">Export Options</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {exportFormats.map((format) => (
                      <motion.button
                        key={format}
                        className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
                          selectedFormat === format
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 ring-2 ring-amber-500 ring-opacity-50"
                            : "border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700"
                        }`}
                        animate={{
                          scale: selectedFormat === format ? 1.05 : 1,
                        }}
                      >
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <span className="font-medium">{format}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Initial state - only shown before animation starts */}
          {!showLoading && !showResults && animationStep === 0 && typedTitle === "" && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Sparkles className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">Enter book details to get started</p>
              <p className="mt-2 text-sm text-gray-500">Watch the demo to see how it works</p>
            </div>
          )}
        </div>
      </div>

      {/* Download animation overlay */}
      <AnimatePresence>
        {showDownload && selectedFormat && (
          <motion.div
            className="absolute inset-0 bg-black/70 z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md overflow-hidden mx-4"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                </motion.div>
                <h3 className="text-lg font-bold mb-2">Download Complete</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
                  Your plot for "{bookTitle}" has been downloaded as a {selectedFormat} file
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  <span>
                    {bookTitle.replace(/\s+/g, "-").toLowerCase()}.{selectedFormat.toLowerCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add custom animation keyframes */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  )
}

export default DemoAnimation
