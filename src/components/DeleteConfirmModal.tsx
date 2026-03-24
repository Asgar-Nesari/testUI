import { Trash2, X } from 'lucide-react';

interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({ onConfirm, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm bg-ink-800 border border-red-900/40 rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <Trash2 size={15} className="text-red-400" />
            </div>
            <h2 className="font-display font-700 text-white text-lg">Delete Record</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-ink-600 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-gray-400 font-body text-sm leading-relaxed">
            Are you sure you want to delete this record?<br />
            <span className="text-red-400 font-mono text-xs">This action cannot be undone.</span>
          </p>
        </div>

        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-body text-gray-400 bg-ink-700 hover:bg-ink-600 transition-colors border border-ink-600"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-6 py-2.5 rounded-lg text-sm font-display font-600 bg-red-500 text-white
              hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}