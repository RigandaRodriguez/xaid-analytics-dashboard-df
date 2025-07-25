
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';


interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
}

const FilterControls = ({ searchTerm, onSearchChange, onClearFilters }: FilterControlsProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">{t('study.date')}:</label>
            <input 
              type="date" 
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              defaultValue="2023-05-20"
            />
            <span className="text-gray-500">–</span>
            <input 
              type="date" 
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              defaultValue="2023-06-04"
            />
          </div>
        </div>
        <div className="text-lg font-semibold text-gray-900">
          {t('study.total')}: 231
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Input
          placeholder={t('study.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
        
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option>{t('study.allStatuses')}</option>
          <option>{t('statuses.completed')}</option>
          <option>{t('statuses.processing')}</option>
          <option>{t('statuses.error')}</option>
        </select>
        
        
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="text-sm"
        >
          {t('study.clearFilters')}
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;
