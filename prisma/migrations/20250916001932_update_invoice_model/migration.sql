/*
  Warnings:

  - You are about to drop the column `userId` on the `Invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceNumber]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `freelancerId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNumber` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_userId_fkey";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "userId",
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "contractId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "freelancerId" TEXT NOT NULL,
ADD COLUMN     "invoiceNumber" TEXT NOT NULL,
ADD COLUMN     "missionId" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "taxAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.20,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
