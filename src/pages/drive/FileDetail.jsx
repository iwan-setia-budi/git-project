import { useEffect, useState } from "react";
import { ArrowLeft, Download, Star, Tag, Edit2, Trash2, FolderIcon, Image, FileText, Film, FileIcon, X } from "lucide-react";
import { Link, useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFolders, togglePinFile, setFileTags, deleteFile, renameFile, recordFileAccess } from "@/services/driveService";
import { showToast } from "@/utils/toast";

const TAG_PRESETS = ["Penting", "Sekolah", "Keuangan", "Kesehatan", "Kerja", "Pribadi"];

function formatSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(",");
  const mime = (header.match(/data:(.*?);base64/) || [])[1] || "application/octet-stream";
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return new Blob([out], { type: mime });
}

function PreviewPanel({ file }) {
  if (file.type === "image" && file.previewUrl) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
        <img src={file.previewUrl} alt={file.name} className="max-h-[480px] w-full rounded-xl object-contain" />
      </div>
    );
  }
  if (file.type === "pdf" && file.previewUrl) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-2">
        <iframe title="Preview PDF" src={file.previewUrl} className="h-[520px] w-full rounded-xl bg-white" />
      </div>
    );
  }
  if (file.type === "video" && file.previewUrl) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
        <video controls className="max-h-[520px] w-full rounded-xl" src={file.previewUrl} />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 min-h-48">
      <FileIcon className="h-16 w-16 text-sky-400 mb-3" />
      <p className="text-sm text-slate-400">Preview tidak tersedia untuk tipe ini</p>
    </div>
  );
}

export default function FileDetail() {
  const { folderId, fileId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [folders, setFolders] = useState(getFolders());
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagValue, setTagValue] = useState([]);

  const folder = folders.find(f => String(f.id) === String(folderId));
  const file = folder?.files?.find(item => String(item.id) === String(fileId));
  const fromFolderId = Number(location.state?.fromFolderId || searchParams.get("folder") || folderId);
  const backTo = `/drive?folder=${fromFolderId}`;

  useEffect(() => {
    if (folderId && fileId) recordFileAccess(Number(folderId), Number(fileId));
  }, [folderId, fileId]);

  const refresh = () => setFolders(getFolders());

  if (!file) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <p className="text-slate-400">File tidak ditemukan.</p>
        <Link to={backTo} className="mt-4 inline-block text-sky-300 hover:underline">← Kembali ke Penyimpanan</Link>
      </div>
    );
  }

  const handleTogglePin = () => {
    const pinned = togglePinFile(Number(folderId), Number(fileId));
    refresh();
    showToast(pinned ? "File disematkan ⭐" : "Sematkan dilepas", "success");
  };

  const handleRenameSubmit = () => {
    if (!renameValue.trim()) { showToast("Nama tidak boleh kosong", "error"); return; }
    renameFile(Number(folderId), Number(fileId), renameValue.trim());
    refresh();
    setRenaming(false);
    showToast("Nama diubah", "success");
  };

  const handleDelete = () => {
    if (!confirm("Hapus file ini ke Sampah?")) return;
    deleteFile(Number(folderId), Number(fileId));
    showToast("File dihapus ke Sampah", "success");
    navigate(backTo);
  };

  const handleTagSave = () => {
    setFileTags(Number(folderId), Number(fileId), tagValue);
    refresh();
    setShowTagModal(false);
    showToast("Tag disimpan", "success");
  };

  const handleDownload = () => {
    if (file.previewUrl?.startsWith("data:")) {
      triggerBlobDownload(dataUrlToBlob(file.previewUrl), file.name);
      showToast("File diunduh", "success");
      return;
    }
    const fallback = new Blob([`Nama: ${file.name}\nTipe: ${file.type}`], { type: "text/plain;charset=utf-8" });
    triggerBlobDownload(fallback, file.name.includes(".") ? file.name : `${file.name}.txt`);
    showToast("File diunduh", "success");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-3xl p-5 sm:p-7 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(backTo)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold">{file.name}</h1>
            <p className="text-sm text-slate-400">
              <span className="text-slate-300">{folder?.name}</span>
              {" · "}
              {formatSize(file.size)}
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-5">
          {/* Preview */}
          <div className="lg:col-span-3">
            <h2 className="mb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider">Preview</h2>
            <PreviewPanel file={file} />
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="rounded-2xl backdrop-blur-xl">
              <CardContent className="p-5 space-y-4">
                {/* Name row with rename */}
                <div>
                  <p className="text-xs text-slate-400 mb-1">Nama File</p>
                  {renaming ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleRenameSubmit()}
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <button onClick={handleRenameSubmit} className="text-emerald-400 hover:text-emerald-300 text-sm">✓</button>
                      <button onClick={() => setRenaming(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate flex-1">{file.name}</p>
                      <button onClick={() => { setRenaming(true); setRenameValue(file.name); }} className="text-slate-400 hover:text-white">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Folder</p>
                  <div className="flex items-center gap-1.5">
                    <FolderIcon className="h-4 w-4 text-yellow-400" />
                    <p className="font-medium">{folder?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Tipe</p>
                    <p className="capitalize font-medium">{file.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Ukuran</p>
                    <p className="font-medium">{formatSize(file.size)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Tanggal Upload</p>
                  <p className="font-medium">
                    {new Date(file.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-400">Tag</p>
                    <button onClick={() => { setShowTagModal(true); setTagValue(file.tags || []); }} className="text-xs text-sky-400 hover:underline">Kelola</button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(file.tags || []).length === 0
                      ? <span className="text-xs text-slate-500">Belum ada tag</span>
                      : (file.tags || []).map(t => (
                          <span key={t} className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">{t}</span>
                        ))
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button onClick={handleDownload} className="w-full gap-2">
                <Download className="h-4 w-4" /> Unduh Berkas
              </Button>
              <Button
                variant="outline"
                onClick={handleTogglePin}
                className={`w-full gap-2 ${file.pinned ? "border-amber-400/30 text-amber-400" : ""}`}
              >
                <Star className={`h-4 w-4 ${file.pinned ? "fill-amber-400" : ""}`} />
                {file.pinned ? "Lepas Sematkan" : "Sematkan"}
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="w-full gap-2 border-red-400/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" /> Hapus ke Sampah
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tag modal */}
      {showTagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Kelola Tag</h3>
              <button onClick={() => setShowTagModal(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {TAG_PRESETS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setTagValue(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  className={`rounded-full px-3 py-1 text-sm transition ${tagValue.includes(tag) ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowTagModal(false)}>Batal</Button>
              <Button onClick={handleTagSave}><Tag className="mr-2 h-4 w-4" />Simpan Tag</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

