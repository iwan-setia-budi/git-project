import { apiRequest } from "@/services/apiClient";
import { hasApiConfig } from "@/config/env";
import { getAuthToken } from "@/services/authService";
import { getMasterList } from "@/services/masterDataService";

const STORAGE_KEY = "family_reminders";
const SYNC_QUEUE_KEY = "family_reminders_sync_queue";

// Mock data for reminders
const initialReminders = [
  {
    id: 1,
    title: "Bayar Listrik",
    category: "utilitas",
    date: "2026-04-20",
    time: "10:00",
    description: "Jatuh tempo tagihan listrik",
    assignee: "Ayah",
    repeat: "monthly",
    remindBefore: "1h",
    completed: false,
    notified: false,
    notify10mSent: false,
    notify1hSent: false,
  },
  {
    id: 2,
    title: "Ulang Tahun Ibu",
    category: "acara",
    date: "2026-05-20",
    time: "08:00",
    description: "Jangan lupa rayakan",
    assignee: "Semua",
    repeat: "yearly",
    remindBefore: "10m",
    completed: false,
    notified: false,
    notify10mSent: false,
    notify1hSent: false,
  },
];

function getReminderCategoryMaster() {
  return getMasterList("reminderCategories").map(item => ({
    name: item.value,
    label: item.label,
  }));
}

function getDefaultReminderCategory() {
  return getReminderCategoryMaster()[0]?.name || "utilitas";
}

function hasRemoteEnabled() {
  const hasToken = Boolean(getAuthToken());
  return hasApiConfig() && hasToken;
}

function syncInBackground(type, payload, runner) {
  void runner().catch(() => {
    queueSyncOperation(type, payload);
  });
}

function toDateInputValue(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().split("T")[0];
  }
  return date.toISOString().split("T")[0];
}

function normalizeReminder(reminder) {
  return {
    ...reminder,
    category: (reminder.category || getDefaultReminderCategory()).toLowerCase(),
    date: toDateInputValue(reminder.date),
    time: reminder.time || "10:00",
    description: reminder.description || "",
    assignee: reminder.assignee || "",
    repeat: reminder.repeat || "none",
    remindBefore: reminder.remindBefore || "10m",
    completed: Boolean(reminder.completed),
    notified: Boolean(reminder.notified),
    notify10mSent: Boolean(reminder.notify10mSent),
    notify1hSent: Boolean(reminder.notify1hSent),
    familyId: reminder.familyId || "",
    userId: reminder.userId || "",
  };
}

function saveReminders(reminders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

function readSyncQueue() {
  const raw = localStorage.getItem(SYNC_QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveSyncQueue(queue) {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

function queueSyncOperation(type, payload) {
  const queue = readSyncQueue();
  queue.push({
    id: `${Date.now()}-${Math.random()}`,
    type,
    payload,
  });
  saveSyncQueue(queue);
}

function extractRemindersPayload(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function getCurrentUserContext() {
  try {
    const raw = localStorage.getItem("family_user");
    const user = raw ? JSON.parse(raw) : null;
    return {
      userId: user?.id || user?.userId || "",
      familyId: user?.familyId || "",
    };
  } catch {
    return { userId: "", familyId: "" };
  }
}

function getNextOccurrenceDate(dateString, repeat) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;

  if (repeat === "daily") date.setDate(date.getDate() + 1);
  if (repeat === "weekly") date.setDate(date.getDate() + 7);
  if (repeat === "monthly") date.setMonth(date.getMonth() + 1);
  if (repeat === "yearly") date.setFullYear(date.getFullYear() + 1);

  return date.toISOString().split("T")[0];
}

function createReminder(rec) {
  const reminders = getReminders();
  const { userId, familyId } = getCurrentUserContext();

  const newReminder = {
    ...normalizeReminder(rec),
    id: Math.max(...reminders.map(r => Number(r.id) || 0), 0) + 1,
    completed: false,
    notified: false,
    notify10mSent: false,
    notify1hSent: false,
    userId: rec.userId || userId,
    familyId: rec.familyId || familyId,
  };

  reminders.push(newReminder);
  saveReminders(reminders);
  return newReminder;
}

async function fetchRemoteReminders() {
  const response = await apiRequest("/api/reminders");
  const reminders = extractRemindersPayload(response).map(normalizeReminder);
  saveReminders(reminders);
  return reminders;
}

async function runSyncOperation(operation) {
  if (operation.type === "create") {
    await apiRequest("/api/reminders", { method: "POST", body: operation.payload });
    return;
  }

  if (operation.type === "update") {
    await apiRequest(`/api/reminders/${operation.payload.id}`, {
      method: "PATCH",
      body: operation.payload.updates,
    });
    return;
  }

  if (operation.type === "delete") {
    await apiRequest(`/api/reminders/${operation.payload.id}`, {
      method: "DELETE",
    });
  }
}

export async function syncReminderQueue() {
  if (!hasRemoteEnabled()) return false;

  const queue = readSyncQueue();
  if (!queue.length) return true;

  const failed = [];

  for (const operation of queue) {
    try {
      await runSyncOperation(operation);
    } catch {
      failed.push(operation);
    }
  }

  saveSyncQueue(failed);
  return failed.length === 0;
}

// Get all reminders (local first, synchronous)
export function getReminders() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const reminders = stored ? JSON.parse(stored) : initialReminders;
  return reminders.map(normalizeReminder);
}

// Get all reminders with backend sync when available
export async function getRemindersAsync() {
  const local = getReminders();

  if (!hasRemoteEnabled()) {
    return local;
  }

  try {
    await syncReminderQueue();
    return await fetchRemoteReminders();
  } catch {
    return local;
  }
}

// Add reminder (local)
export function addReminder(reminder) {
  return createReminder(reminder);
}

// Add reminder with backend sync
export async function addReminderAsync(reminder) {
  const newReminder = createReminder(reminder);

  if (!hasRemoteEnabled()) {
    return newReminder;
  }

  syncInBackground("create", newReminder, async () => {
    const response = await apiRequest("/api/reminders", {
      method: "POST",
      body: newReminder,
    });

    const remoteReminder = normalizeReminder(response?.data || response || newReminder);
    const reminders = getReminders().map(r =>
      r.id === newReminder.id ? { ...remoteReminder, id: remoteReminder.id || r.id } : r
    );
    saveReminders(reminders);
  });

  return newReminder;
}

// Update reminder
export function updateReminder(id, updates) {
  const reminders = getReminders();
  const index = reminders.findIndex(r => String(r.id) === String(id));
  if (index !== -1) {
    reminders[index] = normalizeReminder({ ...reminders[index], ...updates });
    saveReminders(reminders);
    return reminders[index];
  }
  return null;
}

export async function updateReminderAsync(id, updates) {
  const updated = updateReminder(id, updates);
  if (!updated) return null;

  if (!hasRemoteEnabled()) return updated;

  syncInBackground("update", { id, updates }, async () => {
    await apiRequest(`/api/reminders/${id}`, {
      method: "PATCH",
      body: updates,
    });
  });

  return updated;
}

// Delete reminder
export function deleteReminder(id) {
  const reminders = getReminders();
  const filtered = reminders.filter(r => String(r.id) !== String(id));
  saveReminders(filtered);
  return true;
}

export async function deleteReminderAsync(id) {
  deleteReminder(id);

  if (!hasRemoteEnabled()) return true;

  syncInBackground("delete", { id }, async () => {
    await apiRequest(`/api/reminders/${id}`, {
      method: "DELETE",
    });
  });

  return true;
}

// Get upcoming reminders
export function getUpcomingReminders(days = 7) {
  const reminders = getReminders();
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return reminders
    .filter(r => {
      const reminderDate = getReminderDateTime(r);
      return reminderDate >= now && reminderDate <= future && !r.completed;
    })
    .sort((a, b) => getReminderDateTime(a) - getReminderDateTime(b));
}

// Get reminders by month
export function getRemindersByMonth(year, month) {
  const reminders = getReminders();
  return reminders.filter(r => {
    const date = getReminderDateTime(r);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

// Get reminder categories
export function getReminderCategories() {
  return getReminderCategoryMaster();
}

// Toggle reminder completed
export function toggleReminderCompleted(id) {
  const reminders = getReminders();
  const reminder = reminders.find(r => String(r.id) === String(id));
  if (!reminder) return null;

  const wasCompleted = reminder.completed;
  reminder.completed = !wasCompleted;

  if (!wasCompleted && reminder.completed && reminder.repeat !== "none") {
    const nextReminder = {
      ...reminder,
      id: Math.max(...reminders.map(r => Number(r.id) || 0), 0) + 1,
      date: getNextOccurrenceDate(reminder.date, reminder.repeat),
      completed: false,
      notified: false,
      notify10mSent: false,
      notify1hSent: false,
    };
    reminders.push(nextReminder);
  }

  saveReminders(reminders);
  return reminder;
}

export async function toggleReminderCompletedAsync(id) {
  const before = getReminders();
  const beforeIds = new Set(before.map(r => String(r.id)));
  const updated = toggleReminderCompleted(id);
  if (!updated) return null;
  const after = getReminders();
  const spawnedReminder = after.find(r => !beforeIds.has(String(r.id)));

  if (!hasRemoteEnabled()) return updated;

  syncInBackground("update", { id, updates: { completed: updated.completed } }, async () => {
    await apiRequest(`/api/reminders/${id}`, {
      method: "PATCH",
      body: { completed: updated.completed },
    });
  });

  if (spawnedReminder && updated.repeat && updated.repeat !== "none" && updated.completed) {
    syncInBackground("create", spawnedReminder, async () => {
      await apiRequest("/api/reminders", {
        method: "POST",
        body: spawnedReminder,
      });
    });
  }

  return updated;
}

export function getReminderDateTime(reminder) {
  return new Date(`${reminder.date}T${reminder.time || "00:00"}:00`);
}

export function evaluateReminderNotification(reminder, now = new Date()) {
  if (reminder.completed) return null;

  const dueDate = getReminderDateTime(reminder);
  if (Number.isNaN(dueDate.getTime())) return null;

  const diff = dueDate.getTime() - now.getTime();
  const title = reminder.title || "Reminder";

  if (reminder.remindBefore === "1h" && diff > 0 && diff <= 60 * 60 * 1000 && !reminder.notify1hSent) {
    return {
      type: "1h",
      body: `${title} dalam 1 jam (${reminder.time})`,
    };
  }

  if (reminder.remindBefore === "10m" && diff > 0 && diff <= 10 * 60 * 1000 && !reminder.notify10mSent) {
    return {
      type: "10m",
      body: `${title} dalam 10 menit (${reminder.time})`,
    };
  }

  if (diff <= 0 && diff >= -60 * 1000 && !reminder.notified) {
    return {
      type: "due",
      body: `${title} sekarang (${reminder.time})`,
    };
  }

  return null;
}

export function markReminderNotified(id, type) {
  const reminders = getReminders();
  const reminder = reminders.find(r => String(r.id) === String(id));
  if (!reminder) return null;

  if (type === "10m") reminder.notify10mSent = true;
  if (type === "1h") reminder.notify1hSent = true;
  if (type === "due") reminder.notified = true;

  saveReminders(reminders);
  return reminder;
}

export async function markReminderNotifiedAsync(id, type) {
  const updated = markReminderNotified(id, type);
  if (!updated) return null;

  if (!hasRemoteEnabled()) return updated;

  const updates = {
    ...(type === "10m" ? { notify10mSent: true } : {}),
    ...(type === "1h" ? { notify1hSent: true } : {}),
    ...(type === "due" ? { notified: true } : {}),
  };

  syncInBackground("update", { id, updates }, async () => {
    await apiRequest(`/api/reminders/${id}`, {
      method: "PATCH",
      body: updates,
    });
  });

  return updated;
}
