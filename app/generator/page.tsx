"use client";

import { useCheckApiConfiguration } from "@/api/useAccount";
import { useGenerateBook } from "@/api/useBook";
import BasicInfoStep from "@/components/generator/BasicInfoStep";
import CharactersStep from "@/components/generator/CharactersStep";
import ElementsStep from "@/components/generator/ElementsStep";
import ProgressSteps from "@/components/generator/ProgressSteps";
import ReviewStep from "@/components/generator/ReviewStep";
import StructureStep from "@/components/generator/StructureStep";
import LoadingBookGenerator from "@/components/LoadingBookGenerator";
import Button from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Data arrays (genres, options, etc.)
const genres = [
  {
    value: "fantasy",
    label: "Fantasy",
    description:
      "A genre that uses magic and other supernatural forms, typically set in a fictional universe.",
  },
  {
    value: "sci-fi",
    label: "Science Fiction",
    description:
      "A genre based on imagined future scientific or technological advances and major social or environmental changes.",
  },
  {
    value: "mystery",
    label: "Mystery",
    description:
      "A genre that revolves around the solution of a crime or a puzzle, often involving a detective.",
  },
  {
    value: "romance",
    label: "Romance",
    description:
      "A genre focused on the relationship and romantic love between characters.",
  },
  {
    value: "thriller",
    label: "Thriller",
    description:
      "A genre characterized by excitement, suspense, and high stakes.",
  },
];

const chapterOptions = [
  { value: "5", label: "5 Chapters (~12,500 words)" },
  { value: "10", label: "10 Chapters (~25,000 words)" },
  { value: "15", label: "15 Chapters (~37,500 words)" },
  { value: "20", label: "20 Chapters (~50,000 words)" },
  { value: "30", label: "30 Chapters (~75,000 words)" },
];

const complexityOptions = [
  { value: "simple", label: "Simple" },
  { value: "moderate", label: "Moderate" },
  { value: "complex", label: "Complex" },
];

const toneOptions = [
  { value: "dark", label: "Dark" },
  { value: "neutral", label: "Neutral" },
  { value: "light", label: "Light" },
  { value: "humorous", label: "Humorous" },
  { value: "serious", label: "Serious" },
];

const povOptions = [
  { value: "first", label: "First Person" },
  { value: "third", label: "Third Person" },
  { value: "multiple", label: "Multiple Perspectives" },
];

const roleOptions = [
  { value: "protagonist", label: "Protagonist" },
  { value: "antagonist", label: "Antagonist" },
  { value: "supporting", label: "Supporting" },
  { value: "mentor", label: "Mentor" },
  { value: "sidekick", label: "Sidekick" },
];

const storyElements = [
  { id: "romance", label: "Romance" },
  { id: "violence", label: "Violence" },
  { id: "supernatural", label: "Supernatural" },
  { id: "politics", label: "Politics" },
  { id: "mystery", label: "Mystery" },
  { id: "adventure", label: "Adventure" },
  { id: "tragedy", label: "Tragedy" },
  { id: "comedy", label: "Comedy" },
];

// API options
const apiOptions = [
  {
    value: "app",
    label: "Use PlotCraft AI",
    description: "Use our built-in AI for book generation",
  },
  {
    value: "openai",
    label: "Use OpenAI",
    description: "Use your own OpenAI API key",
  },
  {
    value: "openrouter",
    label: "Use OpenRouter",
    description: "Use your own OpenRouter API key",
  },
];

interface Character {
  id: number;
  name: string;
  role: string;
  biography: string;
}

// Define the steps for our wizard
const steps = [
  { id: "basics", label: "Basic Info", icon: "📝" },
  { id: "structure", label: "Structure", icon: "📚" },
  { id: "characters", label: "Characters", icon: "👤" },
  { id: "elements", label: "Elements", icon: "🧩" },
  { id: "review", label: "Review", icon: "✓" },
];

export default function GeneratorPage() {
  const { data: sessionData, status } = useSession();
  const { user } = sessionData || {};
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return router.push("/login");
  }

  // check api configuration
  const { data: configurationData, refetch } = useCheckApiConfiguration(
    user?.id || ""
  );
  const { openAIKey, openRouterKey } = configurationData || {};

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [refetch, user]);

  // State for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("fantasy");
  const [apiChoice, setApiChoice] = useState("app");
  const [chapters, setChapters] = useState("10");
  const [complexity, setComplexity] = useState("moderate");
  const [tone, setTone] = useState("neutral");
  const [pov, setPov] = useState("third");
  const [characters, setCharacters] = useState<Character[]>([
    { id: 1, name: "", role: "protagonist", biography: "" },
    { id: 2, name: "", role: "antagonist", biography: "" },
    { id: 3, name: "", role: "supporting", biography: "" },
  ]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [redirecting, setRedirecting] = useState(false);

  // State for wizard navigation
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for backward, 1 for forward
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const formRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // generate book api
  const { data, mutate, isPending } = useGenerateBook();

  // Handle API response
  useEffect(() => {
    if (!isPending && data) {
      setRedirecting(true);
      router.push(`/books/${data.id}`);
    }
  }, [isPending, data]);

  // Check if current step is valid and can proceed
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          title.trim() !== "" &&
          description.trim() !== "" &&
          (apiChoice !== "openai" || openAIKey) &&
          (apiChoice !== "openrouter" || openRouterKey)
        );
      case 1: // Structure
        return true; // All fields have defaults
      case 2: // Characters
        return characters.every((char) => char.name.trim() !== "");
      case 3: // Elements
        return true; // Optional
      case 4: // Review
        return true;
      default:
        return false;
    }
  };

  // Update completed steps when moving between steps
  useEffect(() => {
    if (canProceed() && !completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
  }, [
    title,
    description,
    genre,
    apiChoice,
    characters,
    currentStep,
    completedSteps,
  ]);

  // Handle navigation between steps
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      setDirection(-1);
    } else {
      setDirection(1);
    }
    setCurrentStep(stepIndex);
    window.scrollTo(0, 0);
  };

  // Suggestion handlers
  const handleGenreSuggestion = () => {
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    setGenre(randomGenre.value);
  };

  const handleTitleSuggestion = () => {
    const fantasyTitles = [
      "Thrones of Etherium: The Last Enchantress",
      "The Crystal Kingdoms",
      "Whispers of the Ancient Magi",
      "Dragonfire Chronicles",
      "The Forgotten Realms of Azoria",
    ];

    const scifiTitles = [
      "Nebula's Edge",
      "The Quantum Protocol",
      "Starship Odyssey",
      "Neural Convergence",
      "The Mars Contingency",
    ];

    const titles = genre === "fantasy" ? fantasyTitles : scifiTitles;
    setTitle(titles[Math.floor(Math.random() * titles.length)]);
  };

  const handleCharacterSuggestion = (index: number) => {
    const names = [
      "Elara Nightshade",
      "Thorne Blackwood",
      "Lyra Stormheart",
      "Orion Duskwalker",
      "Seraphina Moonshadow",
      "Garrick Ironheart",
      "Isolde Ravencrest",
      "Alaric Wolfsbane",
    ];

    const updatedCharacters = [...characters];
    updatedCharacters[index].name =
      names[Math.floor(Math.random() * names.length)];
    setCharacters(updatedCharacters);
  };

  const handleBioSuggestion = (index: number) => {
    const bios = [
      "A mysterious figure with a troubled past, seeking redemption through heroic deeds.",
      "Born to nobility but raised among commoners, harboring a secret power that could change the world.",
      "A skilled warrior with a code of honor that often puts them at odds with authority.",
      "An outcast from society who found purpose in protecting those who cannot protect themselves.",
      "A scholar whose pursuit of forbidden knowledge has led to unexpected consequences.",
    ];

    const updatedCharacters = [...characters];
    updatedCharacters[index].biography =
      bios[Math.floor(Math.random() * bios.length)];
    setCharacters(updatedCharacters);
  };

  const addCharacter = () => {
    const newId =
      characters.length > 0 ? Math.max(...characters.map((c) => c.id)) + 1 : 1;
    setCharacters([
      ...characters,
      { id: newId, name: "", role: "supporting", biography: "" },
    ]);
  };

  const removeCharacter = () => {
    if (characters.length > 1) {
      setCharacters(characters.slice(0, -1));
    }
  };

  const updateCharacter = (
    id: number,
    field: keyof Character,
    value: string
  ) => {
    setCharacters(
      characters.map((char) =>
        char.id === id ? { ...char, [field]: value } : char
      )
    );
  };

  const toggleStoryElement = (elementId: string) => {
    setSelectedElements((prev) =>
      prev.includes(elementId)
        ? prev.filter((id) => id !== elementId)
        : [...prev, elementId]
    );
  };

  const handleGenerateBook = () => {
    mutate({
      json: {
        userId: user?.id || "",
        title,
        description,
        genre,
        chapters,
        complexity,
        tone,
        pov,
        characters,
        selectedElements,
        apiChoice,
      },
    });
  };

  // Animation variants
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.4,
  };

  if (isPending || redirecting) {
    return <LoadingBookGenerator title={title} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-indigo-900 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center mt-4">
            <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
              Book Generator
            </h1>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <ProgressSteps
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          goToStep={goToStep}
        />

        {/* Main Content */}
        <motion.div
          ref={formRef}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8 mb-6 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div ref={contentRef} className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
              >
                {/* Step 1: Basic Information */}
                {currentStep === 0 && (
                  <BasicInfoStep
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    genre={genre}
                    setGenre={setGenre}
                    apiChoice={apiChoice}
                    setApiChoice={setApiChoice}
                    openAIKey={openAIKey || false}
                    openRouterKey={openRouterKey || false}
                    handleTitleSuggestion={handleTitleSuggestion}
                    handleGenreSuggestion={handleGenreSuggestion}
                    genres={genres}
                    apiOptions={apiOptions}
                  />
                )}

                {/* Step 2: Book Structure */}
                {currentStep === 1 && (
                  <StructureStep
                    chapters={chapters}
                    setChapters={setChapters}
                    complexity={complexity}
                    setComplexity={setComplexity}
                    tone={tone}
                    setTone={setTone}
                    pov={pov}
                    setPov={setPov}
                    chapterOptions={chapterOptions}
                    complexityOptions={complexityOptions}
                    toneOptions={toneOptions}
                    povOptions={povOptions}
                  />
                )}

                {/* Step 3: Characters */}
                {currentStep === 2 && (
                  <CharactersStep
                    characters={characters}
                    setCharacters={setCharacters}
                    addCharacter={addCharacter}
                    removeCharacter={removeCharacter}
                    updateCharacter={updateCharacter}
                    handleCharacterSuggestion={handleCharacterSuggestion}
                    handleBioSuggestion={handleBioSuggestion}
                    roleOptions={roleOptions}
                  />
                )}

                {/* Step 4: Story Elements */}
                {currentStep === 3 && (
                  <ElementsStep
                    selectedElements={selectedElements}
                    toggleStoryElement={toggleStoryElement}
                    storyElements={storyElements}
                  />
                )}

                {/* Step 5: Review & Generate */}
                {currentStep === 4 && (
                  <ReviewStep
                    title={title}
                    description={description}
                    genre={genre}
                    apiChoice={apiChoice}
                    chapters={chapters}
                    complexity={complexity}
                    tone={tone}
                    pov={pov}
                    characters={characters}
                    selectedElements={selectedElements}
                    isGenerating={isPending}
                    handleGenerateBook={handleGenerateBook}
                    genres={genres}
                    apiOptions={apiOptions}
                    chapterOptions={chapterOptions}
                    complexityOptions={complexityOptions}
                    toneOptions={toneOptions}
                    povOptions={povOptions}
                    roleOptions={roleOptions}
                    storyElements={storyElements}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
                icon={<ArrowLeft className="h-4 w-4 mr-2" />}
              >
                Previous
              </Button>
            </motion.div>

            {currentStep < steps.length - 1 ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="primary"
                  onClick={goToNextStep}
                  disabled={!canProceed()}
                  icon={<ArrowRight className="h-4 w-4 ml-2" />}
                >
                  Next
                </Button>
              </motion.div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
