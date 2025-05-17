"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Sparkles } from "lucide-react";

interface Character {
  id: number;
  name: string;
  role: string;
  biography: string;
}

interface CharactersStepProps {
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  addCharacter: () => void;
  removeCharacter: () => void;
  updateCharacter: (id: number, field: keyof Character, value: string) => void;
  handleCharacterSuggestion: (index: number) => void;
  handleBioSuggestion: (index: number) => void;
  roleOptions: Array<{ value: string; label: string }>;
}

export default function CharactersStep({
  characters,
  setCharacters,
  addCharacter,
  removeCharacter,
  updateCharacter,
  handleCharacterSuggestion,
  handleBioSuggestion,
  roleOptions,
}: CharactersStepProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100">
          Characters
        </h2>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={removeCharacter}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
            disabled={characters.length <= 1}
          >
            <Minus className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={addCharacter}
            className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/30"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-6">
        {characters.map((character, index) => (
          <motion.div
            key={character.id}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
              Character {index + 1}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Character Name */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor={`name-${character.id}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCharacterSuggestion(index)}
                    className="text-indigo-600 dark:text-indigo-400 text-xs flex items-center hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Get Suggestion
                  </motion.button>
                </div>
                <input
                  type="text"
                  id={`name-${character.id}`}
                  value={character.name}
                  onChange={(e) =>
                    updateCharacter(character.id, "name", e.target.value)
                  }
                  placeholder="Character Name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                {character.name.trim() === "" && (
                  <p className="mt-1 text-sm text-red-500">
                    Please enter a name for this character
                  </p>
                )}
              </div>

              {/* Character Role */}
              <div>
                <label
                  htmlFor={`role-${character.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Role
                </label>
                <select
                  id={`role-${character.id}`}
                  value={character.role}
                  onChange={(e) =>
                    updateCharacter(character.id, "role", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Character Biography */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor={`bio-${character.id}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Character Biography
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBioSuggestion(index)}
                  className="text-indigo-600 dark:text-indigo-400 text-xs flex items-center hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  Suggest Bio
                </motion.button>
              </div>
              <textarea
                id={`bio-${character.id}`}
                value={character.biography}
                onChange={(e) =>
                  updateCharacter(character.id, "biography", e.target.value)
                }
                placeholder="Character Biography"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
