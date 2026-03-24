import { FolderOpen, Plus } from 'lucide-react';

interface Props { onAdd: () => void; }

export default function EmptyState({ onAdd }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-ink-700 border border-ink-600 flex items-center justify-center mb-6">
        <FolderOpen size={32} className="text-gray-600" />
      </div>
      <h3 className="font-display font-700 text-white text-xl mb-2">No records yet</h3>
      <p className="text-gray-500 font-body text-sm mb-8 max-w-xs leading-relaxed">
        Start adding records to manage your data. Each record holds a title, purpose, and description.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-acid text-ink-950 font-display font-600 text-sm hover:bg-acid-dark transition-colors"
      >
        <Plus size={16} /> Add First Record
      </button>
    </div>
  );
}