import React from 'react';
import { CPMI, CPMIStatus } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { User, MapPin, Calendar, ArrowRight, ChevronRight } from 'lucide-react';

interface TrackingKanbanProps {
  cpmiList: CPMI[];
  onViewDetails: (cpmi: CPMI) => void;
}

const STATUS_COLUMNS: { status: CPMIStatus; label: string; color: string }[] = [
  { status: 'Baru', label: 'Baru Daftar', color: 'bg-slate-500' },
  { status: 'Interview', label: 'Interview', color: 'bg-blue-500' },
  { status: 'MCU', label: 'Proses MCU', color: 'bg-amber-500' },
  { status: 'MCU Fit', label: 'MCU Fit', color: 'bg-emerald-500' },
  { status: 'Paspor', label: 'Paspor', color: 'bg-indigo-500' },
  { status: 'PK', label: 'Perjanjian Kerja', color: 'bg-purple-500' },
  { status: 'Visa', label: 'Visa', color: 'bg-violet-500' },
  { status: 'Ready Terbang', label: 'Ready Terbang', color: 'bg-rose-500' },
  { status: 'Terbang', label: 'Terbang', color: 'bg-blue-700' },
];

export const TrackingKanban: React.FC<TrackingKanbanProps> = ({ cpmiList, onViewDetails }) => {
  return (
    <div className="flex space-x-8 overflow-x-auto pb-12 min-h-[calc(100vh-250px)] px-2 custom-scrollbar">
      {STATUS_COLUMNS.map((column) => {
        const items = cpmiList.filter((item) => item.status === column.status);
        return (
          <div key={column.status} className="w-96 shrink-0 flex flex-col group/col">
            <div className="mb-6 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${column.color} shadow-lg shadow-current/20`}></div>
                 <h3 className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-[0.15em] font-display">{column.label}</h3>
              </div>
              <Badge variant="secondary" className="rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black px-4 py-1 text-[10px] shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
                {items.length} Units
              </Badge>
            </div>
            
            <div className="flex-1 bg-slate-100/40 dark:bg-slate-950/40 rounded-[2.5rem] p-5 space-y-4 border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-sm shadow-inner min-h-[500px]">
              {items.length > 0 ? (
                items.map((cpmi) => (
                  <Card 
                    key={cpmi.id} 
                    className="rounded-[2rem] border-none hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer group bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-black/60 ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden"
                    onClick={() => onViewDetails(cpmi)}
                  >
                    <CardContent className="p-6 space-y-6 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[5rem] -z-0"></div>
                      <div className="flex items-start justify-between relative z-10">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                               <User size={24} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col min-w-0">
                               <span className="font-black text-slate-900 dark:text-white text-base truncate uppercase tracking-tight font-display pr-4">{cpmi.name}</span>
                               <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">{cpmi.regNo}</span>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4 relative z-10">
                         <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                               <MapPin size={12} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest truncate">{cpmi.targetCountry} &bull; {cpmi.jobType}</span>
                         </div>
                         <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
                               <Calendar size={12} className="text-slate-400" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Entry: {cpmi.registrationDate || '-'}</span>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between relative z-10">
                         <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">{cpmi.sponsor}</span>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:translate-x-1 duration-500">
                            <ChevronRight size={14} className="stroke-[3]" />
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="h-48 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center opacity-30 gap-3 grayscale">
                   <div className="p-6 bg-slate-200/50 dark:bg-slate-800/50 rounded-full">
                      <User size={32} className="text-slate-400" strokeWidth={1} />
                   </div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Awaiting Data</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
