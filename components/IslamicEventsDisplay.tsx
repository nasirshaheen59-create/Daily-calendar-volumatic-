import React from 'react';
import { ISLAMIC_EVENTS } from '../data/islamicEvents';
import { IslamicEvent } from '../types';
import { CalendarDays } from 'lucide-react';

interface IslamicEventsDisplayProps {
  day: number;
  month: number;
}

export const IslamicEventsDisplay: React.FC<IslamicEventsDisplayProps> = ({ day, month }) => {
  const event = ISLAMIC_EVENTS.find(e => e.day === day && e.month === month);

  if (!event) return null;

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 text-amber-700 mb-1">
        <CalendarDays className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">اسلامی واقعہ</span>
      </div>
      <h3 className="text-xl font-urdu text-amber-800 leading-relaxed mb-1">{event.name}</h3>
      <p className="text-sm text-amber-700/80 font-urdu leading-relaxed">{event.description}</p>
    </div>
  );
};
