/*
  Warnings:

  - You are about to alter the column `createdAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `option` ADD COLUMN `is_load` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` MODIFY `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW();
