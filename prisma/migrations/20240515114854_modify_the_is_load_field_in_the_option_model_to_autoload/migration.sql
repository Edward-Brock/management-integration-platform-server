/*
  Warnings:

  - You are about to drop the column `is_load` on the `option` table. All the data in the column will be lost.
  - You are about to alter the column `createdAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `option` DROP COLUMN `is_load`,
    ADD COLUMN `autoload` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` MODIFY `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW();
