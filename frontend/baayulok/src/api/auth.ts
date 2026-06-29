import client from './client';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const res = await client.post<LoginResponse>('/api/auth/login', payload);
  return res.data;
}

export async function registerUser(payload: RegisterRequest): Promise<RegisterResponse> {
  const res = await client.post<RegisterResponse>('/api/auth/register', payload);
  return res.data;
}