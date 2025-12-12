-- AlterTable
ALTER TABLE `PomodoroSession` ADD COLUMN `totalBreakMinutes` INTEGER NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `PostSessionBreak` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` INTEGER NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NULL,

    UNIQUE INDEX `PostSessionBreak_sessionId_key`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PostSessionBreak` ADD CONSTRAINT `PostSessionBreak_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `PomodoroSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
