import { z } from "zod";

export const characterSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  biography: z.string(),
});

export const generateBookSchema = z.object({
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  genre: z.string(),
  chapters: z.string(),
  complexity: z.string(),
  tone: z.string(),
  pov: z.string(),
  selectedElements: z.array(z.string()),
  characters: z.array(characterSchema),
  apiChoice: z.string(),
});

export const generateBookChapeterSchema = z.object({
  id: z.string(),
  title: z.string(),
  chapterTitle: z.string(),
  summary: z.string(),
  pacing: z.string(),
  wordCount: z.number(),
  keyEvents: z.array(z.string()),
  scenes: z.array(z.string()),
  pov: z.string(),
});
