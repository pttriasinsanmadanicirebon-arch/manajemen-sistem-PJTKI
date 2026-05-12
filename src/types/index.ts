export type UserRole = 'SUPER_ADMIN' | 'KEPALA_CABANG' | 'ADMIN_OPERASIONAL' | 'STAFF_FINANCE' | 'SPONSOR';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  cabang?: string;
}

export interface SystemSettings {
  id: string;
  companyName: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  updatedAt: any;
}

export type CPMIStatus = 
  | 'Baru' 
  | 'Interview' 
  | 'MCU' 
  | 'MCU Fit' 
  | 'Paspor' 
  | 'PK' 
  | 'Visa' 
  | 'Ready Terbang' 
  | 'Terbang' 
  | 'Working' 
  | 'Return' 
  | 'Cancel';

export interface CPMICompleteness {
  ktp: boolean;
  kk: boolean;
  akte: boolean;
  ijazah: boolean;
  paspor: boolean;
  mcu: boolean;
  visa: boolean;
  pk: boolean;
  perjanjian: boolean;
  suratIjin: boolean;
}

export interface CPMI {
  id: string;
  regNo: string;
  name: string;
  photoUrl?: string;
  nik: string;
  passportNo?: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  phone: string;
  familyContact: string; // Name & Phone
  education: string;
  marriageStatus: string;
  weight?: number;
  height?: number;
  motherName?: string;
  fatherName?: string;
  parentsAddress?: string;
  provinsi?: string;
  kabupaten?: string;
  targetCountry: string;
  jobType: string;
  agency: string;
  sponsor: string;
  sponsorId?: string;
  branch: string;
  registrationDate: string;
  flightDate?: string;
  status: CPMIStatus;
  statusHistory?: { status: string; date: string; note?: string }[];
  note: string;
  bottleneck?: string;
  picId?: string; // Assigned Admin/PIC
  completeness: CPMICompleteness;
  totalDebt: number; // Sisa hutang/talangan
  unpaidProcessFees: number; // Fee proses yang belum diajukan
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

export type DocumentStatus = 'Pending' | 'Verified' | 'Rejected';
export type DocumentType = 
  | 'KTP' | 'KK' | 'Akte Kelahiran' | 'Ijazah' | 'Paspor' 
  | 'MCU' | 'Visa' | 'PK' | 'Sertifikat' | 'Foto' | 'Surat Ijin' | 'Perjanjian';

export interface CPMIDocument {
  id: string;
  cpmiId: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  status: DocumentStatus;
  note: string;
  uploadedAt: any;
  verifiedAt?: any;
  verifiedBy?: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE' | 'DEBT' | 'CREDIT';
export type TransactionCategory = 
  | 'Living cost' | 'MCU' | 'Paspor' | 'Visa' | 'BPJS' 
  | 'Transport' | 'Royalti' | 'Fee sponsor' | 'Fee agency' 
  | 'Biaya admin' | 'Penginapan' | 'Tiket' | 'Gaji Staf' | 'Sewa Kantor'
  | 'Titipan biaya' | 'Penggantian biaya' | 'Talangan proses' | 'Lainnya';

export interface Transaction {
  id: string;
  cpmiId?: string;
  sponsorId?: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: string;
  refNo: string;
  note?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isKwitansiGenerated: boolean;
  approvedBy?: string;
  approvedAt?: any;
  createdAt: any;
  createdBy: string;
}

export interface Sponsor {
  id: string;
  name: string;
  region: string;
  phone: string;
  cpmiCount: number;
  unpaidFees: number;
  paidFees: number;
  totalDebt: number; // Hutang sponsor ke kantor or vice versa
  performanceScore: number; // 1-100
  createdAt: any;
}

export interface AuditLog {
  id: string;
  entityId: string;
  entityType: 'CPMI' | 'FINANCE' | 'USER';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  changes: { field: string; old: any; new: any }[];
  performedBy: string;
  performedAt: any;
}
