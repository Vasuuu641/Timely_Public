/*
  Warnings:

  - Made the column `question` on table `Quiz` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Quiz` MODIFY `options` TEXT NOT NULL,
    MODIFY `question` TEXT NOT NULL;
