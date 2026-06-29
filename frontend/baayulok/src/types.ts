// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface LoginResponse {
  accessToken?: string;
  token?: string;
  Token?: string;
  fullName?: string;
}

export interface RegisterResponse {
  userId: string;
}

export interface AuthUser {
  email: string;
  fullName: string;
}

// ─── Department ──────────────────────────────────────────────────────────────

export interface Department {
  id: string;
  name: string;
}

// ─── Patient ─────────────────────────────────────────────────────────────────

export type PatientStatus =
  | 'Draft'
  | 'PendingReview'
  | 'Active'
  | 'Funded'
  | 'Closed'
  | 'Rejected';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  district: string;
  disease: string;
  departmentId: string;
  departmentName?: string;
  criticalityScore: number;
  costTotal: number;
  costRaised: number;
  photoUrl?: string | null;
  medicalSummary?: string | null;
  bipannaVerified: boolean;
  isEmergency: boolean;
  status: PatientStatus;
  createdByOfficerId?: string;
  createdAt?: string;
}

export interface CreatePatientPayload {
  name: string;
  age: number;
  gender: Gender;
  district: string;
  disease: string;
  departmentId: string;
  criticalityScore: number;
  costTotal: number;
  photoUrl?: string | null;
  medicalSummary?: string | null;
  bipannaVerified: boolean;
  isEmergency: boolean;
  createdByOfficerId: string;
}

export interface UpdatePatientPayload {
  name: string;
  age: number;
  gender: Gender;
  district: string;
  disease: string;
  departmentId: string;
  criticalityScore: number;
  costTotal: number;
  photoUrl?: string | null;
  medicalSummary?: string | null;
  bipannaVerified: boolean;
  isEmergency: boolean;
}

export interface CreatePatientResponse {
  patientId: string;
}

// ─── Document ────────────────────────────────────────────────────────────────

export type DocumentType =
  | 'MedicalReport'
  | 'Prescription'
  | 'LabResult'
  | 'IDProof'
  | 'BipannaCard'
  | 'Other';

export interface PatientDocument {
  id: string;
  patientId: string;
  type: DocumentType;
  fileUrl: string;
  originalFileName: string;
  createdAt?: string;
}

export interface CreateDocumentPayload {
  type: DocumentType | '';
  fileUrl: string;
  originalFileName: string;
}

export interface CreateDocumentResponse {
  documentId: string;
}

// ─── Donation ────────────────────────────────────────────────────────────────

export type PaymentMethod =
  | 'Esewa'
  | 'Khalti'
  | 'BankTransfer'
  | 'Cash'
  | 'ConnectIPS'
  | 'Other';

export interface Donation {
  id: string;
  patientId: string;
  donorUserId?: string | null;
  amount: number;
  paymentMethod: PaymentMethod;
  gatewayReference?: string | null;
  message?: string | null;
  createdAt?: string;
}

export interface CreateDonationPayload {
  donorUserId?: string | null;
  amount: number;
  paymentMethod: PaymentMethod | '';
  gatewayReference?: string | null;
  message?: string | null;
}

export interface CreateDonationResponse {
  donationId: string;
}