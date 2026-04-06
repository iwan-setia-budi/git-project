import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Trash2,
  FileIcon,
  FolderIcon,
  Download,
  Upload,
  Plus,
  Search,
  Star,
  Tag,
  RotateCcw,
  X,
  ChevronRight,
  Edit2,
  Move,
  CheckSquare,
  Square,
  Clock,
  HardDrive,
  ArrowUpDown,
  Image,
  FileText,
  Film,
  MoreVertical,
  FolderOpen,
  Trash,
  GripVertical,
} from "lucide-react";
import JSZip from "jszip";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import {
  getFolders,
  addFolder,
  renameFolder,
  renameFile,
  deleteFile,
  deleteFolder,
  moveFile,
  togglePinFolder,
  togglePinFile,
  setFileTags,
  searchFiles,
  getStorageStats,
  getTrash,
  restoreFromTrash,
  deletePermanently,
  emptyTrash,
  getRecentFiles,
  recordFileAccess,
} from "@/services/driveService";
import { getMasterList } from "@/services/masterDataService";
import { showToast } from "@/utils/toast";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Nama (A-Z)" },
  { value: "name-desc", label: "Nama (Z-A)" },
  { value: "date-desc", label: "Terbaru" },
  { value: "date-asc", label: "Terlama" },
  { value: "size-desc", label: "Terbesar" },
  { value: "size-asc", label: "Terkecil" },
];

const VIEWS = { FOLDERS: "folders", SEARCH: "search", RECENT: "recent", TRASH: "trash" };

function formatSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function fileIcon(type) {
  if (type === "image") return <Image className="h-4 w-4 text-emerald-400" />;
  if (type === "pdf") return <FileText className="h-4 w-4 text-red-400" />;
  if (type === "video") return <Film className="h-4 w-4 text-purple-400" />;
  return <FileIcon className="h-4 w-4 text-sky-400" />;
}

function sortItems(items, sort) {
  return [...items].sort((a, b) => {
    switch (sort) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "date-desc":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "date-asc":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "size-desc":
        return (b.size || 0) - (a.size || 0);
      case "size-asc":
        return (a.size || 0) - (b.size || 0);
      default:
        return 0;
    }
  });
}

function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(",");
  const mime = (header.match(/data:(.*?);base64/) || [])[1] || "application/octet-stream";
  const bytes = atob(base64);
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) out[i] = bytes.charCodeAt(i);
  return new Blob([out], { type: mime });
}

function getFileBlob(file) {
  if (file.previewUrl && file.previewUrl.startsWith("data:")) {
    return dataUrlToBlob(file.previewUrl);
  }
  const content = `Nama: ${file.name}\nTipe: ${file.type}\nUkuran: ${file.size || 0}`;
  return new Blob([content], { type: "text/plain;charset=utf-8" });
}

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name) {
  return name.replace(/[\\/:*?"<>|]/g, "_");
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ top: y, left: x }}
      className="fixed z-50 min-w-[170px] rounded-xl border border-white/10 bg-slate-800 py-1 shadow-2xl"
    >
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} className="my-1 border-t border-white/10" />
        ) : (
          <button
            key={i}
            onClick={() => {
              item.action();
              onClose();
            }}
            className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 ${
              item.danger ? "text-red-400" : "text-slate-200"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        )
      )}
    </div>
  );
}

function StorageBar({ stats }) {
  const pct = stats.percent.toFixed(1);
  const color = stats.percent > 80 ? "bg-red-500" : stats.percent > 60 ? "bg-amber-500" : "bg-sky-500";
  return (
    <Card className="rounded-xl backdrop-blur-xl mb-2">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-300 font-medium">Penyimpanan</span>
          <span className="ml-auto text-xs text-slate-400">
            {formatSize(stats.used)} / {formatSize(stats.total)}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-xs text-slate-500">{pct}% digunakan</p>
      </CardContent>
    </Card>
  );
}

export default function FileManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [view, setView] = useState(VIEWS.FOLDERS);
  const [sort, setSort] = useState("name-asc");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [stats, setStats] = useState({ used: 0, total: 100 * 1024 * 1024, percent: 0 });
  const [selected, setSelected] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);
  const [trash, setTrash] = useState([]);

  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [moveTarget, setMoveTarget] = useState(null);
  const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
  const [tagTarget, setTagTarget] = useState(null);
  const [tagValue, setTagValue] = useState([]);

  const [draggedFile, setDraggedFile] = useState(null);
  const [dropTargetFolder, setDropTargetFolder] = useState(null);

  const typeOptions = useMemo(() => getMasterList("driveFileTypes"), []);
  const tagPresets = useMemo(
    () => getMasterList("driveTagPresets").map(item => item.value),
    []
  );

  const refresh = useCallback(() => {
    setFolders(getFolders());
    setStats(getStorageStats());
    setRecentFiles(getRecentFiles());
    setTrash(getTrash());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (view === VIEWS.SEARCH) {
      setSearchResults(searchFiles(searchQuery, typeFilter));
    }
  }, [searchQuery, typeFilter, view, folders]);

  useEffect(() => {
    if (view !== VIEWS.FOLDERS) return;
    const folderFromQuery = Number(searchParams.get("folder"));
    if (!folderFromQuery) {
      setSelectedFolder(null);
      return;
    }
    if (folders.some(f => f.id === folderFromQuery)) {
      setSelectedFolder(folderFromQuery);
    }
  }, [searchParams, folders, view]);

  const currentFolder = selectedFolder ? folders.find(f => f.id === selectedFolder) : null;
  const currentFiles = currentFolder
    ? sortItems((currentFolder.files || []).filter(f => !typeFilter || f.type === typeFilter), sort)
    : [];

  const sortedFolders = [
    ...sortItems(folders.filter(f => f.pinned), sort),
    ...sortItems(folders.filter(f => !f.pinned), sort),
  ];

  const toggleSelect = fileId => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(fileId)) next.delete(fileId);
      else next.add(fileId);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      showToast("Nama folder wajib diisi", "error");
      return;
    }
    addFolder(newFolderName.trim());
    refresh();
    setShowAddFolder(false);
    setNewFolderName("");
    showToast("Folder berhasil dibuat", "success");
  };

  const handleDeleteFolder = folderId => {
    if (!confirm("Hapus folder ini ke Sampah?")) return;
    deleteFolder(folderId);
    refresh();
    if (selectedFolder === folderId) setSelectedFolder(null);
    showToast("Folder dipindahkan ke Sampah", "success");
  };

  const handleDeleteFile = (folderId, fileId) => {
    if (!confirm("Hapus file ini ke Sampah?")) return;
    deleteFile(folderId, fileId);
    refresh();
    setSelected(prev => {
      const next = new Set(prev);
      next.delete(fileId);
      return next;
    });
    showToast("File dipindahkan ke Sampah", "success");
  };

  const handleBulkDelete = () => {
    if (!currentFolder || selected.size === 0) return;
    if (!confirm(`Hapus ${selected.size} file ke Sampah?`)) return;
    selected.forEach(fileId => deleteFile(currentFolder.id, fileId));
    clearSelection();
    refresh();
    showToast("File terpilih dipindahkan ke Sampah", "success");
  };

  const handleRenameFolder = (folderId, name) => {
    setRenameTarget({ type: "folder", folderId });
    setRenameValue(name);
  };

  const handleRenameFile = (folderId, fileId, name) => {
    setRenameTarget({ type: "file", folderId, fileId });
    setRenameValue(name);
  };

  const handleRenameSubmit = () => {
    if (!renameValue.trim()) {
      showToast("Nama tidak boleh kosong", "error");
      return;
    }
    if (renameTarget.type === "folder") {
      renameFolder(renameTarget.folderId, renameValue.trim());
    } else {
      renameFile(renameTarget.folderId, renameTarget.fileId, renameValue.trim());
    }
    refresh();
    setRenameTarget(null);
    showToast("Nama berhasil diubah", "success");
  };

  const handleMoveFile = (folderId, fileId, name) => {
    setMoveTarget({ folderId, fileId, name });
  };

  const handleMoveSubmit = toFolderId => {
    moveFile(moveTarget.folderId, moveTarget.fileId, toFolderId);
    refresh();
    setMoveTarget(null);
    showToast("File berhasil dipindahkan", "success");
  };

  const handleBulkMove = toFolderId => {
    if (!currentFolder) return;
    selected.forEach(fileId => moveFile(currentFolder.id, fileId, toFolderId));
    clearSelection();
    setBulkMoveOpen(false);
    refresh();
    showToast("File terpilih berhasil dipindahkan", "success");
  };

  const handleTogglePinFolder = folderId => {
    const pinned = togglePinFolder(folderId);
    refresh();
    showToast(pinned ? "Folder disematkan" : "Sematan folder dilepas", "success");
  };

  const handleTogglePinFile = (folderId, fileId) => {
    const pinned = togglePinFile(folderId, fileId);
    refresh();
    showToast(pinned ? "File disematkan" : "Sematan file dilepas", "success");
  };

  const handleOpenTags = (folderId, fileId, name, tags) => {
    setTagTarget({ folderId, fileId, name });
    setTagValue(tags || []);
  };

  const handleTagSubmit = () => {
    setFileTags(tagTarget.folderId, tagTarget.fileId, tagValue);
    refresh();
    setTagTarget(null);
    showToast("Tag berhasil disimpan", "success");
  };

  const handleFileClick = (folderId, fileId) => {
    recordFileAccess(folderId, fileId);
    setRecentFiles(getRecentFiles());
  };

  const handleDownloadSingle = (file, folderName) => {
    const blob = getFileBlob(file);
    const extension = file.name.includes(".") ? "" : ".txt";
    triggerBlobDownload(blob, sanitizeFilename(`${folderName}-${file.name}${extension}`));
    showToast("File diunduh", "success");
  };

  const handleBulkDownload = async () => {
    if (!currentFolder || selected.size === 0) return;
    const zip = new JSZip();
    const files = (currentFolder.files || []).filter(f => selected.has(f.id));
    files.forEach(file => {
      const blob = getFileBlob(file);
      const name = sanitizeFilename(file.name.includes(".") ? file.name : `${file.name}.txt`);
      zip.file(name, blob);
    });
    const out = await zip.generateAsync({ type: "blob" });
    triggerBlobDownload(out, sanitizeFilename(`${currentFolder.name}-multi-file.zip`));
    showToast("Multi-file ZIP berhasil diunduh", "success");
  };

  const handleDownloadFolder = async folder => {
    const zip = new JSZip();
    (folder.files || []).forEach(file => {
      const blob = getFileBlob(file);
      const name = sanitizeFilename(file.name.includes(".") ? file.name : `${file.name}.txt`);
      zip.file(name, blob);
    });
    const out = await zip.generateAsync({ type: "blob" });
    triggerBlobDownload(out, sanitizeFilename(`${folder.name}.zip`));
    showToast("Folder ZIP berhasil diunduh", "success");
  };

  const openFolderContext = (e, folder) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          icon: <Edit2 className="h-4 w-4" />,
          label: "Ganti Nama",
          action: () => handleRenameFolder(folder.id, folder.name),
        },
        {
          icon: <Download className="h-4 w-4" />,
          label: "Download Folder",
          action: () => handleDownloadFolder(folder),
        },
        {
          icon: <Star className="h-4 w-4" />,
          label: folder.pinned ? "Lepas Sematkan" : "Sematkan",
          action: () => handleTogglePinFolder(folder.id),
        },
        { divider: true },
        {
          icon: <Trash2 className="h-4 w-4" />,
          label: "Hapus ke Sampah",
          danger: true,
          action: () => handleDeleteFolder(folder.id),
        },
      ],
    });
  };

  const openFileContext = (e, folderId, file) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          icon: <Edit2 className="h-4 w-4" />,
          label: "Ganti Nama",
          action: () => handleRenameFile(folderId, file.id, file.name),
        },
        {
          icon: <Move className="h-4 w-4" />,
          label: "Pindahkan ke...",
          action: () => handleMoveFile(folderId, file.id, file.name),
        },
        {
          icon: <Download className="h-4 w-4" />,
          label: "Unduh",
          action: () => handleDownloadSingle(file, currentFolder?.name || "file"),
        },
        {
          icon: <Star className="h-4 w-4" />,
          label: file.pinned ? "Lepas Sematkan" : "Sematkan",
          action: () => handleTogglePinFile(folderId, file.id),
        },
        {
          icon: <Tag className="h-4 w-4" />,
          label: "Kelola Tag",
          action: () => handleOpenTags(folderId, file.id, file.name, file.tags),
        },
        { divider: true },
        {
          icon: <Trash2 className="h-4 w-4" />,
          label: "Hapus ke Sampah",
          danger: true,
          action: () => handleDeleteFile(folderId, file.id),
        },
      ],
    });
  };

  const onDragFileStart = (folderId, file) => {
    setDraggedFile({ fromFolderId: folderId, fileId: file.id, name: file.name });
  };

  const onDragFolderOver = (e, folderId) => {
    e.preventDefault();
    if (draggedFile && draggedFile.fromFolderId !== folderId) {
      setDropTargetFolder(folderId);
    }
  };

  const onDragFolderLeave = () => setDropTargetFolder(null);

  const onDropToFolder = folderId => {
    if (!draggedFile || draggedFile.fromFolderId === folderId) return;
    moveFile(draggedFile.fromFolderId, draggedFile.fileId, folderId);
    setDraggedFile(null);
    setDropTargetFolder(null);
    clearSelection();
    refresh();
    showToast("File dipindahkan dengan drag and drop", "success");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manajer Berkas</h1>
            <p className="text-slate-300">Kelola file dan folder keluarga</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setShowAddFolder(true)}>
              <Plus className="h-4 w-4" /> Folder Baru
            </Button>
            <Link
              to={selectedFolder ? `/drive/upload?folder=${selectedFolder}` : "/drive/upload"}
              state={selectedFolder ? { fromFolderId: selectedFolder } : undefined}
            >
              <Button className="gap-2">
                <Upload className="h-4 w-4" /> Unggah Berkas
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari file atau folder..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setView(e.target.value ? VIEWS.SEARCH : VIEWS.FOLDERS);
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setView(VIEWS.FOLDERS);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white"
          >
            {typeOptions.map(o => (
              <option key={o.value} value={o.value} className="bg-slate-800">
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} className="bg-slate-800">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5 flex gap-1 overflow-x-auto">
          {[
            { id: VIEWS.FOLDERS, icon: <FolderOpen className="h-4 w-4" />, label: "Berkas" },
            { id: VIEWS.RECENT, icon: <Clock className="h-4 w-4" />, label: `Terbaru (${recentFiles.length})` },
            { id: VIEWS.TRASH, icon: <Trash className="h-4 w-4" />, label: `Sampah (${trash.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setView(tab.id);
                if (tab.id !== VIEWS.SEARCH) setSearchQuery("");
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                view === tab.id ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {view === VIEWS.SEARCH && (
          <Card className="rounded-2xl backdrop-blur-xl">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-bold">
                Hasil Pencarian "{searchQuery}" <span className="text-sm font-normal text-slate-400">({searchResults.length} ditemukan)</span>
              </h2>
              {searchResults.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Search className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p className="font-medium">Tidak ada file ditemukan</p>
                  <p className="text-sm mt-1">Coba kata kunci lain atau ubah filter tipe</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map(file => (
                    <div key={`${file.folderId}-${file.id}`} className="flex items-center justify-between rounded-xl bg-white/5 p-3 hover:bg-white/10">
                      <div className="flex items-center gap-3">
                        {fileIcon(file.type)}
                        <div>
                          <Link
                            to={`/drive/detail/${file.folderId}/${file.id}?folder=${file.folderId}`}
                            state={{ fromFolderId: file.folderId }}
                            onClick={() => handleFileClick(file.folderId, file.id)}
                            className="font-medium hover:text-sky-300"
                          >
                            {file.name}
                          </Link>
                          <p className="text-xs text-slate-400">
                            {file.folderName} · {formatSize(file.size)}
                          </p>
                        </div>
                      </div>
                      {file.pinned && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {view === VIEWS.RECENT && (
          <Card className="rounded-2xl backdrop-blur-xl">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-bold">File Terbaru Diakses</h2>
              {recentFiles.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Clock className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p className="font-medium">Belum ada file diakses</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 p-3 hover:bg-white/10">
                      <div className="flex items-center gap-3">
                        {fileIcon(file.type)}
                        <div>
                          <Link
                            to={`/drive/detail/${file.folderId}/${file.id}?folder=${file.folderId}`}
                            state={{ fromFolderId: file.folderId }}
                            className="font-medium hover:text-sky-300"
                          >
                            {file.name}
                          </Link>
                          <p className="text-xs text-slate-400">
                            {file.folderName} · {formatSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">{new Date(file.accessedAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {view === VIEWS.TRASH && (
          <Card className="rounded-2xl backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Sampah</h2>
                {trash.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-400 border-red-400/30 hover:bg-red-500/10"
                    onClick={() => {
                      if (confirm("Kosongkan sampah? File tidak bisa dipulihkan.")) {
                        emptyTrash();
                        refresh();
                        showToast("Sampah dikosongkan", "success");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" /> Kosongkan
                  </Button>
                )}
              </div>
              {trash.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Trash className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p className="font-medium">Sampah kosong</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trash.map(item => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                      <div className="flex items-center gap-3">
                        {item.type === "folder" ? <FolderIcon className="h-5 w-5 text-yellow-400" /> : fileIcon(item.type)}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-slate-400">Dihapus {new Date(item.deletedAt).toLocaleDateString("id-ID")}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            restoreFromTrash(item.id, item.type === "folder");
                            refresh();
                            showToast("Dipulihkan", "success");
                          }}
                          className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-500/10"
                          title="Pulihkan"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Hapus permanen?")) {
                              deletePermanently(item.id);
                              refresh();
                              showToast("Dihapus permanen", "success");
                            }
                          }}
                          className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10"
                          title="Hapus Permanen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {view === VIEWS.FOLDERS && (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-3">
              <StorageBar stats={stats} />
              <h2 className="text-base font-bold text-slate-300">Folder ({folders.length})</h2>
              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {sortedFolders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/20 py-10 text-center text-slate-400">
                    <FolderIcon className="mx-auto mb-2 h-10 w-10 opacity-30" />
                    <p>Belum ada folder</p>
                    <button onClick={() => setShowAddFolder(true)} className="mt-2 text-sky-400 text-sm hover:underline">
                      + Buat folder baru
                    </button>
                  </div>
                ) : (
                  sortedFolders.map(folder => (
                    <div
                      key={folder.id}
                      onContextMenu={e => openFolderContext(e, folder)}
                      onDragOver={e => onDragFolderOver(e, folder.id)}
                      onDragLeave={onDragFolderLeave}
                      onDrop={() => onDropToFolder(folder.id)}
                      onClick={() => {
                        setSelectedFolder(folder.id);
                        setSearchParams({ folder: String(folder.id) });
                      }}
                      className={`group flex cursor-pointer items-center justify-between rounded-xl p-3 transition ${
                        selectedFolder === folder.id
                          ? "border border-sky-400 bg-sky-500/20"
                          : "border border-white/5 bg-white/5 hover:bg-white/10"
                      } ${dropTargetFolder === folder.id ? "ring-2 ring-emerald-400" : ""}`}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <FolderIcon className="h-5 w-5 flex-shrink-0 text-yellow-400" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-sm">{folder.name}</p>
                          <p className="text-xs text-slate-400">{folder.files?.length || 0} berkas</p>
                        </div>
                        {folder.pinned && <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleRenameFolder(folder.id, folder.name);
                          }}
                          className="rounded p-1 text-slate-400 hover:text-white"
                          title="Rename Folder"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDownloadFolder(folder);
                          }}
                          className="rounded p-1 text-slate-400 hover:text-emerald-400"
                          title="Download Folder"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            openFolderContext(e, folder);
                          }}
                          className="rounded p-1 text-slate-500 hover:text-white"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-slate-500">Tips: drag file dari panel kanan lalu drop ke folder di kiri.</p>
            </div>

            <div className="lg:col-span-2">
              {currentFolder && (
                <div className="mb-3 flex items-center gap-1 text-sm text-slate-400">
                  <button
                    onClick={() => {
                      setSelectedFolder(null);
                      setSearchParams({});
                    }}
                    className="hover:text-white"
                  >
                    Penyimpanan
                  </button>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-white font-medium">{currentFolder.name}</span>
                </div>
              )}

              {selected.size > 0 && currentFolder && (
                <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-2">
                  <span className="text-sm font-medium text-amber-300">{selected.size} dipilih</span>
                  <Button size="sm" variant="outline" className="h-7 gap-1 text-red-400 border-red-400/30" onClick={handleBulkDelete}>
                    <Trash2 className="h-3 w-3" /> Hapus
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 gap-1 border-white/20" onClick={() => setBulkMoveOpen(true)}>
                    <Move className="h-3 w-3" /> Pindahkan
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 gap-1 border-white/20" onClick={handleBulkDownload}>
                    <Download className="h-3 w-3" /> Download ZIP
                  </Button>
                  <button onClick={clearSelection} className="ml-auto text-slate-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {!currentFolder ? (
                <Card className="rounded-2xl backdrop-blur-xl h-full">
                  <CardContent className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <FolderOpen className="mb-3 h-16 w-16 opacity-20" />
                    <p className="font-medium">Pilih folder untuk melihat isi</p>
                    <p className="mt-1 text-sm">atau klik kanan folder untuk opsi lainnya</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl backdrop-blur-xl">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-bold text-lg">{currentFolder.name}</h2>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <ArrowUpDown className="h-3 w-3" />
                        <span>{currentFiles.length} berkas</span>
                      </div>
                    </div>

                    {currentFiles.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-sky-400/30 bg-sky-500/5 py-14 text-center text-slate-300">
                        <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-sky-500/10 flex items-center justify-center">
                          <Upload className="h-10 w-10 text-sky-400" />
                        </div>
                        <p className="font-semibold text-white">Folder ini masih kosong</p>
                        <p className="text-sm mt-1 text-slate-400">Upload dokumen penting keluarga agar tersimpan rapi.</p>
                        <Link to="/drive/upload">
                          <Button size="sm" className="mt-5 gap-2">
                            <Upload className="h-3 w-3" /> Upload Sekarang
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {currentFiles.map(file => (
                          <div
                            key={file.id}
                            draggable
                            onDragStart={() => onDragFileStart(currentFolder.id, file)}
                            onDragEnd={() => {
                              setDraggedFile(null);
                              setDropTargetFolder(null);
                            }}
                            onContextMenu={e => openFileContext(e, currentFolder.id, file)}
                            className={`group flex items-center gap-3 rounded-xl p-3 transition ${
                              selected.has(file.id) ? "bg-sky-500/20 border border-sky-400/30" : "bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <button onClick={() => toggleSelect(file.id)} className="flex-shrink-0 text-slate-400 hover:text-sky-400">
                              {selected.has(file.id) ? <CheckSquare className="h-4 w-4 text-sky-400" /> : <Square className="h-4 w-4" />}
                            </button>

                            <GripVertical className="h-4 w-4 text-slate-500" />
                            {fileIcon(file.type)}

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1">
                                <Link
                                  to={`/drive/detail/${currentFolder.id}/${file.id}?folder=${currentFolder.id}`}
                                  state={{ fromFolderId: currentFolder.id }}
                                  onClick={() => handleFileClick(currentFolder.id, file.id)}
                                  className="truncate font-medium hover:text-sky-300"
                                >
                                  {file.name}
                                </Link>
                                {file.pinned && <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-slate-400">{formatSize(file.size)}</span>
                                {(file.tags || []).map(tag => (
                                  <span key={tag} className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                              <button
                                onClick={() => handleRenameFile(currentFolder.id, file.id, file.name)}
                                className="rounded p-1.5 text-slate-400 hover:text-white"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveFile(currentFolder.id, file.id, file.name)}
                                className="rounded p-1.5 text-slate-400 hover:text-white"
                              >
                                <Move className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleTogglePinFile(currentFolder.id, file.id)}
                                className="rounded p-1.5 text-slate-400 hover:text-amber-400"
                              >
                                <Star className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDownloadSingle(file, currentFolder.name)}
                                className="rounded p-1.5 text-slate-400 hover:text-emerald-400"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteFile(currentFolder.id, file.id)}
                                className="rounded p-1.5 text-slate-400 hover:text-red-400"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenu.items} onClose={() => setContextMenu(null)} />}

      {showAddFolder && (
        <Modal title="Folder Baru" onClose={() => setShowAddFolder(false)}>
          <input
            autoFocus
            type="text"
            placeholder="Nama folder..."
            value={newFolderName}
            onKeyDown={e => e.key === "Enter" && handleAddFolder()}
            onChange={e => setNewFolderName(e.target.value)}
            className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddFolder(false)}>
              Batal
            </Button>
            <Button onClick={handleAddFolder} className="gap-2">
              <Plus className="h-4 w-4" /> Buat
            </Button>
          </div>
        </Modal>
      )}

      {renameTarget && (
        <Modal title={`Ganti Nama ${renameTarget.type === "folder" ? "Folder" : "File"}`} onClose={() => setRenameTarget(null)}>
          <input
            autoFocus
            type="text"
            value={renameValue}
            onKeyDown={e => e.key === "Enter" && handleRenameSubmit()}
            onChange={e => setRenameValue(e.target.value)}
            className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRenameTarget(null)}>
              Batal
            </Button>
            <Button onClick={handleRenameSubmit}>Simpan</Button>
          </div>
        </Modal>
      )}

      {moveTarget && (
        <Modal title={`Pindahkan ${moveTarget.name}`} onClose={() => setMoveTarget(null)}>
          <p className="mb-3 text-sm text-slate-400">Pilih folder tujuan:</p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {folders
              .filter(f => f.id !== moveTarget.folderId)
              .map(folder => (
                <button
                  key={folder.id}
                  onClick={() => handleMoveSubmit(folder.id)}
                  className="flex w-full items-center gap-2 rounded-xl bg-white/5 px-4 py-3 hover:bg-white/10 text-left"
                >
                  <FolderIcon className="h-5 w-5 text-yellow-400" />
                  <span>{folder.name}</span>
                </button>
              ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setMoveTarget(null)}>
              Batal
            </Button>
          </div>
        </Modal>
      )}

      {bulkMoveOpen && currentFolder && (
        <Modal title={`Pindahkan ${selected.size} File`} onClose={() => setBulkMoveOpen(false)}>
          <p className="mb-3 text-sm text-slate-400">Pilih folder tujuan:</p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {folders
              .filter(f => f.id !== currentFolder.id)
              .map(folder => (
                <button
                  key={folder.id}
                  onClick={() => handleBulkMove(folder.id)}
                  className="flex w-full items-center gap-2 rounded-xl bg-white/5 px-4 py-3 hover:bg-white/10 text-left"
                >
                  <FolderIcon className="h-5 w-5 text-yellow-400" />
                  <span>{folder.name}</span>
                </button>
              ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setBulkMoveOpen(false)}>
              Batal
            </Button>
          </div>
        </Modal>
      )}

      {tagTarget && (
        <Modal title={`Tag untuk ${tagTarget.name}`} onClose={() => setTagTarget(null)}>
          <p className="mb-3 text-sm text-slate-400">Pilih atau ketuk untuk toggle tag:</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {tagPresets.map(tag => (
              <button
                key={tag}
                onClick={() => setTagValue(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]))}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  tagValue.includes(tag) ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="mb-2 text-xs text-slate-500">Tag dipilih: {tagValue.length === 0 ? "-" : tagValue.join(", ")}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTagTarget(null)}>
              Batal
            </Button>
            <Button onClick={handleTagSubmit}>Simpan Tag</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
