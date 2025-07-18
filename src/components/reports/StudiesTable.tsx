
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ru, enUS, es, de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateAdditionalRevenue, formatCurrency } from '@/utils/studyHelpers';
import { getDoctorBadgeClass } from '@/utils/doctorRecommendations';
import { Study } from '@/types/study';

interface StudiesTableProps {
  reportStudies: any[];
  selectedStudies: string[];
  onSelectStudy: (uid: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onRemoveFromReport: (studyUid: string) => void;
}

const StudiesTable = ({
  reportStudies,
  selectedStudies,
  onSelectStudy,
  onSelectAll,
  onRemoveFromReport
}: StudiesTableProps) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const dateLocale = React.useMemo(() => {
    return ru; // Only Russian is supported
  }, [language]);

  const getStatusBadge = (study: any) => {
    // Use original status for CSS class logic
    const originalStatus = study.originalStatus || study.status;
    const statusClass = originalStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      originalStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800';
    
    // Translate the status for display
    const translatedStatus = t(`study.statuses.${originalStatus}`) || originalStatus;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
        {translatedStatus}
      </span>
    );
  };


  const handleViewReport = (study: any) => {
    navigate(`/study/${study.uid}`, { state: { study } });
  };

  const calculateStudyRevenue = (study: any) => {
    // Create a study object with original values for calculation
    const studyForCalculation: Study = {
      uid: study.uid,
      patientId: study.patientId,
      patientName: study.patientName || 'Unknown Patient',
      date: study.date,
      status: study.originalStatus || study.status,
      pathology: study.originalPathology || study.pathology,
      descriptionStatus: study.originalDescriptionStatus || study.descriptionStatus || 'in_progress',
      pathologyKey: study.pathologyKey,
      statusKey: study.statusKey,
      pathologyDecisions: study.pathologyDecisions || []
    };
    
    return calculateAdditionalRevenue(studyForCalculation);
  };

  const getDoctorRecommendationsBadges = (recommendations?: string[]) => {
    if (!recommendations || recommendations.length === 0) {
      return null;
    }

    return recommendations.map((doctor, index) => (
      <span 
        key={`${doctor}-${index}`} 
        className={`inline-block px-2 py-1 rounded-full text-xs mr-1 mb-1 ${getDoctorBadgeClass(doctor)}`}
      >
        {t(`study.doctors.${doctor}`) || doctor}
      </span>
    ));
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-t-lg border-b">
        <CardTitle className="text-xl text-gray-800 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          {t('reports.studiesTable.title')}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {t('reports.studiesTable.subtitle')}: {reportStudies.length}
          {selectedStudies.length > 0 && ` • ${t('reports.studiesTable.selected')}: ${selectedStudies.length}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left p-4 font-semibold text-gray-700">
                  <Checkbox
                    checked={selectedStudies.length === reportStudies.length && reportStudies.length > 0}
                    onCheckedChange={onSelectAll}
                  />
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">{t('reports.studiesTable.headers.uid')}</th>
                <th className="text-left p-4 font-semibold text-gray-700">{t('reports.studiesTable.headers.patientId')}</th>
                <th className="text-left p-4 font-semibold text-gray-700">{t('reports.studiesTable.headers.patientName')}</th>
                <th className="text-left p-4 font-semibold text-gray-700">{t('reports.studiesTable.headers.dateTime')}</th>
                <th className="text-left p-4 font-semibold text-gray-700">{t('reports.studiesTable.headers.status')}</th>
                <th className="text-left p-4 font-semibold text-gray-700">{t('reports.studiesTable.headers.pathologies')}</th>
                <th className="text-left p-4 font-semibold text-gray-700">{t('study.recommendations')}</th>
                <th className="text-left p-4 font-semibold text-gray-700">{t('study.descriptionStatus')}</th>
                <th className="text-left p-4 font-semibold text-gray-700">{t('reports.studiesTable.headers.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {reportStudies.map((study) => (
                <tr key={study.uid} className="border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedStudies.includes(study.uid)}
                      onCheckedChange={(checked) => onSelectStudy(study.uid, checked as boolean)}
                    />
                  </td>
                  <td className="p-4 font-mono text-sm">
                    <button
                      onClick={() => handleViewReport(study)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {study.uid}
                    </button>
                  </td>
                  <td className="p-4 font-mono text-sm text-gray-700">{study.patientId}</td>
                  <td className="p-4 text-sm font-medium">{study.patientName || 'Unknown Patient'}</td>
                  <td className="p-4 text-sm">
                    {format(study.date, "dd.MM.yyyy HH:mm", { locale: dateLocale })}
                  </td>
                  <td className="p-4">{getStatusBadge(study)}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(study.pathology) ? (
                        study.pathology.map((pathology, index) => (
                          <span key={`${pathology}-${index}`} className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
                            {pathology}
                          </span>
                        ))
                      ) : (
                        <span className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
                          {study.pathology}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {getDoctorRecommendationsBadges(study.doctorRecommendations)}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant={study.descriptionStatus === 'completed' ? 'default' : 'secondary'}
                      className={study.descriptionStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {study.descriptionStatus === 'completed' ? t('study.descriptionCompleted') : t('study.descriptionInProgress')}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRemoveFromReport(study.uid)}
                      className="border-red-200 text-red-700 hover:bg-red-50 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {t('reports.studiesTable.removeFromReport')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudiesTable;
