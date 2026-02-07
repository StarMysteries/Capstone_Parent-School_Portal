import { NavbarTeacher } from "@/components/teacher/NavbarTeacher";
import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClassData } from '@/Pages/teacher-pages/hooks/useClassData';
import type { ClassItem, SubjectItem } from '@/Pages/teacher-pages/types';

export const ClassList = () => {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const [activeTab, setActiveTab] = useState('class');
  const [studentListTab, setStudentListTab] = useState('students');
  
  // Class filters
  const [classGradeLevel, setClassGradeLevel] = useState('allgrades');
  const [classSection, setClassSection] = useState('all');
  const [classYear, setClassYear] = useState('all');
  
  // Subject filters
  const [subjectGradeLevel, setSubjectGradeLevel] = useState('allgrades');
  const [subjectSection, setSubjectSection] = useState('all');
  const [subjectYear, setSubjectYear] = useState('all');
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('');

  // Student filters
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [remarksFilter, setRemarksFilter] = useState('all');

  // Use custom hook for data management
  const {
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
  } = useClassData();

  // Apply filters
  const filteredClasses = useMemo(
    () => filterClasses(classes, classGradeLevel, classSection, classYear),
    [classes, classGradeLevel, classSection, classYear]
  );

  const filteredSubjects = useMemo(
    () => filterSubjects(subjects, subjectSearchQuery, subjectGradeLevel, subjectSection, subjectYear),
    [subjects, subjectSearchQuery, subjectGradeLevel, subjectSection, subjectYear]
  );

  const studentsForSelectedClass = useMemo(
    () => selectedClass ? getStudentsForClass(allStudents, selectedClass.id) : [],
    [selectedClass, allStudents]
  );

  const filteredStudents = useMemo(
    () => filterStudents(studentsForSelectedClass, studentSearchQuery, remarksFilter),
    [studentsForSelectedClass, studentSearchQuery, remarksFilter]
  );

  const isDetailView = selectedClass !== null || selectedSubject !== null;

  return (
    <div>
      <NavbarTeacher/>

      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] mt-5 overflow-hidden">
        {/* LEFT PANEL */}
        <div className={`
            bg-(--div-bg) flex flex-col
            w-full md:w-[500px] 
            ${isDetailView ? 'hidden md:flex' : 'flex'}
        `}>
          <Tabs 
            defaultValue="class" 
            className="w-full h-full flex flex-col"
            onValueChange={(value) => setActiveTab(value)}
          >
             <TabsList className="w-full rounded-none bg-white p-0">
               <TabsTrigger value="class" className="flex-1 rounded-none data-[state=active]:bg-(--div-bg)">
                 Class List
               </TabsTrigger>
               <TabsTrigger value="subject" className="flex-1 rounded-none data-[state=active]:bg-(--div-bg)">
                 Subject List
               </TabsTrigger>
             </TabsList>

             {/* CLASS TAB CONTENT */}
             <TabsContent value="class" className="flex-1 p-4 space-y-4 mt-0 overflow-y-auto">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex gap-2">
                     <Select value={classGradeLevel} onValueChange={setClassGradeLevel}>
                      <SelectTrigger className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectValue placeholder="Grade Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectItem value="allgrades">All Grade Levels</SelectItem>
                        <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                        <SelectItem value="Grade 1">Grade 1</SelectItem>
                        <SelectItem value="Grade 2">Grade 2</SelectItem>
                        <SelectItem value="Grade 3">Grade 3</SelectItem>
                        <SelectItem value="Grade 4">Grade 4</SelectItem>
                        <SelectItem value="Grade 5">Grade 5</SelectItem>
                        <SelectItem value="Grade 6">Grade 6</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={classSection} onValueChange={setClassSection}>
                      <SelectTrigger className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectValue placeholder="Section" />
                      </SelectTrigger>
                      <SelectContent className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectItem value="all">All Sections</SelectItem>
                        <SelectItem value="a">Section A</SelectItem>
                        <SelectItem value="b">Section B</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={classYear} onValueChange={setClassYear}>
                      <SelectTrigger className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="2024-2025">2024 - 2025</SelectItem>
                        <SelectItem value="2023-2024">2023 - 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Class List */}
                <div className="space-y-2 pb-20">
                  {isLoadingClasses ? (
                    <div className="text-center py-8 text-gray-500">Loading classes...</div>
                  ) : filteredClasses.length > 0 ? (
                    filteredClasses.map((classItem) => (
                      <Card
                        key={classItem.id}
                        className={`group p-4 cursor-pointer transition-colors bg-white border-none hover:bg-(--status-active) hover:text-white ${
                          selectedClass?.id === classItem.id ? 'text-white bg-(--status-active)' : ''
                        }`}
                        onClick={() => {
                          setSelectedClass(classItem);
                          setRemarksFilter('all');
                          setStudentSearchQuery('');
                        }}
                      >
                         <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-base">{classItem.grade} - {classItem.section}</h3>
                              <p className={`text-sm transition-colors ${selectedClass?.id === classItem.id ? 'text-(--tab-subtext)' : 'text-gray-500 group-hover:text-(--tab-subtext)'}`}>
                                {classItem.start_year} - {classItem.end_year}
                              </p>
                            </div>
                            {/* DYNAMIC STUDENT COUNT */}
                            <span className="font-medium">
                              {studentCountByClass[classItem.id] || 0} Students
                            </span>
                         </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">No classes found matching your criteria</div>
                  )}
                </div>
             </TabsContent>

             {/* SUBJECT TAB CONTENT */}
             <TabsContent value="subject" className="flex-1 p-4 space-y-4 mt-0 overflow-y-auto">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search subjects..."
                      value={subjectSearchQuery}
                      onChange={(e) => setSubjectSearchQuery(e.target.value)}
                      className="pl-10 bg-white border-gray-300"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select value={subjectGradeLevel} onValueChange={setSubjectGradeLevel}>
                      <SelectTrigger className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectValue placeholder="Grade Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectItem value="allgrades">All Grade Levels</SelectItem>
                        <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                        <SelectItem value="Grade 1">Grade 1</SelectItem>
                        <SelectItem value="Grade 2">Grade 2</SelectItem>
                        <SelectItem value="Grade 3">Grade 3</SelectItem>
                        <SelectItem value="Grade 4">Grade 4</SelectItem>
                        <SelectItem value="Grade 5">Grade 5</SelectItem>
                        <SelectItem value="Grade 6">Grade 6</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={subjectSection} onValueChange={setSubjectSection}>
                      <SelectTrigger className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectValue placeholder="Section" />
                      </SelectTrigger>
                      <SelectContent className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectItem value="all">All Sections</SelectItem>
                        <SelectItem value="a">Section A</SelectItem>
                        <SelectItem value="b">Section B</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={subjectYear} onValueChange={setSubjectYear}>
                      <SelectTrigger className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-(--navbar-bg) border-none font-semibold">
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="2024-2025">2024 - 2025</SelectItem>
                        <SelectItem value="2023-2024">2023 - 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  {isLoadingSubjects ? (
                    <div className="text-center py-8 text-gray-500">Loading subjects...</div>
                  ) : filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subjectItem) => (
                      <Card
                        key={subjectItem.id}
                        className={`group p-4 cursor-pointer transition-colors bg-white border-none hover:bg-(--status-active) hover:text-white ${
                          selectedSubject?.id === subjectItem.id ? 'text-white bg-(--status-active)' : ''
                        }`}
                        onClick={() => setSelectedSubject(subjectItem)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-base">
                              {subjectItem.name}
                            </h3>
                            <p className={`text-sm transition-colors ${
                              selectedSubject?.id === subjectItem.id 
                                ? 'text-(--tab-subtext)' 
                                : 'text-gray-500 group-hover:text-(--tab-subtext)'
                            }`}>
                              {subjectItem.grade} - {subjectItem.section}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm transition-colors ${
                              selectedSubject?.id === subjectItem.id 
                                ? 'text-(--tab-subtext)' 
                                : 'text-gray-500 group-hover:text-(--tab-subtext)'
                            }`}>
                              {subjectItem.start_year} - {subjectItem.end_year}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No subjects found matching your criteria
                    </div>
                  )}
                </div>
             </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT PANEL */}
        <div className={`
            bg-(--div-bg) h-full overflow-hidden flex flex-col
            w-full md:flex-1
            ${isDetailView ? 'flex' : 'hidden md:flex'}
        `}>
          {activeTab === 'class' && (
            selectedClass ? (
              <div className="h-full flex flex-col w-full">
                <Tabs 
                  defaultValue="students" 
                  className="w-full h-full flex flex-col"
                  onValueChange={(value) => setStudentListTab(value)}
                >
                  <TabsList className="w-full rounded-none bg-white p-0">
                    <TabsTrigger value="students" className="flex-1 rounded-none data-[state=active]:bg-(--div-bg)">
                      Student List
                    </TabsTrigger>
                    <TabsTrigger value="summary" className="flex-1 rounded-none data-[state=active]:bg-(--div-bg)">
                      Class Summary
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="students" className="flex-1 p-4 md:p-6 space-y-4 mt-0 overflow-y-auto">
                    
                    <div className="flex gap-3 flex-wrap items-center justify-center md:justify-start">
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedClass(null);
                          setRemarksFilter('all');
                          setStudentSearchQuery('');
                        }}
                      >
                        &lt;-----
                      </Button>
                      
                      <div className="relative flex-1 md:flex-none w-full md:max-w-md min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Search LRN or student name..."
                          value={studentSearchQuery}
                          onChange={(e) => setStudentSearchQuery(e.target.value)}
                          className="pl-10 bg-white border-none"
                        />
                      </div>

                      <Select value={remarksFilter} onValueChange={setRemarksFilter}>
                        <SelectTrigger className="bg-(--navbar-bg) border-none font-semibold w-[150px]">
                          <SelectValue placeholder="Remarks" />
                        </SelectTrigger>
                        <SelectContent className="bg-(--navbar-bg) border-none font-semibold w-[150px]">
                          <SelectItem value="all">All Remarks</SelectItem>
                          <SelectItem value="PASSED">Passed</SelectItem>
                          <SelectItem value="FAILED">Failed</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Grade Sheet (.xlsx)
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Download className="mr-2 h-4 w-4" />
                        Export Quarterly Grade Sheet (.xlsx)
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Download className="mr-2 h-4 w-4" />
                        Download Grade Sheet Template (.xlsx)
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Class Schedule Picture
                      </Button>
                    </div>

                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                           <thead className="bg-gray-100">
                            <tr>
                              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                                Student Name
                              </th>
                              <th className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                                LRN
                              </th>
                              <th className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                                Final Avg Grade
                              </th>
                              <th className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                                Remarks
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {isLoadingStudents ? (
                              <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                  Loading students...
                                </td>
                              </tr>
                            ) : filteredStudents.length > 0 ? (
                              filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
                                    {student.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                    {student.lrn}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                    {student.finalAvgGrade}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <span className={`font-semibold ${
                                      student.remarks === 'PASSED' 
                                        ? 'text-green-600' 
                                        : student.remarks === 'FAILED' 
                                        ? 'text-red-600' 
                                        : 'text-gray-500'
                                    }`}>
                                      {student.remarks}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                  No students found for this class
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="summary" className="flex-1 p-6">
                    <div className="text-center text-gray-500">
                      <p>Class summary content will be displayed here</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-lg text-center px-4">
                  Please select a class from the left panel to view students
                </p>
              </div>
            )
          )}

          {activeTab === 'subject' && (
            selectedSubject ? (
              <div className="p-8 w-full">
                <Button 
                   className="md:hidden mb-4 bg-green-600 hover:bg-green-700 text-white"
                   onClick={() => setSelectedSubject(null)}
                >
                   &lt;----- Back
                </Button>

                <h2 className="text-2xl font-bold mb-4">{selectedSubject.name}</h2>
                <p className="text-gray-600 mb-2">
                  {selectedSubject.grade} - {selectedSubject.section}
                </p>
                <div className="mt-6">
                  <p className="text-gray-500">Subject details will appear here...</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-lg text-center px-4">
                  Please select a subject from the left panel to view details
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};