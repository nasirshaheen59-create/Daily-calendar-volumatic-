import { HadithData } from '../types';
import { ramadanHadiths } from '../data/ramadanHadiths';

export const fetchDailyHadith = async (excludeReferences: string[] = []): Promise<HadithData> => {
  // Simulate network delay for UI consistency
  await new Promise(resolve => setTimeout(resolve, 500));

  // Filter out recently shown hadiths if possible
  let availableHadiths = ramadanHadiths;
  if (excludeReferences.length > 0) {
    const filtered = ramadanHadiths.filter(h => !excludeReferences.includes(h.reference));
    if (filtered.length > 0) {
      availableHadiths = filtered;
    }
  }

  // Pick a random hadith
  const randomIndex = Math.floor(Math.random() * availableHadiths.length);
  return availableHadiths[randomIndex];
};