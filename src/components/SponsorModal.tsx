import React, { useState } from 'react';
import { Sponsor } from '../types';
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
import { UserPlus, Save } from 'lucide-react';

interface SponsorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Sponsor>) => void;
}

export const SponsorModal: React.FC<SponsorModalProps> = ({ open, onOpenChange, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Sponsor>>({
    name: '',
    region: '',
    phone: '',
    cpmiCount: 0,
    unpaidFees: 0,
    paidFees: 0,
    totalDebt: 0,
    performanceScore: 100
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
    setFormData({ name: '', region: '', phone: '', cpmiCount: 0, unpaidFees: 0, paidFees: 0, totalDebt: 0, performanceScore: 100 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-0 overflow-y-auto max-h-[96vh] border-none shadow-2xl bg-white focus:outline-none">
        <DialogHeader className="p-8 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <UserPlus size={20} />
             </div>
             <div>
                <DialogTitle className="text-xl font-bold font-display">Registrasi Sponsor</DialogTitle>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Daftarkan mitra marketing baru</p>
             </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap Sponsor</Label>
            <Input 
              value={formData.name || ''} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="rounded-2xl h-14 bg-slate-50 border-none ring-1 ring-slate-200/50 font-bold"
              placeholder="Contoh: H. Maman"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Wilayah / Regional</Label>
            <Input 
              value={formData.region || ''} 
              onChange={(e) => setFormData({...formData, region: e.target.value})} 
              className="rounded-2xl h-14 bg-slate-50 border-none ring-1 ring-slate-200/50"
              placeholder="Contoh: Indramayu"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nomor WhatsApp</Label>
            <Input 
              value={formData.phone || ''} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              className="rounded-2xl h-14 bg-slate-50 border-none ring-1 ring-slate-200/50"
              placeholder="0812XXXXXXXX"
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 font-bold shadow-xl shadow-blue-200">
               <Save className="mr-2" size={18} />
               Simpan Data Sponsor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
