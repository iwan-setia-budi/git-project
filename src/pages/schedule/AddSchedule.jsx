import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { addSchedule, getScheduleCategories } from "@/services/scheduleService";
import { getFamilyMembers } from "@/services/familyService";
import { showToast } from "@/utils/toast";

export default function AddSchedule() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "activity",
    date: new Date().toISOString().split("T")[0],
    startTime: "08:00",
    endTime: "09:00",
    member: "",
    description: "",
  });
  const [categories] = useState(getScheduleCategories());
  const [members] = useState(getFamilyMembers());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.startTime) {
      showToast("Silakan isi semua field yang diperlukan", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      addSchedule({
        ...formData,
        date: new Date(formData.date),
      });
      showToast("Jadwal berhasil ditambahkan!", "success");
      navigate("/schedule");
    } catch (error) {
      showToast("Gagal menambahkan jadwal", "error");
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
            <p className="text-slate-300">Buat jadwal baru untuk keluarga</p>
          </div>
        </div>

        <Card className="rounded-2xl backdrop-blur-xl">
          <CardContent className="p-8">
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
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Anggota Keluarga</label>
                <select
                  name="member"
                  value={formData.member}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                >
                  <option value="">Pilih anggota keluarga</option>
                  {members.map(member => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Tanggal</label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
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
