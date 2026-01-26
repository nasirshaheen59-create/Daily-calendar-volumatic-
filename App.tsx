
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
      // Wait for font rendering to be absolutely sure
      await new Promise(r => setTimeout(r, 1000));
      
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        // Specifically setting canvas dimensions can sometimes help with clipping
        style: {
          transform: 'scale(1)',
          margin: '0',
          padding: '0'
        }
      });
      
      const link = document.createElement('a');
      link.download = `Islamic-Calendar-${currentDate.toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('تصویر محفوظ کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-4 px-2 font-base text-islamic-dark overflow-x-hidden bg-[#f0fdf4]">
      
      {/* Controls - Made more compact for small screens */}
      <div className="mb-4 flex flex-wrap justify-center items-center gap-2 bg-white/95 p-2 px-3 rounded-full backdrop-blur-md border border-emerald-100 shadow-lg z-20">
         <button onClick={() => changeDate(-1)} className="p-1.5 text-islamic-primary hover:bg-emerald-50 rounded-full transition-all">
            <ChevronRight className="w-5 h-5" />
         </button>

         <button onClick={() => handleFetchHadith()} disabled={loading} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition-all disabled:opacity-70">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>نئی حدیث</span>
         </button>

         <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-1.5 px-3 py-1 bg-islamic-accent text-white rounded-full text-xs font-bold hover:bg-amber-700 transition-all disabled:opacity-70">
            <Download className={`w-3 h-3 ${downloading ? 'animate-bounce' : ''}`} />
            <span>محفوظ کریں</span>
         </button>

         <button onClick={() => changeDate(1)} className="p-1.5 text-islamic-primary hover:bg-emerald-50 rounded-full transition-all">
            <ChevronLeft className="w-5 h-5" />
         </button>
      </div>

      {/* Main Card - Compacted width and vertical spacing */}
      <main 
        ref={cardRef} 
        className="w-full max-w-[360px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border-[4px] border-emerald-50/50 relative flex flex-col"
      >
        {/* Header - Compact height */}
        <div className="bg-islamic-primary text-white pt-5 pb-4 px-4 text-center">
            <h1 className="text-2xl font-urdu leading-tight tracking-tight">کیلنڈر و حدیثِ رسول ﷺ</h1>
        </div>

        <div className="px-4 py-4 flex flex-col flex-grow">
          {/* Date Section - Tightened */}
          <div className="flex flex-col items-center justify-center text-center space-y-0 mb-4">
             <HijriDateDisplay date={currentDate} />
             <GregorianDateDisplay date={currentDate} />
          </div>

          {/* Hadith Section - Dynamic Height but compact */}
          <div className="flex-grow flex flex-col justify-center mb-4">
             <HadithCard data={hadith} loading={loading} error={error} />
          </div>

          {/* Footer - Reduced padding and margins */}
          <footer className="pt-3 border-t border-dashed border-emerald-100 text-center" dir="ltr">
             <p className="font-base text-xl text-islamic-primary mb-0.5 leading-none">Volumatic Engineering</p>
             <div className="text-[9.5px] text-emerald-800 font-sans leading-tight mb-3 opacity-90">
                <p className="font-bold text-islamic-accent uppercase tracking-wider mb-0.5">SPECIALIZING IN:</p>
                <p>Water Treatment Chemicals & Services</p>
                <p>RO Plant Chemicals & Manufacturing</p>
                <p>Boiler & Chiller Maintenance</p>
             </div>
             {/* Large number for impact, centered */}
             <p className="font-sans text-lg font-black text-islamic-accent tracking-[0.15em] leading-none mb-2">03008865734</p>
          </footer>
        </div>
        
        {/* Decorative Bottom - Safe Zone */}
        <div className="h-2 bg-gradient-to-r from-islamic-primary via-islamic-gold to-islamic-primary" />
        {/* Extra bottom padding to ensure no clipping on capture */}
        <div className="h-1 bg-white" />
      </main>

      <p className="mt-3 text-[9px] text-emerald-800/40 font-sans uppercase tracking-[0.3em]">Digital Daily Diary</p>
    </div>
  );
}
