
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
    <div className="bg-emerald-50/30 rounded-3xl p-4 md:p-5 border border-emerald-100/50 relative overflow-hidden">
      {/* Decorative watermark/element */}
      <div className="absolute -top-4 -right-4 text-emerald-100/20 pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.4 9.1L22 9.3L15.9 13.8L18.1 21L12 16.6L5.9 21L8.1 13.8L2 9.3L9.6 9.1L12 2Z"/></svg>
      </div>

      <div className="relative z-10 text-center flex flex-col items-center">
         <h3 className="text-xl font-bold text-islamic-primary font-urdu mb-3 drop-shadow-sm opacity-90 border-b border-emerald-200/50 pb-1 px-4">
           رسول اللہ ﷺ نے فرمایا
         </h3>

        <p className="text-[21px] md:text-[23px] text-islamic-dark leading-[1.8] font-urdu text-center px-1 mb-4">
          {data.text}
        </p>

        <div className="inline-flex items-center justify-center">
          <span className="text-[12px] text-white bg-islamic-primary px-4 py-1 rounded-full font-urdu shadow-sm leading-none">
            {data.reference}
          </span>
        </div>
      </div>
    </div>
  );
};
