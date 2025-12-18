import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, RefreshCw, Moon, BookOpen, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { HijriDateDisplay } from './components/HijriDateDisplay';
import { GregorianDateDisplay } from './components/GregorianDateDisplay';
import { HadithCard } from './components/HadithCard';
import { fetchDailyHadith } from './services/geminiService';
import { HadithData } from './types';

export default function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [hadith, setHadith] = useState<HadithData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);
  
  // History state to prevent repetition
  const [seenReferences, setSeenReferences] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('noor_hadith_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reference for the card to capture
  const cardRef = useRef<HTMLDivElement>(null);

  // Initial fetch
  useEffect(() => {
    // Pass the initial state directly to avoid dependency issues on mount
    const initialHistory = (() => {
      try {
        const saved = localStorage.getItem('noor_hadith_history');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    })();
    handleFetchHadith(initialHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchHadith = async (historyContext?: string[]) => {
    if (loading) return; // Prevent double clicks
    
    setLoading(true);
    setError(null);
    try {
      // Use provided context or current state
      const exclusions = historyContext || seenReferences;
      const data = await fetchDailyHadith(exclusions);
      setHadith(data);
      
      // Update history if it's a new valid reference
      if (data.reference) {
        setSeenReferences(prev => {
           // Avoid duplicates in state
           if (prev.includes(data.reference)) return prev;
           
           const newHistory = [...prev, data.reference];
           // Keep history size manageable (last 50 items)
           if (newHistory.length > 50) newHistory.shift();
           
           localStorage.setItem('noor_hadith_history', JSON.stringify(newHistory));
           return newHistory;
        });
      }
    } catch (err: any) {
      setError(err.message || "حدیث حاصل کرنے میں ناکامی");
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleDownload = async () => {
    if (cardRef.current === null) {
      return;
    }
    
    setDownloading(true);
    try {
      // Delay to ensure fonts and layout are stable before capture
      await new Promise(resolve => setTimeout(resolve, 1500));

      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 3, // High resolution
        backgroundColor: '#ffffff' // Ensure white background
      });
      
      const link = document.createElement('a');
      link.download = `Noor-e-Hidayat-${currentDate.toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
      alert('تصویر ڈاؤن لوڈ کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-2 px-3 font-base text-islamic-dark overflow-x-hidden">
      
      {/* External Controls */}
      <div className="mb-4 flex flex-wrap justify-center items-center gap-3 bg-white/90 p-2 rounded-full backdrop-blur-sm border border-emerald-100 shadow-sm">
         <button 
            onClick={() => changeDate(-1)}
            className="p-2 text-islamic-primary hover:bg-emerald-50 rounded-full transition-colors"
            aria-label="Previous Day"
          >
            <ChevronRight className="w-5 h-5" />
         </button>

         <button 
            onClick={() => handleFetchHadith()}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-70 text-xs"
         >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>نئی حدیث</span>
         </button>

         <button 
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-islamic-accent text-white rounded-full font-bold hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-70 text-xs"
         >
            <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
            <span>ڈاؤن لوڈ</span>
         </button>

         <button 
            onClick={() => changeDate(1)}
            className="p-2 text-islamic-primary hover:bg-emerald-50 rounded-full transition-colors"
            aria-label="Next Day"
          >
            <ChevronLeft className="w-5 h-5" />
         </button>
      </div>

      {/* Main Card */}
      <main 
        ref={cardRef} 
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-50 relative"
      >
        {/* Header Strip */}
        <div className="bg-islamic-primary text-white py-4 px-4 text-center">
            <h1 className="text-3xl font-urdu leading-relaxed pt-1">کیلنڈر و حدیثِ رسول ﷺ</h1>
        </div>

        <div className="p-4">
          
          {/* Vertical Dates Section (Lines) */}
          <div className="flex flex-col items-center justify-center text-center space-y-1 mb-5 mt-2">
             {/* Hijri Date Line */}
             <HijriDateDisplay date={currentDate} />
             
             {/* Gregorian Date Line */}
             <GregorianDateDisplay date={currentDate} />
          </div>

          {/* Hadith Section */}
          <div className="mt-1">
             <HadithCard data={hadith} loading={loading} error={error} />
          </div>

          {/* Footer Signature */}
          <div className="pt-3 mt-4 border-t border-dashed border-emerald-100 text-center" dir="ltr">
             <p className="font-base text-lg text-islamic-primary mb-1 leading-none">
               Volumatic Engineering
             </p>
             
             {/* Specializations */}
             <div className="text-[10px] text-emerald-800 font-sans leading-tight mb-2 opacity-90 space-y-0.5">
                <p className="font-bold text-islamic-accent">Specializing in:</p>
                <p>Water Treatment Chemicals & Services</p>
                <p>RO Plant Chemicals & Manufacturing</p>
                <p>Boiler & Chiller Parts, Service & Maintenance</p>
             </div>

             <p className="font-sans text-xs font-bold text-islamic-accent tracking-[0.2em] mt-1">
               03008865734
             </p>
          </div>

        </div>
        
        {/* Decorative Bottom Bar */}
        <div className="h-2 bg-gradient-to-r from-islamic-primary via-islamic-gold to-islamic-primary" />
      </main>

    </div>
  );
}