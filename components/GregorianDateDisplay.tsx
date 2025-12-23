
import React from 'react';
import { getFormattedGregorianDate } from '../utils/dateUtils';

interface GregorianDateDisplayProps {
  date: Date;
}

export const GregorianDateDisplay: React.FC<GregorianDateDisplayProps> = ({ date }) => {
  const { day, month, year } = getFormattedGregorianDate(date);

  return (
    <div className="w-full text-center">
      <h3 className="text-lg font-urdu font-semibold text-gray-400 leading-normal">
        {day} {month} {year} عیسوی
      </h3>
    </div>
  );
};
