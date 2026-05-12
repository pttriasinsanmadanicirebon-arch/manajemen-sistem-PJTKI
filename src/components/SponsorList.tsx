import React from 'react';
import { Sponsor } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Plus, Trophy, Phone, MapPin, Calculator, Download } from 'lucide-react';
import { Input } from './ui/input';

interface SponsorListProps {
  sponsors: Sponsor[];
  onAdd: () => void;
}

export const SponsorList: React.FC<SponsorListProps> = ({ sponsors, onAdd }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSponsors = sponsors.filter(s => 
    (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.region?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ).sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0));

  const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 px-2">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-display">Directory Sponsor</h2>
           </div>
           <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] ml-5">Global Network & Marketing Pipeline Intelligence</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
           <Button variant="outline" className="flex-1 md:flex-none h-16 px-8 rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950/20 font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <Download size={18} className="mr-3 text-blue-500" />
              Download Report
           </Button>
           <Button 
             onClick={onAdd}
             className="flex-1 md:flex-none h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/30 transition-all active:scale-95"
           >
             <Plus size={22} className="mr-3 stroke-[3]" />
             Add Professional Sponsor
           </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 bg-white/50 dark:bg-slate-950/20 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-black/20 backdrop-blur-xl ring-1 ring-slate-100/50 dark:ring-slate-800/50">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={20} />
          <Input 
            className="pl-16 h-16 border-none rounded-3xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800 focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 dark:text-white transition-all text-sm" 
            placeholder="Identity Search: Name, Region, or Performance Tier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-16 px-8 rounded-3xl border-none ring-1 ring-slate-200/50 dark:ring-slate-800 bg-white dark:bg-slate-900 font-black text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 transition-all">
              <Calculator size={18} className="mr-3" />
              Recalculate Scores
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredSponsors.map((sponsor, index) => (
          <Card key={sponsor.id} className="rounded-[3rem] border-none bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/40 dark:shadow-black/60 ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden hover:shadow-blue-500/10 transition-all group relative">
            <CardContent className="p-0">
               <div className="flex flex-col lg:flex-row">
                  {/* Ranking / Score */}
                  <div className={`w-full lg:w-56 p-10 flex flex-col items-center justify-center text-center gap-4 relative ${index === 0 ? 'bg-amber-50/50 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400' : 'bg-slate-50/50 dark:bg-slate-950/30 text-slate-400 dark:text-slate-600'}`}>
                     <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-[360deg] shadow-2xl ${index === 0 ? 'bg-amber-100 dark:bg-amber-950/50 shadow-amber-500/20' : 'bg-white dark:bg-slate-800 shadow-slate-200/50 dark:shadow-black/50'}`}>
                        <Trophy size={36} className={`${index === 0 ? 'text-amber-500' : 'text-slate-400'}`} strokeWidth={2.5} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Perf. Audit</p>
                        <p className="text-4xl font-black font-display leading-none">{sponsor.performanceScore}%</p>
                     </div>
                     {index === 0 && (
                        <div className="absolute top-4 left-4">
                           <Badge className="bg-amber-500 text-white border-none py-1.5 px-4 font-black uppercase text-[8px] tracking-widest rounded-full animate-pulse shadow-lg shadow-amber-500/40">WORLD CLASS</Badge>
                        </div>
                     )}
                  </div>

                  <div className="flex-1 p-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                     <div className="md:col-span-4 space-y-6">
                        <div className="space-y-2">
                           <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">{sponsor.name}</h3>
                           <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                              <MapPin size={16} className="text-blue-500" strokeWidth={2.5} />
                              {sponsor.region}
                           </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/30 p-4 rounded-2x border border-slate-100 dark:border-slate-800 w-fit">
                           <div className="p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                              <Phone size={18} className="text-blue-600 dark:text-blue-400" />
                           </div>
                           <p className="text-sm font-black text-slate-600 dark:text-slate-300 tabular-nums">{sponsor.phone}</p>
                        </div>
                     </div>

                     <div className="md:col-span-4 grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 flex flex-col gap-2 shadow-inner group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                           <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Deployment</p>
                           <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{sponsor.cpmiCount}</p>
                           <p className="text-[8px] font-bold text-slate-500 dark:text-slate-500 uppercase">CPMI Active</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20 flex flex-col gap-2 shadow-inner group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                           <p className="text-[9px] font-black text-rose-300 dark:text-rose-900 uppercase tracking-[0.2em]">Risk Exposure</p>
                           <p className="text-xl font-black text-rose-600 dark:text-rose-500 tabular-nums">{formatCurrency(sponsor.totalDebt)}</p>
                           <p className="text-[8px] font-bold text-rose-400 dark:text-rose-800 uppercase tracking-tighter">Outstanding Bridge</p>
                        </div>
                     </div>

                     <div className="md:col-span-4 flex flex-col justify-center h-full space-y-8">
                        <div className="space-y-2 text-right">
                           <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Accrued Pipeline Fees</p>
                           <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tighter">{formatCurrency(sponsor.unpaidFees)}</p>
                        </div>
                        <div className="flex gap-4">
                           <Button variant="outline" className="flex-1 rounded-2xl h-14 border-slate-100 dark:border-slate-800 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                              Intelligence
                           </Button>
                           <Button className="flex-1 rounded-2xl h-14 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                              Release Fee
                           </Button>
                        </div>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
