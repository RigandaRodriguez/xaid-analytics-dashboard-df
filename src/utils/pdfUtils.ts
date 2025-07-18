
import { jsPDF } from 'jspdf';

export interface PDFConfig {
  putOnlyUsedFonts: boolean;
  compress: boolean;
}

export const createPDFDocument = (config: PDFConfig = { putOnlyUsedFonts: true, compress: true }): jsPDF => {
  const doc = new jsPDF(config);
  return doc;
};

export const setFontForLanguage = (doc: jsPDF, language: string) => {
  try {
    // Use courier which has better Unicode support than helvetica/times
    doc.setFont('courier', 'normal');
  } catch (error) {
    console.warn('Failed to set font, using default:', error);
  }
};

export const getPDFTableStyles = () => ({
  styles: {
    fontSize: 10,
    cellPadding: 4,
    font: 'courier', // Use courier for better Unicode support
    fontStyle: 'normal' as const
  },
  headStyles: {
    fillColor: [59, 130, 246] as [number, number, number],
    textColor: 255,
    font: 'courier',
    fontStyle: 'bold' as const
  },
  alternateRowStyles: {
    fillColor: [245, 245, 245] as [number, number, number]
  }
});

export const generateFileName = (title: string): string => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '-');
  const timeStr = now.toTimeString().slice(0, 5).replace(':', '-');
  return `${title.toLowerCase().replace(/\s+/g, '_')}_${dateStr}_${timeStr}.pdf`;
};

// Transliteration function for Russian text
export const transliterateRussian = (text: string): string => {
  const cyrillicMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };
  
  return text.split('').map(char => cyrillicMap[char] || char).join('');
};

// Helper function to encode text for proper display with transliteration
export const encodeTextForPDF = (text: string, language: string): string => {
  if (language === 'ru') {
    return transliterateRussian(text);
  }
  return text;
};
