
import profile from './profile';
import study from './study';
import reports from './reports';
import common from './common';
import logging from './logging';
import studyReport from './studyReport';
import ui from './ui';
// Removed pathologies import - now centralized in pathologyRegistry
import referenceValues from './referenceValues';
import clinicalRecommendations from './clinicalRecommendations';
import physicians from './physicians';

export default {
  navigation: common.navigation,
  header: common.header,
  profile,
  accessLevels: common.accessLevels,
  study,
  statuses: common.statuses,
  pathologies: common.pathologies,
  referenceValues,
  clinicalRecommendations,
  consultation: common.consultation,
  criticality: common.criticality,
  appointmentStatuses: common.appointmentStatuses,
  logging,
  doctors: common.doctors,
  radiologists: common.radiologists,
  studyReport,
  physicians,
  specialties: common.specialties,
  statistics: common.statistics,
  displaySettings: ui.displaySettings,
  bulkActions: ui.bulkActions,
  messages: ui.messages,
  reports,
  currency: common.currency
};
