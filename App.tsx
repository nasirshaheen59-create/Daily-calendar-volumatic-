
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, RefreshCw, Download } from 'lucide-react';
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
  
  const cardRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  const getHistory = () => {
    try {
      const saved = localStorage.getItem('noor_hadith_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  };

  const handleFetchHadith = async (isInitial = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    try {
      const history = getHistory();
      const data = await fetchDailyHadith(history);
      setHadith(data);
      
      if (data.reference) {
        const newHistory = Array.from(new Set([...history, data.reference])).slice(-50);
        localStorage.setItem('noor_hadith_history', JSON.stringify(newHistory));
      }
    } catch (err: any) {
      setError(err.message || "ڈیٹا لوڈ کرنے میں مسئلہ پیش آیا");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted.current) {
      handleFetchHadith(true);
      isMounted.current = true;
    }
  }, []);

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      // Ensure fonts are loaded and layout is stable
      await new Promise(r => setTimeout(r, 800));
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        style: {
          transform: 'scale(1)',
        }
      });
      const link = document.createElement('a');
      link.download = `Islamic-Calendar-${currentDate.toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('تصویر محفوظ کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center py-6 px-2 font-base text-islamic-dark overflow-x-hidden bg-[#f0fdf4]">
      
      {/* External Controls - Floating Style */}
      <div className="mb-6 flex flex-wrap justify-center items-center gap-3 bg-white/95 p-2 px-4 rounded-full backdrop-blur-md border border-emerald-100 shadow-xl z-20">
         <button onClick={() => changeDate(-1)} className="p-2 text-islamic-primary hover:bg-emerald-50 rounded-full transition-all" title="پچھلا دن">
            <ChevronRight className="w-5 h-5" />
         </button>

         <button onClick={() => handleFetchHadith()} disabled={loading} className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-70">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs">نئی حدیث</span>
         </button>

         <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-2 px-4 py-1.5 bg-islamic-accent text-white rounded-full font-bold hover:bg-amber-700 transition-all shadow-sm disabled:opacity-70">
            <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
            <span className="text-xs">محفوظ کریں</span>
         </button>

         <button onClick={() => changeDate(1)} className="p-2 text-islamic-primary hover:bg-emerald-50 rounded-full transition-all" title="اگلا دن">
            <ChevronLeft className="w-5 h-5" />
         </button>
      </div>

      {/* Main Card - Optimized for Mobile Fit */}
      <main 
        ref={cardRef} 
        className="w-full max-w-[380px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] border-emerald-50/50 relative flex flex-col"
      >
        {/* Header - More Compact */}
        <div className="bg-islamic-primary text-white pt-6 pb-5 px-4 text-center">
            <h1 className="text-[32px] font-urdu leading-normal tracking-tight">کیلنڈر و حدیثِ رسول ﷺ</h1>
        </div>

        <div className="px-5 py-6 flex flex-col flex-grow">
          {/* Date Section - Tighter spacing */}
          <div className="flex flex-col items-center justify-center text-center space-y-0.5 mb-8">
             <HijriDateDisplay date={currentDate} />
             <GregorianDateDisplay date={currentDate} />
          </div>

          {/* Hadith Section - Auto-growing content with flex-grow to push footer down */}
          <div className="flex-grow flex flex-col justify-center mb-8">
             <HadithCard data={hadith} loading={loading} error={error} />
          </div>

          {/* Footer - Optimized spacing and bottom margin for download safety */}
          <footer className="pt-5 border-t border-dashed border-emerald-100 text-center mb-2" dir="ltr">
             <p className="font-base text-2xl text-islamic-primary mb-1">Volumatic Engineering</p>
             <div className="text-[11px] text-emerald-800 font-sans leading-[1.4] mb-4 opacity-90">
                <p className="font-bold text-islamic-accent uppercase tracking-wider mb-1">SPECIALIZING IN:</p>
                <p>Water Treatment Chemicals & Services</p>
                <p>RO Plant Chemicals & Manufacturing</p>
                <p>Boiler & Chiller Maintenance</p>
             </div>
             <p className="font-sans text-base font-black text-islamic-accent tracking-[0.2em]">03008865734</p>
          </footer>
        </div>
        
        {/* Bottom Decorative Bar */}
        <div className="h-3 bg-gradient-to-r from-islamic-primary via-islamic-gold to-islamic-primary" />
      </main>

      <p className="mt-4 text-[10px] text-emerald-800/50 font-sans uppercase tracking-widest">Digital Daily Diary</p>
    </div>
  );
}
