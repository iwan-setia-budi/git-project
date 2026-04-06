import { useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarRange,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getFamilyMembers } from "@/services/familyService";
import {
  deleteSchedule,
  getScheduleOccurrencesInRange,
  getScheduleCategories,
  getScheduleRecurrenceOptions,
  getSchedulesByDate,
  getSchedulesByYear,
  updateSchedule,
} from "@/services/scheduleService";
import { showToast } from "@/utils/toast";

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export default function FamilyAgenda() {
  const [pivotDate, setPivotDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("daily");
  const [selectedMember, setSelectedMember] = useState("all");
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const members = useMemo(
    () => getFamilyMembers().map(member => member.name),
    []
  );

  const categories = useMemo(() => getScheduleCategories(), []);
  const recurrenceOptions = useMemo(() => getScheduleRecurrenceOptions(), []);

  const occurrences = useMemo(() => {
    if (viewMode === "daily") {
      return getSchedulesByDate(pivotDate, { member: selectedMember });
    }

    if (viewMode === "monthly") {
      return getScheduleOccurrencesInRange(startOfMonth(pivotDate), endOfMonth(pivotDate), {
        member: selectedMember,
      });
    }

    return getSchedulesByYear(pivotDate.getFullYear(), { member: selectedMember });
  }, [pivotDate, selectedMember, viewMode]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return occurrences;
    return occurrences.filter(item => {
      return (
        item.title.toLowerCase().includes(keyword) ||
        String(item.description || "").toLowerCase().includes(keyword) ||
        String(item.member || "").toLowerCase().includes(keyword)
      );
    });
  }, [occurrences, search]);

  const metrics = useMemo(() => {
    const total = filtered.length;
    const uniqueMembers = new Set(filtered.map(item => item.member).filter(Boolean)).size;
    const highPriority = filtered.filter(item => item.priority === "high").length;
    const recurringCount = filtered.filter(item => item.recurring !== "none").length;
    return { total, uniqueMembers, highPriority, recurringCount };
  }, [filtered]);

  const groupedMonthly = useMemo(() => {
    const map = new Map();
    for (const item of filtered) {
      const key = item.occurrenceDate;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
    return [...map.entries()].sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }, [filtered]);

  const groupedYearly = useMemo(() => {
    const labels = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const bucket = labels.map((label, month) => ({ label, month, items: [] }));
    for (const item of filtered) {
      const month = new Date(item.occurrenceDate).getMonth();
      bucket[month].items.push(item);
    }
    return bucket;
  }, [filtered]);

  const handleDelete = id => {
    if (confirm("Yakin ingin menghapus jadwal ini?")) {
      deleteSchedule(id);
      showToast("Jadwal berhasil dihapus", "success");
    }
  };

  const openEditModal = schedule => {
    setEditTarget(schedule);
    setEditForm({
      title: schedule.title,
      category: schedule.category,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      member: schedule.member,
      recurring: schedule.recurring,
      priority: schedule.priority,
      description: schedule.description || "",
    });
  };

  const closeEditModal = () => {
    setEditTarget(null);
    setEditForm(null);
  };

  const saveEdit = () => {
    if (!editTarget || !editForm) return;
    if (!editForm.title.trim()) {
      showToast("Judul wajib diisi", "error");
      return;
    }
    if (editForm.endTime <= editForm.startTime) {
      showToast("Jam selesai harus lebih besar dari jam mulai", "error");
      return;
    }
    try {
      updateSchedule(editTarget.id, {
        ...editForm,
        title: editForm.title.trim(),
        member: String(editForm.member || "").trim(),
      });
      showToast("Jadwal berhasil diperbarui", "success");
      closeEditModal();
    } catch (error) {
      showToast(error.message || "Gagal memperbarui jadwal", "error");
    }
  };

  const titleByMode = {
    daily: pivotDate.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    monthly: pivotDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
    yearly: pivotDate.getFullYear(),
  };

  const shiftPrev = () => {
    const next = new Date(pivotDate);
    if (viewMode === "daily") next.setDate(next.getDate() - 1);
    if (viewMode === "monthly") next.setMonth(next.getMonth() - 1);
    if (viewMode === "yearly") next.setFullYear(next.getFullYear() - 1);
    setPivotDate(next);
  };

  const shiftNext = () => {
    const next = new Date(pivotDate);
    if (viewMode === "daily") next.setDate(next.getDate() + 1);
    if (viewMode === "monthly") next.setMonth(next.getMonth() + 1);
    if (viewMode === "yearly") next.setFullYear(next.getFullYear() + 1);
    setPivotDate(next);
  };

  const recurringLabel = {
    none: "Sekali",
    daily: "Harian",
    weekly: "Mingguan",
    monthly: "Bulanan",
    yearly: "Tahunan",
  };

  const priorityClass = {
    low: "bg-emerald-500/15 text-emerald-300",
    medium: "bg-amber-500/15 text-amber-300",
    high: "bg-rose-500/15 text-rose-300",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-6xl p-5 sm:p-7 lg:p-8">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agenda Keluarga</h1>
            <p className="text-slate-300">Mode Harian, Bulanan, Tahunan dengan filter berdasarkan anggota</p>
          </div>
          <div className="flex gap-2">
            <Link to="/schedule">
              <Button variant="outline" className="gap-2">Kalender</Button>
            </Link>
            <Link to="/schedule/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Jadwal
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl border border-white/10 bg-white/5">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Total Kegiatan</p>
              <p className="mt-2 text-2xl font-bold text-cyan-300">{metrics.total}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-white/10 bg-white/5">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Anggota Terlibat</p>
              <p className="mt-2 text-2xl font-bold text-emerald-300">{metrics.uniqueMembers}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-white/10 bg-white/5">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Prioritas Tinggi</p>
              <p className="mt-2 text-2xl font-bold text-rose-300">{metrics.highPriority}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-white/10 bg-white/5">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Jadwal Berulang</p>
              <p className="mt-2 text-2xl font-bold text-amber-300">{metrics.recurringCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "daily", label: "Harian", icon: CalendarClock },
                { key: "monthly", label: "Bulanan", icon: CalendarDays },
                { key: "yearly", label: "Tahunan", icon: CalendarRange },
              ].map(mode => (
                <button
                  key={mode.key}
                  onClick={() => setViewMode(mode.key)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    viewMode === mode.key
                      ? "bg-cyan-400 text-slate-950"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  <mode.icon className="h-4 w-4" />
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-56 flex-1 lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Cari kegiatan, deskripsi, anggota"
                className="w-full rounded-lg border border-white/10 bg-slate-950/40 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedMember("all")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedMember === "all"
                  ? "bg-sky-400 text-slate-950"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              Semua Anggota
            </button>
            {members.map(member => (
              <button
                key={member}
                onClick={() => setSelectedMember(member)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedMember === member
                    ? "bg-sky-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {member}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
            <Button onClick={shiftPrev} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <p className="text-sm font-semibold text-cyan-200">{titleByMode[viewMode]}</p>
            <Button onClick={shiftNext} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">Tidak ada jadwal pada filter ini</p>
            </div>
          ) : null}

          {viewMode === "daily"
            ? filtered.map(schedule => {
                const category = categories.find(item => item.name === schedule.category);
                return (
                  <Card key={`${schedule.id}-${schedule.occurrenceDate}`} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold">{schedule.title}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                            <span>{schedule.startTime} - {schedule.endTime}</span>
                            <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-sky-300">
                              {schedule.member || "Umum"}
                            </span>
                            <span
                              className="rounded-full px-2 py-0.5 text-xs"
                              style={{ backgroundColor: `${schedule.color}22`, color: schedule.color }}
                            >
                              {category?.label || schedule.category}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-xs ${priorityClass[schedule.priority]}`}>
                              {schedule.priority.toUpperCase()}
                            </span>
                            <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs text-indigo-300">
                              {recurringLabel[schedule.recurring]}
                            </span>
                          </div>
                          {schedule.description ? (
                            <p className="mt-2 text-sm text-slate-300">{schedule.description}</p>
                          ) : null}
                        </div>
                        <button
                          onClick={() => openEditModal(schedule)}
                          className="text-cyan-300 hover:text-cyan-200"
                          title="Edit jadwal"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Hapus template jadwal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            : null}

          {viewMode === "monthly"
            ? groupedMonthly.map(([date, items]) => (
                <Card key={date} className="rounded-xl border border-white/10 bg-white/5">
                  <CardContent className="p-4">
                    <p className="mb-3 text-sm font-semibold text-cyan-300">{formatDate(date)}</p>
                    <div className="space-y-2">
                      {items.map(item => {
                        const category = categories.find(cat => cat.name === item.category);
                        return (
                          <div key={`${item.id}-${item.occurrenceDate}`} className="rounded-lg border border-white/10 bg-slate-950/35 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-xs text-slate-400">
                                  {item.startTime} - {item.endTime} | {item.member || "Umum"} | {category?.label || item.category}
                                </p>
                              </div>
                              <span className="text-xs text-indigo-300">{recurringLabel[item.recurring]}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            : null}

          {viewMode === "yearly"
            ? groupedYearly.map(month => (
                <Card key={month.month} className="rounded-xl border border-white/10 bg-white/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-cyan-300">{month.label}</p>
                      <p className="text-sm text-slate-400">{month.items.length} kegiatan</p>
                    </div>
                    {month.items.length > 0 ? (
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {month.items.slice(0, 6).map(item => (
                          <div key={`${item.id}-${item.occurrenceDate}`} className="rounded-lg border border-white/10 bg-slate-950/35 p-2.5 text-sm">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(item.occurrenceDate).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                              })} | {item.member || "Umum"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">Belum ada jadwal</p>
                    )}
                  </CardContent>
                </Card>
              ))
            : null}
        </div>

        {editTarget && editForm ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h3 className="text-lg font-bold">Edit Jadwal</h3>
              <p className="mb-4 text-sm text-slate-400">Ubah template jadwal untuk semua kejadian berulang berikutnya.</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm text-slate-300">Judul</label>
                  <input
                    value={editForm.title}
                    onChange={event => setEditForm(prev => ({ ...prev, title: event.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">Kategori</label>
                  <select
                    value={editForm.category}
                    onChange={event => setEditForm(prev => ({ ...prev, category: event.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white"
                    style={{ colorScheme: "dark" }}
                  >
                    {categories.map(item => (
                      <option key={item.name} value={item.name} className="bg-slate-900 text-slate-100">{item.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">Anggota</label>
                  <select
                    value={editForm.member}
                    onChange={event => setEditForm(prev => ({ ...prev, member: event.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="" className="bg-slate-900 text-slate-100">Umum</option>
                    {members.map(member => (
                      <option key={member} value={member} className="bg-slate-900 text-slate-100">{member}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">Tanggal Awal</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={event => setEditForm(prev => ({ ...prev, date: event.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">Pola</label>
                  <select
                    value={editForm.recurring}
                    onChange={event => setEditForm(prev => ({ ...prev, recurring: event.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white"
                    style={{ colorScheme: "dark" }}
                  >
                    {recurrenceOptions.map(item => (
                      <option key={item.value} value={item.value} className="bg-slate-900 text-slate-100">{item.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">Jam Mulai</label>
                  <input
                    type="time"
                    value={editForm.startTime}
                    onChange={event => setEditForm(prev => ({ ...prev, startTime: event.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">Jam Selesai</label>
                  <input
                    type="time"
                    value={editForm.endTime}
                    onChange={event => setEditForm(prev => ({ ...prev, endTime: event.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">Prioritas</label>
                  <select
                    value={editForm.priority}
                    onChange={event => setEditForm(prev => ({ ...prev, priority: event.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="low" className="bg-slate-900 text-slate-100">Low</option>
                    <option value="medium" className="bg-slate-900 text-slate-100">Medium</option>
                    <option value="high" className="bg-slate-900 text-slate-100">High</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm text-slate-300">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={event => setEditForm(prev => ({ ...prev, description: event.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <Button variant="outline" onClick={closeEditModal}>Batal</Button>
                <Button onClick={saveEdit}>Simpan Perubahan</Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
