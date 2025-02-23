/*
  Warnings:

  - You are about to drop the column `roleId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roleId",
ADD COLUMN     "role" "RoleEnum" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Role";

-- DropEnum
DROP TYPE "UserRoleEnum";
