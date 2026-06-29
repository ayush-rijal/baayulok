import { useCallback, useState } from 'react';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  updatePatientStatus,
  getPatientDocuments,
  createPatientDocument,
  getPatientDonations,
  createDonation,
} from '../api/patients';
import type {
  Patient,
  CreatePatientPayload,
  UpdatePatientPayload,
  PatientDocument,
  CreateDocumentPayload,
  Donation,
  CreateDonationPayload,
} from '../types';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPatients(await getAllPatients());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOne = useCallback(async (id: string): Promise<Patient | null> => {
    try {
      return await getPatientById(id);
    } catch (err) {
      setError((err as Error).message);
      return null;
    }
  }, []);

  const create = useCallback(
    async (data: CreatePatientPayload) => {
      const result = await createPatient(data);
      await fetchAll();
      return result;
    },
    [fetchAll],
  );

  const update = useCallback(
    async (id: string, data: UpdatePatientPayload) => {
      await updatePatient(id, data);
      await fetchAll();
    },
    [fetchAll],
  );

  const updateStatus = useCallback(async (id: string, status: string) => {
    await updatePatientStatus(id, status);
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: status as Patient['status'] } : p)),
    );
  }, []);

  // ─── Documents ─────────────────────────────────────────────────────────────

  const fetchDocuments = useCallback(async (patientId: string): Promise<PatientDocument[]> => {
    try {
      return await getPatientDocuments(patientId);
    } catch (err) {
      setError((err as Error).message);
      return [];
    }
  }, []);

  const addDocument = useCallback(
    async (patientId: string, data: CreateDocumentPayload) =>
      createPatientDocument(patientId, data),
    [],
  );

  // ─── Donations ─────────────────────────────────────────────────────────────

  const fetchDonations = useCallback(async (patientId: string): Promise<Donation[]> => {
    try {
      return await getPatientDonations(patientId);
    } catch (err) {
      setError((err as Error).message);
      return [];
    }
  }, []);

  const addDonation = useCallback(
    async (patientId: string, data: CreateDonationPayload) =>
      createDonation(patientId, data),
    [],
  );

  return {
    patients,
    loading,
    error,
    fetchAll,
    fetchOne,
    create,
    update,
    updateStatus,
    fetchDocuments,
    addDocument,
    fetchDonations,
    addDonation,
  };
}