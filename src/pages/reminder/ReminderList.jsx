import { useState, useEffect } from "react";
import { Plus, Trash2, Check, Circle, Search, CalendarClock, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  getReminders,
  getRemindersAsync,
  deleteReminderAsync,
  toggleReminderCompletedAsync,
  updateReminderAsync,
  getReminderCategories,
} from "@/services/reminderService";
import { showToast } from "@/utils/toast";

export default function ReminderList() {
  const [reminders, setReminders] = useState(getReminders());
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nearest");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const categories = getReminderCategories();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    refreshReminders();
  }, []);

  const refreshReminders = async () => {
    setReminders(getReminders());
    setIsSyncing(true);
    const synced = await getRemindersAsync();
    setReminders(synced);
    setIsSyncing(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    await deleteReminderAsync(deleteTarget.id);
    setReminders(getReminders());
    setDeleteTarget(null);
    refreshReminders();
    showToast("Reminder berhasil dihapus", "success");
  };

  const openEditModal = reminder => {
    setEditTarget(reminder);
    setEditForm({
      title: reminder.title || "",
      category: reminder.category || "utilitas",
      date: reminder.date || today,
      time: reminder.time || "10:00",
      description: reminder.description || "",
      remindBefore: reminder.remindBefore || "10m",
      repeat: reminder.repeat || "none",
      assignee: reminder.assignee || "",
    });
  };

  const closeEditModal = () => {
    setEditTarget(null);
    setEditForm(null);
  };

  const handleSaveEdit = async () => {
    if (!editTarget || !editForm) return;

    const trimmedTitle = editForm.title.trim();
    if (!trimmedTitle) {
      showToast("Judul wajib diisi", "error");
      return;
    }

    if (!editForm.time) {
      showToast("Jam wajib diisi", "error");
      return;
    }

    const pickedDate = new Date(`${editForm.date}T00:00:00`);
    const minDate = new Date(`${today}T00:00:00`);
    if (pickedDate < minDate) {
      showToast("Tanggal minimal hari ini", "error");
      return;
    }

    await updateReminderAsync(editTarget.id, {
      ...editForm,
      title: trimmedTitle,
      description: editForm.description.trim(),
      assignee: editForm.assignee.trim(),
    });

    setReminders(getReminders());
    closeEditModal();
    refreshReminders();
    showToast("Reminder berhasil diperbarui", "success");
  };

  const handleToggleCompleted = async id => {
    const updated = await toggleReminderCompletedAsync(id);
    setReminders(getReminders());
    refreshReminders();

    if (updated?.repeat && updated.repeat !== "none" && updated.completed) {
      showToast("Reminder berulang dijadwalkan ulang otomatis", "success");
    }
  };

  const getReminderDateTime = reminder => new Date(`${reminder.date}T${reminder.time || "00:00"}:00`);

  const getUrgencyStyle = reminder => {
    if (reminder.completed) {
      return {
        container: "border-emerald-500/25 bg-emerald-500/5",
        badge: "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
        label: "Selesai",
      };
    }

    const due = getReminderDateTime(reminder);
    const now = new Date();
    const dayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dayDue = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();

    if (due < now) {
      return {
        container: "border-red-500/30 bg-red-500/10",
        badge: "border border-red-500/40 bg-red-500/15 text-red-300",
        label: "Lewat",
      };
    }

    if (dayDue === dayNow) {
      return {
        container: "border-yellow-500/35 bg-yellow-500/10",
        badge: "border border-yellow-500/40 bg-yellow-500/15 text-yellow-300",
        label: "Hari ini",
      };
    }

    return {
      container: "border-emerald-500/20 bg-emerald-500/5",
      badge: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      label: "Terjadwal",
    };
  };

  const filteredByStatus =
    filterStatus === "all"
      ? reminders
      : filterStatus === "completed"
      ? reminders.filter(r => r.completed)
      : reminders.filter(r => !r.completed);

  const searched = filteredByStatus.filter(reminder => {
    const source = [
      reminder.title,
      reminder.description,
      reminder.category,
      reminder.assignee,
    ]
      .join(" ")
      .toLowerCase();
    return source.includes(searchTerm.trim().toLowerCase());
  });

  const sorted = [...searched].sort((a, b) => {
    if (sortBy === "nearest") {
      return getReminderDateTime(a) - getReminderDateTime(b);
    }
    if (sortBy === "farthest") {
      return getReminderDateTime(b) - getReminderDateTime(a);
    }
    return a.title.localeCompare(b.title, "id-ID");
  });

  const repeatMap = {
    none: "Tidak berulang",
    daily: "Harian",
    weekly: "Mingguan",
    monthly: "Bulanan",
    yearly: "Tahunan",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-4xl p-5 sm:p-7 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Daftar Reminder</h1>
            <p className="text-slate-300">Kelola semua reminder keluarga</p>
          </div>
          <div className="flex gap-2">
            <Link to="/reminder/calendar">
              <Button variant="outline" className="gap-2">
                <CalendarClock className="h-4 w-4" />
                Kalender
              </Button>
            </Link>
            <Link to="/reminder/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Reminder
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:grid-cols-3">
          <div className="flex gap-2">
            {[
              { value: "all", label: "Semua" },
              { value: "pending", label: "Aktif" },
              { value: "completed", label: "Selesai" },
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filterStatus === filter.value
                    ? "bg-sky-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari reminder..."
              className="pl-9"
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            style={{ colorScheme: "dark" }}
          >
            <option value="nearest">Terdekat dulu</option>
            <option value="farthest">Terlama</option>
            <option value="az">A-Z</option>
          </select>
        </div>

        {isSyncing ? (
          <p className="mb-3 text-right text-xs text-slate-400">Sinkronisasi data...</p>
        ) : null}

        {/* Reminders List */}
        <div className="space-y-3">
          {sorted.length > 0 ? (
            sorted.map(reminder => {
              const urgency = getUrgencyStyle(reminder);

              return (
              <Card
                key={reminder.id}
                className={`rounded-xl border ${urgency.container} backdrop-blur-xl transition-all duration-300 hover:translate-y-[-1px]`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleCompleted(reminder.id)}
                      className="mt-1 shrink-0 text-slate-400 transition-transform hover:scale-110 hover:text-white"
                    >
                      {reminder.completed ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`font-semibold leading-snug ${
                            reminder.completed ? "line-through text-slate-500" : ""
                          }`}
                        >
                          {reminder.title}
                        </h3>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            onClick={() => openEditModal(reminder)}
                            className="text-cyan-300 hover:text-cyan-200"
                            aria-label="Edit reminder"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(reminder)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-400">
                        {new Date(reminder.date).toLocaleDateString("id-ID")} · {reminder.time}
                      </p>
                      {reminder.assignee ? (
                        <p className="mt-0.5 text-xs text-cyan-300">Untuk: {reminder.assignee}</p>
                      ) : null}
                      {reminder.description ? <p className="mt-0.5 truncate text-xs text-slate-500">{reminder.description}</p> : null}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs ${urgency.badge}`}>{urgency.label}</span>
                        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-xs capitalize text-yellow-300">
                          {reminder.category}
                        </span>
                        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-300">
                          {repeatMap[reminder.repeat] || "Tidak berulang"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-lg font-semibold text-slate-200">Belum ada reminder 😄</p>
              <p className="mt-1 text-sm text-slate-400">Yuk tambahkan reminder pertama kamu!</p>
            </div>
          )}
        </div>

        {deleteTarget ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h3 className="text-lg font-bold">Yakin ingin menghapus reminder ini?</h3>
              <p className="mt-2 text-sm text-slate-300">{deleteTarget.title}</p>
              <div className="mt-5 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                  Batal
                </Button>
                <Button onClick={handleDelete} className="bg-gradient-to-r from-red-400 to-red-500 text-white">
                  Ya
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {editTarget && editForm ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h3 className="text-lg font-bold">Edit Reminder</h3>
              <p className="mt-1 text-sm text-slate-400">Perbarui detail reminder kamu</p>

              <div className="mt-4 space-y-4">
                <Input
                  value={editForm.title}
                  onChange={event =>
                    setEditForm(prev => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Judul reminder"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={editForm.category}
                    onChange={event =>
                      setEditForm(prev => ({ ...prev, category: event.target.value }))
                    }
                    className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                    style={{ colorScheme: "dark" }}
                  >
                    {categories.map(category => (
                      <option
                        key={category.name}
                        value={category.name}
                        className="bg-slate-900 text-slate-100"
                      >
                        {category.label}
                      </option>
                    ))}
                  </select>

                  <Input
                    value={editForm.assignee}
                    onChange={event =>
                      setEditForm(prev => ({ ...prev, assignee: event.target.value }))
                    }
                    placeholder="Untuk anggota (opsional)"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    type="date"
                    value={editForm.date}
                    min={today}
                    onChange={event =>
                      setEditForm(prev => ({ ...prev, date: event.target.value }))
                    }
                    className="reminder-date-input"
                    style={{ colorScheme: "dark" }}
                  />
                  <Input
                    type="time"
                    value={editForm.time}
                    onChange={event =>
                      setEditForm(prev => ({ ...prev, time: event.target.value }))
                    }
                    className="reminder-time-input"
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={editForm.remindBefore}
                    onChange={event =>
                      setEditForm(prev => ({ ...prev, remindBefore: event.target.value }))
                    }
                    className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="none">Tepat waktu</option>
                    <option value="10m">10 menit sebelum</option>
                    <option value="1h">1 jam sebelum</option>
                  </select>

                  <select
                    value={editForm.repeat}
                    onChange={event =>
                      setEditForm(prev => ({ ...prev, repeat: event.target.value }))
                    }
                    className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="none">Tidak berulang</option>
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                    <option value="yearly">Tahunan</option>
                  </select>
                </div>

                <textarea
                  value={editForm.description}
                  onChange={event =>
                    setEditForm(prev => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Deskripsi (opsional)"
                  rows="3"
                  className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <Button variant="outline" onClick={closeEditModal}>
                  Batal
                </Button>
                <Button onClick={handleSaveEdit}>Simpan Perubahan</Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
