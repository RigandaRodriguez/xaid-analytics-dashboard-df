
import React from 'react';
import { FileText, Heart } from 'lucide-react';

interface Study {
  uid: string;
  patientId: string;
  date: string;
  time: string;
  status: 'completed' | 'processing' | 'error';
  pathologies: string[];
}

interface StudyTableProps {
  studies: Study[];
}

const StudyTable = ({ studies }: StudyTableProps) => {
  const getStatusBadge = (status: Study['status']) => {
    const badges = {
      completed: 'status-completed',
      processing: 'status-processing',
      error: 'status-error'
    };
    
    const labels = {
      completed: 'Завершено',
      processing: 'Обработка',
      error: 'Ошибка'
    };
    
    return (
      <span className={`status-badge ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };


  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>UID</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID пациента
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата / Время
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>Патологии</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {studies.map((study, index) => (
              <tr 
                key={study.uid} 
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 1 ? 'bg-gray-25' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {study.uid}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {study.patientId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{study.date}</div>
                    <div className="text-gray-500">{study.time}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(study.status)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex flex-wrap gap-1">
                    {study.pathologies.map((pathology, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                      >
                        {pathology}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-white px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Показано 1-10 из 231
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Назад
            </button>
            <span className="px-3 py-1 bg-[#3B4B96] text-white rounded text-sm">1</span>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Далее
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTable;
