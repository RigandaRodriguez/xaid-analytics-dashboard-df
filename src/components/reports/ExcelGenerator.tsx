import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExcelGenerator } from '@/hooks/useExcelGenerator';

interface ExcelGeneratorProps {
  selectedStudies: string[];
  reportStudies: any[];
  onBulkRemove: () => void;
}

const ExcelGenerator = ({
  selectedStudies,
  reportStudies,
  onBulkRemove
}: ExcelGeneratorProps) => {
  const { t } = useLanguage();
  
  const { generateExcelReport } = useExcelGenerator({
    reportStudies
  });

  return (
    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-t-lg border-b">
        <CardTitle className="text-xl text-gray-800 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
            <FileSpreadsheet className="w-5 h-5 text-white" />
          </div>
          {t('reports.statisticalReport.title')}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {t('reports.statisticalReport.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={generateExcelReport}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            {t('reports.statisticalReport.generateReport')}
          </Button>
          
          {selectedStudies.length > 0 && (
            <Button
              onClick={onBulkRemove}
              variant="outline"
              size="lg"
              className="border-red-200 text-red-700 hover:bg-red-50 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              {t('reports.statisticalReport.removeSelected')} ({selectedStudies.length})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelGenerator;