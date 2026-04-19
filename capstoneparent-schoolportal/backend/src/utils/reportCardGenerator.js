const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs   = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '../../templates');
const PH = 612; // landscape Letter height in points

// ── Attendance: month column x-centers (from structure analysis) ────────────
const ATT_COL_CENTERS = {
  Jun: 68, Jul: 94, Aug: 116, Sept: 145, Oct: 171,
  Nov: 196, Dec: 220, Jan: 245, Feb: 270, Mar: 296,
};
const ATT_TOTAL_X = 322;

// Attendance data row y-centers (pdf coords, y=0 at bottom)
// Row boundaries from structure: 100-137, 137-169, 169-205
const ATT_ROW_Y = {
  school_days:  PH - 118,  // row center top=(100+137)/2=118
  days_present: PH - 153,  // row center top=(137+169)/2=153
  days_absent:  PH - 187,  // row center top=(169+205)/2=187
};

// ── Grade table column x-positions (page 2, from structure) ────────────────
const GRADE_COL_X = {
  subject: 38,   // left-aligned
  q1:      191,
  q2:      215,
  q3:      238,
  q4:      261,
  final:   290,
  remarks: 333,
};
// First subject data row: header ends at top≈97, first row center at top≈109
const GRADE_FIRST_ROW_Y = PH - 109;  // 503pt
const GRADE_ROW_H       = 25;
// General Average row center: top=413, height≈30 → center=428
const GRADE_GEN_AVG_Y   = PH - 428;  // 184pt

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function makeDraw(page, helvetica, helveticaBold) {
  return (text, x, y, size, bold = false) => {
    if (text === null || text === undefined || text === '') return;
    page.drawText(String(text), {
      x, y, size,
      font:  bold ? helveticaBold : helvetica,
      color: rgb(0, 0, 0),
    });
  };
}

function centeredX(text, centerX, font, size) {
  return centerX - font.widthOfTextAtSize(text, size) / 2;
}

function buildAttendanceMap(attendanceRecords = []) {
  const map = {};
  attendanceRecords.forEach(r => { if (r?.month) map[r.month] = r; });
  return map;
}

// ─────────────────────────────────────────────────────────────────────────────
// Grades 1–6
// ─────────────────────────────────────────────────────────────────────────────
async function generateGrade1To6ReportCard({ student, classInfo }) {
  const gradeLevel    = classInfo?.grade_level  ?? student.grade_level?.grade_level ?? '';
  const sectionName   = classInfo?.section_name ?? student.section_name ?? '';
  const schoolYear    = classInfo?.syear_start && classInfo?.syear_end
    ? `${classInfo.syear_start} - ${classInfo.syear_end}` : '';
  const adviserName   = classInfo?.adviser_name   ?? '';
  const principalName = classInfo?.principal_name ?? '';

  const sexDisplay = (student.sex === 'M' || student.sex === 'Male') ? 'MALE' : 'FEMALE';
  const gradeDisplay = String(gradeLevel).replace(/\D/g, '');

  // Build sorted subjects — exclude rows where avg_grade is null OR 0
  // (0 = DB default for ungraded, not a real grade in Philippine schools)
  const subjects = (student.subject_records ?? [])
    .map(r => ({
      name:    (r.subject_record?.subject_name ?? r.subject_name ?? '').toUpperCase(),
      q1:      r.q1_grade  != null ? r.q1_grade  : '',
      q2:      r.q2_grade  != null ? r.q2_grade  : '',
      q3:      r.q3_grade  != null ? r.q3_grade  : '',
      q4:      r.q4_grade  != null ? r.q4_grade  : '',
      avg:     r.avg_grade != null ? r.avg_grade  : '',
      remarks: r.remarks === 'PASSED' ? 'PASSED'
             : r.remarks === 'FAILED' ? 'FAILED' : '',
    }))
    .filter(r => r.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  // General average — only from subjects with a real (non-zero) avg grade
  const gradedAvgs = subjects
    .map(s => Number(s.avg))
    .filter(g => Number.isFinite(g) && g > 0);

  const genAvg = student.finalAvgGrade != null && student.finalAvgGrade > 0
    ? student.finalAvgGrade
    : gradedAvgs.length > 0
      ? Math.round(gradedAvgs.reduce((a, b) => a + b, 0) / gradedAvgs.length * 100) / 100
      : '';
  const genRemarks = gradedAvgs.length > 0
    ? (gradedAvgs.every(g => g >= 75) ? 'PASSED' : 'FAILED')
    : '';

  // Attendance
  const attMap = buildAttendanceMap(student.attendance_records);

  // Load template (Grades 3–6 reuse Grade 1–2 template per your spec)
  const templateBytes = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'Grade1-2_ReportCard(Size-Letter).pdf')
  );
  const pdfDoc = await PDFDocument.load(templateBytes);
  const helvetica     = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const [page1, page2] = pdfDoc.getPages();

  const d1 = makeDraw(page1, helvetica, helveticaBold);
  const d2 = makeDraw(page2, helvetica, helveticaBold);

  // ── PAGE 1 ────────────────────────────────────────────────────────────────

  // School Year
  d1(schoolYear, 590, PH - 192, 9);

  // Name
  d1(`${student.lname.toUpperCase()}, ${student.fname.toUpperCase()}`, 490, PH - 219, 10, true);

  // Sex
  d1(sexDisplay, 650, PH - 235, 9);

  // Grade / Section / LRN
  d1(gradeDisplay,               490,  PH - 247, 8);
  d1(sectionName.toUpperCase(),  567,  PH - 247, 8);
  d1(String(student.lrn_number), 683,  PH - 247, 8);

  // Principal name
  if (principalName) {
    const pnW = helveticaBold.widthOfTextAtSize(principalName.toUpperCase(), 8);
    d1(principalName.toUpperCase(), 469 + (110 - pnW) / 2, PH - 380, 8, true);
  }

  // Teacher name
  if (adviserName) {
    const tnW = helveticaBold.widthOfTextAtSize(adviserName.toUpperCase(), 8);
    d1(adviserName.toUpperCase(), 622 + (130 - tnW) / 2, PH - 370, 8, true);
    // Certificate of Transfer Teacher name
    d1(adviserName.toUpperCase(), 628 + (130 - tnW) / 2, PH - 501, 8, true);
  }

  // Attendance values
  const attRowKeys = [
    { key: 'school_days',  y: ATT_ROW_Y.school_days  },
    { key: 'days_present', y: ATT_ROW_Y.days_present },
    { key: 'days_absent',  y: ATT_ROW_Y.days_absent  },
  ];
  Object.entries(ATT_COL_CENTERS).forEach(([month, cx]) => {
    const rec = attMap[month];
    if (!rec) return;
    attRowKeys.forEach(({ key, y }) => {
      const val = rec[key];
      if (val != null && val !== '') {
        const str = String(val);
        const xc  = centeredX(str, cx, helvetica, 8);
        d1(str, xc, y, 8);
      }
    });
  });

  // Attendance totals
  const totals = {
    school_days:  Object.keys(ATT_COL_CENTERS).reduce((s, m) => s + Number(attMap[m]?.school_days  ?? 0), 0),
    days_present: Object.keys(ATT_COL_CENTERS).reduce((s, m) => s + Number(attMap[m]?.days_present ?? 0), 0),
    days_absent:  Object.keys(ATT_COL_CENTERS).reduce((s, m) => s + Number(attMap[m]?.days_absent  ?? 0), 0),
  };
  attRowKeys.forEach(({ key, y }) => {
    const str = String(totals[key]);
    d1(str, centeredX(str, ATT_TOTAL_X, helvetica, 8), y, 8);
  });

  // ── PAGE 2 ────────────────────────────────────────────────────────────────

  subjects.forEach((subj, i) => {
    const y = GRADE_FIRST_ROW_Y - i * GRADE_ROW_H;
    d2(subj.name, GRADE_COL_X.subject, y, 7.5);
    if (subj.q1 !== '') d2(String(subj.q1), centeredX(String(subj.q1), GRADE_COL_X.q1, helvetica, 8), y, 8);
    if (subj.q2 !== '') d2(String(subj.q2), centeredX(String(subj.q2), GRADE_COL_X.q2, helvetica, 8), y, 8);
    if (subj.q3 !== '') d2(String(subj.q3), centeredX(String(subj.q3), GRADE_COL_X.q3, helvetica, 8), y, 8);
    if (subj.q4 !== '') d2(String(subj.q4), centeredX(String(subj.q4), GRADE_COL_X.q4, helvetica, 8), y, 8);
    if (subj.avg !== '') d2(String(subj.avg), centeredX(String(subj.avg), GRADE_COL_X.final, helvetica, 8), y, 8);
    if (subj.remarks)   d2(subj.remarks, GRADE_COL_X.remarks, y, 8);
  });

  if (genAvg !== '') d2(String(genAvg), centeredX(String(genAvg), GRADE_COL_X.final, helvetica, 8), GRADE_GEN_AVG_Y, 8);
  if (genRemarks)    d2(genRemarks, GRADE_COL_X.remarks, GRADE_GEN_AVG_Y, 8);

  return await pdfDoc.save();
}

// ─────────────────────────────────────────────────────────────────────────────
// Kindergarten
// ─────────────────────────────────────────────────────────────────────────────
async function generateKindergartenReportCard({ student, classInfo }) {
  const sectionName   = classInfo?.section_name   ?? student.section_name ?? '';
  const schoolYear    = classInfo?.syear_start && classInfo?.syear_end
    ? `${classInfo.syear_start} - ${classInfo.syear_end}` : '';
  const principalName = classInfo?.principal_name ?? '';
  const adviserName   = classInfo?.adviser_name   ?? '';

  const templateBytes = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'Kindergarten_ReportCard(Size-Letter).pdf')
  );
  const pdfDoc = await PDFDocument.load(templateBytes);
  const helvetica     = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const [page1] = pdfDoc.getPages();

  const d1 = makeDraw(page1, helvetica, helveticaBold);

  // SY (structure_top=157)
  d1(schoolYear, 556, PH - 161, 9, true);

  // Name (structure_top=227)
  d1(`${student.lname.toUpperCase()}, ${student.fname.toUpperCase()}`, 449, PH - 231, 9, true);

  // Section (structure_top=240)
  d1(sectionName.toUpperCase(), 455, PH - 244, 9, true);

  // LRN (structure_top=254)
  d1(String(student.lrn_number), 440, PH - 258, 9, true);

  // Principal and Teacher/Adviser (signature lines at top=509)
  if (principalName) d1(principalName.toUpperCase(), 418, PH - 509, 9, true);
  if (adviserName)   d1(adviserName.toUpperCase(),   638, PH - 509, 9, true);

  return await pdfDoc.save();
}

module.exports = { generateGrade1To6ReportCard, generateKindergartenReportCard };