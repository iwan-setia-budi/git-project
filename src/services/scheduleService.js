// Mock data for schedules
const initialSchedules = [
  {
    id: 1,
    title: "Sekolah Anak",
    category: "sekolah",
    date: new Date(2024, 3, 8),
    startTime: "07:00",
    endTime: "13:00",
    member: "Anak",
    description: "Hari Senin - Jumat",
    recurring: "weekday",
  },
  {
    id: 2,
    title: "Kerja",
    category: "kerja",
    date: new Date(2024, 3, 9),
    startTime: "08:00",
    endTime: "17:00",
    member: "Ayah",
    description: "Hari kerja",
    recurring: "weekday",
  },
];

const scheduleCategories = [
  { name: "school", label: "Sekolah", color: "#3b82f6" },
  { name: "work", label: "Kerja", color: "#8b5cf6" },
  { name: "worship", label: "Ibadah", color: "#06b6d4" },
  { name: "chore", label: "Tugas Rumah", color: "#f59e0b" },
  { name: "activity", label: "Aktivitas", color: "#10b981" },
  { name: "appointment", label: "Janji Temu", color: "#ef4444" },
];

// Get all schedules
export function getSchedules() {
  const stored = localStorage.getItem("family_schedules");
  return stored ? JSON.parse(stored) : initialSchedules;
}

// Add schedule
export function addSchedule(schedule) {
  const schedules = getSchedules();
  const newSchedule = {
    ...schedule,
    id: Math.max(...schedules.map(s => s.id), 0) + 1,
  };
  schedules.push(newSchedule);
  localStorage.setItem("family_schedules", JSON.stringify(schedules));
  return newSchedule;
}

// Update schedule
export function updateSchedule(id, updates) {
  const schedules = getSchedules();
  const index = schedules.findIndex(s => s.id === id);
  if (index !== -1) {
    schedules[index] = { ...schedules[index], ...updates };
    localStorage.setItem("family_schedules", JSON.stringify(schedules));
    return schedules[index];
  }
  return null;
}

// Delete schedule
export function deleteSchedule(id) {
  const schedules = getSchedules();
  const filtered = schedules.filter(s => s.id !== id);
  localStorage.setItem("family_schedules", JSON.stringify(filtered));
  return true;
}

// Get schedules by date
export function getSchedulesByDate(date) {
  const schedules = getSchedules();
  return schedules.filter(s => {
    const scheduleDate = new Date(s.date);
    return (
      scheduleDate.getFullYear() === date.getFullYear() &&
      scheduleDate.getMonth() === date.getMonth() &&
      scheduleDate.getDate() === date.getDate()
    );
  });
}

// Get schedules by month
export function getSchedulesByMonth(year, month) {
  const schedules = getSchedules();
  return schedules.filter(s => {
    const date = new Date(s.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

// Get today's schedules
export function getTodaySchedules() {
  return getSchedulesByDate(new Date());
}

// Get schedule categories
export function getScheduleCategories() {
  return scheduleCategories;
}
