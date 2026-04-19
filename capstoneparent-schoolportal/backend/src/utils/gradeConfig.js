const { generateGrade1To6ReportCard, generateKindergartenReportCard } = require('./reportCardGenerator');

const GRADE_GENERATORS = {
  'Kindergarten': generateKindergartenReportCard,
  'Grade 1':      generateGrade1To6ReportCard,
  'Grade 2':      generateGrade1To6ReportCard,
  'Grade 3':      generateGrade1To6ReportCard,
  'Grade 4':      generateGrade1To6ReportCard,
  'Grade 5':      generateGrade1To6ReportCard,
  'Grade 6':      generateGrade1To6ReportCard,
};

const generateReportCard = (gradeLevel) => GRADE_GENERATORS[gradeLevel] ?? null;

module.exports = { generateReportCard };