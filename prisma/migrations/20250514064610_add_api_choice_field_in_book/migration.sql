/*
  Warnings:

  - Made the column `apiChoice` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "apiChoice" SET NOT NULL;
