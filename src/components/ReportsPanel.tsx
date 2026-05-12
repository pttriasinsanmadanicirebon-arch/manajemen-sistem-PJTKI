import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CPMI, Transaction } from '../types';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Briefcase,
  PieChart as PieChartIcon,
  Calendar
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface ReportsPanelProps {
  cpmiList: CPMI[];
  transactions: Transaction[];
}

export const ReportsPanel: React.FC<ReportsPanelProps> = ({ cpmiList, transactions }) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const stats = useMemo(() => {
    const problematic = cpmiList.filter(c => c.bottleneck).length;
    const readyFly = cpmiList.filter(c => c.status === 'Ready Terbang').length;
    const income = transactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + (Number(b.amount) || 0), 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + (Number(b.amount) || 0), 0);
    
    return { problematic, readyFly, income, expense, balance: income - expense };
  }, [cpmiList, transactions]);

  const exportExcel = (data: any[], fileName: string) => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      toast.success("Laporan berhasil diunduh");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengunduh laporan");
    }
  };

  const handleExportCPMI = () => {
    const data = cpmiList.map(c => ({
      'Regulatory ID': c.regNo,
      'Full Name': c.name,
      'ID Card (NIK)': c.nik,
      'Agent/Sponsor': c.sponsor,
      'Target Entity': c.targetCountry,
      'Process State': c.status,
      'Issue Log': c.bottleneck || 'CLEAR',
      'Entry Date': c.registrationDate
    }));
    exportExcel(data, `Global_CPMI_Database_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportFinance = () => {
    const data = transactions.map(t => ({
      'Date Log': t.date,
      'Type': t.type,
      'Sector/Category': t.category,
      'Valuation': t.amount,
      'Ref Number': t.refNo,
      'Associated CPMI': t.cpmiId || 'N/A'
    }));
    exportExcel(data, `Financial_Statement_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportProblematic = () => {
    const data = cpmiList.filter(c => c.bottleneck).map(c => ({
      'Operator': c.name,
      'Terminal Status': c.status,
      'Description of Issue': c.bottleneck,
      'Division/Branch': c.branch,
      'Agent Representative': c.sponsor
    }));
    exportExcel(data, `Problematic_Ops_List_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 px-2">
      <div className="flex flex-col space-y-2">
         <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-display">Financial & Ops Intelligence</h2>
         </div>
         <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] ml-5">Cross-Border Resource Analytics & Analytics Center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatReportCard title="Critical Bottlenecks" value={stats.problematic} icon={<AlertCircle />} color="text-rose-600 dark:text-rose-400" bgColor="bg-rose-50 dark:bg-rose-900/20" />
        <StatReportCard title="Deployment Ready" value={stats.readyFly} icon={<TrendingUp />} color="text-emerald-600 dark:text-emerald-400" bgColor="bg-emerald-50 dark:bg-emerald-900/20" />
        <StatReportCard title="Total Cash Inflow" value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(stats.income)} icon={<PieChartIcon />} color="text-blue-600 dark:text-blue-400" bgColor="bg-blue-50 dark:bg-blue-900/20" />
        <StatReportCard title="Current Liquidity" value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(stats.balance)} icon={<Briefcase />} color="text-amber-600 dark:text-amber-400" bgColor="bg-amber-50 dark:bg-amber-900/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
          <CardHeader className="p-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
             <div className="flex items-center gap-6">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-xl shadow-blue-500/10 border border-slate-100 dark:border-slate-700">
                   <Download size={28} className="text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                </div>
                <div>
                   <CardTitle className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-display">Asset Export Center</CardTitle>
                   <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Cross-platform data synchronization (.XLSX)</p>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReportAction 
                  title="Full Master Database" 
                  desc="Comprehensive regulatory dataset" 
                  icon={<Users className="text-blue-600" />} 
                  onClick={handleExportCPMI} 
                />
                <ReportAction 
                  title="Global Finance Ledger" 
                  desc="Detailed transaction audit log" 
                  icon={<FileText className="text-emerald-600" />} 
                  onClick={handleExportFinance} 
                />
                <ReportAction 
                  title="Exception/Issue Report" 
                  desc="Bottleneck & contingency analysis" 
                  icon={<AlertCircle className="text-rose-600" />} 
                  onClick={handleExportProblematic} 
                />
                <ReportAction 
                  title="Network Performance" 
                  desc="Affiliate & distribution analytics" 
                  icon={<TrendingUp className="text-amber-600" />} 
                  onClick={() => toast.info("Advanced analytics arriving soon")} 
                />
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
          <CardHeader className="p-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-600/10 dark:bg-blue-400/10 rounded-lg">
                   <Calendar size={20} className="text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Temporal Filter</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Period Inception</label>
                   <input 
                     type="date" 
                     className="w-full h-16 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950/50 border-none ring-1 ring-slate-200 dark:ring-slate-800 outline-none px-6 font-black text-slate-700 dark:text-white transition-all focus:ring-2 focus:ring-blue-600" 
                     value={dateRange.start}
                     onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Period Termination</label>
                   <input 
                     type="date" 
                     className="w-full h-16 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950/50 border-none ring-1 ring-slate-200 dark:ring-slate-800 outline-none px-6 font-black text-slate-700 dark:text-white transition-all focus:ring-2 focus:ring-blue-600" 
                     value={dateRange.end}
                     onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                   />
                </div>
             </div>
             <Button className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-500/30 transition-all active:scale-95">
                Apply Intelligence Filter
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatReportCard = ({ title, value, icon, color, bgColor }: any) => (
  <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 dark:shadow-black/20 bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden group">
    <CardContent className="p-10 flex items-center justify-between relative">
       <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100/50 dark:bg-slate-800/10 rounded-bl-[10rem] group-hover:scale-110 transition-transform -z-0"></div>
       <div className="space-y-3 relative z-10">
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">{title}</p>
          <p className={`text-3xl font-black font-display tracking-tight leading-none ${color}`}>{value}</p>
       </div>
       <div className={`p-5 ${bgColor} ${color} rounded-[1.5rem] relative z-10 shadow-inner group-hover:rotate-12 transition-all duration-500`}>
          {React.cloneElement(icon, { size: 30, strokeWidth: 2.5 })}
       </div>
    </CardContent>
  </Card>
);

const ReportAction = ({ title, desc, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-950/20 hover:bg-white dark:hover:bg-slate-800 hover:ring-1 hover:ring-slate-200 dark:hover:ring-slate-700 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/60 transition-all text-left group border border-transparent border-dashed"
  >
     <div className="p-4 bg-white dark:bg-slate-900 rounded-[1.25rem] shadow-xl shadow-slate-200/50 dark:shadow-black/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ring-1 ring-slate-100 dark:ring-slate-800">
        {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
     </div>
     <div>
        <h4 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase leading-none">{title}</h4>
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.1em] mt-2 group-hover:text-blue-500 transition-colors">{desc}</p>
     </div>
  </button>
);
