import React, { useState } from 'react';
import { CPMI, CPMIDocument, Transaction, CPMIStatus, TransactionCategory } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Label } from './ui/label';
import { 
  User, 
  MapPin, 
  Briefcase, 
  Building, 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Download,
  Printer
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { TransactionList } from './TransactionList';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface CPMIDetailProps {
  cpmi: CPMI;
  documents: CPMIDocument[];
  transactions: Transaction[];
  onUpdateStatus: (status: CPMIStatus) => void;
  onUpdateCompleteness: (k: keyof CPMI['completeness'], v: boolean) => void;
  onUploadDocument: (file: File, type: string) => void;
  onAddTransaction: () => void;
  onBack: () => void;
}

export const CPMIDetail: React.FC<CPMIDetailProps> = ({ 
  cpmi, 
  documents, 
  transactions,
  onUpdateStatus, 
  onUpdateCompleteness,
  onUploadDocument,
  onAddTransaction,
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState('profile');

  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  const feeCategories: { label: string, key: TransactionCategory }[] = [
    { label: 'Living Cost', key: 'Living cost' },
    { label: 'Medical Check-up (MCU)', key: 'MCU' },
    { label: 'Proses Paspor', key: 'Paspor' },
    { label: 'Visa & Stampting', key: 'Visa' },
    { label: 'Asuransi / BPJS', key: 'BPJS' },
    { label: 'Transportasi', key: 'Transport' },
    { label: 'Fee Sponsor', key: 'Fee sponsor' },
    { label: 'Tiket Pesawat', key: 'Tiket' },
  ];

  const getFeeStatus = (category: TransactionCategory) => {
    const amount = transactions
      .filter(t => t.category === category && t.type === 'EXPENSE')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return amount;
  };

  const requiredDocTypes: string[] = ["KTP", "KK", "Akte Kelahiran", "Ijazah", "Paspor", "Medical", "Perjanjian Penempatan"];

  const handleDownloadProfile = () => {
    const profileData = [
      { Kategori: '--- INFORMASI REGISTRASI ---', Detail: '' },
      { Kategori: 'No. Registrasi', Detail: cpmi.regNo },
      { Kategori: 'Tanggal Daftar', Detail: cpmi.registrationDate },
      { Kategori: 'Cabang', Detail: cpmi.branch || 'Pusat' },
      { Kategori: 'Status Terakhir', Detail: cpmi.status },
      { Kategori: '', Detail: '' },
      { Kategori: '--- DATA PRIBADI ---', Detail: '' },
      { Kategori: 'Nama Lengkap', Detail: cpmi.name.toUpperCase() },
      { Kategori: 'NIK', Detail: cpmi.nik },
      { Kategori: 'No. Paspor', Detail: cpmi.passportNo || '-' },
      { Kategori: 'Jenis Kelamin', Detail: cpmi.gender },
      { Kategori: 'Tempat Lahir', Detail: cpmi.birthPlace },
      { Kategori: 'Tanggal Lahir', Detail: cpmi.birthDate },
      { Kategori: 'Pendidikan', Detail: cpmi.education },
      { Kategori: 'Status Nikah', Detail: cpmi.marriageStatus || 'Single' },
      { Kategori: 'Alamat KTP', Detail: cpmi.address },
      { Kategori: 'No. HP / WA', Detail: cpmi.phone },
      { Kategori: 'Kontak Keluarga', Detail: cpmi.familyContact },
      { Kategori: 'Sponsor / PL', Detail: cpmi.sponsor },
      { Kategori: '', Detail: '' },
      { Kategori: '--- RENCANA PENEMPATAN ---', Detail: '' },
      { Kategori: 'Negara Tujuan', Detail: cpmi.targetCountry },
      { Kategori: 'Job Pekerjaan', Detail: cpmi.jobType },
      { Kategori: 'Agency / Majikan', Detail: cpmi.agency || '-' },
      { Kategori: 'Estimasi Terbang', Detail: cpmi.flightDate || '-' },
      { Kategori: '', Detail: '' },
      { Kategori: '--- CATATAN INTERNAL ---', Detail: '' },
      { Kategori: 'Catatan Admin', Detail: cpmi.note || '-' },
      { Kategori: 'Bottleneck', Detail: cpmi.bottleneck || '-' },
    ];

    const ws = XLSX.utils.json_to_sheet(profileData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profil CPMI");
    XLSX.writeFile(wb, `Profil_${cpmi.name.replace(/\s+/g, '_')}.xlsx`);
    toast.success("Profil berhasil diunduh");
  };

  const handlePrintBiodata = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24 dark:text-slate-200">
      {/* PRINT ONLY BIODATA - Optimized for the requested layout */}
      <div className="hidden print:block bg-white text-black p-0 m-0" style={{ fontSize: '10px' }}>
        <div className="flex gap-6 mb-6">
          <div className="w-32 h-40 shrink-0 overflow-hidden rounded-lg border">
            {cpmi.photoUrl ? (
              <img src={cpmi.photoUrl} alt={cpmi.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                <User size={40} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-[8px] font-bold uppercase text-slate-500">Data Sesuai Dukcapil</p>
            <h1 className="text-2xl font-black uppercase mt-1">{cpmi.name}</h1>
            <div className="flex gap-4 mt-2 mb-3">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-blue-600" />
                <span className="font-bold">{cpmi.gender === 'Perempuan' ? 'P' : 'L'}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-blue-600" />
                <span className="font-bold">{new Date().getFullYear() - new Date(cpmi.birthDate).getFullYear()} Tahun</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-y-2 text-[9px] font-medium">
              <div className="flex items-center gap-1"><Briefcase size={10} /> {cpmi.weight || '-'} kg</div>
              <div className="flex items-center gap-1"><MapPin size={10} /> {cpmi.height || '-'} cm</div>
              <div className="flex items-center gap-1"><Clock size={10} /> {cpmi.phone}</div>
              <div className="flex items-center gap-1 col-span-2 capitalize"><ShieldCheck size={10} /> {cpmi.birthPlace}, {cpmi.birthDate}</div>
            </div>
            <div className="mt-4 border p-2 rounded flex items-center gap-2 w-max">
               <Download size={14} />
               <span className="font-bold uppercase text-[8px]">Unduh Dokumen Kepesertaan</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-black uppercase border-b-2 border-black pb-1 mb-3">Detail Proses Penempatan</h2>
          <div className="space-y-3">
            {[...(cpmi.statusHistory || [])].reverse().map((h, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle2 size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[9px]">{h.date}</p>
                  <p className="text-[8px] text-slate-600">{h.status} - {h.note || 'Diproses oleh sistem'}</p>
                </div>
              </div>
            ))}
            {(!cpmi.statusHistory || cpmi.statusHistory.length === 0) && (
              <div className="flex gap-3">
                <CheckCircle2 size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[9px]">{cpmi.registrationDate}</p>
                  <p className="text-[8px] text-slate-600">Pendaftaran - Berhasil terintegrasi ke sistem</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
           <h2 className="text-xs font-black uppercase border-b-2 border-black pb-1 mb-2">ID Registrasi</h2>
           <p className="text-[9px]">({cpmi.regNo})</p>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
          <section>
            <h2 className="text-xs font-black uppercase border-b border-slate-200 pb-1 mb-2">Detail Data Diri</h2>
            <div className="space-y-1.5">
              <PrintField label="NIK" value={cpmi.nik} />
              <PrintField label="TTL" value={`${cpmi.birthPlace}, ${cpmi.birthDate}`} />
              <PrintField label="Provinsi" value={cpmi.provinsi} />
              <PrintField label="Kabupaten" value={cpmi.kabupaten} />
              <PrintField label="Alamat" value={cpmi.address} />
              <PrintField label="Status Kawin" value={cpmi.marriageStatus} />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase border-b border-slate-200 pb-1 mb-2">Data orang tua</h2>
            <div className="space-y-1.5">
              <PrintField label="Nama Ibu" value={cpmi.motherName} />
              <PrintField label="Nama Ayah" value={cpmi.fatherName} />
              <PrintField label="Alamat orang tua" value={cpmi.parentsAddress} />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase border-b border-slate-200 pb-1 mb-2">Jamsos Selama dan Setelah Penempatan</h2>
            <div className="space-y-1.5">
              <PrintField label="Provider" value="-" />
              <PrintField label="Nomor" value="-" />
              <PrintField label="Tanggal Berlaku" value="s.d. -" />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase border-b border-slate-200 pb-1 mb-2">Resume Pendidikan</h2>
            <div className="space-y-1.5">
               <p className="text-[8px] font-bold text-slate-400">2019 - 2022</p>
               <p className="text-[9px] font-bold uppercase">{cpmi.education} - TEKNIK KOMPUTER DAN INFORMATIKA <span className="text-blue-600">SMK NASYRUL ULUM GEGESIK</span></p>
            </div>
          </section>

          <section className="col-span-2">
            <h2 className="text-xs font-black uppercase border-b border-slate-200 pb-1 mb-2">Persyaratan Seleksi</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {Object.entries(cpmi.completeness).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1">
                   <p className="text-[9px] font-bold capitalize">{k}</p>
                   <CheckCircle2 size={10} className={v ? "text-emerald-600" : "text-slate-300"} />
                </div>
              ))}
            </div>
          </section>

          <section className="col-span-2">
            <h2 className="text-xs font-black uppercase border-b border-slate-200 pb-1 mb-2">Persyaratan OPP</h2>
            <div className="flex gap-4">
              <p className="text-[9px] font-bold">Paspor</p>
              <p className="text-[9px] font-bold">Perjanjian Kerja</p>
              <p className="text-[9px] font-bold">Visa Kerja</p>
            </div>
          </section>

          <section className="col-span-2">
            <h2 className="text-xs font-black uppercase border-b border-slate-200 pb-1 mb-2">Dokumen Penempatan</h2>
            <div className="flex flex-wrap gap-4">
              {['Cost Structure', 'Draft Perjanjian Kerja', 'Draft Perjanjian Kerja ttd PMI', 'Jamsos Sebelum Bekerja', 'Jamsos Selama dan Setelah Bekerja', 'Perjanjian Penempatan Pekerja Migran Indonesia', 'Sertifikat Fit to Work'].map(d => (
                <p key={d} className="text-[9px] font-bold">{d} <CheckCircle2 size={8} className="inline ml-1 text-slate-300" /></p>
              ))}
            </div>
          </section>

          <section className="col-span-2">
            <h2 className="text-xs font-black uppercase border-b border-slate-200 pb-1 mb-2">Informasi Peluang Kerja</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[8px] font-bold text-slate-400">No Job Order :</p>
                <p className="text-[9px] font-bold">{cpmi.regNo.replace('REG', 'JOB')}</p>
              </div>
              <div>
                <p className="text-[8px] font-bold text-slate-400">No SIP2MI :</p>
                <p className="text-[9px] font-bold">B. 432/SIP2MI/IV/2026</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 no-print">
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl hover:bg-white dark:hover:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-800 h-12 w-12 shrink-0">
            <ArrowLeft size={24} />
          </Button>
          <div className="flex-1 flex items-center gap-6">
            {cpmi.photoUrl ? (
               <div className="relative group">
                  <img src={cpmi.photoUrl} alt={cpmi.name} className="w-20 h-24 md:w-24 md:h-32 object-cover rounded-2xl shadow-xl ring-4 ring-white dark:ring-slate-900 shrink-0" />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 dark:ring-white/10 pointer-events-none"></div>
               </div>
            ) : (
               <div className="w-20 h-24 md:w-24 md:h-32 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-700 shrink-0 border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <User size={40} />
               </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                 <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display uppercase">{cpmi.name}</h2>
                 <Badge className="bg-blue-600 text-white border-none px-4 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md shadow-blue-200 dark:shadow-blue-900/40 font-mono">
                   {cpmi.status}
                 </Badge>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                 Reg: <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{cpmi.regNo}</span> | Cabang: <span className="text-slate-700 dark:text-slate-300 font-bold">{cpmi.branch || 'Pusat'}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <div className="flex gap-2 w-full md:w-auto">
              <Button onClick={handlePrintBiodata} variant="outline" className="flex-1 md:flex-none rounded-2xl px-6 h-14 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 font-bold active:scale-95 transition-all">
                <Printer size={20} className="mr-2" />
                PRINT BIODATA
              </Button>
              <Button onClick={handleDownloadProfile} variant="default" className="flex-1 md:flex-none rounded-2xl px-6 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">
                <Download size={20} className="mr-2" />
                XLSX
              </Button>
           </div>
           <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button className="flex-1 md:flex-none rounded-2xl px-8 h-14 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 border shadow-sm font-bold active:scale-95 transition-all">
                  Update Status
                </Button>
              } />
              <DropdownMenuContent align="end" className="rounded-2xl p-2 w-56 shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                 {['Baru', 'Interview', 'MCU', 'MCU Fit', 'Paspor', 'PK', 'Visa', 'Ready Terbang', 'Terbang', 'Cancel'].map((s) => (
                    <DropdownMenuItem key={s} onClick={() => onUpdateStatus(s as any)} className="rounded-xl py-3.5 font-bold text-[11px] uppercase tracking-wider focus:bg-blue-600 focus:text-white cursor-pointer mb-0.5">
                      {s}
                    </DropdownMenuItem>
                 ))}
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 no-print">
        {/* Left Column: CPMI Info & Financials */}
        <section className="w-full lg:w-3/5 flex flex-col gap-8">
          {/* Fee Tracking Dashboard */}
          <Card className="rounded-[2.5rem] border-none bg-slate-900 dark:bg-slate-900/50 shadow-2xl shadow-blue-900/20 overflow-hidden ring-1 ring-white/5">
            <CardHeader className="px-10 py-8 border-b border-white/5">
               <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Tracking Fee Proses</CardTitle>
                    <p className="text-xs text-slate-500 font-medium italic">Breakdown pengeluaran operasional pekerja</p>
                  </div>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-400/30 px-4 py-1.5 rounded-full font-bold text-[10px]">REALTIME SYNC</Badge>
               </div>
            </CardHeader>
            <CardContent className="p-10">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {feeCategories.map((fee) => {
                    const amount = getFeeStatus(fee.key);
                    const isPaid = amount > 0;
                    return (
                      <div key={fee.key} className={`group relative p-5 rounded-3xl border transition-all duration-300 ${isPaid ? 'bg-white/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5' : 'bg-slate-800/40 border-white/5 hover:border-blue-500/30 hover:bg-slate-800/60'}`}>
                         <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{fee.label}</p>
                               {isPaid ? (
                                 <CheckCircle2 size={14} className="text-emerald-500" />
                               ) : (
                                 <div className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse"></div>
                               )}
                            </div>
                            <div className="space-y-0.5">
                               <p className={`text-sm font-black ${isPaid ? 'text-white' : 'text-slate-600'}`}>{formatCurrency(amount)}</p>
                               <p className="text-[8px] font-bold text-slate-500 uppercase">{isPaid ? 'Verified' : 'Belum Diajukan'}</p>
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>

               <div className="mt-10 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex gap-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Terpakai</p>
                        <p className="text-2xl font-black text-white">{formatCurrency(totalExpense)}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pemasukan / Deposit</p>
                        <p className="text-2xl font-black text-emerald-400">{formatCurrency(totalIncome)}</p>
                     </div>
                  </div>
                  <Button onClick={onAddTransaction} className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-12 py-8 h-auto shadow-2xl shadow-blue-900/40 font-bold transition-all active:scale-95 border-none">
                     <DollarSign size={22} className="mr-3" />
                     INPUT BIAYA PROSES
                  </Button>
               </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-800 overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-black/20 border-b border-slate-100 dark:border-slate-800 px-10 py-6">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Biodata & Administrasi</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                       <User size={18} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest">Detail Identitas</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-5 pl-1">
                    <DetailItem label="NIK" value={cpmi.nik} isMono />
                    <DetailItem label="Nomor Paspor" value={cpmi.passportNo} isMono isBold />
                    <DetailItem label="TTL" value={`${cpmi.birthPlace}, ${cpmi.birthDate}`} />
                    <DetailItem label="Alamat Domisili" value={cpmi.address} />
                    <DetailItem label="Kontak Keluarga" value={cpmi.familyContact} />
                    <DetailItem label="Pendidikan Terakhir" value={cpmi.education} />
                    <DetailItem label="Sponsor" value={cpmi.sponsor} isBold />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                       <Briefcase size={18} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest">Job Penempatan</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-5 pl-1">
                    <DetailItem label="Negara Tujuan" value={cpmi.targetCountry} isBold />
                    <DetailItem label="Jenis Pekerjaan" value={cpmi.jobType} />
                    <DetailItem label="Agency / Majikan" value={cpmi.agency} />
                    <DetailItem label="Renc. Tgl Terbang" value={cpmi.flightDate} isBold />
                    <DetailItem label="Tgl Pendaftaran" value={cpmi.registrationDate} />
                  </div>
                </div>
              </div>
              
              <div className="pt-10 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Kelengkapan Berkas Fisik</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       {Object.entries(cpmi.completeness).map(([key, value]) => (
                         <div key={key} className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800">
                           <Checkbox 
                             id={key} 
                             checked={value as boolean} 
                             onCheckedChange={(v) => onUpdateCompleteness(key as any, !!v)} 
                             className="rounded-lg h-5 w-5 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                           />
                           <Label htmlFor={key} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight cursor-pointer">{key}</Label>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6 bg-slate-50 dark:bg-slate-950 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                    <div className="flex items-center gap-2">
                       <AlertCircle size={18} className="text-rose-500" />
                       <h4 className="text-[10px] font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest">Hutang & Talangan</h4>
                    </div>
                    <div className="space-y-4">
                       <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Hutang</p>
                          <p className="text-xl font-bold text-rose-600 dark:text-rose-500">{formatCurrency(cpmi.totalDebt || 0)}</p>
                       </div>
                       <Button variant="outline" className="w-full h-14 rounded-2xl text-xs font-bold border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 active:scale-95 transition-all">
                          CATAT CICILAN HUTANG
                       </Button>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Column: Digital Dossier */}
        <section className="w-full lg:w-2/5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Digital Dossier (Berkas Digital)</h3>
            <div className="flex items-center space-x-2">
               <Badge variant="outline" className="text-[9px] font-bold border-slate-200 text-slate-400">{documents.length}/{requiredDocTypes.length} Berkas</Badge>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {requiredDocTypes.map(type => {
              const doc = documents.find(d => d.type === type);
              return (
                <DocumentItem 
                  key={type}
                  type={type}
                  document={doc}
                  onUpload={(file) => onUploadDocument(file, type)}
                />
              );
            })}
          </div>

          {cpmi.notePusat && (
            <div className="mt-auto flex flex-col gap-3 rounded-2xl bg-blue-50 p-6 border border-blue-100 shadow-sm shadow-blue-50">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-blue-700" />
                <p className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest">Catatan Admin Pusat</p>
              </div>
              <p className="text-xs leading-relaxed text-blue-900 font-medium italic">
                "{cpmi.notePusat}"
              </p>
            </div>
          )}
        </section>
      </div>

      {activeTab === 'finance' && (
        <div className="mt-12 animate-in slide-in-from-top-4 duration-500 no-print">
           <Card className="rounded-3xl border-none bg-white shadow-xl ring-1 ring-slate-200/50">
             <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold">Histori Transaksi Lengkap</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setActiveTab('profile')} className="rounded-full"><XCircle size={20} className="text-slate-300" /></Button>
             </CardHeader>
             <CardContent className="p-0">
                <TransactionList Transactions={transactions} cpmiId={cpmi.id} />
             </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
};

const DocumentItem: React.FC<{ type: string, document?: CPMIDocument, onUpload: (file: File) => void }> = ({ type, document, onUpload }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files: File[]) => onUpload(files[0]),
    multiple: false
  } as any);

  const getStatusStyle = () => {
    if (!document) return "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 opacity-60";
    if (document.status === 'Verified') return "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-900/10";
    if (document.status === 'Rejected') return "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10";
    return "border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10";
  };

  const getIconStyle = () => {
    if (!document) return "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700";
    if (document.status === 'Verified') return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400";
    if (document.status === 'Rejected') return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
  };

  return (
    <div className={`group relative flex items-center gap-4 rounded-2xl border p-4 transition-all hover:shadow-md ${getStatusStyle()}`}>
       <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${getIconStyle()}`}>
         {document ? <FileCheck size={26} /> : <Upload size={24} />}
       </div>
       
       <div className="flex-1 min-w-0">
         <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{type}</p>
         {document ? (
           <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400 mt-0.5">
             {document.status} • {new Date(document.uploadedAt).toLocaleDateString('id-ID')}
           </p>
         ) : (
           <p className="text-[10px] font-medium text-slate-400 dark:text-slate-600 mt-0.5 uppercase tracking-tighter">Slot Kosong</p>
         )}
       </div>

       {document ? (
         <div className="flex items-center gap-2">
            {document.status === 'Rejected' && (
              <Badge className="bg-red-600 text-white border-none text-[8px] font-extrabold uppercase px-2">Issue</Badge>
            )}
            <Button variant="ghost" size="sm" onClick={() => window.open(document.fileUrl, '_blank')} className="h-8 rounded-lg text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-slate-800 shadow-sm">
              View
            </Button>
            <a href={document.fileUrl} download={document.fileName} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-100 dark:border-slate-800 shadow-sm">
                <Download size={14} />
              </Button>
            </a>
         </div>
       ) : (
         <div {...getRootProps()} className="cursor-pointer">
           <input {...getInputProps()} />
           <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white border border-blue-200 dark:border-blue-900/50">
             Upload
           </Button>
         </div>
       )}
    </div>
  );
};

const DetailItem = ({ label, value, isMono, isBold }: { label: string, value?: string | number, isMono?: boolean, isBold?: boolean }) => (
  <div className="flex flex-col space-y-1">
    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{label}</p>
    <p className={`text-sm ${isBold ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'} ${isMono ? 'font-mono text-[11px]' : ''}`}>
      {value || '-'}
    </p>
  </div>
);

const PrintField = ({ label, value }: { label: string, value?: string | number }) => (
  <div className="flex justify-between items-start text-[9px] border-b border-slate-50 pb-1">
    <span className="text-slate-400 font-bold w-32 shrink-0">{label} :</span>
    <span className="font-bold text-slate-800 text-left flex-1 break-words">{value || '-'}</span>
  </div>
);

const CompletenessItem = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
    <Checkbox id={label} checked={checked} onCheckedChange={onChange} className="rounded" />
    <Label htmlFor={label} className="text-sm font-medium cursor-pointer">{label}</Label>
  </div>
);

const DocumentCard: React.FC<{ type: string, document?: CPMIDocument, onUpload: (file: File) => void }> = ({ type, document, onUpload }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files: File[]) => onUpload(files[0]),
    multiple: false
  } as any);

  return (
    <Card className={`rounded-2xl border ${document ? 'border-slate-200' : 'border-dashed border-slate-300 bg-slate-50/50'} overflow-hidden`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
           <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
             <FileCheck size={20} className={document ? 'text-blue-600' : 'text-slate-300'} />
           </div>
           {document && (
             <Badge 
               variant="secondary" 
               className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                document.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 
                document.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                'bg-amber-100 text-amber-700'
               }`}
             >
               {document.status}
             </Badge>
           )}
        </div>
        
        <div className="space-y-1 mb-4">
          <h4 className="font-bold text-slate-900">{type}</h4>
          {document ? (
            <p className="text-xs text-slate-500 truncate">{document.fileName}</p>
          ) : (
            <p className="text-xs text-slate-400">Belum diunggah</p>
          )}
        </div>

        {document ? (
          <div className="flex flex-col space-y-3">
            <Button variant="outline" size="sm" className="w-full text-xs rounded-lg border-slate-200 py-4 font-bold flex items-center justify-center gap-2" onClick={() => window.open(document.fileUrl, '_blank')}>
              <Download size={14} />
              Unduh Berkas
            </Button>
            {document.note && (
               <div className="text-[10px] bg-slate-100 p-2 rounded-lg text-slate-600 italic">
                 Note: {document.note}
               </div>
            )}
          </div>
        ) : (
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <Button variant="outline" size="sm" className="w-full text-xs rounded-lg border-dashed border-slate-300 bg-white/50 py-6 flex flex-col items-center space-y-1">
              <Upload size={14} className="text-slate-400" />
              <span>Unggah Scan</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
