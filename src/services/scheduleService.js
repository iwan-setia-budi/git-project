import { getMasterList } from "@/services/masterDataService";

const STORAGE_KEY = "family_schedules";

function getScheduleCategoryMaster() {
  return getMasterList("scheduleCategories").map(item => ({
    name: item.value,
    label: item.label,
    color: item.color || "#3b82f6",
  }));
}

function getDefaultScheduleCategory() {
  return getScheduleCategoryMaster()[0]?.name || "activity";
}

const scheduleRecurrenceOptions = [
  { value: "none", label: "Sekali" },
  { value: "daily", label: "Harian" },
  { value: "weekly", label: "Mingguan" },
  { value: "monthly", label: "Bulanan" },
  { value: "yearly", label: "Tahunan" },
];

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return startOfDay(new Date());
  }
  return startOfDay(parsed);
}

function toMinutes(timeString) {
  const [hour, minute] = String(timeString || "00:00").split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

function normalizeRecurrence(value) {
  const valid = new Set(["none", "daily", "weekly", "monthly", "yearly"]);
  return valid.has(value) ? value : "none";
}

function normalizeSchedule(schedule) {
  const baseDate = toDate(schedule?.date);
  return {
    id: Number(schedule?.id),
    title: String(schedule?.title || "").trim(),
    category: String(schedule?.category || getDefaultScheduleCategory()),
    date: formatDate(baseDate),
    startTime: String(schedule?.startTime || "08:00"),
    endTime: String(schedule?.endTime || "09:00"),
    member: String(schedule?.member || "").trim(),
    description: String(schedule?.description || "").trim(),
    recurring: normalizeRecurrence(schedule?.recurring),
    priority: ["low", "medium", "high"].includes(schedule?.priority)
      ? schedule.priority
      : "medium",
    createdAt: schedule?.createdAt || new Date().toISOString(),
  };
}

const initialSchedules = [
  normalizeSchedule({
    id: 1,
    title: "Sekolah Anak",
    category: "school",
    date: new Date(),
    startTime: "07:00",
    endTime: "13:00",
    member: "Anak",
    description: "Rutinitas sekolah",
    recurring: "daily",
    priority: "high",
  }),
  normalizeSchedule({
    id: 2,
    title: "Rapat Kerja",
    category: "work",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:30",
    member: "Ayah",
    description: "Meeting koordinasi tim",
    recurring: "weekly",
    priority: "medium",
  }),
];

function saveSchedules(schedules) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
}

function compareByStartTime(a, b) {
  return toMinutes(a.startTime) - toMinutes(b.startTime);
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function occursOnDate(schedule, targetDate) {
  const startDate = toDate(schedule.date);
  const target = startOfDay(targetDate);
  if (target < startDate) return false;

  if (schedule.recurring === "none") {
    return isSameDay(startDate, target);
  }

  if (schedule.recurring === "daily") {
    return true;
  }

  if (schedule.recurring === "weekly") {
    return startDate.getDay() === target.getDay();
  }

  if (schedule.recurring === "monthly") {
    return startDate.getDate() === target.getDate();
  }

  if (schedule.recurring === "yearly") {
    return (
      startDate.getMonth() === target.getMonth() &&
      startDate.getDate() === target.getDate()
    );
  }

  return false;
}

function getScheduleColor(categoryName) {
  return (
    getScheduleCategoryMaster().find(category => category.name === categoryName)?.color ||
    "#3b82f6"
  );
}

function buildOccurrence(schedule, date) {
  const dateString = formatDate(date);
  return {
    ...schedule,
    occurrenceDate: dateString,
    dayLabel: new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    color: getScheduleColor(schedule.category),
  };
}

export function getSchedules() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : initialSchedules;
  const normalized = Array.isArray(parsed)
    ? parsed.map(item => normalizeSchedule(item))
    : initialSchedules;
  saveSchedules(normalized);
  return normalized;
}

export function addSchedule(schedule) {
  const schedules = getSchedules();
  const normalized = normalizeSchedule(schedule);

  if (!normalized.title) {
    throw new Error("Judul jadwal wajib diisi");
  }

  if (toMinutes(normalized.endTime) <= toMinutes(normalized.startTime)) {
    throw new Error("Jam selesai harus lebih besar dari jam mulai");
  }

  const newSchedule = {
    ...normalized,
    id: Math.max(...schedules.map(item => item.id), 0) + 1,
  };

  schedules.push(newSchedule);
  saveSchedules(schedules);
  return newSchedule;
}

export function updateSchedule(id, updates) {
  const schedules = getSchedules();
  const index = schedules.findIndex(item => item.id === id);
  if (index === -1) return null;

  const candidate = normalizeSchedule({ ...schedules[index], ...updates, id });
  if (!candidate.title) {
    throw new Error("Judul jadwal wajib diisi");
  }
  if (toMinutes(candidate.endTime) <= toMinutes(candidate.startTime)) {
    throw new Error("Jam selesai harus lebih besar dari jam mulai");
  }

  schedules[index] = candidate;
  saveSchedules(schedules);
  return candidate;
}

export function deleteSchedule(id) {
  const schedules = getSchedules();
  const filtered = schedules.filter(item => item.id !== id);
  saveSchedules(filtered);
  return true;
}

export function getScheduleOccurrencesInRange(start, end, options = {}) {
  const { member = "all" } = options;
  const schedules = getSchedules();
  const startDate = toDate(start);
  const endDate = toDate(end);

  const occurrences = [];
  for (const schedule of schedules) {
    if (member !== "all" && schedule.member !== member) continue;

    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      if (occursOnDate(schedule, cursor)) {
        occurrences.push(buildOccurrence(schedule, cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  return occurrences.sort((a, b) => {
    const firstDate = new Date(a.occurrenceDate) - new Date(b.occurrenceDate);
    if (firstDate !== 0) return firstDate;
    return compareByStartTime(a, b);
  });
}

export function getSchedulesByDate(date, options = {}) {
  const day = toDate(date);
  return getScheduleOccurrencesInRange(day, day, options);
}

export function getSchedulesByMonth(year, month, options = {}) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  return getScheduleOccurrencesInRange(first, last, options);
}

export function getSchedulesByYear(year, options = {}) {
  const first = new Date(year, 0, 1);
  const last = new Date(year, 11, 31);
  return getScheduleOccurrencesInRange(first, last, options);
}

export function getTodaySchedules(options = {}) {
  return getSchedulesByDate(new Date(), options);
}

export function getScheduleCategories() {
  return getScheduleCategoryMaster();
}

export function getScheduleRecurrenceOptions() {
  return scheduleRecurrenceOptions;
}
