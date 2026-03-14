const API_BASE_URL = '/api';

// Download functions - ALL DEFAULT TO CSV
export const downloadGradeSheetTemplate = async (fileType: 'csv' = 'csv') => {
  try {
    const response = await fetch(`${API_BASE_URL}/templates/grade-sheet?format=${fileType}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Failed to download template');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grade-sheet-template.${fileType}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading template:', error);
    throw error;
  }
};

// UPDATED: Export all quarters
export const exportAllQuartersGradeSheet = async (
  classId: number,
  fileType: 'csv' = 'csv'
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/classes/${classId}/export-grades-all-quarters?format=${fileType}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) throw new Error('Failed to export grade sheet');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class-${classId}-all-quarters-grades.${fileType}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error exporting grade sheet:', error);
    throw error;
  }
};

export const downloadStudentListTemplate = async (fileType: 'csv' = 'csv') => {
  try {
    const response = await fetch(`${API_BASE_URL}/templates/student-list?format=${fileType}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Failed to download template');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-list-template.${fileType}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading template:', error);
    throw error;
  }
};

// Upload functions - UNCHANGED (accept File object)
export const uploadGradeSheet = async (classId: number, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/classes/${classId}/import-grades`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload grade sheet');

    return await response.json();
  } catch (error) {
    console.error('Error uploading grade sheet:', error);
    throw error;
  }
};

export const uploadClassSchedulePicture = async (classId: number, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/classes/${classId}/upload-schedule`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload class schedule');

    return await response.json();
  } catch (error) {
    console.error('Error uploading class schedule:', error);
    throw error;
  }
};

export const uploadSubjectGradeSheet = async (subjectId: number, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/import-grades`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload grade sheet');

    return await response.json();
  } catch (error) {
    console.error('Error uploading grade sheet:', error);
    throw error;
  }
};