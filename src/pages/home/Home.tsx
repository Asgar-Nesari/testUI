import { useState, useCallback } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  LayoutGrid,
  List,
  X,
  ChevronDown,
  Layers,
  Pencil,
  Trash2,
  Clock,
  Tag,
} from "lucide-react";
import type { FormMode, RecordResponse } from "../../types/record";
import EmptyState from "../../components/EmptyState";
import RecordModal from "../../components/RecordModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import ToastContainer from "../../components/ToastContainer";
import { useRecords } from "../../hooks/useRecords";

type ViewMode = "grid" | "list";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function RecordCard({
  record,
  index,
  onEdit,
  onDelete,
}: {
  record: RecordResponse;
  index: number;
  onEdit: (r: RecordResponse) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className="group relative flex flex-col gap-4 rounded-2xl p-5
        bg-linear-to-br from-slate-900 to-slate-900/80
        border border-slate-800 hover:border-amber-500/40
        transition-all duration-300 hover:-translate-y-1
        hover:shadow-2xl hover:shadow-amber-500/5 overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-400/20 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

    
      <div
        className="absolute -top-10 -left-10 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-mono text-[10px] tracking-[0.15em] text-amber-400/40">
            #{String(record.id).padStart(3, "0")}
          </span>
          <h3 className="text-white font-semibold text-[15px] leading-snug truncate tracking-tight">
            {record.title}
          </h3>
        </div>

        {/* Action buttons - visible on hover */}
        <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={() => onEdit(record)}
            className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700
              hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400
              flex items-center justify-center text-slate-400 transition-all duration-150"
          >
            <Pencil size={11} />
          </button>
          <button
            onClick={() => onDelete(record.id)}
            className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700
              hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400
              flex items-center justify-center text-slate-400 transition-all duration-150"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Purpose badge */}
      <div className="relative z-10 flex items-center gap-2">
        <Tag size={10} className="text-amber-400/50 shrink-0" />
        <span
          className="text-[10px] font-mono text-amber-400/70
          bg-amber-400/8 border border-amber-400/15
          px-2.5 py-0.5 rounded-full truncate max-w-full"
        >
          {record.purpose}
        </span>
      </div>

      {/* Description */}
      <p className="relative z-10 text-slate-400 text-[13px] leading-relaxed line-clamp-3">
        {record.description}
      </p>

      {/* Footer */}
      <div className="relative z-10 flex items-center gap-1.5 pt-3 mt-auto border-t border-slate-800/80">
        <Clock size={9} className="text-slate-600" />
        <span className="font-mono text-[10px] text-slate-600">
          {formatDate(record.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const {
    records,
    loading,
    toasts,
    createRecord,
    updateRecord,
    deleteRecord,
    searchRecords,
    fetchAll,
  } = useRecords();

  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editTarget, setEditTarget] = useState<RecordResponse | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<"title" | "purpose">("title");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const openCreate = () => {
    setFormMode("create");
    setEditTarget(null);
    setModalOpen(true);
  };
  const openEdit = (r: RecordResponse) => {
    setFormMode("edit");
    setEditTarget(r);
    setModalOpen(true);
  };

  const handleSearch = useCallback(
    (val: string) => {
      setSearch(val);
      searchRecords(val, searchField);
    },
    [searchField, searchRecords],
  );

  const handleFieldChange = (field: "title" | "purpose") => {
    setSearchField(field);
    setDropdownOpen(false);
    if (search) searchRecords(search, field);
  };

  const clearSearch = () => {
    setSearch("");
    fetchAll();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200
          bg-amber-500/2 rounded-full blur-3xl"
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3 sm:gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div
                className="w-8 h-8 rounded-xl bg-linear-to-br from-amber-400 to-amber-500
                flex items-center justify-center shadow-lg shadow-amber-500/20"
              >
                <Layers size={15} className="text-slate-900" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-white font-bold text-base leading-none tracking-tight">
                  Record<span className="text-amber-400">Vault</span>
                </span>
                <span className="text-slate-600 text-[9px] font-mono tracking-widest uppercase mt-0.5">
                  Data Manager
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-8 w-px bg-slate-800 shrink-0" />

            {/* Search bar */}
            <div className="flex-1 flex items-center gap-2 min-w-0">
              {/* Field selector dropdown */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                    bg-slate-900 border border-slate-800 hover:border-amber-500/30
                    text-[11px] font-mono text-slate-400 hover:text-white
                    transition-all duration-200 whitespace-nowrap"
                >
                  {searchField}
                  <ChevronDown
                    size={10}
                    className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute top-full mt-1.5 left-0 z-50
                    bg-slate-900 border border-slate-800 rounded-xl overflow-hidden
                    shadow-2xl shadow-black/50 min-w-20"
                  >
                    {(["title", "purpose"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => handleFieldChange(f)}
                        className={`w-full text-left px-3 py-2.5 text-[11px] font-mono transition-colors
                          ${
                            searchField === f
                              ? "text-amber-400 bg-amber-500/10"
                              : "text-slate-400 hover:text-white hover:bg-slate-800"
                          }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search input */}
              <div className="relative flex-1">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={`Search by ${searchField}...`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl
                    pl-9 pr-9 py-2 text-sm text-white placeholder-slate-600
                    outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10
                    transition-all duration-200"
                />
                {search && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Refresh */}
              <button
                onClick={() => fetchAll()}
                title="Refresh"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800
                  hover:border-amber-500/30 hover:text-white
                  flex items-center justify-center text-slate-500 transition-all duration-200"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
              </button>

              {/* View toggle */}
              <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`w-9 h-9 flex items-center justify-center transition-all duration-200
                    ${
                      viewMode === "grid"
                        ? "bg-amber-500/15 text-amber-400"
                        : "text-slate-500 hover:text-white"
                    }`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`w-9 h-9 flex items-center justify-center transition-all duration-200
                    ${
                      viewMode === "list"
                        ? "bg-amber-500/15 text-amber-400"
                        : "text-slate-500 hover:text-white"
                    }`}
                >
                  <List size={14} />
                </button>
              </div>

              {/* New Record */}
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-linear-to-r from-blue-400 to-blue-500
                  text-slate-900 font-bold text-sm
                  hover:from-amber-300 hover:to-amber-400
                  transition-all duration-200
                  shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30
                  hover:-translate-y-px active:translate-y-0"
              >
                <Plus size={15} />
                <span className="hidden sm:inline">New Record</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Page hero / stats ──────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 bg-linear-to-b from-amber-400 to-amber-500 rounded-full" />
              <span className="text-[11px] font-mono text-amber-400/70 tracking-[0.2em] uppercase">
                Dashboard
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none">
              Your Records
              {search && (
                <span className="text-amber-400 text-lg font-normal ml-3">
                  — "{search}"
                </span>
              )}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Manage all your data entries in one place
            </p>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl
              bg-slate-900 border border-slate-800"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400 text-xs font-mono">
                <span className="text-white font-semibold">
                  {records.length}
                </span>{" "}
                total
              </span>
            </div>

            {loading && (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                bg-amber-500/10 border border-amber-500/20"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400/80 text-xs font-mono">
                  syncing...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 h-px bg-linear-to-r from-transparent via-slate-800 to-transparent" />
      </div>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {!loading && records.length === 0 ? (
          <EmptyState onAdd={openCreate} />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {records.map((r: RecordResponse, i: number) => (
              <RecordCard
                key={r.id}
                record={r}
                index={i}
                onEdit={openEdit}
                onDelete={setDeleteId}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* List header */}
            <div
              className="hidden sm:grid grid-cols-[40px_1fr_1fr_1fr_100px] gap-4 px-5 pb-2
              text-[10px] font-mono text-slate-600 uppercase tracking-widest"
            >
              <span>#</span>
              <span>Title</span>
              <span>Purpose</span>
              <span>Description</span>
              <span className="text-right">Actions</span>
            </div>

            {records.map((r: RecordResponse, i: number) => (
              <div
                key={r.id}
                className="group flex flex-col sm:grid sm:grid-cols-[40px_1fr_1fr_1fr_100px]
                  items-start sm:items-center gap-3 sm:gap-4
                  px-5 py-4 rounded-2xl
                  bg-slate-900/60 border border-slate-800
                  hover:border-amber-500/30 hover:bg-slate-900
                  transition-all duration-200"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="hidden sm:block font-mono text-[10px] text-amber-400/30">
                  {String(r.id).padStart(3, "0")}
                </span>

                <div className="min-w-0 w-full sm:w-auto">
                  <p className="sm:hidden text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-0.5">
                    Title
                  </p>
                  <p className="text-white font-semibold text-sm truncate">
                    {r.title}
                  </p>
                </div>

                <div className="min-w-0 w-full sm:w-auto">
                  <p className="sm:hidden text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-0.5">
                    Purpose
                  </p>
                  <p className="text-amber-400/70 font-mono text-xs truncate">
                    {r.purpose}
                  </p>
                </div>

                <div className="min-w-0 w-full sm:w-auto">
                  <p className="sm:hidden text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-0.5">
                    Description
                  </p>
                  <p className="text-slate-400 text-sm truncate">
                    {r.description}
                  </p>
                </div>

                <div
                  className="flex items-center gap-2 sm:justify-end w-full sm:w-auto
                  sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                >
                  <button
                    onClick={() => openEdit(r)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-mono
                      bg-slate-800 border border-slate-700
                      hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400
                      text-slate-400 transition-all duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(r.id)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-mono
                      bg-slate-800 border border-slate-700
                      hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400
                      text-slate-400 transition-all duration-150"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ─────────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <RecordModal
          mode={formMode}
          record={editTarget}
          onSubmit={
            formMode === "create"
              ? (data) => createRecord(data)
              : (data) => updateRecord(editTarget!.id, data)
          }
          onClose={() => setModalOpen(false)}
        />
      )}

      {deleteId !== null && (
        <DeleteConfirmModal
          onConfirm={() => deleteRecord(deleteId)}
          onClose={() => setDeleteId(null)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
