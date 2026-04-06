// Mock data for reminders
const initialReminders = [
  {
    id: 1,
    title: "Bayar Listrik",
    category: "utilitas",
    date: new Date(2024, 3, 15),
    time: "10:00",
    description: "Jatuh tempo tagihan listrik",
    completed: false,
    notified: false,
  },
  {
    id: 2,
    title: "Ulang Tahun Ibu",
    category: "acara",
    date: new Date(2024, 4, 20),
    time: "08:00",
    description: "Jangan lupa rayakan",
    completed: false,
    notified: false,
  },
];

const reminderCategories = [
  { name: "Utility", label: "Utilitas" },
  { name: "health", label: "Kesehatan" },
  { name: "maintenance", label: "Perawatan" },
  { name: "event", label: "Acara" },
  { name: "financial", label: "Keuangan" },
];

// Get all reminders
export function getReminders() {
  const stored = localStorage.getItem("family_reminders");
  return stored ? JSON.parse(stored) : initialReminders;
}

// Add reminder
export function addReminder(reminder) {
  const reminders = getReminders();
  const newReminder = {
    ...reminder,
    id: Math.max(...reminders.map(r => r.id), 0) + 1,
    completed: false,
    notified: false,
  };
  reminders.push(newReminder);
  localStorage.setItem("family_reminders", JSON.stringify(reminders));
  return newReminder;
}

// Update reminder
export function updateReminder(id, updates) {
  const reminders = getReminders();
  const index = reminders.findIndex(r => r.id === id);
  if (index !== -1) {
    reminders[index] = { ...reminders[index], ...updates };
    localStorage.setItem("family_reminders", JSON.stringify(reminders));
    return reminders[index];
  }
  return null;
}

// Delete reminder
export function deleteReminder(id) {
  const reminders = getReminders();
  const filtered = reminders.filter(r => r.id !== id);
  localStorage.setItem("family_reminders", JSON.stringify(filtered));
  return true;
}

// Get upcoming reminders
export function getUpcomingReminders(days = 7) {
  const reminders = getReminders();
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return reminders
    .filter(r => {
      const reminderDate = new Date(r.date);
      return reminderDate >= now && reminderDate <= future && !r.completed;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Get reminders by month
export function getRemindersByMonth(year, month) {
  const reminders = getReminders();
  return reminders.filter(r => {
    const date = new Date(r.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

// Get reminder categories
export function getReminderCategories() {
  return reminderCategories;
}

// Toggle reminder completed
export function toggleReminderCompleted(id) {
  const reminders = getReminders();
  const reminder = reminders.find(r => r.id === id);
  if (reminder) {
    reminder.completed = !reminder.completed;
    localStorage.setItem("family_reminders", JSON.stringify(reminders));
  }
  return reminder;
}
