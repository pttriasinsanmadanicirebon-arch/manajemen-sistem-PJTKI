import React, { useState, useEffect } from 'react';
import { CPMI, CPMIStatus } from '../types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { ThemeToggle } from './ThemeToggle';
import { Users, Camera, Loader2, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';

interface CPMIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<CPMI>) => void;
  initialData?: CPMI;
}

export const CPMIModal: React.FC<CPMIModalProps> = ({ open, onOpenChange, onSubmit, initialData }) => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState<Partial<CPMI>>({
    name: '',
    nik: '',
    regNo: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Perempuan',
    address: '',
    phone: '',
    familyContact: '',
    education: '',
    marriageStatus: 'Single',
    weight: 0,
    height: 0,
    motherName: '',
    fatherName: '',
    parentsAddress: '',
    provinsi: '',
    kabupaten: '',
    targetCountry: '',
    jobType: '',
    agency: '',
    sponsor: '',
    branch: 'Cabang Cirebon',
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'Baru',
    note: '',
    completeness: {
      kte: false,
      kk: false,
      akte: false,
      ijazah: false,
      paspor: false,
      mcu: false,
      visa: false,
      pk: false,
    }
  });

  const [activeSection, setActiveSection] = useState<'pribadi' | 'penempatan' | 'administrasi'>('pribadi');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, photoUrl: localUrl }));

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `cpmi-photos/${formData.regNo || 'temp'}_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, photoUrl: url }));
      toast.success("Foto berhasil diunggah");
    } catch (error) {
      toast.error("Gagal mengunggah foto. Periksa koneksi internet.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        nik: '',
        regNo: `REG-${Date.now().toString().slice(-6)}`,
        birthPlace: '',
        birthDate: '',
        gender: 'Perempuan',
        address: '',
        phone: '',
        familyContact: '',
        education: '',
        marriageStatus: 'Single',
        targetCountry: '',
        jobType: '',
        agency: '',
        sponsor: '',
        branch: 'Cabang Cirebon',
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'Baru',
        note: '',
        completeness: {
          kte: false,
          kk: false,
          akte: false,
          ijazah: false,
          paspor: false,
          mcu: false,
          visa: false,
          pk: false,
        }
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const STATUSES: CPMIStatus[] = [
    'Baru', 'Interview', 'MCU', 'MCU Fit', 'Paspor', 'PK', 'Visa', 'Ready Terbang', 'Terbang', 'Working', 'Return', 'Cancel'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] w-[95vw] sm:w-full max-h-[96vh] rounded-[2rem] sm:rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900 focus:outline-none transition-colors">
        <div className="flex flex-col md:flex-row h-[92vh] md:h-[85vh] max-h-[96vh]">
          {/* Side Navigation - Hidden on mobile, shown on md+ */}
          <div className="hidden md:flex md:w-1/4 bg-slate-900 dark:bg-black/40 p-8 flex-col items-center border-r border-slate-800">
             <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-900/40">
                <Users size={32} />
             </div>
             <nav className="flex-1 w-full space-y-2">
                <SectionButton 
                  active={activeSection === 'pribadi'} 
                  onClick={() => setActiveSection('pribadi')} 
                  label="Data Pribadi" 
                  step="01"
                />
                <SectionButton 
                  active={activeSection === 'penempatan'} 
                  onClick={() => setActiveSection('penempatan')} 
                  label="Penempatan" 
                  step="02"
                />
                <SectionButton 
                   active={activeSection === 'administrasi'} 
                   onClick={() => setActiveSection('administrasi')} 
                   label="Administrasi" 
                   step="03"
                />
             </nav>
             <div className="mt-auto pt-8 border-t border-slate-800 w-full text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">PT Trias Insan Madani</p>
                <div className="mt-4 flex justify-center">
                   <ThemeToggle />
                </div>
             </div>
          </div>

          {/* Mobile Header Navigation - Only on mobile */}
          <div className="md:hidden flex bg-slate-900 p-4 justify-around items-center">
             <MobileStepButton active={activeSection === 'pribadi'} label="01" onClick={() => setActiveSection('pribadi')} />
             <MobileStepButton active={activeSection === 'penempatan'} label="02" onClick={() => setActiveSection('penempatan')} />
             <MobileStepButton active={activeSection === 'administrasi'} label="03" onClick={() => setActiveSection('administrasi')} />
          </div>

          {/* Form Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-h-0">
            <DialogHeader className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-black/10">
              <DialogTitle className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-display">
                 {initialData ? 'Update Data Pekerja' : 'Registrasi CPMI Baru'}
              </DialogTitle>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Lengkapi informasi pekerja migran &bull; Enterprise ERP</p>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900">
              <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6 md:py-8">
                 <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    {activeSection === 'pribadi' && (
                       <section className="space-y-6 md:space-y-8 pb-10">
                          {/* Photo Upload Section */}
                          <div className="flex flex-col items-center justify-center p-8 bg-blue-50/30 dark:bg-blue-900/10 border-2 border-dashed border-blue-100 dark:border-blue-900/50 rounded-[2.5rem] space-y-4">
                             {formData.photoUrl || isUploading ? (
                                <div className="relative group">
                                   <div className={`w-40 h-52 object-cover rounded-[2rem] shadow-2xl ring-4 ring-white dark:ring-slate-800 overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-800 ${isUploading ? 'opacity-50' : ''}`}>
                                      {isUploading ? (
                                         <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Mengunggah...</span>
                                         </div>
                                      ) : (
                                         <img src={formData.photoUrl} alt="CPMI" className="w-full h-full object-cover" />
                                      )}
                                   </div>
                                   {!isUploading && (
                                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                         <div className="flex flex-col items-center gap-2">
                                            <Camera size={32} />
                                            <span className="text-[10px] font-bold uppercase">Ganti Foto</span>
                                         </div>
                                         <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                      </label>
                                   )}
                                </div>
                             ) : (
                                <label className="w-40 h-52 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-[1.02] group">
                                   <div className="flex flex-col items-center gap-3">
                                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                         <Camera size={32} />
                                      </div>
                                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Klik Input Foto</span>
                                   </div>
                                   <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                </label>
                             )}
                             <div className="text-center">
                                <p className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Foto Formal CPMI</p>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider mt-1 opacity-60">Pas Foto 4x6 / Background Putih</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-8 md:gap-y-6">
                             <FormGroup className="md:col-span-2" label="Nama Lengkap Pekerja" required>
                               <Input 
                                 value={formData.name || ''} 
                                 onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 dark:text-white"
                                 placeholder="Nama Sesuai Paspor/KTP"
                                 required
                               />
                             </FormGroup>
                             <FormGroup label="Nomor Induk Kependudukan (NIK)">
                               <Input 
                                 value={formData.nik || ''} 
                                 onChange={(e) => setFormData({...formData, nik: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 font-mono text-slate-700 dark:text-slate-300"
                                 placeholder="16 Digit Nomor KTP"
                                 maxLength={16}
                               />
                             </FormGroup>
                             <FormGroup label="Nomor Paspor (Jika Ada)">
                               <Input 
                                 value={formData.passportNo || ''} 
                                 onChange={(e) => setFormData({...formData, passportNo: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 font-mono uppercase text-slate-700 dark:text-slate-300"
                                 placeholder="Contoh: AU123456"
                               />
                             </FormGroup>
                             <FormGroup label="Jenis Kelamin">
                                <Select value={formData.gender} onValueChange={(v: any) => setFormData({...formData, gender: v})}>
                                  <SelectTrigger className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300">
                                     <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-2xl border-none shadow-2xl p-2 mt-2 bg-white dark:bg-slate-801">
                                     <SelectItem value="Laki-laki" className="rounded-xl py-3 font-bold text-slate-600 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-700">Laki-laki</SelectItem>
                                     <SelectItem value="Perempuan" className="rounded-xl py-3 font-bold text-slate-600 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-700">Perempuan</SelectItem>
                                  </SelectContent>
                                </Select>
                             </FormGroup>
                             <FormGroup label="Tempat Lahir">
                               <Input 
                                 value={formData.birthPlace || ''} 
                                 onChange={(e) => setFormData({...formData, birthPlace: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                               />
                             </FormGroup>
                             <FormGroup label="Tanggal Lahir">
                               <Input 
                                 type="date"
                                 value={formData.birthDate || ''} 
                                 onChange={(e) => setFormData({...formData, birthDate: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                               />
                             </FormGroup>
                             <FormGroup className="md:col-span-2" label="Alamat Sesuai KTP">
                               <Input 
                                 value={formData.address || ''} 
                                 onChange={(e) => setFormData({...formData, address: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                                 placeholder="Jalan, Desa, Kec, Kota"
                               />
                             </FormGroup>
                             <FormGroup label="No. HP">
                               <Input 
                                 value={formData.phone || ''} 
                                 onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                               />
                             </FormGroup>
                             <FormGroup label="Pendidikan">
                                <Select value={formData.education} onValueChange={(v: any) => setFormData({...formData, education: v})}>
                                  <SelectTrigger className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300">
                                     <SelectValue placeholder="Pilih Pendidikan" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-2xl border-none shadow-2xl p-2 mt-2 bg-white dark:bg-slate-800">
                                     {['SD', 'SMP', 'SMA', 'Diploma', 'Sarjana'].map(e => (
                                       <SelectItem key={e} value={e} className="rounded-xl py-3 font-bold text-slate-600 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-700">{e}</SelectItem>
                                     ))}
                                  </SelectContent>
                                </Select>
                             </FormGroup>
                             <FormGroup className="md:col-span-2" label="Kontak Keluarga (Nama & No HP)">
                                <Input 
                                  value={formData.familyContact || ''} 
                                  onChange={(e) => setFormData({...formData, familyContact: e.target.value})} 
                                  className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                                  placeholder="Nama Pasangan/Orang Tua - 08xxxxxxxx"
                                />
                             </FormGroup>
                             <div className="grid grid-cols-2 gap-4">
                                <FormGroup label="Berat Badan (Kg)">
                                  <Input 
                                    type="number"
                                    value={formData.weight || ''} 
                                    onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})} 
                                    className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 font-bold"
                                  />
                                </FormGroup>
                                <FormGroup label="Tinggi Badan (Cm)">
                                  <Input 
                                    type="number"
                                    value={formData.height || ''} 
                                    onChange={(e) => setFormData({...formData, height: Number(e.target.value)})} 
                                    className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 font-bold"
                                  />
                                </FormGroup>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <FormGroup label="Provinsi">
                                  <Input 
                                    value={formData.provinsi || ''} 
                                    onChange={(e) => setFormData({...formData, provinsi: e.target.value})} 
                                    className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500"
                                  />
                                </FormGroup>
                                <FormGroup label="Kabupaten / Kota">
                                  <Input 
                                    value={formData.kabupaten || ''} 
                                    onChange={(e) => setFormData({...formData, kabupaten: e.target.value})} 
                                    className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500"
                                  />
                                </FormGroup>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <FormGroup label="Nama Ibu">
                                  <Input 
                                    value={formData.motherName || ''} 
                                    onChange={(e) => setFormData({...formData, motherName: e.target.value})} 
                                    className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500"
                                  />
                                </FormGroup>
                                <FormGroup label="Nama Ayah">
                                  <Input 
                                    value={formData.fatherName || ''} 
                                    onChange={(e) => setFormData({...formData, fatherName: e.target.value})} 
                                    className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500"
                                  />
                                </FormGroup>
                             </div>
                             <FormGroup className="md:col-span-2" label="Alamat Orang Tua">
                                <Input 
                                  value={formData.parentsAddress || ''} 
                                  onChange={(e) => setFormData({...formData, parentsAddress: e.target.value})} 
                                  className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500"
                                />
                             </FormGroup>
                          </div>
                       </section>
                    )}

                    {activeSection === 'penempatan' && (
                       <section className="space-y-6 md:space-y-8 pb-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-8 md:gap-y-6">
                             <FormGroup label="Negara Tujuan">
                               <Input 
                                 value={formData.targetCountry || ''} 
                                 onChange={(e) => setFormData({...formData, targetCountry: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 font-bold text-blue-600 dark:text-blue-400"
                                 placeholder="Taiwan / Hongkong / dll"
                               />
                             </FormGroup>
                             <FormGroup label="Jenis Pekerjaan">
                               <Input 
                                 value={formData.jobType || ''} 
                                 onChange={(e) => setFormData({...formData, jobType: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                               />
                             </FormGroup>
                             <FormGroup label="Agency / Majikan">
                               <Input 
                                 value={formData.agency || ''} 
                                 onChange={(e) => setFormData({...formData, agency: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                               />
                             </FormGroup>
                             <FormGroup label="Rencana Tgl Terbang">
                               <Input 
                                 type="date"
                                 value={formData.flightDate || ''} 
                                 onChange={(e) => setFormData({...formData, flightDate: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 font-bold text-emerald-600 dark:text-emerald-400"
                               />
                             </FormGroup>
                             <FormGroup label="Sponsor / Marketing">
                               <Input 
                                 value={formData.sponsor || ''} 
                                 onChange={(e) => setFormData({...formData, sponsor: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 dark:text-slate-200"
                               />
                             </FormGroup>
                             <FormGroup label="Cabang Input">
                               <Input 
                                 value={formData.branch || ''} 
                                 onChange={(e) => setFormData({...formData, branch: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                               />
                             </FormGroup>
                             <FormGroup label="Tanggal Daftar">
                               <Input 
                                 type="date"
                                 value={formData.registrationDate || ''} 
                                 onChange={(e) => setFormData({...formData, registrationDate: e.target.value})} 
                                 className="rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 dark:text-slate-200"
                               />
                             </FormGroup>
                          </div>
                       </section>
                    )}

                    {activeSection === 'administrasi' && (
                       <section className="space-y-6 md:space-y-8 pb-10">
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                             <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Kelengkapan Berkas Fisik</h4>
                             <div className="grid grid-cols-2 gap-4">
                                {Object.entries(formData.completeness || {}).map(([key, value]) => (
                                   <div key={key} className="flex items-center space-x-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-blue-500/50">
                                      <Checkbox 
                                        id={`modal-${key}`} 
                                        checked={value as boolean} 
                                        onCheckedChange={(v) => setFormData({
                                          ...formData, 
                                          completeness: { ...formData.completeness, [key]: !!v }
                                        })}
                                        className="rounded-lg h-6 w-6 border-slate-300 dark:border-slate-700 data-[state=checked]:bg-blue-600"
                                      />
                                      <Label htmlFor={`modal-${key}`} className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase cursor-pointer">{key}</Label>
                                   </div>
                                ))}
                             </div>
                          </div>

                          <FormGroup label="Catatan Internal Admin / Bottleneck">
                             <Textarea 
                               value={formData.note || ''} 
                               onChange={(e) => setFormData({...formData, note: e.target.value})} 
                               className="rounded-[2rem] min-h-[150px] bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200/50 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 p-6 text-slate-700 dark:text-slate-300"
                               placeholder="Contoh: Menunggu tanda tangan suami, Foto kurang jelas, dll"
                             />
                          </FormGroup>
                       </section>
                    )}
                 </div>
              </div>

              {/* Action Buttons Footer - Sticky/Fixed at bottom */}
              <div className="px-6 md:px-10 py-6 md:py-8 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-black/20 flex flex-col md:flex-row gap-4">
                 {activeSection !== 'pribadi' && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveSection(activeSection === 'penempatan' ? 'pribadi' : (activeSection === 'administrasi' ? 'penempatan' : 'pribadi'))}
                      className="h-14 rounded-2xl px-8 font-bold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
                    >
                       Sebelumnya
                    </Button>
                 )}
                 
                 <div className="flex-1 flex gap-4">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => onOpenChange(false)}
                      className="h-14 rounded-2xl px-8 font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                       Batal
                    </Button>
                    
                    {activeSection !== 'administrasi' ? (
                       <Button 
                         type="button" 
                         onClick={() => setActiveSection(activeSection === 'pribadi' ? 'penempatan' : 'administrasi')}
                         className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all"
                       >
                          Lanjut: {activeSection === 'pribadi' ? 'Penempatan' : 'Administrasi'}
                          <ChevronRight size={18} className="ml-2" />
                       </Button>
                    ) : (
                       <Button 
                         type="submit" 
                         disabled={isSubmitting}
                         className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all"
                       >
                          {isSubmitting ? (
                             <>
                               <Loader2 className="animate-spin mr-2" size={20} />
                               Menyimpan...
                             </>
                          ) : (
                             <>
                               <Save size={20} className="mr-2" />
                               SIMPAN DATA PEKERJA
                             </>
                          )}
                       </Button>
                    )}
                 </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MobileStepButton = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${active ? 'opacity-100' : 'opacity-40'}`}
  >
     <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-lg ${active ? 'bg-blue-600 text-white shadow-blue-900/40' : 'bg-slate-800 text-slate-500'}`}>
        {label}
     </div>
     <span className={`text-[8px] font-bold uppercase tracking-tighter ${active ? 'text-blue-400' : 'text-slate-600'}`}>
        {label === '01' ? 'Pribadi' : label === '02' ? 'Proses' : 'Admin'}
     </span>
  </button>
);

const SectionButton = ({ active, onClick, label, step }: { active: boolean, onClick: () => void, label: string, step: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-5 rounded-3xl transition-all font-bold group ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
  >
     <span className={`text-[9px] font-mono ${active ? 'text-blue-200' : 'text-slate-600'}`}>{step}</span>
     <span className="text-sm tracking-tight">{label}</span>
  </button>
);

const FormGroup = ({ label, children, required, className }: { label: string, children: React.ReactNode, required?: boolean, className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1">
       {label}
       {required && <span className="text-rose-500">*</span>}
    </Label>
    {children}
  </div>
);
