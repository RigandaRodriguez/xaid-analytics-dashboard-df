
import navigation from './navigation';
import header from './header';
import profile from './profile';
import study from './study';
import reports from './reports';
import common from './common';
import logging from './logging';
import studyReport from './studyReport';
import ui from './ui';
import pathologies from './pathologies';
import referenceValues from './referenceValues';
import clinicalRecommendations from './clinicalRecommendations';
import physicians from './physicians';

export default {
  navigation,
  header,
  profile,
  accessLevels: common.accessLevels,
  study,
  statuses: common.statuses,
  pathologies: {
    ...common.pathologies,
    names: pathologies
  },
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
  statistics: ui.statistics,
  displaySettings: ui.displaySettings,
  bulkActions: ui.bulkActions,
  messages: ui.messages,
  reports,
  currency: common.currency
};
