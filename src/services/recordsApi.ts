import axios from 'axios';
import type { RecordRequest, RecordResponse } from '../types/record';


// const BASE = '/api/records';
const BASE = `${import.meta.env.VITE_API_URL}/api/records`;

export const recordsApi = {
  getAll: async (): Promise<RecordResponse[]> => {
    const res = await axios.get<RecordResponse[]>(BASE);
    return res.data;
  },
  getById: async (id: number): Promise<RecordResponse> => {
    const res = await axios.get<RecordResponse>(`${BASE}/${id}`);
    return res.data;
  },
  create: async (data: RecordRequest): Promise<RecordResponse> => {
    const res = await axios.post<RecordResponse>(BASE, data);
    return res.data;
  },
  update: async (id: number, data: RecordRequest): Promise<RecordResponse> => {
    const res = await axios.put<RecordResponse>(`${BASE}/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE}/${id}`);
  },
  search: async (query: string, field: 'title' | 'purpose'): Promise<RecordResponse[]> => {
    const res = await axios.get<RecordResponse[]>(BASE, { params: { [field]: query } });
    return res.data;
  },
};