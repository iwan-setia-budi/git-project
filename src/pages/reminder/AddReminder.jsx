import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { addReminderAsync, getReminderCategories } from "@/services/reminderService";
import { showToast } from "@/utils/toast";

export default function AddReminder() {
  const navigate = useNavigate();
  const dateInputRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];
  const categories = useMemo(() => getReminderCategories(), []);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: categories[0]?.name || "utilitas",
    date: today,
    time: "10:00",
    remindBefore: "10m",
    repeat: "none",
    assignee: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!categories.length) return;
    if (!categories.some(category => category.name === formData.category)) {
      setFormData(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories, formData.category]);

  const repeatOptions = [
    { value: "none", label: "Tidak berulang" },
    { value: "daily", label: "Harian" },
    { value: "weekly", label: "Mingguan" },
    { value: "monthly", label: "Bulanan" },
    { value: "yearly", label: "Tahunan" },
  ];

  const remindBeforeOptions = [
    { value: "none", label: "Tepat waktu" },
    { value: "10m", label: "10 menit sebelum" },
    { value: "1h", label: "1 jam sebelum" },
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      showToast("Judul wajib diisi", "error");
      return;
    }

    if (!formData.time) {
      showToast("Jam wajib diisi", "error");
      return;
    }

    const pickedDate = new Date(`${formData.date}T00:00:00`);
    const minDate = new Date(`${today}T00:00:00`);
    if (pickedDate < minDate) {
      showToast("Tanggal minimal hari ini", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      await addReminderAsync({
        ...formData,
        title: trimmedTitle,
        description: formData.description.trim(),
        assignee: formData.assignee.trim(),
        date: formData.date,
      });
      showToast("Reminder berhasil ditambahkan!", "success");
      navigate("/reminder");
    } catch (error) {
      showToast("Gagal menambahkan reminder", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDatePicker = () => {
    if (!dateInputRef.current) return;

    if (typeof dateInputRef.current.showPicker === "function") {
      dateInputRef.current.showPicker();
      return;
    }

    dateInputRef.current.focus();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-2xl p-5 sm:p-7 lg:p-8">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/reminder">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Tambah Reminder</h1>
            <p className="text-slate-300">Buat reminder baru untuk keluarga</p>
          </div>
        </div>

        <Card className="rounded-2xl backdrop-blur-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Judul Reminder</label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Cth: Bayar Listrik"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-slate-100"
                  style={{ colorScheme: "dark" }}
                >
                  {categories.map(cat => (
                    <option
                      key={cat.name}
                      value={cat.name}
                      className="bg-slate-900 text-slate-100"
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Tanggal</label>
                  <div className="relative">
                    <Input
                      ref={dateInputRef}
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      required
                      className="reminder-date-input rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white"
                      style={{ colorScheme: "dark" }}
                    />
                    <button
                      type="button"
                      onClick={handleOpenDatePicker}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-200 transition hover:bg-white/10 hover:text-white"
                      aria-label="Pilih tanggal"
                    >
                      <CalendarDays className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Jam</label>
                  <Input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="reminder-time-input rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Ingatkan</label>
                  <select
                    name="remindBefore"
                    value={formData.remindBefore}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-slate-100"
                    style={{ colorScheme: "dark" }}
                  >
                    {remindBeforeOptions.map(option => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-slate-900 text-slate-100"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Pengulangan</label>
                  <select
                    name="repeat"
                    value={formData.repeat}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-slate-100"
                    style={{ colorScheme: "dark" }}
                  >
                    {repeatOptions.map(option => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-slate-900 text-slate-100"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Untuk Anggota (Opsional)</label>
                <Input
                  type="text"
                  name="assignee"
                  placeholder="Contoh: Ayah"
                  value={formData.assignee}
                  onChange={handleChange}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Deskripsi (Opsional)</label>
                <textarea
                  name="description"
                  placeholder="Tambahkan catatan..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <Link to="/reminder" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Batal
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
                  <Plus className="h-4 w-4" />
                  Simpan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
