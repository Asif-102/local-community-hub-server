/*
  Warnings:

  - The `name` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_UserRoles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRoleEnum" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_B_fkey";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "name",
ADD COLUMN     "name" "UserRoleEnum" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roleId" INTEGER;

-- DropTable
DROP TABLE "_UserRoles";

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
