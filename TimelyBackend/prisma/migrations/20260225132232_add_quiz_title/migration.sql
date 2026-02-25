/*
  Warnings:

  - Added the required column `title` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: First add the column with a default value based on topic
ALTER TABLE `Quiz` ADD COLUMN `title` VARCHAR(191) NOT NULL DEFAULT 'Untitled Quiz';

-- Update existing rows to use topic as title
UPDATE `Quiz` SET `title` = `topic` WHERE `title` = 'Untitled Quiz';

-- CreateIndex
CREATE INDEX `Quiz_title_idx` ON `Quiz`(`title`);
