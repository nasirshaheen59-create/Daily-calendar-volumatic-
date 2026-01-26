
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { HadithData } from '../types';

interface HadithCardProps {
  data: HadithData | null;
  loading: boolean;
  error: string | null;
}

export const HadithCard: React.FC<HadithCardProps> = ({ data, loading, error }) => {
  
  if (loading) {
    return (
      <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border border-dashed border-emerald-100">
        <div className="w-5 h-5 border-2 border-islamic-primary border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-islamic-primary font-urdu text-sm animate-pulse">حدیث لوڈ ہو رہی ہے...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-700">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <p className="font-urdu text-xs leading-relaxed">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-emerald-50/30 rounded-[2rem] p-4 md:p-5 border border-emerald-100/40 relative overflow-hidden flex flex-col min-h-[180px]">
      {/* Decorative watermark */}
      <div className="absolute -top-4 -right-4 text-emerald-100/10 pointer-events-none transform rotate-12">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.4 9.1L22 9.3L15.9 13.8L18.1 21L12 16.6L5.9 21L8.1 13.8L2 9.3L9.6 9.1L12 2Z"/>
        </svg>
      </div>

      <div className="relative z-10 text-center flex flex-col items-center h-full">
         <h3 className="text-lg font-bold text-islamic-primary font-urdu mb-3 drop-shadow-sm opacity-90 border-b border-emerald-200/50 pb-0.5 px-4 inline-block">
           حدیثِ رسول ﷺ
         </h3>

        {/* Main Text Area - Increased vertical breathing room */}
        <div className="flex-grow flex items-center justify-center py-2">
          <p className="text-[19px] md:text-[21px] text-islamic-dark leading-[1.8] font-urdu text-center px-1">
            {data.text}
          </p>
        </div>

        {/* Reference Area - Guaranteed safety at bottom */}
        <div className="w-full mt-3 pb-1">
          <div className="inline-flex items-center justify-center max-w-full">
            <span className="text-[11px] text-white bg-islamic-primary/90 px-4 py-1.5 rounded-full font-urdu shadow-sm leading-none text-center">
              {data.reference}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
