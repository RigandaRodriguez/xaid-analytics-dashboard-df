
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationTabs = ({ activeTab, onTabChange }: NavigationTabsProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const tabs = [
    { id: 'dashboard', label: t('navigation.dashboard'), path: '/' },
    { id: 'reports', label: t('navigation.reports'), path: '/reports' },
    { id: 'logging', label: t('navigation.logging'), path: '/logging' }
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.id === 'reports') {
      navigate('/reports');
    } else if (tab.id === 'logging') {
      navigate('/logging');
    } else {
      navigate('/');
      onTabChange(tab.id);
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white px-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-[#3B4B96] text-[#3B4B96]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NavigationTabs;
