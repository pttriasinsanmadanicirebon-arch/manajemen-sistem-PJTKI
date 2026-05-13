import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { UserPlus, Shield, Building, Mail, Trash2, Edit2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface UserManagementProps {
  users: UserProfile[];
  onUpdateUser: (uid: string, data: Partial<UserProfile>) => void;
  onDeleteUser: (uid: string) => void;
  currentUser: UserProfile | null;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateUser, onDeleteUser, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.cabang?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roles: UserRole[] = ['SUPER_ADMIN', 'KEPALA_CABANG', 'ADMIN_OPERASIONAL', 'STAFF_FINANCE', 'SPONSOR'];

  const handleEdit = (user: UserProfile) => {
    setEditingId(user.uid);
    setEditData({ role: user.role, cabang: user.cabang, name: user.name });
  };

  const handleSave = async (uid: string) => {
    onUpdateUser(uid, editData);
    setEditingId(null);
    toast.success("User profile updated");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-display">Manajemen Pengguna</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Kontrol akses hirarki pusat dan cabang</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search by name, email or branch..." 
            className="pl-12 h-14 rounded-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.uid} className="rounded-[2rem] border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-black/60 ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden group hover:ring-blue-500/50 transition-all duration-500">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 relative overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2">
                  {editingId === user.uid ? (
                    <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} className="rounded-xl h-10 w-10 text-slate-400">
                      <Trash2 size={18} />
                    </Button>
                  ) : (
                    currentUser?.uid !== user.uid && (
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} className="rounded-xl h-10 w-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Edit2 size={18} />
                      </Button>
                    )
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="space-y-1">
                {editingId === user.uid ? (
                  <Input 
                    value={editData.name} 
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="h-10 rounded-xl font-bold"
                  />
                ) : (
                  <h3 className="text-xl font-black text-slate-900 dark:text-white truncate uppercase font-display">{user.name}</h3>
                )}
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Mail size={12} />
                  <p className="text-[10px] font-bold uppercase tracking-tight truncate">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Shield size={12} />
                    <span>Role Terpasang</span>
                  </div>
                  {editingId === user.uid ? (
                    <Select value={editData.role} onValueChange={(v) => setEditData({...editData, role: v as UserRole})}>
                      <SelectTrigger className="rounded-xl h-12 bg-slate-50 dark:bg-slate-950 border-none ring-1 ring-slate-200 dark:ring-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {roles.map(r => <SelectItem key={r} value={r} className="rounded-lg">{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${user.role === 'SUPER_ADMIN' ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'} border-none px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-500/10`}>
                      {user.role}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Building size={12} />
                    <span>Afiliasi Cabang</span>
                  </div>
                  {editingId === user.uid ? (
                    <Input 
                      value={editData.cabang} 
                      onChange={(e) => setEditData({...editData, cabang: e.target.value})}
                      placeholder="e.g. Cirebon, Sragen"
                      className="h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border-none ring-1 ring-slate-200 dark:ring-slate-800 font-bold"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase truncate">{user.cabang || 'TIDAK TERDAFTAR'}</p>
                    </div>
                  )}
                </div>
              </div>

              {editingId === user.uid && (
                <Button onClick={() => handleSave(user.uid)} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-12 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                  Update Configuration
                </Button>
              )}
              
              {user.uid === currentUser?.uid && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center">Current Active Account</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {/* Helper Card for adding users */}
        <Card className="rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col items-center justify-center p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-lg">
            <UserPlus className="text-blue-500" size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase font-display tracking-tight">Tambah Anggota</h4>
            <p className="text-[10px] font-bold text-slate-500 mt-2 leading-relaxed uppercase tracking-widest">
              Instruksikan personil untuk melakukan pendaftaran melalui halaman login, kemudian otorisasi role mereka melalui panel ini.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
