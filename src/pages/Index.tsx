
import React, { useState } from 'react';
import Header from '@/components/Header';
import NavigationTabs from '@/components/NavigationTabs';
import StudyDashboard from '@/components/StudyDashboard';
import PatientSearch from '@/components/PatientSearch';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reportStudies, setReportStudies] = useState<any[]>([]);

  const handleAddToReport = (studies: any[]) => {
    setReportStudies([...reportStudies, ...studies]);
    console.log('Added to report:', studies);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-7xl mx-auto">
        <div className="p-8 space-y-8">
          <StudyDashboard onAddToReport={handleAddToReport} />
        </div>
      </div>
    </div>
  );
};

export default Index;
