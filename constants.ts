import { UrduMonths } from './types';

// Map standard month numbers (1-12) to Urdu Month Enum
// Note: Islamic calendar usually 0-indexed in some libs, but Intl returns "Muharram" strings or numbered months depending on options.
// We will parse the output of Intl.DateTimeFormat
export const HIJRI_MONTHS_MAP: { [key: string]: string } = {
  'Muharram': UrduMonths.Muharram,
  'Safar': UrduMonths.Safar,
  'Rabiʻ I': UrduMonths.RabiAlAwwal,
  'Rabiʻ II': UrduMonths.RabiAlThani,
  'Jumada I': UrduMonths.JumadaAlAwwal,
  'Jumada II': UrduMonths.JumadaAlThani,
  'Rajab': UrduMonths.Rajab,
  'Shaʻban': UrduMonths.Shaban,
  'Ramadan': UrduMonths.Ramadan,
  'Shawwal': UrduMonths.Shawwal,
  'Dhuʻl-Qiʻdah': UrduMonths.DhulQadah,
  'Dhuʻl-Hijjah': UrduMonths.DhulHijjah,
};

// Fallback array if simple indexing is needed (0-11)
export const HIJRI_MONTHS_ARRAY = [
  UrduMonths.Muharram,
  UrduMonths.Safar,
  UrduMonths.RabiAlAwwal,
  UrduMonths.RabiAlThani,
  UrduMonths.JumadaAlAwwal,
  UrduMonths.JumadaAlThani,
  UrduMonths.Rajab,
  UrduMonths.Shaban,
  UrduMonths.Ramadan,
  UrduMonths.Shawwal,
  UrduMonths.DhulQadah,
  UrduMonths.DhulHijjah,
];