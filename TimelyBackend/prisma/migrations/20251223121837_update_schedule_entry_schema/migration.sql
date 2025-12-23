/*
  Warnings:

  - You are about to drop the column `description` on the `ScheduleEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ScheduleEntry` DROP COLUMN `description`,
    ADD COLUMN `isRecurring` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `notes` VARCHAR(191) NULL;
