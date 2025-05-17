import type { Plot } from "@/types";

// Mock function to simulate chapter generation
export const generateChapter = async (
  plot: Plot,
  chapterIndex: number
): Promise<string> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return `# Chapter ${chapterIndex + 1}: ${plot.chapters[chapterIndex].title}

${plot.chapters[chapterIndex].summary}

## Scene 1: ${plot.chapters[chapterIndex].scenes[0]}

The morning mist clung to the ancient trees of the Whispering Woods as Elara Nightshade made her way along the familiar path. Her satchel, already half-filled with herbs and fungi, bounced gently against her hip. The villagers of Mistfall relied on her alchemical remedies, a skill she had inherited from her grandmother.

"Grandmother always said the woods speak to those who listen," Elara murmured to herself, brushing her fingers against the rough bark of an elder oak. The tree seemed to shiver at her touch, though no wind disturbed the forest canopy.

Something felt different today. The usual chorus of birdsong had fallen silent, and the mist—ever-present in these woods—seemed to part before her, revealing a path she had never noticed before.

Curiosity, always her guiding star, pulled her forward.

## Scene 2: ${plot.chapters[chapterIndex].scenes[1]}

The path led to a clearing where a massive tree, ancient beyond reckoning, dominated the space. Its trunk, gnarled and twisted with age, seemed to pulse with an inner light that caught Elara's attention immediately.

"What secrets are you hiding, old one?" she whispered, approaching cautiously.

As she drew closer, she saw it—a crystal embedded in the heart of the trunk, pulsing with a blue-white light that seemed to intensify as she approached. It was no larger than her palm, but something about it called to her, a silent song that resonated in her very bones.

Without thinking, she reached out.

## Scene 3: ${plot.chapters[chapterIndex].scenes[2]}

The moment her fingers touched the crystal, the world around her dissolved. Visions flooded her mind: five kingdoms united under a canopy of crystal light; a great darkness spreading across the land; five crystals, each pulsing with a different hue, scattered to the winds.

And faces—so many faces. A queen with eyes cold as ice, a knight with shadows in his gaze, a wise man with secrets etched into the lines of his face, and others, flashing too quickly to grasp.

When the visions faded, Elara found herself on her knees, the crystal now cradled in her palm, free from the tree as if it had been waiting for her all along.

## Scene 4: ${plot.chapters[chapterIndex].scenes[3]}

The return to Mistfall was a blur. Elara kept the crystal hidden, wrapped in a cloth and tucked deep in her satchel. Yet she could feel its presence, a gentle warmth against her side, a whisper at the edge of her consciousness.

As she entered the village, she noticed a stranger at the inn—tall, dark-haired, with the bearing of a warrior though he wore no visible weapons. His eyes, sharp and assessing, followed her as she passed.

That night, as Elara studied the crystal by candlelight in the privacy of her small cottage, she noticed the plants on her windowsill leaning toward it, as if drawn by its light. And when she finally slept, the dreams came again—clearer now, more urgent.

A storm was coming to the Five Kingdoms, and somehow, this crystal—and Elara herself—stood at its heart.`;
};

import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

type Character = {
  id: number;
  name: string;
  role: string;
  biography: string;
};

export type ChapterMeta = {
  id: string;
  title: string;
  summary: string;
  pacing: "slow" | "medium" | "fast";
  wordCount: number;
  keyEvents: string[];
  scenes: string[];
};

export type GenerateBookInput = {
  title: string;
  description: string;
  genre: string;
  chapters: string;
  complexity: string;
  tone: string;
  pov: string;
  characters: Character[];
  selectedElements: string[];
};

export async function generateBook(data: GenerateBookInput) {
  const prompt = `
You are a creative novelist AI. Based on the following user input, generate a complete book structure with detailed metadata (but without full prose content yet).

**Book Configuration:**
- Title: ${data.title}
- Description: ${data.description}
- Genre: ${data.genre}
- Chapters: ${data.chapters}
- Complexity: ${data.complexity}
- Tone: ${data.tone}
- Point of View: ${data.pov}
- Themes/Elements: ${data.selectedElements.join(", ")}

**Characters:**
${data.characters
  .map((char) => `- ${char.name} (${char.role}): ${char.biography}`)
  .join("\n")}

**Output format (JSON):**
{
  "title": "string",
  "shortSummary": "string",
  "chapters": [
    {
      "title": "string",
      "summary": "string",
      "pacing": "slow | medium | fast",
      "wordCount": number,
      "keyEvents": ["string", ...],
      "scenes": ["string", ...],
      "pov": "First Person | Third Person Limited | Third Person Omniscient | Third Person Objective | Second Person"
    },
    ...
  ]
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that generates fictional book outlines in structured JSON. Do not include full prose content.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = completion.choices[0].message.content;

  try {
    const parsed = JSON.parse(content || "");

    // Add unique UUIDs to each chapter
    const chaptersWithId = parsed.chapters.map((chapter: any) => ({
      ...chapter,
      id: uuidv4(), // unique ID per chapter
    }));

    return {
      title: parsed.title,
      shortSummary: parsed.shortSummary,
      chapters: chaptersWithId,
    };
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON");
  }
}

export async function generateChapterContent(
  chapter: ChapterMeta,
  bookConfig: {
    title: string;
    tone: string;
    pov: string;
  }
) {
  const prompt = `
You are a novelist AI. Write the full chapter content using the metadata below. Include engaging prose, paragraphs, descriptions, and dialogue. Do not add summaries or structure info.

**Chapter Metadata:**
- Book Title: ${bookConfig.title}
- Chapter Title: ${chapter.title}
- Summary: ${chapter.summary}
- Scenes: ${chapter.scenes.join(", ")}
- Key Events: ${chapter.keyEvents.join(", ")}
- Tone: ${bookConfig.tone}
- Point of View: ${bookConfig.pov}
- Target Word Count: approximately ${chapter.wordCount}

Write the chapter as if it's from a novel, with immersive storytelling.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You write immersive, full prose chapters for novels based on metadata.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0].message.content;
}
