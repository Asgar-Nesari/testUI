import { useState, useEffect } from 'react';
import { X, Save, Plus, Loader2 } from 'lucide-react';
import type { FormMode, RecordRequest, RecordResponse } from '../types/record';


interface Props {
  mode: FormMode;
  record?: RecordResponse | null;
  onSubmit: (data: RecordRequest) => Promise<boolean>;
  onClose: () => void;
}

const empty: RecordRequest = { title: '', purpose: '', description: '' };

export default function RecordModal({ mode, record, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<RecordRequest>(empty);
  const [errors, setErrors] = useState<Partial<RecordRequest>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && record) {
      setForm({ title: record.title, purpose: record.purpose, description: record.description });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [mode, record]);

  const validate = (): boolean => {
    const e: Partial<RecordRequest> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.purpose.trim()) e.purpose = 'Purpose is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const ok = await onSubmit(form);
    setSubmitting(false);
    if (ok) onClose();
  };

  const field = (key: keyof RecordRequest, label: string, multiline = false) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-mono tracking-widest uppercase text-acid">{label}</label>
      {multiline ? (
        <textarea
          rows={4}
          value={form[key]}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}...`}
          className={`bg-ink-700 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 font-body resize-none
            outline-none transition-all focus:border-acid focus:ring-1 focus:ring-acid/30
            ${errors[key] ? 'border-red-500' : 'border-ink-600'}`}
        />
      ) : (
        <input
          type="text"
          value={form[key]}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}...`}
          className={`bg-ink-700 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 font-body
            outline-none transition-all focus:border-acid focus:ring-1 focus:ring-acid/30
            ${errors[key] ? 'border-red-500' : 'border-ink-600'}`}
        />
      )}
      {errors[key] && <span className="text-red-400 text-xs font-mono">{errors[key]}</span>}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-acid/10 border border-acid/30 flex items-center justify-center">
              {mode === 'create' ? <Plus size={15} className="text-acid" /> : <Save size={15} className="text-acid" />}
            </div>
            <h2 className="font-display font-700 text-white text-lg">
              {mode === 'create' ? 'New Record' : 'Edit Record'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-ink-600 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {field('title', 'Title')}
          {field('purpose', 'Purpose')}
          {field('description', 'Description', true)}
        </div>

        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-body text-gray-400 bg-ink-700 hover:bg-ink-600 transition-colors border border-ink-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-display font-600 bg-acid text-ink-950
              hover:bg-acid-dark transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
              : <><Save size={14} /> {mode === 'create' ? 'Create' : 'Update'}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}