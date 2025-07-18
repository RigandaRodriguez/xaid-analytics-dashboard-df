import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PatientSearchProps {
  onPatientSelect?: (patientId: string) => void;
}

const PatientSearch = ({ onPatientSelect }: PatientSearchProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock patient data - in real app this would come from API
  const mockPatients = [
    { id: 'PAT-001', name: 'Иванов Иван Иванович', uid: 'UID-2023-000001' },
    { id: 'PAT-002', name: 'Петров Петр Петрович', uid: 'UID-2023-000002' },
    { id: 'PAT-003', name: 'Сидоров Сидор Сидорович', uid: 'UID-2023-000003' },
  ];

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={t('study.searchByName')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {searchTerm && filteredPatients.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
          {filteredPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => {
                onPatientSelect?.(patient.id);
                setSearchTerm(patient.name);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-2"
            >
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <div className="font-medium text-sm">{patient.name}</div>
                <div className="text-xs text-gray-500">{patient.id}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;