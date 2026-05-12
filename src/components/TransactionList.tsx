import React, { useMemo, useState } from 'react';
import { Transaction, TransactionCategory } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Plus, Download, CreditCard, TrendingUp, Wallet, Search, Filter, ChevronRight } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface TransactionListProps {
  Transactions: Transaction[];
  cpmiId?: string; // If provided, shows transactions for specific CPMI
  onAddTransaction?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ Transactions, cpmiId, onAddTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filtered = useMemo(() => {
    let list = cpmiId ? Transactions.filter(t => t.cpmiId === cpmiId) : Transactions;
    
    if (typeFilter !== 'ALL') {
      list = list.filter(t => t.type === typeFilter);
    }
    
    if (searchTerm) {
      list = list.filter(t => 
        (t.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (t.refNo && t.refNo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return list.sort((a, b) => {
       const dateA = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
       const dateB = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
       return dateB - dateA;
    });
  }, [Transactions, cpmiId, searchTerm, typeFilter]);

  const handleExportExcel = () => {
    const data = filtered.map(t => ({
      'Date Log': new Date(t.date).toLocaleDateString('id-ID'),
      'Transaction Category': t.category,
      'Operation Type': t.type,
      'Internal Reference': t.refNo || 'UNREF',
      'Valuation': t.amount,
      'Audit Notes': t.note || 'N/A'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financial_Intelligence");
    XLSX.writeFile(wb, `Financial_Statement_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel statement generated successfully");
  };

  const stats = useMemo(() => {
    const income = filtered.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const expense = filtered.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalDebt = filtered.filter(t => t.type === 'DEBT').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalCredit = filtered.filter(t => t.type === 'CREDIT').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    return { income, expense, balance: income - expense, totalDebt, totalCredit };
  }, [filtered]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    filtered.forEach(t => {
      const amount = Number(t.amount) || 0;
      totals[t.category] = (totals[t.category] || 0) + (t.type === 'EXPENSE' ? -amount : amount);
    });
    return totals;
  }, [filtered]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(amount));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 px-2">
         <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
               <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-display">Capital Flow Ledger</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] ml-5">Global Auditing & Financial Oversight Terminal</p>
         </div>
         <div className="flex gap-4 w-full lg:w-auto">
            <Button variant="outline" onClick={handleExportExcel} className="h-16 px-8 rounded-[1.5rem] border-slate-200 dark:border-slate-800 dark:bg-slate-950/20 font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-4">
              <Download size={20} className="text-blue-500" strokeWidth={2.5} />
              Export Statement
            </Button>
            <Button onClick={onAddTransaction} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] px-10 h-16 shadow-2xl shadow-blue-500/30 transition-all active:scale-95 font-black uppercase tracking-widest text-[10px] flex items-center gap-4">
              <Plus size={20} className="stroke-[3]" />
              Commit Transaction
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SummaryCard 
          title="Consolidated Inflow" 
          value={formatCurrency(stats.income)} 
          icon={<TrendingUp size={24} strokeWidth={2.5} />} 
          color="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
          accent="bg-emerald-500"
        />
        <SummaryCard 
          title="Operational Outflow" 
          value={formatCurrency(stats.expense)} 
          icon={<TrendingUp size={24} strokeWidth={2.5} className="rotate-180" />} 
          color="bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
          accent="bg-rose-500"
        />
        <SummaryCard 
          title="Current Liquidity" 
          value={(stats.balance < 0 ? '-' : '') + formatCurrency(stats.balance)} 
          icon={<Wallet size={24} strokeWidth={2.5} />} 
          color="bg-slate-50 text-slate-900 dark:bg-slate-950/20 dark:text-white"
          accent="bg-slate-900 dark:bg-blue-600"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 bg-white/50 dark:bg-slate-950/20 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-black/40 backdrop-blur-xl ring-1 ring-slate-100/50 dark:ring-slate-800/50">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={20} />
            <Input 
               className="pl-16 h-16 border-none rounded-3xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800 focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 dark:text-white transition-all text-sm" 
               placeholder="Auditing search: Category, Entity, or Reference Code..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800">
               <Filter size={18} className="text-blue-500" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
               <SelectTrigger className="w-full md:w-64 h-16 rounded-[1.5rem] bg-white dark:bg-slate-900 border-none ring-1 ring-slate-200/50 dark:ring-slate-800 font-black uppercase text-[10px] tracking-widest text-slate-600 dark:text-slate-400 transition-all focus:ring-2 focus:ring-blue-600 px-8">
                  <SelectValue placeholder="System Filter" />
               </SelectTrigger>
               <SelectContent className="rounded-[1.5rem] border-slate-200 dark:border-slate-800 shadow-2xl p-2 bg-white dark:bg-slate-900 backdrop-blur-xl">
                  <SelectItem value="ALL" className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 focus:bg-blue-50">Global Statement</SelectItem>
                  <SelectItem value="INCOME" className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 text-emerald-600 focus:bg-emerald-50">Inflow Matrix (+)</SelectItem>
                  <SelectItem value="EXPENSE" className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 text-rose-600 focus:bg-rose-50">Outflow Metrics (-)</SelectItem>
                  <SelectItem value="DEBT" className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 text-blue-600 focus:bg-blue-50">Bridge Liquidity (Hutang)</SelectItem>
                  <SelectItem value="CREDIT" className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 text-slate-400 focus:bg-slate-50">Amortization (Pelunasan)</SelectItem>
               </SelectContent>
            </Select>
         </div>
      </div>

      <Card className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-black/60 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800">
        <div className="overflow-x-auto">
           <Table>
             <TableHeader className="bg-slate-50/50 dark:bg-black/20 h-20 border-b border-slate-100 dark:border-slate-800">
               <TableRow className="border-none hover:bg-transparent">
                 <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 pl-10">Temporal Record</TableHead>
                 <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Resource Category</TableHead>
                 <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Operation Tag</TableHead>
                 <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Audit Ref</TableHead>
                 <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right pr-10">Financial Value</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filtered.length > 0 && filtered.map(t => (
                 <TableRow key={t.id} className="hover:bg-slate-50 dark:hover:bg-blue-500/5 transition-all border-slate-50 dark:border-slate-800/30 h-24">
                   <TableCell className="pl-10 py-6 font-mono text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                     {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                        <span className="font-black text-slate-800 dark:text-slate-200 text-sm uppercase tracking-tight">{t.category}</span>
                     </div>
                   </TableCell>
                   <TableCell>
                     <Badge className={`${
                       t.type === 'INCOME' ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' : 
                       t.type === 'EXPENSE' ? 'bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400' :
                       t.type === 'DEBT' ? 'bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400' :
                       'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                     } border-none px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm`}>
                       {t.type === 'INCOME' ? 'Inflow' : 
                        t.type === 'EXPENSE' ? 'Outflow' : 
                        t.type === 'DEBT' ? 'Bridge' : 'Settlement'}
                     </Badge>
                   </TableCell>
                   <TableCell className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-600 tracking-tighter uppercase">{t.refNo || 'UNTRACKED'}</TableCell>
                   <TableCell className={`text-right pr-10 font-mono font-black text-lg tabular-nums tracking-tighter ${
                     t.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 
                     t.type === 'DEBT' ? 'text-blue-600 dark:text-blue-400' :
                     'text-slate-900 dark:text-white'
                   }`}>
                     {t.type === 'EXPENSE' || t.type === 'DEBT' ? '-' : '+'}{formatCurrency(t.amount)}
                   </TableCell>
                 </TableRow>
               ))}
               {filtered.length === 0 && (
                 <TableRow key="empty-state">
                   <TableCell colSpan={5} className="h-96 text-center">
                     <div className="flex flex-col items-center justify-center space-y-6 opacity-30">
                        <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-inner">
                           <CreditCard size={64} className="text-slate-300 dark:text-slate-600" strokeWidth={1} />
                        </div>
                        <div className="space-y-2">
                           <p className="text-xl font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white">Zero Activity Detected</p>
                           <p className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Awaiting financial command input...</p>
                        </div>
                     </div>
                   </TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
        </div>
      </Card>
      
      {filtered.length > 0 && cpmiId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
           {Object.entries(categoryTotals).map(([cat, val]) => (
             <div key={cat} className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-black/20 ring-1 ring-slate-200/30 dark:ring-slate-800/50 group hover:ring-blue-500 transition-all">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-600">{cat}</p>
               </div>
               <p className="text-2xl font-black text-slate-900 dark:text-white font-display tabular-nums group-hover:text-blue-600 transition-colors">{formatCurrency(val as number)}</p>
               <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-blue-600 w-1/3 group-hover:w-full transition-all duration-700"></div>
               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color, accent }: { title: string, value: string, icon: React.ReactNode, color: string, accent: string }) => (
  <Card className="rounded-[2.5rem] border-none bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-black/40 ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden group">
    <CardContent className="p-0 flex h-32 relative">
      <div className={`w-8 h-full ${accent} absolute left-0 top-0 opacity-10 group-hover:w-full transition-all duration-700`}></div>
      <div className={`w-1/4 flex items-center justify-center relative translate-x-2 transition-transform duration-500 group-hover:scale-110 ${color}`}>
        {icon}
      </div>
      <div className="w-3/4 p-10 flex flex-col justify-center relative z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 mb-2">{title}</p>
        <p className="text-2xl font-black font-display text-slate-900 dark:text-white tracking-tighter leading-none">{value}</p>
      </div>
    </CardContent>
  </Card>
);
