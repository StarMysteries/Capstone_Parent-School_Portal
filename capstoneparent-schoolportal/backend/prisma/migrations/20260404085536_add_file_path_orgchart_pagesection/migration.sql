-- AlterTable
ALTER TABLE "org_charts" ADD COLUMN     "file_name" TEXT,
ADD COLUMN     "file_path" TEXT;

-- AlterTable
ALTER TABLE "page_sections" ADD COLUMN     "file_name" TEXT;
