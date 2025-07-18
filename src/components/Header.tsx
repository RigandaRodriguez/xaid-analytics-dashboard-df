
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-[#3B4B96]">
            {t('header.brand')}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
