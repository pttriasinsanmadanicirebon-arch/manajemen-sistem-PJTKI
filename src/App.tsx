import React, { useState, useEffect, useMemo } from 'react';
import { Layout, TabType } from './components/Layout';
import { TrackingKanban } from './components/TrackingKanban';
import { Dashboard } from './components/Dashboard';
import { CPMIList } from './components/CPMIList';
import { CPMIDetail } from './components/CPMIDetail';
import { CPMIModal } from './components/CPMIModal';
import { TransactionModal } from './components/TransactionModal';
import { TransactionList } from './components/TransactionList';
import { Button } from './components/ui/button';
import { Toaster, toast } from 'sonner';
import { User } from 'lucide-react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc, updateDoc, doc, setDoc, query, orderBy, serverTimestamp, getDoc, getDocFromServer } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth, logout } from './lib/firebase';
import { CPMI, CPMIDocument, Transaction, CPMIStatus, UserProfile, Sponsor, SystemSettings } from './types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SponsorList } from './components/SponsorList';
import { SponsorModal } from './components/SponsorModal';
import { SettingsPanel } from './components/SettingsPanel';
import { ReportsPanel } from './components/ReportsPanel';
import { UserManagement } from './components/UserManagement';

export default function App() {
  const [user] = useAuthState(auth);

  // Connection test
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, '_connection_test_', 'init'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('permission-denied')) {
          console.log("Firestore reachability confirmed.");
        }
      }
    };
    testConnection();
  }, []);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedCPMI, setSelectedCPMI] = useState<CPMI | null>(null);
  const [isCPMIModalOpen, setIsCPMIModalOpen] = useState(false);
  const [editingCPMI, setEditingCPMI] = useState<CPMI | undefined>(undefined);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

  // Fetch or setup System Settings
  useEffect(() => {
    if (user) {
      const fetchSettings = async () => {
        const settingsRef = doc(db, 'settings', 'global');
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          setSystemSettings(settingsSnap.data() as SystemSettings);
        } else {
          const defaultSettings: SystemSettings = {
            id: 'global',
            companyName: 'PT Trias Insan Madani',
            address: 'Cirebon, Jawa Barat',
            phone: '0812XXXX',
            updatedAt: serverTimestamp()
          };
          await setDoc(settingsRef, defaultSettings);
          setSystemSettings(defaultSettings);
        }
      };
      fetchSettings();
    }
  }, [user]);

  // Fetch or setup User Profile
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserProfile(userSnap.data() as UserProfile);
        } else {
          // If first user ever (or just this user), make it super admin for now
          // In real ERP, this would be handled by a super admin creating users
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || 'User',
            role: 'SUPER_ADMIN',
            cabang: 'Pusat Cirebon'
          };
          await setDoc(userRef, newProfile);
          setUserProfile(newProfile);
        }
      };
      fetchProfile();
    } else {
      setUserProfile(null);
    }
  }, [user]);

  // Firestore Data
  const [cpmiSnapshot] = useCollection(
    query(collection(db, 'cpmi'), orderBy('createdAt', 'desc'))
  );
  
  const [transactionsSnapshot] = useCollection(
    collection(db, 'transactions')
  );

  const [docsSnapshot] = useCollection(
    collection(db, 'documents')
  );

  const [sponsorsSnapshot] = useCollection(
    collection(db, 'sponsors')
  );

  const [usersSnapshot] = useCollection(
    userProfile?.role === 'SUPER_ADMIN' ? collection(db, 'users') : null
  );

  const cpmiList = useMemo(() => {
    let list = cpmiSnapshot?.docs.map(d => ({ ...d.data(), id: d.id } as CPMI)) || [];
    if (userProfile && userProfile.role !== 'SUPER_ADMIN' && userProfile.cabang) {
      list = list.filter(item => item.branch === userProfile.cabang);
    }
    return list;
  }, [cpmiSnapshot, userProfile]);

  const allTransactions = useMemo(() => {
    let list = transactionsSnapshot?.docs.map(d => ({ ...d.data(), id: d.id } as Transaction)) || [];
    if (userProfile && userProfile.role !== 'SUPER_ADMIN' && userProfile.cabang) {
      // Filter transactions related to CPMI in this branch
      const branchCpmiIds = new Set(cpmiList.map(c => c.id));
      list = list.filter(t => branchCpmiIds.has(t.cpmiId));
    }
    return list;
  }, [transactionsSnapshot, userProfile, cpmiList]);

  const allDocs = useMemo(() => docsSnapshot?.docs.map(d => ({ ...d.data(), id: d.id } as CPMIDocument)) || [], [docsSnapshot]);
  const sponsors = useMemo(() => sponsorsSnapshot?.docs.map(d => ({ ...d.data(), id: d.id } as Sponsor)) || [], [sponsorsSnapshot]);
  const users = useMemo(() => usersSnapshot?.docs.map(d => ({ ...d.data(), uid: d.id } as UserProfile)) || [], [usersSnapshot]);

  const handleUpdateStatus = async (id: string, status: CPMIStatus) => {
    try {
      const timestamp = new Date().toLocaleString('id-ID', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-');

      const cpmiRef = doc(db, 'cpmi', id);
      const snap = await getDoc(cpmiRef);
      const currentHistory = snap.data()?.statusHistory || [];
      
      const newHistory = [...currentHistory, { 
        status, 
        date: timestamp,
        note: `Update status ke ${status}` 
      }];

      await updateDoc(cpmiRef, {
        status,
        statusHistory: newHistory,
        updatedAt: serverTimestamp()
      });

      if (selectedCPMI?.id === id) {
        setSelectedCPMI({ ...selectedCPMI, status, statusHistory: newHistory });
      }
      toast.success(`Status CPMI diperbarui: ${status}`);
    } catch (e) {
      toast.error("Gagal memperbarui status.");
    }
  };

  const handleAddCPMI = async (data: Partial<CPMI>) => {
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user?.uid,
      };
      
      if (editingCPMI) {
        await updateDoc(doc(db, 'cpmi', editingCPMI.id), docData);
        toast.success("Data CPMI berhasil diperbarui!");
      } else {
        await addDoc(collection(db, 'cpmi'), docData);
        toast.success("CPMI baru berhasil didaftarkan!");
      }
      setEditingCPMI(undefined);
    } catch (e) {
      toast.error("Gagal menyimpan data.");
    }
  };

  const handleUpdateCompleteness = async (id: string, k: string, v: boolean) => {
     try {
       await updateDoc(doc(db, 'cpmi', id), {
         [`completeness.${k}`]: v,
         updatedAt: serverTimestamp()
       });
       if (selectedCPMI?.id === id) {
         setSelectedCPMI({
           ...selectedCPMI,
           completeness: { ...selectedCPMI.completeness, [k]: v }
         });
       }
     } catch (e) {
       toast.error("Gagal update status berkas.");
     }
  };

  const handleAddTransaction = async (data: Partial<Transaction>) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...data,
        status: 'APPROVED', // Auto approved for MVP/Admin
        cpmiId: data.cpmiId || null,
        createdAt: serverTimestamp(),
        createdBy: user?.uid
      });
      toast.success("Transaksi keuangan berhasil dicatat!");
    } catch (e) {
      toast.error("Gagal mencatat transaksi.");
    }
  };

  const handleAddSponsor = async (data: Partial<Sponsor>) => {
    try {
      await addDoc(collection(db, 'sponsors'), {
        ...data,
        createdAt: serverTimestamp(),
        performanceScore: 100,
        cpmiCount: 0,
        paidFees: 0,
        unpaidFees: 0,
        totalDebt: 0
      });
      toast.success("Sponsor baru berhasil didaftarkan!");
    } catch (e) {
      toast.error("Gagal mendaftarkan sponsor.");
    }
  };

  const handleUpdateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    try {
      await updateDoc(doc(db, 'users', uid), data);
      toast.success("User configuration updated");
    } catch (e) {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: 'SPONSOR', cabang: 'TIDAK AKTIF' });
      toast.info("User access revoked");
    } catch (e) {
      toast.error("Failed to revoke access");
    }
  };

  const handlePrintReport = () => {
    setActiveTab('reports');
  };

  const handleUploadDocument = async (file: File, type: string, cpmiId: string) => {
    try {
      const storageRef = ref(storage, `documents/${cpmiId}/${type}_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'documents'), {
        cpmiId,
        type,
        fileUrl: url,
        fileName: file.name,
        status: 'Pending',
        uploadedAt: serverTimestamp(),
      });

      toast.success(`Dokumen ${type} berhasil diunggah!`);
    } catch (e) {
      toast.error("Gagal mengunggah dokumen.");
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} systemSettings={systemSettings} userProfile={userProfile}>
      <Toaster position="top-center" expand={true} richColors />
      
      {selectedCPMI ? (
        <CPMIDetail 
          cpmi={selectedCPMI} 
          documents={allDocs.filter(d => d.cpmiId === selectedCPMI.id)}
          transactions={allTransactions.filter(t => t.cpmiId === selectedCPMI.id)}
          onUpdateStatus={(status) => handleUpdateStatus(selectedCPMI.id, status)}
          onUpdateCompleteness={(k, v) => handleUpdateCompleteness(selectedCPMI.id, k, v)}
          onUploadDocument={(file, type) => handleUploadDocument(file, type, selectedCPMI.id)}
          onAddTransaction={() => {
            setEditingCPMI(selectedCPMI); // used loosely to track target
            setIsTransactionModalOpen(true);
          }}
          onBack={() => setSelectedCPMI(null)}
          systemSettings={systemSettings}
        />
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <Dashboard 
              cpmiList={cpmiList} 
              transactions={allTransactions} 
              onAddCPMI={() => setIsCPMIModalOpen(true)}
              onAddTransaction={() => setIsTransactionModalOpen(true)}
              onReport={handlePrintReport}
              systemSettings={systemSettings}
            />
          )}
          {activeTab === 'cpmi' && (
            <CPMIList 
              cpmiList={cpmiList} 
              onAdd={() => {
                setEditingCPMI(undefined);
                setIsCPMIModalOpen(true);
              }}
              onEdit={(cpmi) => {
                setEditingCPMI(cpmi);
                setIsCPMIModalOpen(true);
              }}
              onViewDetails={(cpmi) => setSelectedCPMI(cpmi)}
            />
          )}
          {activeTab === 'tracking' && (
             <TrackingKanban 
               cpmiList={cpmiList} 
               onViewDetails={(cpmi) => setSelectedCPMI(cpmi)} 
             />
          )}
          {activeTab === 'finance' && (
             <TransactionList 
               Transactions={allTransactions} 
               onAddTransaction={() => setIsTransactionModalOpen(true)} 
             /> 
          )}
          {activeTab === 'sponsors' && (
             <SponsorList sponsors={sponsors} onAdd={() => setIsSponsorModalOpen(true)} />
          )}
          {activeTab === 'reports' && (
             <ReportsPanel cpmiList={cpmiList} transactions={allTransactions} />
          )}
          {activeTab === 'settings' && (
             <SettingsPanel 
                settings={systemSettings} 
                onUpdateSettings={async (data) => {
                  try {
                    await updateDoc(doc(db, 'settings', 'global'), {
                      ...data,
                      updatedAt: serverTimestamp()
                    });
                    setSystemSettings({...systemSettings!, ...data});
                    toast.success("Pengaturan berhasil diperbarui!");
                  } catch (e) {
                    toast.error("Gagal update pengaturan.");
                  }
                }} 
                userProfile={userProfile}
                logout={logout}
             />
          )}
          {activeTab === 'users' && userProfile?.role === 'SUPER_ADMIN' && (
            <UserManagement 
              users={users} 
              onUpdateUser={handleUpdateUserProfile}
              onDeleteUser={handleDeleteUser}
              currentUser={userProfile}
            />
          )}
        </>
      )}

      <CPMIModal 
        open={isCPMIModalOpen} 
        onOpenChange={setIsCPMIModalOpen} 
        onSubmit={handleAddCPMI}
        initialData={editingCPMI}
        systemSettings={systemSettings}
      />

      <TransactionModal 
        open={isTransactionModalOpen} 
        onOpenChange={setIsTransactionModalOpen} 
        onSubmit={handleAddTransaction}
        cpmiId={selectedCPMI?.id}
      />

      <SponsorModal 
        open={isSponsorModalOpen} 
        onOpenChange={setIsSponsorModalOpen} 
        onSubmit={handleAddSponsor} 
      />
    </Layout>
  );
}
