const STORAGE_KEY = "family_master_data";

const defaultMasterData = {
  financeExpenseCategories: [
    { id: "exp-1", value: "makan", label: "Makan", color: "#ef4444" },
    { id: "exp-2", value: "sekolah", label: "Sekolah", color: "#f59e0b" },
    { id: "exp-3", value: "listrik", label: "Listrik", color: "#eab308" },
    { id: "exp-4", value: "internet", label: "Internet", color: "#84cc16" },
    { id: "exp-5", value: "transport", label: "Transport", color: "#22c55e" },
    { id: "exp-6", value: "kesehatan", label: "Kesehatan", color: "#10b981" },
    { id: "exp-7", value: "cicilan", label: "Cicilan", color: "#06b6d4" },
    { id: "exp-8", value: "hiburan", label: "Hiburan", color: "#a855f7" },
    { id: "exp-9", value: "belanja", label: "Belanja", color: "#3b82f6" },
    { id: "exp-10", value: "lainnya", label: "Lainnya", color: "#64748b" },
  ],
  financeIncomeCategories: [
    { id: "inc-1", value: "gaji", label: "Gaji", color: "#22c55e" },
    { id: "inc-2", value: "bisnis", label: "Bisnis", color: "#0ea5e9" },
    { id: "inc-3", value: "bonus", label: "Bonus", color: "#8b5cf6" },
    { id: "inc-4", value: "investasi", label: "Investasi", color: "#14b8a6" },
    { id: "inc-5", value: "hadiah", label: "Hadiah", color: "#f59e0b" },
    { id: "inc-6", value: "lainnya", label: "Lainnya", color: "#64748b" },
  ],
  reminderCategories: [
    { id: "rem-1", value: "utilitas", label: "Utilitas", color: "#f59e0b" },
    { id: "rem-2", value: "kesehatan", label: "Kesehatan", color: "#10b981" },
    { id: "rem-3", value: "perawatan", label: "Perawatan", color: "#06b6d4" },
    { id: "rem-4", value: "acara", label: "Acara", color: "#a855f7" },
    { id: "rem-5", value: "keuangan", label: "Keuangan", color: "#ef4444" },
  ],
  scheduleCategories: [
    { id: "sch-1", value: "school", label: "Sekolah", color: "#3b82f6" },
    { id: "sch-2", value: "work", label: "Kerja", color: "#8b5cf6" },
    { id: "sch-3", value: "worship", label: "Ibadah", color: "#06b6d4" },
    { id: "sch-4", value: "chore", label: "Tugas Rumah", color: "#f59e0b" },
    { id: "sch-5", value: "activity", label: "Aktivitas", color: "#10b981" },
    { id: "sch-6", value: "appointment", label: "Janji Temu", color: "#ef4444" },
    { id: "sch-7", value: "health", label: "Kesehatan", color: "#ec4899" },
    { id: "sch-8", value: "family", label: "Keluarga", color: "#14b8a6" },
  ],
  driveFileTypes: [
    { id: "drv-type-1", value: "", label: "Semua Tipe" },
    { id: "drv-type-2", value: "pdf", label: "PDF" },
    { id: "drv-type-3", value: "image", label: "Gambar" },
    { id: "drv-type-4", value: "video", label: "Video" },
    { id: "drv-type-5", value: "file", label: "Lainnya" },
  ],
  driveTagPresets: [
    { id: "drv-tag-1", value: "Penting", label: "Penting" },
    { id: "drv-tag-2", value: "Sekolah", label: "Sekolah" },
    { id: "drv-tag-3", value: "Keuangan", label: "Keuangan" },
    { id: "drv-tag-4", value: "Kesehatan", label: "Kesehatan" },
    { id: "drv-tag-5", value: "Kerja", label: "Kerja" },
    { id: "drv-tag-6", value: "Pribadi", label: "Pribadi" },
  ],
};

function cloneDefault() {
  return JSON.parse(JSON.stringify(defaultMasterData));
}

function normalizeList(list, fallbackPrefix) {
  if (!Array.isArray(list)) return [];
  return list
    .map((item, index) => {
      const value = String(item?.value || item?.label || "").trim();
      const label = String(item?.label || item?.value || "").trim();
      if (!value || !label) return null;
      return {
        id: String(item?.id || `${fallbackPrefix}-${Date.now()}-${index}`),
        value,
        label,
        color: item?.color ? String(item.color) : undefined,
      };
    })
    .filter(Boolean);
}

function normalizeMasterData(data) {
  const source = data && typeof data === "object" ? data : {};
  const fallback = cloneDefault();

  return {
    financeExpenseCategories: normalizeList(
      source.financeExpenseCategories,
      "exp"
    ).length
      ? normalizeList(source.financeExpenseCategories, "exp")
      : fallback.financeExpenseCategories,
    financeIncomeCategories: normalizeList(
      source.financeIncomeCategories,
      "inc"
    ).length
      ? normalizeList(source.financeIncomeCategories, "inc")
      : fallback.financeIncomeCategories,
    reminderCategories: normalizeList(source.reminderCategories, "rem").length
      ? normalizeList(source.reminderCategories, "rem")
      : fallback.reminderCategories,
    scheduleCategories: normalizeList(source.scheduleCategories, "sch").length
      ? normalizeList(source.scheduleCategories, "sch")
      : fallback.scheduleCategories,
    driveFileTypes: normalizeList(source.driveFileTypes, "drv-type").length
      ? normalizeList(source.driveFileTypes, "drv-type")
      : fallback.driveFileTypes,
    driveTagPresets: normalizeList(source.driveTagPresets, "drv-tag").length
      ? normalizeList(source.driveTagPresets, "drv-tag")
      : fallback.driveTagPresets,
  };
}

export function getMasterData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : cloneDefault();
  const normalized = normalizeMasterData(parsed);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function saveMasterData(data) {
  const normalized = normalizeMasterData(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function getMasterList(key) {
  const masterData = getMasterData();
  return masterData[key] || [];
}

export function addMasterItem(key, item) {
  const masterData = getMasterData();
  const current = Array.isArray(masterData[key]) ? masterData[key] : [];
  const value = String(item?.value || item?.label || "").trim();
  const label = String(item?.label || item?.value || "").trim();
  if (!value || !label) {
    throw new Error("Value dan label wajib diisi");
  }

  const lowerValue = value.toLowerCase();
  if (current.some(entry => String(entry.value).toLowerCase() === lowerValue)) {
    throw new Error("Value sudah ada");
  }

  const created = {
    id: `${key}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    value,
    label,
    color: item?.color ? String(item.color) : undefined,
  };

  masterData[key] = [...current, created];
  saveMasterData(masterData);
  return created;
}

export function updateMasterItem(key, id, updates) {
  const masterData = getMasterData();
  const current = Array.isArray(masterData[key]) ? masterData[key] : [];
  const index = current.findIndex(entry => String(entry.id) === String(id));
  if (index === -1) return null;

  const nextValue = String(
    updates?.value ?? updates?.label ?? current[index].value
  ).trim();
  const nextLabel = String(
    updates?.label ?? updates?.value ?? current[index].label
  ).trim();

  if (!nextValue || !nextLabel) {
    throw new Error("Value dan label wajib diisi");
  }

  const lowerValue = nextValue.toLowerCase();
  if (
    current.some(
      entry =>
        String(entry.id) !== String(id) &&
        String(entry.value).toLowerCase() === lowerValue
    )
  ) {
    throw new Error("Value sudah ada");
  }

  const updated = {
    ...current[index],
    ...updates,
    value: nextValue,
    label: nextLabel,
    color: updates?.color ?? current[index].color,
  };

  current[index] = updated;
  masterData[key] = current;
  saveMasterData(masterData);
  return updated;
}

export function reorderMasterItem(key, id, direction) {
  const masterData = getMasterData();
  const current = Array.isArray(masterData[key]) ? [...masterData[key]] : [];
  const idx = current.findIndex(entry => String(entry.id) === String(id));
  if (idx === -1) return current;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= current.length) return current;
  [current[idx], current[swapIdx]] = [current[swapIdx], current[idx]];
  masterData[key] = current;
  saveMasterData(masterData);
  return current;
}

export function deleteMasterItem(key, id) {
  const masterData = getMasterData();
  const current = Array.isArray(masterData[key]) ? masterData[key] : [];
  if (current.length <= 1) {
    throw new Error("Minimal harus ada 1 item");
  }

  const filtered = current.filter(entry => String(entry.id) !== String(id));
  masterData[key] = filtered;
  saveMasterData(masterData);
  return true;
}

export function resetMasterData() {
  const defaults = cloneDefault();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}
