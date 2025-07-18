import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ru, enUS, es, de } from 'date-fns/locale';

export interface ExcelExportData {
  uid: string;
  patientId: string;
  patientName: string;
  dateTime: string;
  status: string;
  pathologies: string;
  recommendations: string;
  descriptionStatus: string;
}

export const generateFileName = (baseName: string): string => {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  return `${baseName}_${timestamp}.xlsx`;
};

export const exportToExcel = (data: ExcelExportData[], fileName: string): void => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Create worksheet data with headers
  const worksheetData = [
    // Headers
    ['UID', 'ID пациента', 'ФИО пациента', 'Дата/Время', 'Статус', 'Патологии', 'Рекомендации', 'Статус описания'],
    // Data rows
    ...data.map(row => [
      row.uid,
      row.patientId,
      row.patientName,
      row.dateTime,
      row.status,
      row.pathologies,
      row.recommendations,
      row.descriptionStatus
    ])
  ];
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Set column widths
  const columnWidths = [
    { wch: 15 }, // UID
    { wch: 15 }, // Patient ID
    { wch: 25 }, // Patient Name
    { wch: 20 }, // Date/Time
    { wch: 15 }, // Status
    { wch: 30 }, // Pathologies
    { wch: 25 }, // Recommendations
    { wch: 20 }  // Description Status
  ];
  worksheet['!cols'] = columnWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Medical Report');
  
  // Write file
  XLSX.writeFile(workbook, fileName);
};

export const prepareExcelData = (studies: any[], t: any, language: string): ExcelExportData[] => {
  const dateLocale = ru; // Only Russian is supported
  
  return studies.map(study => ({
    uid: study.uid,
    patientId: study.patientId,
    patientName: study.patientName || 'Unknown Patient',
    dateTime: format(study.date, "dd.MM.yyyy HH:mm", { locale: dateLocale }),
    status: study.status,
    pathologies: Array.isArray(study.pathology) ? study.pathology.join(', ') : study.pathology,
    recommendations: study.doctorRecommendations ? study.doctorRecommendations.join(', ') : '',
    descriptionStatus: study.descriptionStatus === 'completed' ? 
      t('study.descriptionCompleted') : 
      t('study.descriptionInProgress')
  }));
};