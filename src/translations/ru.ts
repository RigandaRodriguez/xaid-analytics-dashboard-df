import common from './ru/common';
import study from './ru/study';
import reports from './ru/reports';
import studyReport from './ru/studyReport';
import logging from './ru/logging';
// Removed pathologies import - now centralized in pathologyRegistry
import referenceValues from './ru/referenceValues';
import messages from './ru/messages';

export default {
  common,
  study,
  reports,
  studyReport,
  logging,
  // pathologies moved to common.pathologies
  referenceValues,
  messages,
};
