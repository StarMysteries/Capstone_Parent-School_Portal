-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Parent', 'Librarian', 'Teacher', 'Admin', 'Principal', 'Vice_Principal');

-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('General', 'Staff_only', 'Memorandum');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ENROLLED', 'GRADUATED', 'TRANSFERRED', 'DROPPED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('VERIFIED', 'PENDING', 'DENIED');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "Month" AS ENUM ('Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr');

-- CreateEnum
CREATE TYPE "SubjectRemarks" AS ENUM ('IN_PROGRESS', 'PASSED', 'FAILED');

-- CreateEnum
CREATE TYPE "MaterialStatus" AS ENUM ('AVAILABLE', 'BORROWED', 'LOST', 'GIVEN');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('Learning_Resource', 'Book');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('mission', 'vision', 'values', 'history', 'contact', 'school_calendar', 'transparency');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "contact_num" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "account_status" "AccountStatus" NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_otp_codes" (
    "otp_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "otp_code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_otp_codes_pkey" PRIMARY KEY ("otp_id")
);

-- CreateTable
CREATE TABLE "user_trusted_devices" (
    "td_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "device_token" CHAR(64) NOT NULL,
    "last_used_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_trusted_devices_pkey" PRIMARY KEY ("td_id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "ur_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("ur_id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "announcement_id" SERIAL NOT NULL,
    "announcement_title" TEXT NOT NULL,
    "announcement_desc" TEXT NOT NULL,
    "announcement_type" "AnnouncementType" NOT NULL,
    "announced_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("announcement_id")
);

-- CreateTable
CREATE TABLE "files" (
    "file_id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" INTEGER NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "announcement_files" (
    "af_id" SERIAL NOT NULL,
    "announcement_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,

    CONSTRAINT "announcement_files_pkey" PRIMARY KEY ("af_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" SERIAL NOT NULL,
    "event_title" TEXT NOT NULL,
    "event_desc" TEXT,
    "event_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "photo_path" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "page_id" SERIAL NOT NULL,
    "content_type" "ContentType" NOT NULL,
    "content" TEXT,
    "file_path" TEXT,
    "start_year" INTEGER,
    "end_year" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("page_id")
);

-- CreateTable
CREATE TABLE "org_charts" (
    "chart_id" SERIAL NOT NULL,
    "school_year" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" INTEGER NOT NULL,

    CONSTRAINT "org_charts_pkey" PRIMARY KEY ("chart_id")
);

-- CreateTable
CREATE TABLE "students" (
    "student_id" SERIAL NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "lrn_number" TEXT NOT NULL,
    "gl_id" INTEGER NOT NULL,
    "syear_start" INTEGER NOT NULL,
    "syear_end" INTEGER NOT NULL,
    "status" "StudentStatus" NOT NULL DEFAULT 'ENROLLED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "parent_registrations" (
    "pr_id" SERIAL NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMP(3),
    "verified_by" INTEGER,

    CONSTRAINT "parent_registrations_pkey" PRIMARY KEY ("pr_id")
);

-- CreateTable
CREATE TABLE "parent_registration_students" (
    "prs_id" SERIAL NOT NULL,
    "pr_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "parent_registration_students_pkey" PRIMARY KEY ("prs_id")
);

-- CreateTable
CREATE TABLE "parent_child_files" (
    "pcf_id" SERIAL NOT NULL,
    "pr_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,

    CONSTRAINT "parent_child_files_pkey" PRIMARY KEY ("pcf_id")
);

-- CreateTable
CREATE TABLE "grade_levels" (
    "gl_id" SERIAL NOT NULL,
    "grade_level" TEXT NOT NULL,

    CONSTRAINT "grade_levels_pkey" PRIMARY KEY ("gl_id")
);

-- CreateTable
CREATE TABLE "sections" (
    "section_id" SERIAL NOT NULL,
    "section_name" TEXT NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "class_lists" (
    "clist_id" SERIAL NOT NULL,
    "gl_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "class_adviser" INTEGER NOT NULL,
    "syear_start" INTEGER NOT NULL,
    "syear_end" INTEGER NOT NULL,
    "class_sched" TEXT,

    CONSTRAINT "class_lists_pkey" PRIMARY KEY ("clist_id")
);

-- CreateTable
CREATE TABLE "subject_records" (
    "srecord_id" SERIAL NOT NULL,
    "subject_name" TEXT NOT NULL,
    "time_start" TIME NOT NULL,
    "time_end" TIME NOT NULL,
    "subject_teacher" INTEGER NOT NULL,

    CONSTRAINT "subject_records_pkey" PRIMARY KEY ("srecord_id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "attendance_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "school_days" INTEGER NOT NULL,
    "days_present" INTEGER NOT NULL,
    "days_absent" INTEGER NOT NULL,
    "month" "Month" NOT NULL,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("attendance_id")
);

-- CreateTable
CREATE TABLE "class_list_subject_records" (
    "clsr_id" SERIAL NOT NULL,
    "clist_id" INTEGER NOT NULL,
    "srecord_id" INTEGER NOT NULL,

    CONSTRAINT "class_list_subject_records_pkey" PRIMARY KEY ("clsr_id")
);

-- CreateTable
CREATE TABLE "subject_record_students" (
    "srs_id" SERIAL NOT NULL,
    "srecord_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "q1_grade" INTEGER,
    "q2_grade" INTEGER,
    "q3_grade" INTEGER,
    "q4_grade" INTEGER,
    "avg_grade" INTEGER,
    "remarks" "SubjectRemarks" NOT NULL DEFAULT 'IN_PROGRESS',

    CONSTRAINT "subject_record_students_pkey" PRIMARY KEY ("srs_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "learning_materials" (
    "item_id" SERIAL NOT NULL,
    "item_name" TEXT NOT NULL,
    "author" TEXT,
    "item_type" "ItemType" NOT NULL,
    "category_id" INTEGER NOT NULL,
    "gl_id" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" INTEGER NOT NULL,

    CONSTRAINT "learning_materials_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "material_copies" (
    "copy_id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "copy_code" INTEGER NOT NULL,
    "status" "MaterialStatus" NOT NULL DEFAULT 'AVAILABLE',
    "condition" TEXT,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "material_copies_pkey" PRIMARY KEY ("copy_id")
);

-- CreateTable
CREATE TABLE "material_borrow_records" (
    "mbr_id" SERIAL NOT NULL,
    "copy_id" INTEGER NOT NULL,
    "student_id" INTEGER,
    "user_id" INTEGER,
    "penalty_cost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "borrowed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_at" TIMESTAMP(3) NOT NULL,
    "returned_at" TIMESTAMP(3),
    "remarks" TEXT,

    CONSTRAINT "material_borrow_records_pkey" PRIMARY KEY ("mbr_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_trusted_devices_device_token_key" ON "user_trusted_devices"("device_token");

-- CreateIndex
CREATE UNIQUE INDEX "students_lrn_number_syear_start_key" ON "students"("lrn_number", "syear_start");

-- AddForeignKey
ALTER TABLE "user_otp_codes" ADD CONSTRAINT "user_otp_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trusted_devices" ADD CONSTRAINT "user_trusted_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_announced_by_fkey" FOREIGN KEY ("announced_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_files" ADD CONSTRAINT "announcement_files_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("announcement_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_files" ADD CONSTRAINT "announcement_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("file_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_charts" ADD CONSTRAINT "org_charts_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_gl_id_fkey" FOREIGN KEY ("gl_id") REFERENCES "grade_levels"("gl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_registrations" ADD CONSTRAINT "parent_registrations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_registrations" ADD CONSTRAINT "parent_registrations_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_registration_students" ADD CONSTRAINT "parent_registration_students_pr_id_fkey" FOREIGN KEY ("pr_id") REFERENCES "parent_registrations"("pr_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_registration_students" ADD CONSTRAINT "parent_registration_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_child_files" ADD CONSTRAINT "parent_child_files_pr_id_fkey" FOREIGN KEY ("pr_id") REFERENCES "parent_registrations"("pr_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_child_files" ADD CONSTRAINT "parent_child_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("file_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_lists" ADD CONSTRAINT "class_lists_gl_id_fkey" FOREIGN KEY ("gl_id") REFERENCES "grade_levels"("gl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_lists" ADD CONSTRAINT "class_lists_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_lists" ADD CONSTRAINT "class_lists_class_adviser_fkey" FOREIGN KEY ("class_adviser") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_records" ADD CONSTRAINT "subject_records_subject_teacher_fkey" FOREIGN KEY ("subject_teacher") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_list_subject_records" ADD CONSTRAINT "class_list_subject_records_clist_id_fkey" FOREIGN KEY ("clist_id") REFERENCES "class_lists"("clist_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_list_subject_records" ADD CONSTRAINT "class_list_subject_records_srecord_id_fkey" FOREIGN KEY ("srecord_id") REFERENCES "subject_records"("srecord_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_record_students" ADD CONSTRAINT "subject_record_students_srecord_id_fkey" FOREIGN KEY ("srecord_id") REFERENCES "subject_records"("srecord_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_record_students" ADD CONSTRAINT "subject_record_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_materials" ADD CONSTRAINT "learning_materials_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_materials" ADD CONSTRAINT "learning_materials_gl_id_fkey" FOREIGN KEY ("gl_id") REFERENCES "grade_levels"("gl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_materials" ADD CONSTRAINT "learning_materials_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_copies" ADD CONSTRAINT "material_copies_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "learning_materials"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_borrow_records" ADD CONSTRAINT "material_borrow_records_copy_id_fkey" FOREIGN KEY ("copy_id") REFERENCES "material_copies"("copy_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_borrow_records" ADD CONSTRAINT "material_borrow_records_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_borrow_records" ADD CONSTRAINT "material_borrow_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
