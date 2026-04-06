import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  FolderOpen,
  PiggyBank,
  ShieldCheck,
  Users,
  Zap,
  CheckCircle2,
  Star,
  BarChart3,
  FileText,
  Target,
  Layers,
  ChevronDown,
  Sparkles,
  Lock,
  Smartphone,
  Globe,
} from "lucide-react";

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const modules = [
  {
    id: "fitur-keuangan",
    label: "Keuangan",
    icon: PiggyBank,
    accent: "from-emerald-400 to-teal-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    iconColor: "text-emerald-300",
    title: "Keuangan Keluarga Terpadu",
    desc: "Catat pemasukan dan pengeluaran, lihat laporan bulanan, pantau tabungan, serta analisis kategori pengeluaran.",
    features: [
      "Catat transaksi income dan expense",
      "Laporan bulanan dan tahunan",
      "Target dan progres tabungan",
      "Analitik kategori pengeluaran",
      "Export CSV laporan",
    ],
    link: "/finance",
  },
  {
    id: "fitur-reminder",
    label: "Reminder",
    icon: Bell,
    accent: "from-amber-400 to-orange-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    iconColor: "text-amber-300",
    title: "Pengingat Keluarga Otomatis",
    desc: "Atur reminder berulang untuk tagihan, agenda penting, dan momen keluarga agar tidak terlewat.",
    features: [
      "Reminder berulang otomatis",
      "Kategori reminder fleksibel",
      "Kalender visual bulanan",
      "Filter reminder per anggota",
      "Countdown waktu jatuh tempo",
    ],
    link: "/reminder",
  },
  {
    id: "fitur-jadwal",
    label: "Jadwal",
    icon: CalendarDays,
    accent: "from-violet-400 to-indigo-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/25",
    iconColor: "text-violet-300",
    title: "Jadwal dan Agenda Keluarga",
    desc: "Kelola jadwal seluruh anggota keluarga dalam satu kalender dengan tampilan harian dan bulanan.",
    features: [
      "Jadwal per anggota keluarga",
      "Kalender bulanan interaktif",
      "Jadwal berulang (rekurensi)",
      "Agenda hari ini di dashboard",
      "Filter kategori kegiatan",
    ],
    link: "/schedule",
  },
  {
    id: "fitur-drive",
    label: "Drive",
    icon: FolderOpen,
    accent: "from-sky-400 to-cyan-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/25",
    iconColor: "text-sky-300",
    title: "Penyimpanan Dokumen Keluarga",
    desc: "Simpan, cari, dan kelola dokumen penting keluarga dengan folder, tag, serta tipe file yang terstruktur.",
    features: [
      "Folder terorganisir",
      "Tag dan pencarian cepat",
      "Preview berbagai tipe file",
      "Upload file mudah",
      "Akses file terbaru di dashboard",
    ],
    link: "/drive",
  },
];

const steps = [
  {
    step: "01",
    title: "Masuk Dashboard",
    desc: "Lihat ringkasan keuangan, reminder aktif, dan jadwal hari ini dalam satu layar.",
  },
  {
    step: "02",
    title: "Atur Keluarga",
    desc: "Tambahkan anggota keluarga dan sesuaikan kategori master data sesuai kebutuhan.",
  },
  {
    step: "03",
    title: "Kelola Harian",
    desc: "Input transaksi, reminder, jadwal, dan dokumen penting secara rutin.",
  },
];

const whys = [
  {
    icon: ShieldCheck,
    color: "text-emerald-300 bg-emerald-500/15",
    title: "Privasi Data Lokal",
    desc: "Data disimpan lokal di perangkat, tanpa ketergantungan server eksternal.",
  },
  {
    icon: Layers,
    color: "text-sky-300 bg-sky-500/15",
    title: "Empat Modul Lengkap",
    desc: "Keuangan, Reminder, Jadwal, dan Drive terintegrasi dalam satu aplikasi.",
  },
  {
    icon: Zap,
    color: "text-amber-300 bg-amber-500/15",
    title: "Cepat dan Responsif",
    desc: "Pengalaman aplikasi ringan dan cepat di desktop maupun mobile.",
  },
  {
    icon: Users,
    color: "text-violet-300 bg-violet-500/15",
    title: "Multi Anggota",
    desc: "Setiap data dapat dikaitkan ke anggota keluarga agar lebih rapi.",
  },
  {
    icon: BarChart3,
    color: "text-pink-300 bg-pink-500/15",
    title: "Analitik Lengkap",
    desc: "Pantau tren bulanan, top kategori, dan performa finansial dengan cepat.",
  },
  {
    icon: Target,
    color: "text-teal-300 bg-teal-500/15",
    title: "Master Data Fleksibel",
    desc: "Kategori bisa tambah, edit, hapus, dan urutkan sesuai kebutuhan keluarga.",
  },
];

const stats = [
  { value: "4", label: "Modul Terintegrasi" },
  { value: "20+", label: "Fitur Utama" },
  { value: "100%", label: "Data Lokal" },
  { value: "24/7", label: "Siap Dipakai" },
];

export default function IndexPage() {
  return (
    <div className="relative bg-slate-950 text-white" style={{ scrollBehavior: "smooth" }}>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(20,184,166,0.2),transparent_35%),radial-gradient(circle_at_85%_18%,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_20%_90%,rgba(99,102,241,0.12),transparent_28%)]" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button onClick={() => scrollToSection("hero")} className="text-xl font-black tracking-tight">
            Family<span className="text-cyan-400">App</span>
          </button>

          <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <button onClick={() => scrollToSection("fitur")} className="transition hover:text-white">Fitur</button>
            <button onClick={() => scrollToSection("cara-kerja")} className="transition hover:text-white">Cara Kerja</button>
            <button onClick={() => scrollToSection("keunggulan")} className="transition hover:text-white">Keunggulan</button>
            <Link to="/finance" className="transition hover:text-white">Keuangan</Link>
            <Link to="/reminder" className="transition hover:text-white">Reminder</Link>
            <Link to="/schedule" className="transition hover:text-white">Jadwal</Link>
            <Link to="/drive" className="transition hover:text-white">Drive</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
              Masuk
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-300 px-4 py-2 text-sm font-black !text-slate-950 shadow-[0_4px_20px_rgba(45,212,191,0.35)] transition hover:scale-[1.03]"
            >
              Masuk Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section id="hero" className="px-5 pb-20 pt-20 sm:px-8 sm:pt-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Family Organization Platform</span>
              </div>

              <h1 className="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-5xl font-black leading-tight tracking-tight text-transparent sm:text-7xl">
                Satu Aplikasi
                <br />
                <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">untuk Seluruh</span>
                <br />
                Keluarga Anda
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Pantau keuangan, atur reminder, kelola jadwal harian, dan simpan dokumen penting keluarga dalam satu dashboard yang rapi dan modern.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-300 px-8 py-4 text-base font-black !text-slate-950 shadow-[0_8px_32px_rgba(34,211,238,0.4)] transition hover:-translate-y-0.5"
                >
                  Mulai Sekarang <ArrowRight className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => scrollToSection("fitur")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Lihat Fitur <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mx-auto mt-16 max-w-4xl rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
              <div className="grid gap-3 sm:grid-cols-4">
                {[
                  { label: "Saldo Bulan Ini", value: "Rp 4.500.000", color: "border-sky-500/30 bg-sky-500/8 text-sky-300" },
                  { label: "Pemasukan", value: "Rp 8.000.000", color: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300" },
                  { label: "Pengeluaran", value: "Rp 3.500.000", color: "border-rose-500/30 bg-rose-500/8 text-rose-300" },
                  { label: "Jadwal Hari Ini", value: "4 Kegiatan", color: "border-violet-500/30 bg-violet-500/8 text-violet-300" },
                ].map(card => (
                  <div key={card.label} className={`rounded-2xl border px-4 py-3 ${card.color}`}>
                    <p className="text-xs opacity-70">{card.label}</p>
                    <p className="mt-1 text-base font-black">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-white/3 px-5 py-10 sm:px-8">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(item => (
              <div key={item.label} className="text-center">
                <p className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-4xl font-black text-transparent">{item.value}</p>
                <p className="mt-1 text-sm text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="fitur" className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">Modul Lengkap</p>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Semua yang Keluarga Butuhkan</h2>
              <p className="mt-4 text-slate-400">Empat modul terintegrasi untuk operasional keluarga sehari-hari.</p>
            </div>

            <div className="space-y-6">
              {modules.map((mod, i) => {
                const Icon = mod.icon;
                const reverse = i % 2 !== 0;
                return (
                  <div key={mod.id} className={`rounded-3xl border ${mod.border} ${mod.bg} p-8 sm:p-10`}>
                    <div className={`flex flex-col gap-8 ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
                      <div className="flex-1">
                        <div className={`mb-4 inline-flex items-center gap-2 rounded-full border ${mod.border} px-3 py-1.5`}>
                          <Icon className={`h-4 w-4 ${mod.iconColor}`} />
                          <span className={`text-xs font-bold ${mod.iconColor}`}>{mod.label}</span>
                        </div>
                        <h3 className="text-2xl font-black text-white sm:text-3xl">{mod.title}</h3>
                        <p className="mt-3 text-slate-400">{mod.desc}</p>
                        <ul className="mt-5 space-y-2">
                          {mod.features.map(feature => (
                            <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-300">
                              <CheckCircle2 className={`h-4 w-4 shrink-0 ${mod.iconColor}`} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Link
                          to={mod.link}
                          className={`mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${mod.accent} px-5 py-2.5 text-sm font-black text-slate-900 shadow-lg transition hover:-translate-y-0.5`}
                        >
                          Buka Modul <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>

                      <div className="flex flex-1 items-center justify-center">
                        <div className={`w-full max-w-sm rounded-2xl border ${mod.border} bg-slate-900/60 p-5`}>
                          <div className={`mb-3 flex items-center gap-3 rounded-xl ${mod.bg} px-4 py-3`}>
                            <Icon className={`h-5 w-5 ${mod.iconColor}`} />
                            <span className="text-sm font-bold text-white">{mod.label}</span>
                          </div>
                          <div className="space-y-2">
                            {mod.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center gap-3 rounded-lg bg-white/4 px-3 py-2.5">
                                <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${mod.accent}`} />
                                <span className="text-xs text-slate-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="cara-kerja" className="border-y border-white/8 bg-white/3 px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">Cara Kerja</p>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Mulai dalam 3 Langkah</h2>
              <p className="mt-4 text-slate-400">Langsung pakai tanpa setup rumit.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {steps.map(item => (
                <div key={item.step} className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 transition hover:border-violet-400/30">
                  <p className="mb-4 text-6xl font-black text-white/10">{item.step}</p>
                  <h3 className="text-xl font-black text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="keunggulan" className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-400">Keunggulan</p>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Kenapa Memilih FamilyApp</h2>
              <p className="mt-4 text-slate-400">Dirancang untuk kebutuhan keluarga modern sehari-hari.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {whys.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-white/20">
                    <div className={`mb-4 inline-flex rounded-xl p-2.5 ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-white/3 px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Dibangun dengan Teknologi Modern</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: Globe, label: "React + Vite", color: "text-sky-300 bg-sky-500/10 border-sky-500/25" },
                { icon: Smartphone, label: "Responsif Mobile", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25" },
                { icon: Lock, label: "Data Lokal", color: "text-amber-300 bg-amber-500/10 border-amber-500/25" },
                { icon: Zap, label: "Performa Tinggi", color: "text-violet-300 bg-violet-500/10 border-violet-500/25" },
                { icon: Star, label: "UI Premium", color: "text-pink-300 bg-pink-500/10 border-pink-500/25" },
                { icon: FileText, label: "Export CSV", color: "text-teal-300 bg-teal-500/10 border-teal-500/25" },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${item.color}`}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-28 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-12 shadow-[0_0_80px_rgba(34,211,238,0.15)]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Gratis</span>
              </div>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Siap Mengatur Keluarga Lebih Rapi?</h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">Mulai kelola keuangan, reminder, jadwal, dan dokumen keluarga sekarang juga.</p>
              <div className="mt-10">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-300 px-10 py-4 text-lg font-black !text-slate-950 shadow-[0_8px_40px_rgba(34,211,238,0.45)] transition hover:-translate-y-1"
                >
                  Mulai Sekarang <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-3 text-xl font-black">Family<span className="text-cyan-400">App</span></p>
              <p className="text-sm leading-6 text-slate-400">Platform manajemen keluarga modern: keuangan, reminder, jadwal, dan drive dalam satu aplikasi.</p>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-300">Modul</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/finance" className="transition hover:text-white">Keuangan</Link></li>
                <li><Link to="/reminder" className="transition hover:text-white">Reminder</Link></li>
                <li><Link to="/schedule" className="transition hover:text-white">Jadwal</Link></li>
                <li><Link to="/drive" className="transition hover:text-white">Drive</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-300">Navigasi</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => scrollToSection("fitur")} className="transition hover:text-white">Fitur</button></li>
                <li><button onClick={() => scrollToSection("cara-kerja")} className="transition hover:text-white">Cara Kerja</button></li>
                <li><button onClick={() => scrollToSection("keunggulan")} className="transition hover:text-white">Keunggulan</button></li>
                <li><Link to="/settings" className="transition hover:text-white">Pengaturan</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-300">Akun</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/login" className="transition hover:text-white">Masuk</Link></li>
                <li><Link to="/dashboard" className="transition hover:text-white">Dashboard</Link></li>
                <li><Link to="/family-profile" className="transition hover:text-white">Profil Keluarga</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/8 pt-6 text-center text-xs text-slate-500">
            © 2026 FamilyApp. Dibuat untuk manajemen keluarga.
          </div>
        </div>
      </footer>
    </div>
  );
}
