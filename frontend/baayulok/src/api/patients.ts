import client from './client';
import type {
  Patient,
  CreatePatientPayload,
  CreatePatientResponse,
  UpdatePatientPayload,
  PatientDocument,
  CreateDocumentPayload,
  CreateDocumentResponse,
  Donation,
  CreateDonationPayload,
  CreateDonationResponse,
} from '../types';

// ─── Patients ────────────────────────────────────────────────────────────────

export async function getAllPatients(): Promise<Patient[]> {
  const res = await client.get<Patient[]>('/api/patients');
  return res.data;
}

export async function getPatientById(id: string): Promise<Patient> {
  const res = await client.get<Patient>(`/api/patients/${id}`);
  return res.data;
}

export async function createPatient(data: CreatePatientPayload): Promise<CreatePatientResponse> {
  const res = await client.post<CreatePatientResponse>('/api/patients', data);
  return res.data;
}

export async function updatePatient(id: string, data: UpdatePatientPayload): Promise<void> {
  await client.put(`/api/patients/${id}`, data);
}

export async function updatePatientStatus(id: string, status: string): Promise<void> {
  await client.patch(`/api/patients/${id}/status`, { status });
}

// ─── Documents ───────────────────────────────────────────────────────────────

export async function getPatientDocuments(patientId: string): Promise<PatientDocument[]> {
  const res = await client.get<PatientDocument[]>(`/api/patients/${patientId}/documents`);
  return res.data;
}

export async function createPatientDocument(
  patientId: string,
  data: CreateDocumentPayload,
): Promise<CreateDocumentResponse> {
  const res = await client.post<CreateDocumentResponse>(
    `/api/patients/${patientId}/documents`,
    data,
  );
  return res.data;
}

// ─── Donations ───────────────────────────────────────────────────────────────

export async function getPatientDonations(patientId: string): Promise<Donation[]> {
  const res = await client.get<Donation[]>(`/api/patients/${patientId}/donations`);
  return res.data;
}

export async function createDonation(
  patientId: string,
  data: CreateDonationPayload,
): Promise<CreateDonationResponse> {
  const res = await client.post<CreateDonationResponse>(
    `/api/patients/${patientId}/donations`,
    data,
  );
  return res.data;
}