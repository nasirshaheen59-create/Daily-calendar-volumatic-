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

  // History system to track seen hadiths
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

  // Only trigger on mount
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
      await new Promise(r => setTimeout(r, 1000));
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Hadith-${currentDate.toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('تصویر محفوظ کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-4 px-4 font-base text-islamic-dark overflow-x-hidden">
      
      {/* External Controls */}
      <div className="mb-6 flex flex-wrap justify-center items-center gap-4 bg-white/95 p-3 rounded-full backdrop-blur-md border border-emerald-100 shadow-lg">
         <button onClick={() => changeDate(-1)} className="p-2 text-islamic-primary hover:bg-emerald-50 rounded-full transition-all">
            <ChevronRight className="w-6 h-6" />
         </button>

         <button onClick={() => handleFetchHadith()} disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all shadow-md disabled:opacity-70">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">نئی حدیث</span>
         </button>

         <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-2 px-6 py-2 bg-islamic-accent text-white rounded-full font-bold hover:bg-amber-700 transition-all shadow-md disabled:opacity-70">
            <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
            <span className="text-sm">ڈاؤن لوڈ</span>
         </button>

         <button onClick={() => changeDate(1)} className="p-2 text-islamic-primary hover:bg-emerald-50 rounded-full transition-all">
            <ChevronLeft className="w-6 h-6" />
         </button>
      </div>

      {/* Main Card */}
      <main ref={cardRef} className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-emerald-50 relative">
        <div className="bg-islamic-primary text-white py-6 px-4 text-center">
            <h1 className="text-4xl font-urdu leading-snug tracking-wide">کیلنڈر و حدیثِ رسول ﷺ</h1>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-2 mb-8">
             <HijriDateDisplay date={currentDate} />
             <GregorianDateDisplay date={currentDate} />
          </div>

          <div className="min-h-[200px] flex flex-col justify-center">
             <HadithCard data={hadith} loading={loading} error={error} />
          </div>

          <footer className="pt-6 mt-8 border-t border-dashed border-emerald-100 text-center" dir="ltr">
             <p className="font-base text-2xl text-islamic-primary mb-2">Volumatic Engineering</p>
             <div className="text-[11px] text-emerald-800 font-sans leading-tight mb-4 opacity-90">
                <p className="font-bold text-islamic-accent uppercase tracking-wider mb-1">Specializing in:</p>
                <p>Water Treatment Chemicals & Services</p>
                <p>RO Plant Chemicals & Manufacturing</p>
                <p>Boiler & Chiller Parts, Service & Maintenance</p>
             </div>
             <p className="font-sans text-sm font-black text-islamic-accent tracking-[0.25em]">03008865734</p>
          </footer>
        </div>
        
        <div className="h-3 bg-gradient-to-r from-islamic-primary via-islamic-gold to-islamic-primary" />
      </main>
    </div>
  );
}