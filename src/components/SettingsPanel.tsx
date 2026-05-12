import React, { useState, useEffect } from 'react';
import { SystemSettings, UserProfile } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Building2, Save, Globe, Phone, MapPin, User, LogOut, Camera, Loader2 } from 'lucide-react';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { toast } from 'sonner';

interface SettingsPanelProps {
  settings: SystemSettings | null;
  onUpdateSettings: (data: Partial<SystemSettings>) => void;
  userProfile: UserProfile | null;
  logout: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings, userProfile, logout }) => {
  const [formData, setFormData] = useState<Partial<SystemSettings>>(settings || {
    companyName: 'PT Trias Insan Madani',
    address: '',
    phone: '',
    logoUrl: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediate local preview
    const localUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, logoUrl: localUrl }));

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `company/logo_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, logoUrl: url }));
      toast.success("Logo entitas berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal sinkronisasi logo baru");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    toast.success("Konfigurasi sistem telah diperbarui");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 px-2">
      <div className="flex flex-col space-y-2 mb-4">
         <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-display">System Configuration</h2>
         </div>
         <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] ml-5">Global Identity & Infrastructure Control Panel</p>
      </div>

      {/* Corporate Settings Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 ml-6">
           <Building2 size={18} className="text-blue-500" strokeWidth={3} />
           <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">P3MI Corporate Identity</h3>
        </div>
        <Card className="rounded-[3rem] border-none bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-black/60 ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden">
          <CardHeader className="p-12 pb-0">
             <div className="flex flex-col md:flex-row items-center gap-12 mb-12 pb-12 border-b border-slate-100 dark:border-slate-800">
                <div className="relative group/logo">
                   <div className="w-44 h-44 rounded-[3rem] bg-slate-900 flex items-center justify-center text-white overflow-hidden shadow-2xl shadow-blue-500/20 ring-4 ring-white dark:ring-slate-800 transition-transform duration-500 group-hover/logo:scale-105">
                      {formData.logoUrl ? (
                         <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                         <Building2 size={64} strokeWidth={1} />
                      )}
                   </div>
                   <label className="absolute -bottom-3 -right-3 w-14 h-14 bg-blue-600 border-4 border-white dark:border-slate-900 text-white rounded-[1.5rem] flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-all shadow-2xl group-hover/logo:rotate-12">
                      {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Camera className="text-white" size={24} strokeWidth={2.5} />}
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                   </label>
                </div>
                <div className="text-center md:text-left space-y-3">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">Verified P3MI Entity</p>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white font-display uppercase tracking-tight">{formData.companyName}</h2>
                   </div>
                   <div className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Digital Eco-System v2.0</div>
                   </div>
                </div>
             </div>
             
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-[1.25rem] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                   <Building2 size={28} strokeWidth={2.5} />
                </div>
                <div>
                   <CardTitle className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-display">Regulatory Profile</CardTitle>
                   <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Global compliance & public identity credentials</p>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-2">Legal entity name (PT)</Label>
                  <Input 
                    value={formData.companyName || ''} 
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
                    className="rounded-[1.5rem] h-16 bg-slate-50 dark:bg-slate-950/50 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-blue-600 font-black text-slate-800 dark:text-white transition-all uppercase tracking-tight px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-2">Secure Communications (Phone)</Label>
                  <Input 
                    value={formData.phone || ''} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    className="rounded-[1.5rem] h-16 bg-slate-50 dark:bg-slate-950/50 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-blue-600 font-bold tabular-nums px-6 text-slate-800 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <Label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-2">Global Headquarters Address</Label>
                  <Input 
                    value={formData.address || ''} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})} 
                    className="rounded-[1.5rem] h-16 bg-slate-50 dark:bg-slate-950/50 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-blue-600 font-bold px-6 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] h-16 px-12 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-4">
                  <Save size={20} strokeWidth={2.5} />
                  Authorize Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* User Performance & Identity */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 ml-6">
           <User size={18} className="text-emerald-500" strokeWidth={3} />
           <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Operator Identity</h3>
        </div>
        <Card className="rounded-[3rem] border-none bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-black/60 ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden">
          <CardContent className="p-12">
             <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                   <div className="w-24 h-24 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700 relative group overflow-hidden">
                      {userProfile?.uid && <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.name}`} alt="Avatar" className="w-full h-full object-cover" />}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                         <Camera className="text-white" size={24} />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-3">
                         <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase font-display">{userProfile?.name}</h4>
                         <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-none px-3 py-1 text-[8px] font-black uppercase tracking-widest">{userProfile?.role || 'Operator'}</Badge>
                      </div>
                      <p className="text-slate-500 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest">{userProfile?.email}</p>
                      <div className="flex items-center gap-2 mt-4">
                         <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40"></div>
                         <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Active Branch: {userProfile?.cabang || 'Pusat Cirebon'}</p>
                      </div>
                   </div>
                </div>
                <Button onClick={logout} variant="outline" className="h-16 px-10 rounded-[1.5rem] border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 dark:hover:bg-rose-900/20 active:scale-95 transition-all flex items-center gap-3">
                   <LogOut size={18} />
                   Log Out Session
                </Button>
             </div>
             
             <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 leading-relaxed max-w-2xl uppercase tracking-widest">
                   Anda sedang login sebagai <span className="text-blue-600 dark:text-blue-400">ADMIN PUSAT</span>. Seluruh data dari semua cabang (Cirebon, Sragen, dll) akan teragregasi secara otomatis pada dashboard ini. 
                   Akun Cabang dapat dibuat oleh Pusat melalui modul Manajemen Pengguna.
                </p>
             </div>
          </CardContent>
        </Card>
      </section>

      {/* Advanced Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card className="rounded-[2.5rem] border-none bg-slate-50 dark:bg-slate-950 shadow-inner p-10 border border-slate-100 dark:border-slate-800 group hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl w-fit shadow-xl mb-6 group-hover:scale-110 transition-transform">
               <Globe className="text-blue-500" size={32} strokeWidth={2.5} />
            </div>
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xl">Branch Infrastructure</h4>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-2">Scale and distribute penempatan node across regions.</p>
         </Card>
         <Card className="rounded-[2.5rem] border-none bg-slate-50 dark:bg-slate-950 shadow-inner p-10 border border-slate-100 dark:border-slate-800 group hover:ring-2 hover:ring-emerald-500 transition-all cursor-pointer">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl w-fit shadow-xl mb-6 group-hover:scale-110 transition-transform">
               <Phone className="text-emerald-500" size={32} strokeWidth={2.5} />
            </div>
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xl">Protocol Integration</h4>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-2">Automated notification relay & worker synchronization.</p>
         </Card>
      </div>
    </div>
  );
};
