-- DropForeignKey
ALTER TABLE `Quiz` DROP FOREIGN KEY `Quiz_userId_fkey`;

-- AlterTable
ALTER TABLE `Quiz` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
