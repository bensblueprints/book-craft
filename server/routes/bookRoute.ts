import { splitTextIntoLines } from "@/lib/utils";
import {
  generateBookChapeterSchema,
  generateBookSchema,
} from "@/schemas/generateBookSchema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { OpenAI } from "openai";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { z } from "zod";
import prisma from "../db/prisma";

const app = new Hono()
  .post("/generate", zValidator("json", generateBookSchema), async (c) => {
    const {
      userId,
      title,
      description,
      chapters,
      characters,
      complexity,
      genre,
      pov,
      selectedElements,
      tone,
      apiChoice,
    } = c.req.valid("json");

    let apiKey = "";
    let openai;

    if (apiChoice === "app") {
      apiKey = process.env.OPENAI_API_KEY || "";

      openai = new OpenAI({
        apiKey,
      });
    } else if (apiChoice === "openai") {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      apiKey = user?.openAIKey || "";

      openai = new OpenAI({
        apiKey,
      });
    } else if (apiChoice === "openrouter") {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      apiKey = user?.openRouterKey || "";
      openai = new OpenAI({
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
      });
    }

    const prompt = `
You are a creative novelist AI. Based on the following user input, generate a complete book structure with detailed metadata (but without full prose content yet).

**Book Configuration:**
- Title: ${title}
- Description: ${description}
- Genre: ${genre}
- Chapters: ${chapters}
- Complexity: ${complexity}
- Tone: ${tone}
- Point of View: ${pov}
- Themes/Elements: ${selectedElements.join(", ")}

**Characters:**
${characters
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

    const completion = openai
      ? await openai.chat.completions.create({
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
        })
      : "";

    const content = completion && completion.choices[0].message.content;

    try {
      const parsed = JSON.parse(content || "");

      // save in database
      const newBook = await prisma.book.create({
        data: {
          userId,
          title,
          genre,
          apiChoice,
          shortSummary: parsed.shortSummary,
          characters: {
            create: characters.map((char) => ({
              name: char.name,
              role: char.role,
              biography: char.biography,
            })),
          },
          chapters: {
            create: parsed.chapters.map((chapter: any, index: number) => ({
              title: chapter.title,
              summary: chapter.summary,
              pacing: chapter.pacing,
              wordCount: chapter.wordCount,
              keyEvents: chapter.keyEvents,
              scenes: chapter.scenes,
              pov: chapter.pov,
              position: index,
            })),
          },
        },
        include: {
          characters: true,
          chapters: true,
        },
      });

      return c.json({ id: newBook.id });
    } catch (err) {
      console.error("Error parsing AI response:", err);
      throw new Error("Failed to parse AI response as JSON");
    }
  })
  .put(
    "/generate-book-chapter-content/:bookId",
    zValidator("json", generateBookChapeterSchema),
    async (c) => {
      const {
        id,
        keyEvents,
        pov,
        scenes,
        summary,
        title,
        chapterTitle,
        wordCount,
      } = c.req.valid("json");

      const { bookId } = c.req.param();

      const book = await prisma.book.findUnique({
        where: {
          id: bookId,
        },
      });

      let apiKey = "";
      let openai;

      if (book?.apiChoice === "openai") {
        const user = await prisma.user.findUnique({
          where: {
            id: book?.userId,
          },
        });

        apiKey = user?.openAIKey || "";

        openai = new OpenAI({
          apiKey,
        });
      } else if (book?.apiChoice === "openrouter") {
        const user = await prisma.user.findUnique({
          where: {
            id: book?.userId,
          },
        });

        apiKey = user?.openRouterKey || "";

        openai = new OpenAI({
          apiKey,
          baseURL: "https://openrouter.ai/api/v1",
        });
      } else {
        apiKey = process.env.OPENAI_API_KEY || "";

        openai = new OpenAI({
          apiKey,
        });
      }

      const prompt = `
You are a novelist AI. Write the full chapter content using the metadata below. Include engaging prose, paragraphs, descriptions, and dialogue. Do not add summaries or structure info.

**Chapter Metadata:**
- Book Title: ${title}
- Chapter Title: ${chapterTitle}
- Summary: ${summary}
- Scenes: ${scenes.join(", ")}
- Key Events: ${keyEvents.join(", ")}
- Point of View: ${pov}
- Target Word Count: approximately ${wordCount}

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

      // update book chapter with content
      await prisma.chapter.update({
        where: { id },
        data: {
          content: completion.choices[0].message.content,
        },
      });

      return c.json({
        success: true,
      });
    }
  )
  .get("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          characters: true,
          chapters: {
            orderBy: { position: "asc" },
          },
        },
      });

      return c.json(book);
    } catch (error) {
      console.error("Error get book:", error);
      throw new Error("Failed to get book data");
    }
  })
  .get("/all-books/:userId", async (c) => {
    try {
      const { userId } = c.req.param();

      const books = await prisma.book.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          shortSummary: true,
          createdAt: true,
          genre: true,
          chapters: {
            select: {
              wordCount: true,
            },
          },
        },
      });

      const result = books.map((book) => {
        const chapterCount = book.chapters.length;
        const totalWords = book.chapters.reduce(
          (sum, chapter) => sum + chapter.wordCount,
          0
        );

        return {
          id: book.id,
          title: book.title,
          shortSummary: book.shortSummary,
          createdAt: book.createdAt,
          genre: book.genre,
          chapterCount,
          totalWords,
        };
      });

      return c.json(result);
    } catch (error) {
      console.error("Error get book:", error);
      throw new Error("Failed to get book data");
    }
  })
  .post(
    "/export-book",
    zValidator(
      "json",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("json");

      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          chapters: { orderBy: { position: "asc" } },
          characters: true,
        },
      });

      if (!book) {
        return c.json({ error: "Book not found" }, { status: 404 });
      }

      const user = await prisma.user.findUnique({
        where: { id: book.userId },
        select: { name: true },
      });

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const titleFontSize = 24;
      const chapterTitleFontSize = 18;
      const margin = 50;

      // Start with first page
      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      let y = height - 80;

      // Helper to center-align text
      const drawCenteredText = (text: string, size: number, color: any) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        const x = (width - textWidth) / 2;

        page.drawText(text, {
          x,
          y,
          size,
          font,
          color,
        });

        y -= size + 20;
      };

      // Draw cover info (centered)
      drawCenteredText(book.title, titleFontSize, rgb(0, 0, 0));
      drawCenteredText(
        `Author: ${user?.name || "Unknown"}`,
        16,
        rgb(0.3, 0.3, 0.3)
      );
      drawCenteredText(`Genre: ${book.genre || "N/A"}`, 14, rgb(0.3, 0.3, 0.3));
      drawCenteredText(
        `Created: ${book.createdAt.toDateString()}`,
        14,
        rgb(0.3, 0.3, 0.3)
      );

      // Add extra space between cover and chapter content
      y -= 60;

      // Chapters
      for (const chapter of book.chapters) {
        const chapterTitleLines = splitTextIntoLines(
          chapter.title,
          font,
          chapterTitleFontSize,
          width - 2 * margin
        );

        for (const line of chapterTitleLines) {
          if (y < margin + chapterTitleFontSize) {
            page = pdfDoc.addPage();
            y = height - margin;
          }

          page.drawText(line, {
            x: margin,
            y,
            size: chapterTitleFontSize,
            font,
            color: rgb(0, 0, 0.6),
          });

          y -= chapterTitleFontSize + 10;
        }

        const lines = splitTextIntoLines(
          chapter.content || "",
          font,
          fontSize,
          width - 2 * margin
        );

        for (const line of lines) {
          if (y < margin + fontSize) {
            page = pdfDoc.addPage();
            y = height - margin;
          }

          page.drawText(line, {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });

          y -= fontSize + 6;
        }

        y -= 20; // spacing between chapters
      }

      const pdfBytes = await pdfDoc.save();

      return c.body(pdfBytes, 200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${book.title}.pdf"`,
      });
    }
  );

export default app;
