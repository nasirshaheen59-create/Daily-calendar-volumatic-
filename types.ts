export interface HadithData {
  text: string;
  reference: string;
  sourceUrl?: string; // For grounding link
}

export enum UrduMonths {
  Muharram = 'محرم',
  Safar = 'صفر',
  RabiAlAwwal = 'ربیع الاول',
  RabiAlThani = 'ربیع الثانی',
  JumadaAlAwwal = 'جمادی الاول',
  JumadaAlThani = 'جمادی الثانی',
  Rajab = 'رجب',
  Shaban = 'شعبان',
  Ramadan = 'رمضان',
  Shawwal = 'شوال',
  DhulQadah = 'ذوالقعدہ',
  DhulHijjah = 'ذوالحجہ',
}

export const URDU_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];