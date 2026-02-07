import { useState, useEffect, useMemo } from 'react';
import type { ClassItem, SubjectItem, Student } from '@/Pages/teacher-pages/types';
import { fetchClasses, fetchSubjects, fetchStudents } from '@/Pages/teacher-pages/services/api';
import {
  filterClasses,
  filterSubjects,
  filterStudents,
  getStudentCountByClass,
  getStudentsForClass,
} from '@/Pages/teacher-pages/utils/filters';

export const useClassData = () => {
  // Loading states
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // Data
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  // Load data on mount
  useEffect(() => {
    loadClasses();
    loadSubjects();
    loadStudents();
  }, []);

  const loadClasses = async () => {
    setIsLoadingClasses(true);
    const data = await fetchClasses();
    setClasses(data);
    setIsLoadingClasses(false);
  };

  const loadSubjects = async () => {
    setIsLoadingSubjects(true);
    const data = await fetchSubjects();
    setSubjects(data);
    setIsLoadingSubjects(false);
  };

  const loadStudents = async () => {
    setIsLoadingStudents(true);
    const data = await fetchStudents();
    setAllStudents(data);
    setIsLoadingStudents(false);
  };

  // Calculate student counts
  const studentCountByClass = useMemo(
    () => getStudentCountByClass(allStudents),
    [allStudents]
  );

  return {
    classes,
    subjects,
    allStudents,
    isLoadingClasses,
    isLoadingSubjects,
    isLoadingStudents,
    studentCountByClass,
    filterClasses,
    filterSubjects,
    filterStudents,
    getStudentsForClass,
  };
};