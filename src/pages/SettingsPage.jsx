import { useState } from "react";
import {
  Bell,
  Globe,
  Lock,
  Palette,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/utils/toast";

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

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("");

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
      </div>
    </div>
  );
}
