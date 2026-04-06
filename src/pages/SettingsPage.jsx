import { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Database,
  Globe,
  Lock,
  Palette,
  Pencil,
  PlusCircle,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserCog,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/utils/toast";
import {
  addMasterItem,
  deleteMasterItem,
  getMasterData,
  reorderMasterItem,
  resetMasterData,
  updateMasterItem,
} from "@/services/masterDataService";

const settingStats = [
  {
    title: "Level Keamanan",
    value: "Tinggi",
    note: "2FA dan audit aktif",
    icon: ShieldCheck,
  },
  {
    title: "Notifikasi",
    value: "12 Aturan",
    note: "Email dan aplikasi aktif",
    icon: Bell,
  },
  {
    title: "Tema Aplikasi",
    value: "Gelap Premium",
    note: "Preset tampilan profesional",
    icon: Palette,
  },
  {
    title: "Wilayah",
    value: "Asia / Jakarta",
    note: "Pengaturan aplikasi lokal",
    icon: Globe,
  },
];

const preferences = [
  "Logo merek khusus aktif",
  "Email ringkasan mingguan aktif",
  "Zona waktu sinkron dengan aplikasi",
  "Bahasa diatur ke Indonesia",
];

const securityItems = [
  "Otentikasi dua langkah wajib",
  "Single sign-on terhubung",
  "Retensi log audit: 180 hari",
  "Persetujuan admin untuk anggota baru",
];

const notifications = [
  "Pembaruan aplikasi",
  "Pengingat pembayaran bulanan",
  "Ringkasan mingguan",
  "Notifikasi undangan anggota",
];

const masterConfigs = [
  { key: "financeExpenseCategories", label: "Finance - Kategori Pengeluaran", hasColor: true },
  { key: "financeIncomeCategories", label: "Finance - Kategori Pemasukan", hasColor: true },
  { key: "scheduleCategories", label: "Jadwal - Kategori", hasColor: true },
  { key: "reminderCategories", label: "Reminder - Kategori", hasColor: true },
  { key: "driveFileTypes", label: "Penyimpanan - Tipe File", hasColor: false },
  { key: "driveTagPresets", label: "Penyimpanan - Preset Tag", hasColor: false },
];

function getDefaultDraft(config) {
  return {
    label: "",
    value: "",
    color: config?.hasColor ? "#38bdf8" : "",
  };
}

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [masterData, setMasterData] = useState(getMasterData());
  const [selectedMasterKey, setSelectedMasterKey] = useState(masterConfigs[0].key);
  const selectedMasterConfig = useMemo(
    () => masterConfigs.find(config => config.key === selectedMasterKey) || masterConfigs[0],
    [selectedMasterKey]
  );
  const [draftItem, setDraftItem] = useState(getDefaultDraft(masterConfigs[0]));
  const [editingId, setEditingId] = useState(null);

  const currentMasterItems = masterData[selectedMasterKey] || [];

  const refreshMasterData = () => {
    setMasterData(getMasterData());
  };

  const handleSaveSettings = () => {
    showToast("Pengaturan berhasil disimpan! Preferensi Anda telah diperbarui.");
  };

  const handleEnableTwoFactor = () => {
    showToast("Pengaturan 2FA dibuka - Pindai QR code atau masukkan kode cadangan");
  };

  const handleThemeChange = () => {
    showToast("Tema diubah ke Mode Gelap");
  };

  const handleNotificationSettings = () => {
    showToast("Panel preferensi notifikasi dibuka - Atur email dan notifikasi push");
  };

  const handleSelectMaster = key => {
    const config = masterConfigs.find(item => item.key === key) || masterConfigs[0];
    setSelectedMasterKey(key);
    setDraftItem(getDefaultDraft(config));
    setEditingId(null);
  };

  const handleEditMasterItem = item => {
    setEditingId(item.id);
    setDraftItem({
      label: item.label,
      value: item.value,
      color: item.color || (selectedMasterConfig.hasColor ? "#38bdf8" : ""),
    });
  };

  const handleSaveMasterItem = () => {
    try {
      const payload = {
        label: draftItem.label.trim(),
        value: draftItem.value.trim().toLowerCase(),
        ...(selectedMasterConfig.hasColor ? { color: draftItem.color || "#38bdf8" } : {}),
      };

      if (!payload.label || !payload.value) {
        showToast("Label dan value wajib diisi", "error");
        return;
      }

      if (editingId) {
        updateMasterItem(selectedMasterKey, editingId, payload);
        showToast("Master data berhasil diperbarui", "success");
      } else {
        addMasterItem(selectedMasterKey, payload);
        showToast("Master data berhasil ditambahkan", "success");
      }

      refreshMasterData();
      setEditingId(null);
      setDraftItem(getDefaultDraft(selectedMasterConfig));
    } catch (error) {
      showToast(error.message || "Gagal menyimpan master data", "error");
    }
  };

  const handleDeleteMasterItem = id => {
    if (!confirm("Yakin ingin menghapus item master data ini?")) return;
    try {
      deleteMasterItem(selectedMasterKey, id);
      refreshMasterData();
      showToast("Item master data berhasil dihapus", "success");
      if (editingId === id) {
        setEditingId(null);
        setDraftItem(getDefaultDraft(selectedMasterConfig));
      }
    } catch (error) {
      showToast(error.message || "Gagal menghapus item", "error");
    }
  };

  const handleMoveMasterItem = (id, direction) => {
    reorderMasterItem(selectedMasterKey, id, direction);
    refreshMasterData();
  };

  const handleResetMaster = () => {
    if (!confirm("Reset semua master data ke default?")) return;
    resetMasterData();
    refreshMasterData();
    setEditingId(null);
    setDraftItem(getDefaultDraft(selectedMasterConfig));
    showToast("Semua master data berhasil direset", "success");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-7xl p-5 sm:p-7 lg:p-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-sky-300">Pengaturan Aplikasi</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Pengaturan Sistem dan Keluarga</h1>
              <p className="mt-2 text-sm text-slate-300">
                Kelola keamanan, notifikasi, tampilan, branding, dan preferensi keluarga dalam desain premium dan profesional.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari pengaturan..."
                  className="rounded-2xl border-white/10 bg-slate-950/40 pl-10 text-white placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={handleNotificationSettings}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Preferensi
              </Button>
              <Button className="rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 hover:opacity-95" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {settingStats.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="rounded-[1.75rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-300">{item.title}</p>
                      <h3 className="mt-3 text-3xl font-semibold tracking-tight">{item.value}</h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-indigo-500/20">
                      <Icon className="h-5 w-5 text-sky-300" />
                    </div>
                  </div>
                  <p className="mt-5 text-xs text-slate-400">{item.note}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <UserCog className="h-5 w-5 text-sky-300" />
                <div>
                  <p className="text-sm text-sky-300">Preferensi Umum</p>
                  <h2 className="mt-1 text-2xl font-semibold">Konfigurasi Keluarga</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {preferences.map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-sky-300" />
                <div>
                  <p className="text-sm text-sky-300">Kontrol Keamanan</p>
                  <h2 className="mt-1 text-2xl font-semibold">Perlindungan Akses</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {securityItems.map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-sky-300" />
                <div>
                  <p className="text-sm text-sky-300">Notifikasi</p>
                  <h2 className="mt-1 text-2xl font-semibold">Preferensi Peringatan</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {notifications.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4">
                    <span className="text-sm text-slate-300">{item}</span>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                      Aktif
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-sky-300" />
                <div>
                  <p className="text-sm text-sky-300">Tampilan</p>
                  <h2 className="mt-1 text-2xl font-semibold">Tema dan Branding</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-[1.5rem] border border-sky-400/30 bg-gradient-to-r from-sky-400/10 to-indigo-500/10 p-5">
                  <p className="text-sm text-slate-400">Tema Aktif</p>
                  <h3 className="mt-2 text-xl font-semibold">Antarmuka Gelap Premium</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Desain gelap elegan dengan nuansa modern, premium, dan profesional untuk dashboard keluarga.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5">
                  <p className="text-sm text-slate-400">Identitas Merek</p>
                  <h3 className="mt-2 text-xl font-semibold">Logo Kustom dan Aksen Aktif</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Branding aplikasi dapat disesuaikan untuk kebutuhan keluarga dan pengelolaan rumah tangga.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-sky-300" />
                  <div>
                    <p className="text-sm text-sky-300">Master Data</p>
                    <h2 className="mt-1 text-2xl font-semibold">Kelola Semua Dropdown</h2>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/5"
                    onClick={handleResetMaster}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Default
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[360px_1fr]">
                <div className="space-y-2">
                  {masterConfigs.map(config => (
                    <button
                      key={config.key}
                      onClick={() => handleSelectMaster(config.key)}
                      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                        selectedMasterKey === config.key
                          ? "border-sky-400/50 bg-sky-500/10 text-sky-200"
                          : "border-white/10 bg-slate-950/30 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>

                <div>
                  <div className="mb-4 rounded-xl border border-white/10 bg-slate-950/30 p-4">
                    <p className="text-sm text-slate-300">{selectedMasterConfig.label}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Item: {currentMasterItems.length}. Perubahan akan otomatis dipakai pada form Finance, Jadwal, Reminder, dan Penyimpanan.
                    </p>
                  </div>

                  <div className="mb-4 grid gap-3 rounded-xl border border-white/10 bg-slate-950/30 p-4 md:grid-cols-3">
                    <Input
                      value={draftItem.label}
                      onChange={event => setDraftItem(prev => ({ ...prev, label: event.target.value }))}
                      placeholder="Label tampil"
                    />
                    <Input
                      value={draftItem.value}
                      onChange={event => setDraftItem(prev => ({ ...prev, value: event.target.value }))}
                      placeholder="Value internal"
                    />
                    {selectedMasterConfig.hasColor ? (
                      <input
                        type="color"
                        value={draftItem.color || "#38bdf8"}
                        onChange={event => setDraftItem(prev => ({ ...prev, color: event.target.value }))}
                        className="h-10 w-full rounded-lg border border-white/10 bg-slate-900 p-1"
                      />
                    ) : (
                      <div className="flex items-center rounded-lg border border-dashed border-white/10 px-3 text-xs text-slate-500">
                        Tanpa warna
                      </div>
                    )}

                    <div className="md:col-span-3 flex flex-wrap gap-2">
                      <Button onClick={handleSaveMasterItem} className="rounded-xl">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {editingId ? "Simpan Perubahan" : "Tambah Item"}
                      </Button>
                      {editingId ? (
                        <Button
                          variant="outline"
                          className="rounded-xl border-white/10 bg-white/5"
                          onClick={() => {
                            setEditingId(null);
                            setDraftItem(getDefaultDraft(selectedMasterConfig));
                          }}
                        >
                          Batal Edit
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentMasterItems.map(item => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {selectedMasterConfig.hasColor ? (
                            <span
                              className="h-4 w-4 rounded-full border border-white/20"
                              style={{ backgroundColor: item.color || "#38bdf8" }}
                            />
                          ) : null}
                          <div>
                            <p className="text-sm font-medium text-slate-100">{item.label}</p>
                            <p className="text-xs text-slate-400">{item.value}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg border-white/10 bg-white/5 px-2"
                            onClick={() => handleMoveMasterItem(item.id, "up")}
                            title="Naikan"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg border-white/10 bg-white/5 px-2"
                            onClick={() => handleMoveMasterItem(item.id, "down")}
                            title="Turunkan"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-lg border-white/10 bg-white/5"
                            onClick={() => handleEditMasterItem(item)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-lg border-red-400/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                            onClick={() => handleDeleteMasterItem(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
