// Plain-language labels. Neutral on purpose: these describe, they do not rank.

export const EVIDENCE_BASIS_LABEL: Record<string, { label: string; text: string }> = {
  'new-science': {
    label: 'New science',
    text: "The support comes from the company's own research, often a university spinout.",
  },
  'established-applied': {
    label: 'Established evidence, applied',
    text: 'The support comes from existing trials, reviews or guidelines, delivered in a new way.',
  },
  'none-public': {
    label: 'No public evidence found',
    text: 'I could not find public evidence behind the approach. That describes what I could see, not the company.',
  },
};

import stages from './path-stages.json';

export const PATH_STAGES: { id: string; label: string; blurb: string }[] = stages;

export const PRODUCT_CHECK_LABEL: Record<string, string> = Object.fromEntries(stages.map((s) => [s.id, s.label]));

export const REF_USE_LABEL: Record<string, string> = {
  'read-in-full': 'Read in full',
  'abstract-only': 'Abstract only',
  'summary-only': 'Read through a summary of the page, not line by line',
  'registry-search': 'Registry search I ran',
  'not-read': 'Not read',
  'company-reported': 'Company-reported',
};

export const AREA_LABEL: Record<string, string> = {
  pcos: 'PCOS',
  endometriosis: 'Endometriosis',
  'menstrual-health': 'Menstrual health',
  menopause: 'Menopause',
  'pregnancy-childbirth': 'Pregnancy & childbirth',
  postpartum: 'Postpartum',
  infertility: 'Infertility',
  'heart-disease': 'Heart disease in women',
  osteoporosis: 'Osteoporosis',
  'vaginal-urogenital': 'Vaginal & urogenital health',
  'sexual-wellness': 'Sexual wellness',
};

// Broad kind of product, for the "By technology" view.
export const TYPE_LABEL: Record<string, string> = {
  drug: 'Drugs',
  device: 'Devices',
  diagnostic: 'Tests and diagnostics',
  software: 'Software and apps',
  service: 'Care services',
  platform: 'Platforms',
};
