import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { addReminder, getReminderCategories } from "@/services/reminderService";
import { showToast } from "@/utils/toast";

export default function AddReminder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "utility",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
  });
  const [categories] = useState(getReminderCategories());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) {
      showToast("Silakan isi semua field yang diperlukan", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      addReminder({
        ...formData,
        date: new Date(formData.date),
      });
      showToast("Reminder berhasil ditambahkan!", "success");
      navigate("/reminder");
    } catch (error) {
      showToast("Gagal menambahkan reminder", "error");
    } finally {
      setIsSubmitting(false);
    }
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
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                  <label className="mb-2 block text-sm font-medium">Jam</label>
                  <Input
                    type="time"
                    name="time"
                    value={formData.time}
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
