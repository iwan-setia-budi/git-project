// ─── Helpers ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "family_files";
const TRASH_KEY = "family_files_trash";
const RECENT_KEY = "family_files_recent";
const STORAGE_QUOTA = 100 * 1024 * 1024; // 100 MB mock quota

function genId(list) {
  return list.length === 0 ? 1 : Math.max(...list.map(i => i.id)) + 1;
}

// ─── Initial data ────────────────────────────────────────────────────────────

const initialFiles = [
  {
    id: 1,
    name: "Dokumen Penting",
    type: "folder",
    size: 0,
    createdAt: "2024-01-15T00:00:00.000Z",
    pinned: false,
    tags: [],
    files: [
      { id: 101, name: "KTP Ayah.pdf",  type: "pdf",   size: 1500000, createdAt: "2024-02-10T00:00:00.000Z", pinned: false, tags: ["Penting"] },
      { id: 102, name: "KTP Ibu.pdf",   type: "pdf",   size: 1400000, createdAt: "2024-02-10T00:00:00.000Z", pinned: false, tags: ["Penting"] },
    ],
  },
  {
    id: 2,
    name: "Foto Keluarga",
    type: "folder",
    size: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
    pinned: false,
    tags: [],
    files: [
      { id: 201, name: "Reuni Keluarga 2024.jpg", type: "image", size: 3500000, createdAt: "2024-03-20T00:00:00.000Z", pinned: false, tags: [] },
      { id: 202, name: "Liburan Pantai.jpg",       type: "image", size: 4200000, createdAt: "2024-02-15T00:00:00.000Z", pinned: false, tags: [] },
    ],
  },
  {
    id: 3,
    name: "Video",
    type: "folder",
    size: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
    pinned: false,
    tags: [],
    files: [],
  },
  {
    id: 4,
    name: "Sekolah Anak",
    type: "folder",
    size: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
    pinned: false,
    tags: ["Sekolah"],
    files: [
      { id: 301, name: "Raport SD.pdf", type: "pdf", size: 800000, createdAt: "2024-03-01T00:00:00.000Z", pinned: false, tags: ["Sekolah"] },
    ],
  },
  {
    id: 5,
    name: "Kendaraan",
    type: "folder",
    size: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
    pinned: false,
    tags: [],
    files: [
      { id: 401, name: "STNK Mobil.pdf", type: "pdf", size: 1200000, createdAt: "2024-02-05T00:00:00.000Z", pinned: false, tags: [] },
    ],
  },
  {
    id: 6,
    name: "Keuangan",
    type: "folder",
    size: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
    pinned: false,
    tags: ["Keuangan"],
    files: [
      { id: 501, name: "Laporan Keuangan 2024.xlsx", type: "file", size: 500000, createdAt: "2024-03-15T00:00:00.000Z", pinned: false, tags: ["Keuangan"] },
    ],
  },
];

// ─── Core CRUD ───────────────────────────────────────────────────────────────

export function getFolders() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(initialFiles));
}

function saveFolders(folders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
}

export function getFilesInFolder(folderId) {
  const folder = getFolders().find(f => f.id === folderId);
  return folder ? folder.files : [];
}

export function addFolder(name) {
  const folders = getFolders();
  const newFolder = {
    id: genId(folders),
    name,
    type: "folder",
    size: 0,
    createdAt: new Date().toISOString(),
    pinned: false,
    tags: [],
    files: [],
  };
  folders.push(newFolder);
  saveFolders(folders);
  return newFolder;
}

export function renameFolder(folderId, newName) {
  const folders = getFolders();
  const folder = folders.find(f => f.id === folderId);
  if (folder) {
    folder.name = newName;
    saveFolders(folders);
    return folder;
  }
  return null;
}

export function addFileToFolder(folderId, file) {
  const folders = getFolders();
  const folder = folders.find(f => f.id === folderId);
  if (folder) {
    if (!folder.files) folder.files = [];
    const allIds = folders.flatMap(f => (f.files || []).map(fi => fi.id));
    const newFile = {
      ...file,
      id: allIds.length === 0 ? 1 : Math.max(...allIds) + 1,
      createdAt: new Date().toISOString(),
      pinned: file.pinned ?? false,
      tags: file.tags ?? [],
    };
    folder.files.push(newFile);
    saveFolders(folders);
    addRecentFile({ ...newFile, folderId, folderName: folder.name });
    return newFile;
  }
  return null;
}

export function renameFile(folderId, fileId, newName) {
  const folders = getFolders();
  const folder = folders.find(f => f.id === folderId);
  if (folder && folder.files) {
    const file = folder.files.find(f => f.id === fileId);
    if (file) {
      file.name = newName;
      saveFolders(folders);
      return file;
    }
  }
  return null;
}

export function moveFile(fromFolderId, fileId, toFolderId) {
  const folders = getFolders();
  const fromFolder = folders.find(f => f.id === fromFolderId);
  const toFolder = folders.find(f => f.id === toFolderId);
  if (!fromFolder || !toFolder) return false;
  const fileIndex = (fromFolder.files || []).findIndex(f => f.id === fileId);
  if (fileIndex === -1) return false;
  const [file] = fromFolder.files.splice(fileIndex, 1);
  if (!toFolder.files) toFolder.files = [];
  toFolder.files.push(file);
  saveFolders(folders);
  return true;
}

// ─── Trash ──────────────────────────────────────────────────────────────────

export function getTrash() {
  const stored = localStorage.getItem(TRASH_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveTrash(trash) {
  localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
}

export function deleteFile(folderId, fileId) {
  const folders = getFolders();
  const folder = folders.find(f => f.id === folderId);
  if (folder && folder.files) {
    const file = folder.files.find(f => f.id === fileId);
    if (file) {
      folder.files = folder.files.filter(f => f.id !== fileId);
      saveFolders(folders);
      const trash = getTrash();
      trash.push({ ...file, folderId, folderName: folder.name, deletedAt: new Date().toISOString() });
      saveTrash(trash);
      return true;
    }
  }
  return false;
}

export function deleteFolder(folderId) {
  const folders = getFolders();
  const folder = folders.find(f => f.id === folderId);
  if (folder) {
    const trash = getTrash();
    trash.push({ ...folder, type: "folder", deletedAt: new Date().toISOString() });
    saveTrash(trash);
    saveFolders(folders.filter(f => f.id !== folderId));
    return true;
  }
  return false;
}

export function restoreFromTrash(itemId, isFolder) {
  const trash = getTrash();
  const itemIndex = trash.findIndex(t => t.id === itemId && (isFolder ? t.type === "folder" : t.type !== "folder"));
  if (itemIndex === -1) return false;
  const [item] = trash.splice(itemIndex, 1);
  saveTrash(trash);
  if (isFolder) {
    const folders = getFolders();
    const { deletedAt, ...rest } = item;
    folders.push(rest);
    saveFolders(folders);
  } else {
    const folders = getFolders();
    const folder = folders.find(f => f.id === item.folderId);
    if (folder) {
      const { deletedAt, folderId, folderName, ...fileData } = item;
      if (!folder.files) folder.files = [];
      folder.files.push(fileData);
      saveFolders(folders);
    }
  }
  return true;
}

export function deletePermanently(itemId) {
  const trash = getTrash();
  saveTrash(trash.filter(t => t.id !== itemId));
  return true;
}

export function emptyTrash() {
  saveTrash([]);
}

// ─── Pin / Favorite ──────────────────────────────────────────────────────────

export function togglePinFolder(folderId) {
  const folders = getFolders();
  const folder = folders.find(f => f.id === folderId);
  if (folder) {
    folder.pinned = !folder.pinned;
    saveFolders(folders);
    return folder.pinned;
  }
  return false;
}

export function togglePinFile(folderId, fileId) {
  const folders = getFolders();
  const folder = folders.find(f => f.id === folderId);
  if (folder && folder.files) {
    const file = folder.files.find(f => f.id === fileId);
    if (file) {
      file.pinned = !file.pinned;
      saveFolders(folders);
      return file.pinned;
    }
  }
  return false;
}

// ─── Tags ────────────────────────────────────────────────────────────────────

export function setFileTags(folderId, fileId, tags) {
  const folders = getFolders();
  const folder = folders.find(f => f.id === folderId);
  if (folder && folder.files) {
    const file = folder.files.find(f => f.id === fileId);
    if (file) {
      file.tags = tags;
      saveFolders(folders);
      return true;
    }
  }
  return false;
}

// ─── Recent Files ────────────────────────────────────────────────────────────

export function getRecentFiles(limit = 10) {
  const stored = localStorage.getItem(RECENT_KEY);
  const all = stored ? JSON.parse(stored) : [];
  return all.slice(0, limit);
}

export function addRecentFile(file) {
  const existing = getRecentFiles(50);
  const filtered = existing.filter(f => !(f.id === file.id && f.folderId === file.folderId));
  const updated = [{ ...file, accessedAt: new Date().toISOString() }, ...filtered].slice(0, 20);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

export function recordFileAccess(folderId, fileId) {
  const folders = getFolders();
  const folder = folders.find(f => f.id === folderId);
  if (folder && folder.files) {
    const file = folder.files.find(f => f.id === fileId);
    if (file) addRecentFile({ ...file, folderId, folderName: folder.name });
  }
}

// ─── Search ──────────────────────────────────────────────────────────────────

export function searchFiles(query, typeFilter = "") {
  const folders = getFolders();
  const results = [];
  const q = query.toLowerCase();
  folders.forEach(folder => {
    (folder.files || []).forEach(file => {
      const matchesQuery = !q || file.name.toLowerCase().includes(q) || folder.name.toLowerCase().includes(q);
      const matchesType = !typeFilter || file.type === typeFilter;
      if (matchesQuery && matchesType) {
        results.push({ ...file, folderName: folder.name, folderId: folder.id });
      }
    });
  });
  return results;
}

// ─── Storage stats ────────────────────────────────────────────────────────────

export function getStorageStats() {
  const folders = getFolders();
  const used = folders.reduce((sum, f) => sum + (f.files || []).reduce((s, fi) => s + (fi.size || 0), 0), 0);
  return { used, total: STORAGE_QUOTA, percent: Math.min(100, (used / STORAGE_QUOTA) * 100) };
}
