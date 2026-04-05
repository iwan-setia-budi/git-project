import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, Users } from "lucide-react";

const highlights = [
  {
    title: "Lightning Fast",
    desc: "UI responsif, loading ringan, dan pengalaman pengguna terasa instan.",
    icon: Sparkles,
  },
  {
    title: "Security First",
    desc: "Akses terproteksi, kontrol role jelas, dan audit activity yang konsisten.",
    icon: ShieldCheck,
  },
  {
    title: "Scale With Team",
    desc: "Tumbuh dari startup sampai enterprise tanpa perlu rewrite fondasi aplikasi.",
    icon: Users,
  },
];

export default function IndexPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(20,184,166,0.32),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(14,165,233,0.24),transparent_28%),radial-gradient(circle_at_20%_90%,rgba(249,115,22,0.18),transparent_26%)]" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="text-xl font-black tracking-tight">
            MyApp
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            <a href="#fitur" className="transition hover:text-white">Fitur</a>
            <a href="#why" className="transition hover:text-white">Keunggulan</a>
            <Link to="/analytics" className="transition hover:text-white">Analytics</Link>
            <Link to="/reports" className="transition hover:text-white">Reports</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
              Login
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-300 via-cyan-300 to-amber-300 px-4 py-2 text-sm font-bold text-slate-900 shadow-[0_8px_30px_rgba(45,212,191,0.35)] transition hover:scale-[1.02]"
            >
              Masuk Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Digital Product Platform</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Bangun Produk yang Terlihat Premium, Terasa Cepat, dan Siap Scale.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Landing page ini sekarang fokus ke visual yang lebih tegas dengan kontras kuat, hierarki teks jelas,
            dan CTA yang langsung membawa user ke flow utama aplikasi.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-300 via-cyan-300 to-amber-300 px-6 py-3 font-bold text-slate-900 shadow-[0_8px_24px_rgba(34,211,238,0.34)] transition hover:-translate-y-0.5"
            >
              Start Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/users"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Lihat User Management
            </Link>
          </div>
        </section>

        <section id="fitur" className="mt-8 grid gap-5 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-slate-900/65 p-6 transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <div className="inline-flex rounded-2xl bg-cyan-300/15 p-3 text-cyan-200 transition group-hover:bg-cyan-300/25">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.desc}</p>
              </article>
            );
          })}
        </section>

        <section id="why" className="mt-8 grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">Why Teams Choose MyApp</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">One Platform for Ops, Product, and Growth</h2>
            <p className="mt-4 text-slate-300">
              Navigasi cepat ke Analytics, Reports, Billing, sampai Settings dalam satu struktur yang konsisten dan
              enak dipakai sehari-hari.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-cyan-300">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm font-semibold">Analytics Ready</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">Pantau performa dengan panel visual yang lebih kaya dan actionable.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-amber-300">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm font-semibold">Workflow Friendly</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">Transisi antar halaman lebih jelas, dari landing ke dashboard sampai report export.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-400">
        © 2026 MyApp. Crafted for high-performance teams.
      </footer>
    </div>
  );
}
