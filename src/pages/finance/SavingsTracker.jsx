import { useState, useEffect } from "react";
import { ArrowLeft, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { getSavingsTarget, updateSavingsTarget } from "@/services/financeService";
import { showToast } from "@/utils/toast";

export default function SavingsTracker() {
  const [savingsTarget, setSavingsTarget] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    current: "",
  });

  useEffect(() => {
    const target = getSavingsTarget();
    setSavingsTarget(target);
    setFormData({
      name: target.name,
      target: target.target.toString(),
      current: target.current.toString(),
    });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    try {
      const updated = {
        name: formData.name,
        target: parseInt(formData.target),
        current: parseInt(formData.current),
      };
      updateSavingsTarget(updated);
      setSavingsTarget(updated);
      setIsEditing(false);
      showToast("Target tabungan berhasil diperbarui!", "success");
    } catch (error) {
      showToast("Gagal memperbarui target tabungan", "error");
    }
  };

  if (!savingsTarget) return null;

  const percentage = (savingsTarget.current / savingsTarget.target) * 100;
  const remaining = savingsTarget.target - savingsTarget.current;

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
            <h1 className="text-3xl font-bold">Target Tabungan</h1>
            <p className="text-slate-300">Pantau progres tabungan keluarga</p>
          </div>
        </div>

        {!isEditing ? (
          <>
            {/* Main Savings Card */}
            <Card className="mb-6 rounded-2xl backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Target:</p>
                    <h2 className="text-3xl font-bold">{savingsTarget.name}</h2>
                  </div>
                  <Target className="h-12 w-12 text-sky-400" />
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="mb-3 flex justify-between">
                    <p className="text-sm font-medium">Progres Tabungan</p>
                    <p className="text-sm font-bold">{percentage.toFixed(1)}%</p>
                  </div>
                  <div className="h-4 w-full rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-white/5 p-4">
                    <p className="text-xs text-slate-400">Terkumpul</p>
                    <p className="mt-1 text-lg font-bold text-green-400">
                      Rp {savingsTarget.current.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-4">
                    <p className="text-xs text-slate-400">Target</p>
                    <p className="mt-1 text-lg font-bold text-sky-400">
                      Rp {savingsTarget.target.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-4">
                    <p className="text-xs text-slate-400">Sisa</p>
                    <p className="mt-1 text-lg font-bold text-yellow-400">
                      Rp {remaining.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setIsEditing(true)} className="w-full gap-2">
              <TrendingUp className="h-4 w-4" />
              Edit Target
            </Button>
          </>
        ) : (
          <Card className="rounded-2xl backdrop-blur-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">Nama Target</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Target (Rp)</label>
                  <Input
                    type="number"
                    name="target"
                    value={formData.target}
                    onChange={handleChange}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Terkumpul (Rp)</label>
                  <Input
                    type="number"
                    name="current"
                    value={formData.current}
                    onChange={handleChange}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsEditing(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
