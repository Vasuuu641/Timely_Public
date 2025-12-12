/*
  Warnings:

  - You are about to drop the column `title` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `correctAnswer` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `options` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Quiz` DROP COLUMN `title`,
    ADD COLUMN `correctAnswer` VARCHAR(191) NOT NULL,
    ADD COLUMN `options` VARCHAR(191) NOT NULL,
    ADD COLUMN `topic` VARCHAR(191) NOT NULL;
