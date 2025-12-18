import React from 'react';
import { Quote, ExternalLink, AlertCircle } from 'lucide-react';
import { HadithData } from '../types';

interface HadithCardProps {
  data: HadithData | null;
  loading: boolean;
  error: string | null;
}

export const HadithCard: React.FC<HadithCardProps> = ({ data, loading, error }) => {
  
  if (loading) {
    return (
      <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <div className="w-6 h-6 border-2 border-islamic-primary border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-islamic-primary font-urdu text-lg animate-pulse">حدیث لوڈ ہو رہی ہے...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 text-red-700">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <p className="font-urdu text-sm">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100 relative group">
      
      <div className="mb-2 relative z-10 text-center">
         {/* Header - Urdu Font */}
         <h3 className="text-2xl font-bold text-islamic-dark font-urdu mb-2 drop-shadow-sm leading-relaxed">
           رسول اللہ ﷺ نے فرمایا
         </h3>

        {/* Hadith Text - Urdu Font */}
        <p className="text-xl md:text-2xl text-islamic-dark leading-[2.2] font-urdu text-center px-1">
          {data.text}
        </p>
      </div>

      <div className="flex items-center justify-center pt-3 border-t border-emerald-50 mt-2">
        <span className="text-sm text-white bg-islamic-primary/90 px-3 py-0.5 rounded-full font-urdu shadow-sm leading-relaxed">
          {data.reference}
        </span>
      </div>
    </div>
  );
};