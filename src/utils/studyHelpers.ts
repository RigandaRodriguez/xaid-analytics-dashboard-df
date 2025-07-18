
import React from 'react';
import { Study } from '@/types/study';

// Exchange rates (RUB as base currency)
const EXCHANGE_RATES = {
  'ru': 1,     // RUB (base)
  'en': 0.011, // USD
  'es': 0.010, // EUR  
  'de': 0.010  // EUR
};

// Get locale for number formatting
const getLocale = (language: string): string => {
  switch (language) {
    case 'ru': return 'ru-RU';
    case 'en': return 'en-US';
    case 'es': return 'es-ES';
    case 'de': return 'de-DE';
    default: return 'ru-RU';
  }
};

// Convert currency based on language
export const convertCurrency = (amount: number, language: string): number => {
  const rate = EXCHANGE_RATES[language as keyof typeof EXCHANGE_RATES] || 1;
  return Math.round(amount * rate);
};

export const getStatusBadge = (status: string, t: (key: string) => string) => {
  const statusMap = {
    completed: { text: t('statuses.completed'), class: 'bg-green-100 text-green-800' },
    processing: { text: t('statuses.processing'), class: 'bg-blue-100 text-blue-800' },
    processing_error: { text: t('statuses.processing_error'), class: 'bg-red-100 text-red-800' },
    data_error: { text: t('statuses.data_error'), class: 'bg-orange-100 text-orange-800' }
  };
  const statusInfo = statusMap[status as keyof typeof statusMap] || { text: status, class: 'bg-gray-100 text-gray-800' };
  return React.createElement('span', {
    className: `px-2 py-1 rounded-full text-xs font-medium ${statusInfo.class}`
  }, statusInfo.text);
};


export const getPathologyText = (study: Study, t: (key: string) => string) => {
  if (study.status === 'processing' || study.status === 'processing_error' || study.status === 'data_error') {
    return t('studyReport.noData');
  }
  return study.pathology;
};



export const calculateAdditionalRevenue = (study: Study): number | null => {
  if (study.descriptionStatus === 'completed') {
    // Generate deterministic revenue based on study UID to ensure consistency
    const seed = study.uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed * 9301 + 49297) % 233280 / 233280;
    const minRevenue = 2500;
    const maxRevenue = 7500;
    const range = (maxRevenue - minRevenue) / 100;
    const revenue = Math.floor(random * range) * 100 + minRevenue;
    return revenue;
  }
  return null;
};

export const formatCurrency = (amount: number | null, currencySymbol: string, language: string = 'ru'): string => {
  if (amount === null) {
    return '—';
  }
  
  const convertedAmount = convertCurrency(amount, language);
  const locale = getLocale(language);
  
  return `${convertedAmount.toLocaleString(locale)} ${currencySymbol}`;
};

export const getAdditionalRevenueText = (study: Study, t: (key: string) => string, language: string = 'ru'): string => {
  const revenue = calculateAdditionalRevenue(study);
  if (revenue === null) {
    return t('studyReport.notApplicable');
  }
  return formatCurrency(revenue, t('currency.symbol'), language);
};

// Helper functions for revenue filter
export const formatRevenueInput = (value: string): string => {
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '';
  
  // Add spaces as thousands separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const parseRevenueInput = (value: string): number | undefined => {
  if (!value.trim()) return undefined;
  
  // Remove spaces and convert to number
  const numericValue = value.replace(/\s/g, '');
  const parsed = parseInt(numericValue, 10);
  
  return isNaN(parsed) ? undefined : parsed;
};

export const validateRevenueRange = (from?: number, to?: number): boolean => {
  if (from !== undefined && to !== undefined) {
    return from <= to;
  }
  return true;
};
