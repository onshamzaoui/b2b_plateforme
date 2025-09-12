/*
  Warnings:

  - You are about to drop the column `userId` on the `Application` table. All the data in the column will be lost.
  - The `status` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `dailyRate` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `freelancerId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchScore` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "userId",
ADD COLUMN     "availability" TEXT,
ADD COLUMN     "dailyRate" INTEGER NOT NULL,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "freelancerId" TEXT NOT NULL,
ADD COLUMN     "matchScore" INTEGER NOT NULL,
ADD COLUMN     "motivation" TEXT,
ADD COLUMN     "portfolio" TEXT[],
ADD COLUMN     "skills" TEXT[],
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Nouveau';

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
