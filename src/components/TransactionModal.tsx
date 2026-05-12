import React, { useState } from 'react';
import { Transaction, TransactionCategory } from '../types';
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
import { DollarSign } from 'lucide-react';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Transaction>) => void;
  cpmiId?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ open, onOpenChange, onSubmit, cpmiId }) => {
  const [formData, setFormData] = React.useState<Partial<Transaction>>({
    cpmiId: cpmiId || null,
    type: 'EXPENSE',
    category: 'Living cost',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    refNo: `TX-${Date.now().toString().slice(-6)}`
  });

  React.useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        cpmiId: cpmiId || null,
        refNo: `TX-${Date.now().toString().slice(-6)}`
      }));
    }
  }, [open, cpmiId]);

  const categories: TransactionCategory[] = [
    'Living cost', 'MCU', 'Paspor', 'Visa', 'BPJS', 
    'Transport', 'Royalti', 'Fee sponsor', 'Fee agency', 
    'Biaya admin', 'Penginapan', 'Tiket', 'Gaji Staf', 'Sewa Kantor',
    'Titipan biaya', 'Penggantian biaya', 'Talangan proses', 'Lainnya'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl p-0 overflow-y-auto max-h-[96vh] border-none shadow-2xl bg-white focus:outline-none">
        <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                 <DollarSign size={20} />
              </div>
              <div>
                 <DialogTitle className="text-xl font-bold text-slate-900 font-display">Entry Keuangan</DialogTitle>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Catat Pemasukan / Pengeluaran</p>
              </div>
           </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipe Transaksi</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(v: any) => setFormData({...formData, type: v})}
                >
                  <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-none ring-1 ring-slate-200/50 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl p-1 bg-white">
                    <SelectItem value="INCOME" className="rounded-xl font-bold text-emerald-600">Pemasukan (+)</SelectItem>
                    <SelectItem value="EXPENSE" className="rounded-xl font-bold text-rose-600">Pengeluaran (-)</SelectItem>
                    <SelectItem value="DEBT" className="rounded-xl font-bold text-blue-600">Hutang / Talangan</SelectItem>
                    <SelectItem value="CREDIT" className="rounded-xl font-bold text-slate-600">Pelunasan</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kategori</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v: any) => setFormData({...formData, category: v})}
                >
                  <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-none ring-1 ring-slate-200/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl p-1 bg-white h-64 overflow-y-auto">
                    {categories.map(cat => <SelectItem key={cat} value={cat} className="rounded-xl text-xs font-bold py-2.5">{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
             </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-semibold text-slate-700">Jumlah (IDR)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
              <Input 
                id="amount" 
                type="number"
                value={formData.amount || 0} 
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} 
                className="rounded-xl h-11 border-slate-200 pl-10 font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold text-slate-700">Tanggal</Label>
              <Input 
                id="date" 
                type="date"
                value={formData.date || ''} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                className="rounded-xl h-11 border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="refNo" className="text-sm font-semibold text-slate-700">No. Reff</Label>
              <Input 
                id="refNo" 
                value={formData.refNo || ''} 
                onChange={(e) => setFormData({...formData, refNo: e.target.value})} 
                className="rounded-xl h-11 border-slate-200 font-mono text-xs"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-4 flex-row justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-medium">Batal</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 font-semibold">Simpan Transaksi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
