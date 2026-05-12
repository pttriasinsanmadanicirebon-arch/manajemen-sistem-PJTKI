import React, { useState, useMemo } from 'react';
import { CPMI, CPMIStatus } from '../types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MoreVertical, Search, Plus, Filter, FileSpreadsheet, TrendingUp, Users, Download } from 'lucide-react';

interface CPMIListProps {
  cpmiList: CPMI[];
  onAdd: () => void;
  onEdit: (cpmi: CPMI) => void;
  onViewDetails: (cpmi: CPMI) => void;
}

export const CPMIList: React.FC<CPMIListProps> = ({ cpmiList, onAdd, onEdit, onViewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CPMIStatus | 'Semua'>('Semua');

  const filteredList = useMemo(() => {
    return cpmiList.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = (c.name?.toLowerCase() || '').includes(q) || 
                             (c.regNo?.toLowerCase() || '').includes(q) ||
                             (c.sponsor?.toLowerCase() || '').includes(q) ||
                             (c.nik && c.nik.includes(q));
      const matchesStatus = statusFilter === 'Semua' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cpmiList, searchQuery, statusFilter]);

  const handleExportExcel = () => {
    // In a real app, this would generate an actual excel file
    console.log('Exporting data to Excel...');
    alert('Menyiapkan file Excel Database CPMI... Silahkan tunggu sebentar.');
  };

  const getStatusBadge = (status: CPMIStatus) => {
    const configs: Record<CPMIStatus, { bg: string; text: string; label: string, dot: string }> = {
      'Baru': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: 'Baru', dot: 'bg-slate-400' },
      'Interview': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Interview', dot: 'bg-blue-500' },
      'MCU': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'Proses MCU', dot: 'bg-amber-500' },
      'MCU Fit': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', label: 'MCU Fit', dot: 'bg-emerald-500' },
      'Paspor': { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', label: 'Proses Paspor', dot: 'bg-indigo-500' },
      'PK': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', label: 'PK / Kontrak', dot: 'bg-purple-500' },
      'Visa': { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-400', label: 'Visa', dot: 'bg-violet-500' },
      'Ready Terbang': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', label: 'Ready Terbang', dot: 'bg-rose-500' },
      'Terbang': { bg: 'bg-blue-600 dark:bg-blue-600', text: 'text-white', label: 'Sudah Terbang', dot: 'bg-white' },
      'Working': { bg: 'bg-teal-600 dark:bg-teal-600', text: 'text-white', label: 'Bekerja', dot: 'bg-white' },
      'Return': { bg: 'bg-slate-600 dark:bg-slate-600', text: 'text-white', label: 'Sudah Pulang', dot: 'bg-white' },
      'Cancel': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Dibatalkan', dot: 'bg-red-500' },
    };
    const c = configs[status] || configs['Baru'];
    return (
      <Badge className={`${c.bg} ${c.text} hover:opacity-80 border-none px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-sm`}>
        <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></div>
        {c.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 px-2">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white font-display uppercase">Database CPMI</h2>
           </div>
           <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-5">Integrasi Data Calon Pekerja &bull; Global Ecosystem</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
           <Button 
             variant="outline" 
             onClick={handleExportExcel}
             className="flex-1 md:flex-none border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 rounded-2xl h-16 px-8 font-black text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
           >
              <Download size={20} className="mr-3 text-blue-600" />
              Export Excel
           </Button>
           <Button onClick={onAdd} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-10 h-16 shadow-2xl shadow-blue-900/30 transition-all active:scale-95">
             <Plus size={22} className="mr-3 stroke-[3]" />
             <span className="font-black uppercase tracking-widest text-xs">Registrasi Baru</span>
           </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 bg-white/50 dark:bg-slate-950/20 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-black/20 backdrop-blur-xl ring-1 ring-slate-100/50 dark:ring-slate-800/50">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={20} />
          <Input 
            placeholder="Cari Identitas Pekerja, Sponsor, atau Branch..." 
            className="pl-16 h-16 border-none rounded-3xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800 focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 dark:text-white transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
           <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" className="h-16 border-none ring-1 ring-slate-200/50 dark:ring-slate-800 rounded-3xl px-8 flex items-center space-x-4 bg-white dark:bg-slate-900 font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <Filter size={18} className="text-blue-500" />
                <span>Status: {statusFilter}</span>
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-72 rounded-3xl p-3 border-slate-200 dark:border-slate-800 shadow-2xl mt-4 bg-white dark:bg-slate-900 backdrop-blur-xl">
              <DropdownMenuItem onClick={() => setStatusFilter('Semua')} className="rounded-2xl py-4 font-black uppercase text-[10px] tracking-[0.2em] text-slate-600 dark:text-slate-400 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-600">Semua Progres</DropdownMenuItem>
              {['Baru', 'Interview', 'MCU', 'MCU Fit', 'Paspor', 'PK', 'Visa', 'Ready Terbang', 'Terbang', 'Cancel'].map(s => (
                <DropdownMenuItem key={s} onClick={() => setStatusFilter(s as any)} className="rounded-2xl py-4 font-black uppercase text-[10px] tracking-[0.2em] text-slate-600 dark:text-slate-400 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-600">
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-black/40 overflow-hidden ring-1 ring-slate-100/50 dark:ring-slate-800/50">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-black/20 h-20 border-b border-slate-100 dark:border-slate-800">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[120px] font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 pl-10">Regulatory</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Pekerja Migran</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Assignment</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Entity/Sponsor</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-center">Division</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Process State</TableHead>
                <TableHead className="w-[80px] pr-10 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length > 0 && filteredList.map((cpmi) => (
                <TableRow key={cpmi.id || `cpmi-${cpmi.regNo}`} className="group hover:bg-slate-50 dark:hover:bg-blue-500/5 transition-all border-slate-50 dark:border-slate-800/50 cursor-pointer h-24" onClick={() => onViewDetails(cpmi)}>
                  <TableCell className="font-mono text-[9px] font-black text-slate-400 dark:text-slate-600 pl-10 uppercase tracking-[0.1em]">{cpmi.regNo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-5">
                       <div className="relative">
                          {cpmi.photoUrl ? (
                             <img src={cpmi.photoUrl} alt={cpmi.name} className="w-12 h-16 rounded-[1rem] object-cover shadow-lg border-2 border-white dark:border-slate-800 group-hover:scale-105 transition-transform" />
                          ) : (
                             <div className="w-12 h-16 rounded-[1rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border-2 border-white dark:border-slate-800">
                                <Users size={20} strokeWidth={1.5} />
                             </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm"></div>
                       </div>
                       <div className="flex flex-col space-y-1">
                          <span className="font-black text-slate-800 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{cpmi.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-600 font-black tabular-nums tracking-widest">{cpmi.nik || 'NO-ID'}</span>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{cpmi.targetCountry}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-600 font-bold uppercase tracking-widest opacity-80">{cpmi.jobType || 'General Worker'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{cpmi.sponsor || 'Personal'}</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="ghost" className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-500 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">{cpmi.branch || 'Head Office'}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(cpmi.status)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()} className="pr-10 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl shadow-slate-200/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                          <MoreVertical size={20} className="text-slate-400" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="rounded-3xl p-3 border-slate-100 dark:border-slate-800 shadow-2xl mt-2 w-56 bg-white dark:bg-slate-900 backdrop-blur-xl">
                        <DropdownMenuItem onClick={() => onViewDetails(cpmi)} className="rounded-2xl py-4 px-5 font-black uppercase text-[10px] tracking-[0.2em] text-slate-600 dark:text-slate-400 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-600">
                          <TrendingUp size={16} className="mr-4 text-blue-500" />
                          Tracking
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(cpmi)} className="rounded-2xl py-4 px-5 font-black uppercase text-[10px] tracking-[0.2em] text-slate-600 dark:text-slate-400 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-600">
                          <FileSpreadsheet size={16} className="mr-4 text-emerald-500" />
                          Update Data
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredList.length === 0 && (
                <TableRow key="empty-state">
                  <TableCell colSpan={7} className="h-96 text-center">
                    <div className="flex flex-col items-center justify-center space-y-6 opacity-40">
                      <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-inner">
                        <Users size={64} className="text-slate-300 dark:text-slate-600" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white">Record Not Found</p>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Adjust filters or search parameters</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
