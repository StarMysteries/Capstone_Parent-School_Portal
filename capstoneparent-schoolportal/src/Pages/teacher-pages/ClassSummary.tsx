import { useMemo } from 'react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer 
} from 'recharts';
import type { ClassSummaryProps, QuarterGrades } from '@/Pages/teacher-pages/types';

export const ClassSummary = ({ students = [] }: ClassSummaryProps) => {
  
  const quarterlyStats = useMemo(() => {
    // 1. Define the keys as a const array to help TypeScript inference
    const quarterKeys = ['q1', 'q2', 'q3', 'q4'] as const;
    
    return quarterKeys.map((qKey) => {
      // 2. Filter students who have data for this specific quarter
      const gradedStudents = students.filter(s => s.quarters?.[qKey]);
      const totalGraded = gradedStudents.length;

      // 3. Access 'passed' safely by telling TS the shape of the data
      const passedCount = gradedStudents.filter((s) => {
        const quarterData = s.quarters?.[qKey] as QuarterGrades;
        return quarterData.passed === true;
      }).length;

      const rate = totalGraded > 0 ? Math.round((passedCount / totalGraded) * 100) : 0;

      // Determine color based on data presence and rate
      let color = '#9CA3AF'; // Gray for N/A
      if (totalGraded > 0) {
        if (rate >= 75) color = '#4DA660';      
        else if (rate >= 50) color = '#F59E0B'; 
        else color = '#dc2626';                
      }

      return {
        quarter: qKey.toUpperCase(),
        passingRate: rate,
        totalStudents: students.length,
        passedStudents: passedCount,
        color,
      };
    });
  }, [students]);

  const subjectAverages = useMemo(() => {
    const subjectTotals: Record<string, { sum: number; count: number }> = {};

    students.forEach((student) => {
      if (!student.quarters) return;

      // Iterate through each quarter (q1, q2, etc.)
      Object.values(student.quarters).forEach((quarterData) => {
        if (!quarterData?.subjects) return;

        // Iterate through subjects defined in your QuarterGrades interface
        Object.entries(quarterData.subjects).forEach(([subject, grade]) => {
          if (typeof grade === 'number') {
            if (!subjectTotals[subject]) {
              subjectTotals[subject] = { sum: 0, count: 0 };
            }
            subjectTotals[subject].sum += grade;
            subjectTotals[subject].count += 1;
          }
        });
      });
    });

    const result = Object.entries(subjectTotals).map(([subject, data]) => ({
      subject,
      average: Math.round(data.sum / data.count),
      fullMark: 100,
    }));

    return result.length > 0 ? result : [
      { subject: 'No Data', average: 0, fullMark: 100 }
    ];
  }, [students]);

  return (
    <div className="p-6 space-y-8">
      {/* Passing Rate per Quarter */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">Passing Rate per Quarter</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {quarterlyStats.map((stat) => (
            <div key={stat.quarter} className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                {/* Circular Progress */}
                <svg className="w-32 h-32 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={stat.color}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${
                      stat.passedStudents === 0 && stat.passingRate === 0 
                      ? 2 * Math.PI * 56 // Full offset (empty) if no data
                      : 2 * Math.PI * 56 * (1 - stat.passingRate / 100)
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span 
                    className="text-3xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.passingRate === 0 && stat.passedStudents === 0 ? 'N/A' : `${stat.passingRate}%`}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {stat.quarter}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Average Grades per Subject */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">Average Grades per Subject</h2>
        <div className="flex justify-center h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectAverages}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fill: '#6B7280', fontSize: 10 }}
              />
              <Radar
                name="Average Grade"
                dataKey="average"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Overall Passed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {students.filter(s => s.remarks === 'PASSED').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Overall Failed</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {students.filter(s => s.remarks === 'FAILED').length}
          </p>
        </div>
      </div>
    </div>
  );
};