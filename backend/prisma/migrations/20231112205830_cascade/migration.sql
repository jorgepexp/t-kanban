-- DropForeignKey
ALTER TABLE "TaskState" DROP CONSTRAINT "TaskState_projectId_fkey";

-- AddForeignKey
ALTER TABLE "TaskState" ADD CONSTRAINT "TaskState_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
