
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
      <div className="w-full h-40 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border border-dashed border-emerald-100">
        <div className="w-6 h-6 border-2 border-islamic-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-islamic-primary font-urdu text-base animate-pulse">حدیث لوڈ ہو رہی ہے...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-700">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="font-urdu text-sm leading-relaxed">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-emerald-50/40 rounded-[2.5rem] p-5 md:p-6 border border-emerald-100/60 relative overflow-hidden flex flex-col min-h-[220px]">
      {/* Decorative watermark */}
      <div className="absolute -top-6 -right-6 text-emerald-100/20 pointer-events-none transform rotate-12">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.4 9.1L22 9.3L15.9 13.8L18.1 21L12 16.6L5.9 21L8.1 13.8L2 9.3L9.6 9.1L12 2Z"/>
        </svg>
      </div>

      <div className="relative z-10 text-center flex flex-col items-center h-full">
         <h3 className="text-[22px] font-bold text-islamic-primary font-urdu mb-4 drop-shadow-sm opacity-95 border-b-2 border-emerald-200/40 pb-1 px-6">
           حدیثِ رسول ﷺ
         </h3>

        {/* Main Text Area - Improved spacing to prevent overlap */}
        <div className="flex-grow flex items-center justify-center mb-6">
          <p className="text-[20px] md:text-[22px] text-islamic-dark leading-[1.85] font-urdu text-center px-1">
            {data.text}
          </p>
        </div>

        {/* Reference Area - Ensured visibility and padding to prevent cutoff */}
        <div className="w-full mt-auto pt-2 pb-1">
          <div className="inline-flex items-center justify-center max-w-full">
            <span className="text-[13px] text-white bg-islamic-primary/90 px-5 py-1.5 rounded-full font-urdu shadow-sm leading-tight text-center break-words">
              {data.reference}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
