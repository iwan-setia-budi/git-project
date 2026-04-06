import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarRange, Plus, Repeat, Sparkles, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  addSchedule,
  getScheduleCategories,
  getScheduleRecurrenceOptions,
} from "@/services/scheduleService";
import { getFamilyMembers } from "@/services/familyService";
import { showToast } from "@/utils/toast";

export default function AddSchedule() {
  const navigate = useNavigate();
  const categories = useMemo(() => getScheduleCategories(), []);
  const [formData, setFormData] = useState({
    title: "",
    category: categories[0]?.name || "activity",
    date: new Date().toISOString().split("T")[0],
    startTime: "08:00",
    endTime: "09:00",
    member: "",
    recurring: "none",
    priority: "medium",
    description: "",
  });
  const [recurrenceOptions] = useState(getScheduleRecurrenceOptions());
  const [members] = useState(getFamilyMembers());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!categories.length) return;
    if (!categories.some(category => category.name === formData.category)) {
      setFormData(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories, formData.category]);

  const selectedCategory = useMemo(
    () => categories.find(item => item.name === formData.category),
    [categories, formData.category]
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      showToast("Silakan isi semua field yang diperlukan", "error");
      return;
    }

    if (formData.endTime <= formData.startTime) {
      showToast("Jam selesai harus lebih besar dari jam mulai", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      addSchedule(formData);
      showToast("Jadwal berhasil ditambahkan!", "success");
      navigate("/schedule");
    } catch (error) {
      showToast(error.message || "Gagal menambahkan jadwal", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-2xl p-5 sm:p-7 lg:p-8">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/schedule">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Tambah Jadwal</h1>
            <p className="text-slate-300">Buat jadwal keluarga yang rapi, modern, dan profesional</p>
          </div>
        </div>

        <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="mb-6 grid gap-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-4 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-950/60 p-3">
                <p className="text-xs text-slate-400">Kategori</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: selectedCategory?.color || "#7dd3fc" }}>
                  {selectedCategory?.label || "Aktivitas"}
                </p>
              </div>
              <div className="rounded-lg bg-slate-950/60 p-3">
                <p className="text-xs text-slate-400">Pengulangan</p>
                <p className="mt-1 text-sm font-semibold text-cyan-300">
                  {recurrenceOptions.find(item => item.value === formData.recurring)?.label || "Sekali"}
                </p>
              </div>
              <div className="rounded-lg bg-slate-950/60 p-3">
                <p className="text-xs text-slate-400">Prioritas</p>
                <p className="mt-1 text-sm font-semibold text-amber-300 capitalize">{formData.priority}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Judul Jadwal</label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Cth: Sekolah, Kerja"
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
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  style={{ colorScheme: "dark" }}
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name} className="bg-slate-900 text-slate-100">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Repeat className="h-4 w-4 text-cyan-300" />
                    Pola Jadwal
                  </label>
                  <select
                    name="recurring"
                    value={formData.recurring}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                    style={{ colorScheme: "dark" }}
                  >
                    {recurrenceOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    Prioritas
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                    style={{ colorScheme: "dark" }}
                  >
                    <option className="bg-slate-900 text-slate-100" value="low">Low</option>
                    <option className="bg-slate-900 text-slate-100" value="medium">Medium</option>
                    <option className="bg-slate-900 text-slate-100" value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <UserRound className="h-4 w-4 text-emerald-300" />
                  Berdasarkan Anggota Keluarga
                </label>
                <select
                  name="member"
                  value={formData.member}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" className="bg-slate-900 text-slate-100">Pilih anggota keluarga</option>
                  {members.map(member => (
                    <option key={member.id} value={member.name} className="bg-slate-900 text-slate-100">
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <CalendarRange className="h-4 w-4 text-sky-300" />
                    Tanggal
                  </label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Jam Mulai</label>
                  <Input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Jam Selesai</label>
                  <Input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
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
                <Link to="/schedule" className="flex-1">
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
