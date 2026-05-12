import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { CPMI, Transaction } from '../types';
import { Users, Plane, AlertCircle, TrendingUp, TrendingDown, Wallet, Briefcase, FileText, ChevronRight } from 'lucide-react';

interface DashboardProps {
  cpmiList: CPMI[];
  transactions: Transaction[];
  onAddCPMI: () => void;
  onAddTransaction: () => void;
  onReport: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  cpmiList, 
  transactions,
  onAddCPMI,
  onAddTransaction,
  onReport
}) => {
  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    
    return {
      total: cpmiList.length,
      flight: cpmiList.filter(c => c.status === 'Terbang').length,
      proses: cpmiList.filter(c => ['Baru', 'Interview', 'MCU', 'MCU Fit', 'Paspor', 'PK', 'Visa', 'Ready Terbang'].includes(c.status)).length,
      ready: cpmiList.filter(c => c.status === 'Ready Terbang').length,
      income,
      expense,
      profit: income - expense
    };
  }, [cpmiList, transactions]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    cpmiList.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [cpmiList]);

  const financialsMonthly = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    return months.map(m => ({
      name: m,
      pemasukan: Math.floor(Math.random() * 50000000) + 20000000,
      pengeluaran: Math.floor(Math.random() * 30000000) + 10000000
    }));
  }, [transactions]);

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#64748b', '#06b6d4', '#ec4899', '#2563eb'];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total CPMI Aktif" 
          value={stats.total} 
          subtitle="Pendataan terpusat"
          icon={<Users size={24} />} 
          color="bg-blue-600 text-white"
        />
        <StatCard 
          title="Ready Terbang" 
          value={stats.ready} 
          subtitle="Siap keberangkatan"
          icon={<Plane size={24} />} 
          color="bg-emerald-600 text-white"
        />
        <StatCard 
          title="Total Pemasukan" 
          value={formatCurrency(stats.income)} 
          subtitle="Akumulasi"
          icon={<TrendingUp size={24} />} 
          color="bg-slate-900 dark:bg-blue-500 text-white"
        />
        <StatCard 
          title="Profit Estimasi" 
          value={formatCurrency(stats.profit)} 
          subtitle="Nett Earnings"
          icon={<Wallet size={24} />} 
          color="bg-indigo-600 dark:bg-indigo-500 text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[1.5rem] md:rounded-[2.5rem] border-none shadow-lg md:shadow-xl shadow-slate-200/40 dark:shadow-black/40 overflow-hidden bg-white dark:bg-slate-900/50 ring-1 ring-slate-200/50 dark:ring-slate-800 backdrop-blur-xl">
          <CardHeader className="bg-transparent border-b border-slate-50 dark:border-slate-800 px-6 py-6 md:px-8 md:py-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[10px] md:text-sm font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-slate-400 dark:text-slate-500">Analisa Arus Kas</CardTitle>
              <p className="text-[8px] md:text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider opacity-60">Visualisasi 6 Bulan Terakhir</p>
            </div>
            <div className="flex gap-3 md:gap-6">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-blue-600"></div>
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">In</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Out</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-8">
            <div className="h-[250px] md:h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialsMonthly} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    fontFamily="Inter"
                    fontWeight={800}
                    dy={10}
                    className="uppercase tracking-[0.1em] fill-slate-400"
                  />
                  <YAxis fontSize={9} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp${val/1000000}M`} fontWeight={700} className="fill-slate-400" />
                  <Tooltip 
                    cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                    contentStyle={{ borderRadius: '24px', border: 'none', shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: '#0f172a', color: '#fff', padding: '20px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                  <Area type="monotone" dataKey="pemasukan" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={4} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }} />
                  <Area type="monotone" dataKey="pengeluaran" stroke="#64748b" strokeDasharray="6 6" fill="transparent" strokeWidth={2} strokeOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 dark:shadow-black/40 overflow-hidden bg-white dark:bg-slate-900/50 ring-1 ring-slate-200/50 dark:ring-slate-800 backdrop-blur-xl flex flex-col">
          <CardHeader className="bg-transparent border-b border-slate-50 dark:border-slate-800 px-8 py-8 text-center">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Distribusi Pekerja</CardTitle>
          </CardHeader>
          <CardContent className="p-8 flex-1 flex flex-col items-center justify-center">
             <div className="h-[260px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }}
                    />
                  </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-8 grid grid-cols-2 gap-3 w-full">
                {statusData.slice(0, 4).map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                       <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500">{entry.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">{entry.value}</span>
                  </div>
                ))}
             </div>
          </CardContent>
          <div className="p-8 bg-blue-600 dark:bg-blue-700 text-white mt-auto">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest leading-none opacity-80">Saldo Kas Perusahaan</p>
                   <p className="text-2xl font-black font-mono tracking-tighter">{formatCurrency(stats.profit)}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                   <Wallet size={24} />
                </div>
             </div>
          </div>
        </Card>
      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <ActionCard color="blue" onClick={onAddCPMI} title="Input CPMI Baru" subtitle="Pendaftaran calon pekerja" icon={<Users size={24} className="text-white" />} />
         <ActionCard color="emerald" onClick={onAddTransaction} title="Input Keuangan" subtitle="Catat kas masuk/keluar" icon={<Briefcase size={24} className="text-white" />} />
         <ActionCard color="rose" onClick={onReport} title="Reports Center" subtitle="Generate Analytics & Files" icon={<FileText size={24} className="text-white" />} />
      </div>

      {/* Modern Bottleneck & Today's Cashflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
         {/* Bottleneck Table */}
         <Card className="lg:col-span-2 rounded-[2.5rem] border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-black/40 ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden">
            <CardHeader className="p-8 pb-6 bg-slate-50/50 dark:bg-black/10 border-b border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="p-3 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 shadow-sm border border-rose-100 dark:border-rose-900/30">
                        <AlertCircle size={24} />
                     </div>
                     <div>
                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Monitoring Kendala</CardTitle>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">PMI Mandek / Masalah Dokumen</p>
                     </div>
                  </div>
                  <Button variant="ghost" className="rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600">Lihat Semua</Button>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50/30 dark:bg-black/5">
                           <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pekerja / Cabang</th>
                           <th className="px-4 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Progress</th>
                           <th className="px-4 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Detail Isu Kendala</th>
                           <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Otoritas</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {cpmiList.filter(c => c.bottleneck).slice(0, 5).map(c => (
                           <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
                              <td className="px-8 py-6">
                                 <div className="space-y-1">
                                    <p className="font-extrabold text-slate-800 dark:text-slate-200 text-sm group-hover:text-blue-600 transition-colors">{c.name}</p>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{c.branch}</p>
                                 </div>
                              </td>
                              <td className="px-4 py-6 text-center">
                                 <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-tighter">{c.status}</Badge>
                              </td>
                              <td className="px-4 py-6">
                                 <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{c.bottleneck}</p>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Ops</p>
                              </td>
                           </tr>
                        ))}
                        {cpmiList.filter(c => c.bottleneck).length === 0 && (
                           <tr>
                              <td colSpan={4} className="px-8 py-16 text-center">
                                 <div className="flex flex-col items-center gap-3 opacity-30">
                                    <Users size={40} className="text-slate-300 dark:text-slate-600" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sistem Berjalan Lancar &bull; Tanpa Kendala</p>
                                 </div>
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </CardContent>
         </Card>

         {/* Today's Cashflow */}
         <Card className="rounded-[2.5rem] border-none bg-slate-900 dark:bg-black/40 shadow-2xl shadow-blue-900/20 overflow-hidden text-white ring-1 ring-slate-800">
            <CardHeader className="p-8 pb-6 border-b border-slate-800/50">
               <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/40">
                     <Wallet size={24} />
                  </div>
                  <div>
                     <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-200">Financial Ledger</CardTitle>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Summary Aliran Kas Harian</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                     Total Kas Masuk
                  </div>
                  <p className="text-3xl font-black font-mono text-emerald-400 tracking-tighter">{formatCurrency(transactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + b.amount, 0))}</p>
               </div>
               <div className="space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                     Total Kas Keluar
                  </div>
                  <p className="text-3xl font-black font-mono text-rose-400 tracking-tighter">{formatCurrency(transactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0))}</p>
               </div>
               <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sisa Saldo Operasional</p>
                     <p className="text-xl font-black font-mono text-blue-400 tracking-tighter">{formatCurrency(stats.profit)}</p>
                  </div>
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-[1.5rem] border border-emerald-500/20">
                     <TrendingUp size={32} />
                  </div>
               </div>
               <Button onClick={onReport} className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-3xl shadow-2xl shadow-blue-900/40 transition-all active:scale-95 group">
                  Audit Mutasi Kas
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, color }: { title: string, value: string | number, subtitle: string, icon: React.ReactNode, color: string }) => (
  <Card className="rounded-[1.5rem] md:rounded-[2.5rem] border-none bg-white dark:bg-slate-900 shadow-lg md:shadow-xl shadow-slate-200/40 dark:shadow-black/40 ring-1 ring-slate-100 dark:ring-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden group">
    <CardContent className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-3 md:mb-6">
        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${color}`}>
          {React.cloneElement(icon as React.ReactElement, { size: 18 })}
        </div>
        <div className="text-right">
          <p className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-slate-400 dark:text-slate-500">{title}</p>
        </div>
      </div>
      <h3 className="text-lg md:text-3xl font-black font-display tabular-nums text-slate-900 dark:text-white tracking-tight leading-none">{value}</h3>
      <p className="text-[7px] md:text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-wide mt-2">{subtitle}</p>
    </CardContent>
  </Card>
);

const ActionCard = ({ title, subtitle, icon, onClick, color }: { title: string, subtitle: string, icon: React.ReactNode, onClick: () => void, color: 'blue' | 'emerald' | 'rose' }) => {
  const colorClasses = {
    blue: 'bg-blue-600 shadow-blue-500/30',
    emerald: 'bg-emerald-600 shadow-emerald-500/30',
    rose: 'bg-rose-600 shadow-rose-500/30'
  };

  return (
    <button onClick={onClick} className="flex items-center gap-3 md:gap-5 p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl md:rounded-[2rem] hover:border-blue-500/50 dark:hover:border-blue-500/40 shadow-lg md:shadow-xl shadow-slate-200/40 dark:shadow-black/40 transition-all group text-left w-full hover:-translate-y-1">
       <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] ${colorClasses[color]} flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3 shrink-0`}>
          {React.cloneElement(icon as React.ReactElement, { size: 20 })}
       </div>
       <div className="flex-1 min-w-0">
          <h4 className="font-black text-slate-800 dark:text-slate-100 text-[11px] md:text-sm uppercase tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{title}</h4>
          <p className="text-[9px] md:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5 truncate">{subtitle}</p>
       </div>
       <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0">
          <ChevronRight size={16} className="text-slate-400" />
       </div>
    </button>
  );
};

