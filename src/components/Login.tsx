import React from 'react';
import { Button } from './ui/button';
import { loginWithGoogle } from '../lib/firebase';
import { Briefcase, ShieldCheck, Globe, LayoutDashboard } from 'lucide-react';

export function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-6 shadow-lg shadow-blue-200">
            <LayoutDashboard size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">P3MI Management System</h1>
          <p className="text-slate-500 text-sm mb-8">
            Solusi Digital Terpadu untuk Pengelolaan Pekerja Migran Indonesia
          </p>
        </div>

        <div className="p-8 pt-0 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                <Briefcase size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Operasional</span>
              <span className="text-xs font-semibold text-slate-700">Manajemen CPMI</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                <Globe size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Placement</span>
              <span className="text-xs font-semibold text-slate-700">Multi Negara</span>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => loginWithGoogle()}
              className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center justify-center space-x-3 shadow-lg shadow-slate-200"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="Google" />
              <span>Masuk dengan Google</span>
            </Button>
            
            <div className="flex items-center justify-center space-x-2 text-slate-400">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-medium uppercase tracking-widest">Sistem Keamanan Terenkripsi</span>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] text-center text-slate-400 font-medium">
            &copy; 2024 P3MI Management System - Versi 1.0.0 Pro
          </p>
        </div>
      </div>
    </div>
  );
}
