import React from 'react';
import { getFormattedGregorianDate } from '../utils/dateUtils';

interface GregorianDateDisplayProps {
  date: Date;
}

export const GregorianDateDisplay: React.FC<GregorianDateDisplayProps> = ({ date }) => {
  const { day, month, year } = getFormattedGregorianDate(date);

  return (
    <div className="w-full text-center -mt-2">
      <h3 className="text-xl font-urdu font-bold text-gray-500 leading-relaxed">
        {day} {month} {year} عیسوی
      </h3>
    </div>
  );
};