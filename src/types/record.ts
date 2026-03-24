export interface RecordResponse {
  id: number;
  title: string;
  purpose: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordRequest {
  title: string;
  purpose: string;
  description: string;
}

export type FormMode = 'create' | 'edit';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  message: string;
}