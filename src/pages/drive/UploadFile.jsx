import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Upload, CheckCircle, X, File, FolderIcon } from "lucide-react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFolders, addFileToFolder } from "@/services/driveService";
import { showToast } from "@/utils/toast";

function readAsDataUrl(fileObj) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(fileObj);
  });
}

function detectType(fileName) {
  const ext = fileName.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return "video";
  return "file";
}

export default function UploadFile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [folders] = useState(getFolders());
  const incomingFolder = searchParams.get("folder") || location.state?.fromFolderId || "";
  const initialFolderId = incomingFolder || String(folders[0]?.id || "");
  const [folderId, setFolderId] = useState(String(initialFolderId));
  const [queue, setQueue] = useState([]); // [{ name, size, type, status }]
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ── Drag & drop handlers ──────────────────────────────────────────────────

  const onDragOver = useCallback(e => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);
  const onDrop = useCallback(e => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addToQueue(files);
  }, []);

  const onFileInput = (e) => {
    const files = Array.from(e.target.files);
    addToQueue(files);
    e.target.value = "";
  };

  const addToQueue = (files) => {
    const entries = files.map(f => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size,
      type: detectType(f.name),
      rawFile: f,
      status: "pending",
    }));
    setQueue(prev => [...prev, ...entries]);
  };

  const removeFromQueue = (id) => {
    setQueue(prev => prev.filter(f => f.id !== id));
  };

  // ── Upload ────────────────────────────────────────────────────────────────

  const handleUpload = async () => {
    if (!folderId) { showToast("Pilih folder tujuan", "error"); return; }
    const pending = queue.filter(f => f.status === "pending");
    if (pending.length === 0) { showToast("Tidak ada file untuk diunggah", "error"); return; }

    setUploading(true);

    for (const file of pending) {
      // simulate per-file progress
      setQueue(prev => prev.map(f => f.id === file.id ? { ...f, status: "uploading" } : f));
      await new Promise(r => setTimeout(r, 300));
      let previewUrl = "";
      if (file.rawFile && ["image", "pdf", "video"].includes(file.type)) {
        try {
          previewUrl = await readAsDataUrl(file.rawFile);
        } catch {
          previewUrl = "";
        }
      }
      addFileToFolder(Number(folderId), {
        name: file.name,
        type: file.type,
        size: file.size,
        previewUrl,
        mimeType: file.rawFile?.type || "",
      });
      setQueue(prev => prev.map(f => f.id === file.id ? { ...f, status: "done" } : f));
    }

    setUploading(false);
    showToast(`${pending.length} file berhasil diunggah`, "success");
    const destination = incomingFolder ? `/drive?folder=${incomingFolder}` : "/drive";
    setTimeout(() => navigate(destination), 800);
  };

  const doneCount = queue.filter(f => f.status === "done").length;
  const pendingCount = queue.filter(f => f.status === "pending").length;
  const backTo = incomingFolder ? `/drive?folder=${incomingFolder}` : "/drive";

  function formatSize(bytes) {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-2xl p-5 sm:p-7 lg:p-8">
        <div className="mb-8 flex items-center gap-4">
          <Link to={backTo}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Unggah Berkas</h1>
            <p className="text-slate-300">Tambahkan file ke folder keluarga</p>
          </div>
        </div>

        <Card className="rounded-2xl backdrop-blur-xl mb-5">
          <CardContent className="p-6">
            {/* Folder picker */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">Folder Tujuan</label>
              <div className="flex items-center gap-2">
                <FolderIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <select
                  value={folderId}
                  onChange={e => setFolderId(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {folders.map(f => (
                    <option key={f.id} value={f.id} className="bg-slate-800">{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Drag & drop zone */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 text-center ${
                isDragging
                  ? "border-sky-400 bg-sky-500/10"
                  : "border-white/20 hover:border-sky-400/60 hover:bg-white/5"
              }`}
            >
              <Upload className={`mx-auto mb-3 h-10 w-10 transition ${isDragging ? "text-sky-400" : "text-slate-400"}`} />
              <p className="font-semibold text-slate-200">
                {isDragging ? "Lepaskan untuk mengunggah" : "Drag & drop file di sini"}
              </p>
              <p className="mt-1 text-sm text-slate-400">atau klik untuk pilih file</p>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFileInput} />
            </div>
          </CardContent>
        </Card>

        {/* Queue */}
        {queue.length > 0 && (
          <Card className="rounded-2xl backdrop-blur-xl mb-5">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Antrian Unggah ({queue.length})</h3>
                {doneCount > 0 && (
                  <span className="text-xs text-emerald-400">{doneCount} selesai</span>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {queue.map(file => (
                  <div key={file.id} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                    <File className="h-4 w-4 flex-shrink-0 text-sky-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {file.status === "done" && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                      {file.status === "uploading" && (
                        <div className="h-4 w-4 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                      )}
                      {file.status === "pending" && (
                        <button onClick={() => removeFromQueue(file.id)} className="text-slate-400 hover:text-red-400">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link to={backTo} className="flex-1">
            <Button variant="outline" className="w-full">Batal</Button>
          </Link>
          <Button
            onClick={handleUpload}
            disabled={uploading || pendingCount === 0}
            className="flex-1 gap-2"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Mengunggah...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Unggah {pendingCount > 0 ? `(${pendingCount})` : ""}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
