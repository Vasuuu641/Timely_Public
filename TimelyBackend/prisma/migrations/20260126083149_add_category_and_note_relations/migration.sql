/*
  Warnings:

  - Made the column `categoryId` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Note` DROP FOREIGN KEY `Note_categoryId_fkey`;

-- DropIndex
DROP INDEX `Note_categoryId_fkey` ON `Note`;

-- AlterTable
ALTER TABLE `Note` MODIFY `categoryId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
