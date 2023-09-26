/*
  Warnings:

  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "State" DROP CONSTRAINT "State_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_stateId_fkey";

-- DropTable
DROP TABLE "State";

-- CreateTable
CREATE TABLE "TaskState" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "TaskState_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskState" ADD CONSTRAINT "TaskState_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "TaskState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
