/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availability" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "companyDescription" TEXT,
ADD COLUMN     "companyLogo" TEXT,
ADD COLUMN     "companySector" TEXT,
ADD COLUMN     "companySize" TEXT,
ADD COLUMN     "companyWebsite" TEXT,
ADD COLUMN     "dailyRate" INTEGER,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "notificationsApplications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notificationsMarketing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notificationsNewMissions" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "portfolio" TEXT[],
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "website" TEXT;
