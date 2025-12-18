import { HIJRI_MONTHS_MAP, HIJRI_MONTHS_ARRAY } from '../constants';
import { URDU_DIGITS } from '../types';

// Helper to convert English digits to Urdu
export const toUrduDigits = (num: number | string): string => {
  return num.toString().split('').map(char => {
    const digit = parseInt(char);
    return isNaN(digit) ? char : URDU_DIGITS[digit];
  }).join('');
};

// Helper to get Urdu Day Name
export const getUrduDayName = (date: Date): string => {
  return new Intl.DateTimeFormat('ur-PK', { weekday: 'long' }).format(date);
};

// Custom function to get formatted Hijri date
export const getFormattedHijriDate = (date: Date): { day: string, month: string, year: string } => {
  // PAKISTAN DATE ADJUSTMENT:
  // Pakistan is typically 1 day behind Saudi Arabia (Um Al Qura).
  // We subtract 1 day from the current Gregorian date before calculating the Hijri date
  // to approximate the Pakistani moon sighting.
  const adjustedDate = new Date(date);
  adjustedDate.setDate(date.getDate() - 1);

  // Use Intl with islamic-umalqura
  // We request numeric parts to get consistent day/year, but month might need special handling
  const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
    day: 'numeric',
    month: 'long', // We get the English transliterated name (e.g., "Rajab") to map to our static Urdu constant
    year: 'numeric'
  });

  const parts = formatter.formatToParts(adjustedDate);
  
  let day = '';
  let month = '';
  let year = '';

  parts.forEach(part => {
    if (part.type === 'day') day = part.value;
    if (part.type === 'month') month = part.value;
    if (part.type === 'year') {
        // Remove "AH" or other eras if present (though numeric usually just gives numbers)
        year = part.value.replace(/\D/g, ''); 
    }
  });

  // Convert Day and Year to Urdu Digits
  // User Request Update: Day should be in English digits ("English counting")
  const formattedDay = day; 
  const urduYear = toUrduDigits(year);

  // Map Month
  // Clean up the month string from Intl (sometimes has special chars like ʻ)
  const cleanMonthKey = Object.keys(HIJRI_MONTHS_MAP).find(k => k.includes(month.split(' ')[0])) || month;
  
  // If direct map fails, try to approximate or use array fallback if we can derive index (hard with just string).
  // However, modern browsers return standard strings for islamic-umalqura. 
  // Let's implement a fallback using part values if available, otherwise default logic.
  let urduMonth = HIJRI_MONTHS_MAP[month] || HIJRI_MONTHS_MAP[cleanMonthKey] || month;

  // Fallback: If map failed (browser differences), use a simpler numeric formatter to get month index
  if (!HIJRI_MONTHS_MAP[month] && !HIJRI_MONTHS_MAP[cleanMonthKey]) {
     const monthIndexFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { month: 'numeric' });
     const mPart = monthIndexFormatter.formatToParts(adjustedDate).find(p => p.type === 'month');
     if (mPart) {
         const mIndex = parseInt(mPart.value) - 1;
         if (mIndex >= 0 && mIndex < HIJRI_MONTHS_ARRAY.length) {
             urduMonth = HIJRI_MONTHS_ARRAY[mIndex];
         }
     }
  }

  return {
    day: formattedDay,
    month: urduMonth,
    year: urduYear
  };
};

export const getFormattedGregorianDate = (date: Date): { day: string, month: string, year: string } => {
  const formatter = new Intl.DateTimeFormat('ur-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const parts = formatter.formatToParts(date);
  const day = parts.find(p => p.type === 'day')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const year = parts.find(p => p.type === 'year')?.value || '';

  return { day, month, year };
};