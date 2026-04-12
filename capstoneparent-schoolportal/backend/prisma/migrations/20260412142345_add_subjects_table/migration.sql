-- AlterTable
ALTER TABLE "learning_materials" ADD COLUMN     "subject_id" INTEGER;

-- AlterTable
ALTER TABLE "subject_records" ADD COLUMN     "subject_id" INTEGER;

-- CreateTable
CREATE TABLE "subjects" (
    "subject_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("subject_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE INDEX "learning_materials_subject_id_idx" ON "learning_materials"("subject_id");

-- CreateIndex
CREATE INDEX "subject_records_subject_id_idx" ON "subject_records"("subject_id");

-- AddForeignKey
ALTER TABLE "subject_records" ADD CONSTRAINT "subject_records_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_materials" ADD CONSTRAINT "learning_materials_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE SET NULL ON UPDATE CASCADE;
