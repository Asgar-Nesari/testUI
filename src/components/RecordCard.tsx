import { Pencil, Trash2, Clock, Tag } from 'lucide-react';
import type { RecordResponse } from '../types/record';


interface Props {
  record: RecordResponse;
  index: number;
  onEdit: (record: RecordResponse) => void;
  onDelete: (id: number) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

export default function RecordCard({ record, index, onEdit, onDelete }: Props) {
  return (
    <div
      className="group relative bg-ink-800 border border-ink-600 rounded-2xl p-5 flex flex-col gap-4
        hover:border-acid/40 transition-all duration-300 hover:shadow-lg hover:shadow-acid/5 animate-slide-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both', opacity: 0 }}
    >
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-acid/30 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-mono text-[10px] text-acid/60 tracking-widest">
            #{String(record.id).padStart(3, '0')}
          </span>
          <h3 className="font-display font-700 text-white text-base leading-snug truncate">
            {record.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(record)}
            className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-acid/10 hover:border-acid/30 border border-transparent
              flex items-center justify-center transition-all text-gray-400 hover:text-acid"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(record.id)}
            className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent
              flex items-center justify-center transition-all text-gray-400 hover:text-red-400"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tag size={11} className="text-acid/60 shrink-0" />
        <span className="text-xs font-mono text-acid/80 bg-acid/10 border border-acid/20 px-2.5 py-0.5 rounded-full truncate">
          {record.purpose}
        </span>
      </div>

      <p className="text-gray-400 font-body text-sm leading-relaxed line-clamp-3">
        {record.description}
      </p>

      <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-ink-700">
        <Clock size={10} className="text-gray-600" />
        <span className="text-[11px] font-mono text-gray-600">{formatDate(record.createdAt)}</span>
      </div>
    </div>
  );
}