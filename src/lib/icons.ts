// Simple line icons (24x24, drawn with strokes) for the 11 condition areas.
// They are decoration only: every use is aria-hidden and sits next to the condition's name.

export const AREA_ICON: Record<string, string> = {
  pcos: '<circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1.6"/><circle cx="14" cy="8.5" r="1.3"/><circle cx="15.5" cy="14" r="1.8"/><circle cx="9.5" cy="15.5" r="1.2"/>',
  endometriosis:
    '<path d="M12 3c-3 0-5 2-5 5 0 3 2 4 2 7a3 3 0 0 0 6 0c0-3 2-4 2-7 0-3-2-5-5-5z"/><circle cx="19" cy="19" r="1"/><circle cx="5" cy="20" r="1"/>',
  'menstrual-health': '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  menopause: '<path d="M4 17h16"/><path d="M7 17a5 5 0 0 1 10 0"/><path d="M12 6v3M5.5 9.5l2 2M18.5 9.5l-2 2"/><path d="M8 21h8"/>',
  'pregnancy-childbirth': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
  postpartum: '<path d="M3 12h18"/><path d="M5 12a7 7 0 0 0 14 0"/><path d="M8 20h8"/><circle cx="12" cy="7.5" r="2.5"/>',
  infertility: '<circle cx="9" cy="9" r="5"/><path d="M13 13c3 1 4 3 4 5s2 3 4 3"/>',
  'heart-disease': '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
  osteoporosis:
    '<path d="M7 17L17 7"/><circle cx="6" cy="19" r="1.8"/><circle cx="4.5" cy="17" r="1.8"/><circle cx="18" cy="5" r="1.8"/><circle cx="19.5" cy="7" r="1.8"/>',
  'vaginal-urogenital': '<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/><path d="M5 19l8-8"/>',
  'sexual-wellness': '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
};
