import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { addTransaction, getExpenseCategories } from "@/services/financeService";
import { getFamilyMembers } from "@/services/familyService";
import { showToast } from "@/utils/toast";

export default function AddTransaction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "makan",
    description: "",
    date: new Date().toISOString().split("T")[0],
    member: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories] = useState(getExpenseCategories());
  const [members] = useState(getFamilyMembers());

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.amount || !formData.category) {
      showToast("Silakan isi semua field yang diperlukan", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const transaction = {
        ...formData,
        amount: parseInt(formData.amount),
        date: new Date(formData.date),
      };
      addTransaction(transaction);
      showToast("Transaksi berhasil ditambahkan!", "success");
      navigate("/finance");
    } catch (error) {
      showToast("Gagal menambahkan transaksi", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-2xl p-5 sm:p-7 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link to="/finance">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Tambah Transaksi</h1>
            <p className="text-slate-300">Catat pemasukan atau pengeluaran keluarga</p>
          </div>
        </div>

        {/* Form */}
        <Card className="rounded-2xl backdrop-blur-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type */}
              <div>
                <label className="mb-2 block text-sm font-medium">Jenis Transaksi</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "income", label: "Pemasukan", color: "bg-green-500/20 border-green-500/40" },
                    { value: "expense", label: "Pengeluaran", color: "bg-red-500/20 border-red-500/40" },
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: option.value }))}
                      className={`rounded-lg border-2 p-4 text-center font-medium transition ${
                        formData.type === option.value
                          ? `${option.color} border-current`
                          : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-medium">Jumlah (Rp)</label>
                <Input
                  type="number"
                  name="amount"
                  placeholder="0"
                  value={formData.amount}
                  onChange={handleChange}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium">Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name.toLowerCase()}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium">Keterangan</label>
                <Input
                  type="text"
                  name="description"
                  placeholder="Contoh: Belanja groceries"
                  value={formData.description}
                  onChange={handleChange}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                />
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-medium">Tanggal</label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  required
                />
              </div>

              {/* Member */}
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

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                <Link to="/finance" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Batal
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
