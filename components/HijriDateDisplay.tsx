
import React from 'react';
import { getFormattedHijriDate, getUrduDayName } from '../utils/dateUtils';

interface HijriDateDisplayProps {
  date: Date;
}

export const HijriDateDisplay: React.FC<HijriDateDisplayProps> = ({ date }) => {
  const { day, month, year } = getFormattedHijriDate(date);
  const dayName = getUrduDayName(date);

  return (
    <div className="w-full text-center">
      <h2 className="text-[26px] font-urdu font-bold text-islamic-dark leading-[1.4] drop-shadow-sm">
        {dayName}، {day} {month} {year}ھ
      </h2>
    </div>
  );
};
