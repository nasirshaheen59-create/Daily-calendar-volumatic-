import { HadithData } from '../types';
import { hadithData } from '../data/hadithData';

export const fetchDailyHadith = async (excludeReferences: string[] = []): Promise<HadithData> => {
  // Simulate network delay for UI consistency
  await new Promise(resolve => setTimeout(resolve, 500));

  // Filter out recently shown hadiths if possible
  let availableHadiths = hadithData;
  if (excludeReferences.length > 0) {
    const filtered = hadithData.filter(h => !excludeReferences.includes(h.reference));
    if (filtered.length > 0) {
      availableHadiths = filtered;
    }
  }

  // Pick a random hadith
  const randomIndex = Math.floor(Math.random() * availableHadiths.length);
  return availableHadiths[randomIndex];
};