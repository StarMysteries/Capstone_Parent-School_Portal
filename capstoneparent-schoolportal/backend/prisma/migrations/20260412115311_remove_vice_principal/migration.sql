/*
  Warnings:

  - The values [Vice_Principal] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('Parent', 'Librarian', 'Teacher', 'Admin', 'Principal');
ALTER TABLE "user_roles" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "subject_records" DROP CONSTRAINT "subject_records_subject_teacher_fkey";

-- CreateTable
CREATE TABLE "user_password_reset_tokens" (
    "prt_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" CHAR(64) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_password_reset_tokens_pkey" PRIMARY KEY ("prt_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_password_reset_tokens_token_key" ON "user_password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "user_password_reset_tokens_token_idx" ON "user_password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "announcement_files_announcement_id_idx" ON "announcement_files"("announcement_id");

-- CreateIndex
CREATE INDEX "announcement_files_file_id_idx" ON "announcement_files"("file_id");

-- CreateIndex
CREATE INDEX "announcements_announced_by_created_at_idx" ON "announcements"("announced_by", "created_at");

-- CreateIndex
CREATE INDEX "attendance_records_student_id_month_idx" ON "attendance_records"("student_id", "month");

-- CreateIndex
CREATE INDEX "class_list_subject_records_clist_id_idx" ON "class_list_subject_records"("clist_id");

-- CreateIndex
CREATE INDEX "class_list_subject_records_srecord_id_idx" ON "class_list_subject_records"("srecord_id");

-- CreateIndex
CREATE INDEX "class_lists_class_adviser_syear_start_idx" ON "class_lists"("class_adviser", "syear_start");

-- CreateIndex
CREATE INDEX "class_lists_gl_id_section_id_syear_start_idx" ON "class_lists"("gl_id", "section_id", "syear_start");

-- CreateIndex
CREATE INDEX "class_lists_section_id_idx" ON "class_lists"("section_id");

-- CreateIndex
CREATE INDEX "events_created_by_idx" ON "events"("created_by");

-- CreateIndex
CREATE INDEX "events_event_date_idx" ON "events"("event_date");

-- CreateIndex
CREATE INDEX "files_uploaded_by_idx" ON "files"("uploaded_by");

-- CreateIndex
CREATE INDEX "learning_materials_item_type_category_id_gl_id_idx" ON "learning_materials"("item_type", "category_id", "gl_id");

-- CreateIndex
CREATE INDEX "learning_materials_uploaded_by_idx" ON "learning_materials"("uploaded_by");

-- CreateIndex
CREATE INDEX "material_borrow_records_copy_id_idx" ON "material_borrow_records"("copy_id");

-- CreateIndex
CREATE INDEX "material_borrow_records_student_id_idx" ON "material_borrow_records"("student_id");

-- CreateIndex
CREATE INDEX "material_borrow_records_user_id_idx" ON "material_borrow_records"("user_id");

-- CreateIndex
CREATE INDEX "material_borrow_records_returned_at_due_at_idx" ON "material_borrow_records"("returned_at", "due_at");

-- CreateIndex
CREATE INDEX "material_copies_item_id_idx" ON "material_copies"("item_id");

-- CreateIndex
CREATE INDEX "material_copies_copy_code_idx" ON "material_copies"("copy_code");

-- CreateIndex
CREATE INDEX "org_charts_school_year_idx" ON "org_charts"("school_year");

-- CreateIndex
CREATE INDEX "org_charts_uploaded_by_idx" ON "org_charts"("uploaded_by");

-- CreateIndex
CREATE INDEX "page_sections_content_type_updated_at_idx" ON "page_sections"("content_type", "updated_at");

-- CreateIndex
CREATE INDEX "page_sections_content_type_start_year_idx" ON "page_sections"("content_type", "start_year");

-- CreateIndex
CREATE INDEX "parent_child_files_pr_id_idx" ON "parent_child_files"("pr_id");

-- CreateIndex
CREATE INDEX "parent_child_files_file_id_idx" ON "parent_child_files"("file_id");

-- CreateIndex
CREATE INDEX "parent_registration_students_pr_id_idx" ON "parent_registration_students"("pr_id");

-- CreateIndex
CREATE INDEX "parent_registration_students_student_id_idx" ON "parent_registration_students"("student_id");

-- CreateIndex
CREATE INDEX "parent_registrations_parent_id_status_idx" ON "parent_registrations"("parent_id", "status");

-- CreateIndex
CREATE INDEX "parent_registrations_verified_by_idx" ON "parent_registrations"("verified_by");

-- CreateIndex
CREATE INDEX "students_status_gl_id_syear_start_idx" ON "students"("status", "gl_id", "syear_start");

-- CreateIndex
CREATE INDEX "students_created_at_idx" ON "students"("created_at");

-- CreateIndex
CREATE INDEX "subject_record_students_student_id_idx" ON "subject_record_students"("student_id");

-- CreateIndex
CREATE INDEX "subject_records_subject_teacher_idx" ON "subject_records"("subject_teacher");

-- CreateIndex
CREATE INDEX "user_roles_user_id_idx" ON "user_roles"("user_id");

-- AddForeignKey
ALTER TABLE "user_password_reset_tokens" ADD CONSTRAINT "user_password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_records" ADD CONSTRAINT "subject_records_subject_teacher_fkey" FOREIGN KEY ("subject_teacher") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
