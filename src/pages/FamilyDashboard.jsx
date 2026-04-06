import { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  Bell,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  FileText,
  Image,
  File,
  Clock,
  Target,
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  Zap,
  FolderOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  getMonthlySummaryWithComparison,
  getFinanceAnalytics,
  getSavingsTarget,
} from "@/services/financeService";
import { getUpcomingReminders } from "@/services/reminderService";
import { getTodaySchedules } from "@/services/scheduleService";
import { getFolders } from "@/services/driveService";
import { getFamilyData } from "@/services/familyService";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Selamat Pagi";
  if (h < 15) return "Selamat Siang";
  if (h < 18) return "Selamat Sore";
  return "Selamat Malam";
}

function formatRp(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / 86400000);
  if (diff < 0) return null;
  if (diff === 0) return { label: "Hari ini", color: "text-rose-300 bg-rose-500/15 border-rose-400/30" };
  if (diff === 1) return { label: "Besok", color: "text-amber-300 bg-amber-500/15 border-amber-400/30" };
  return { label: `${diff} hari`, color: "text-sky-300 bg-sky-500/15 border-sky-400/30" };
}

function FileIcon({ name }) {
  const ext = name?.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
    return <Image className="h-4 w-4 text-pink-300" />;
  if (["pdf"].includes(ext))
    return <FileText className="h-4 w-4 text-red-300" />;
  if (["xlsx", "xls", "csv"].includes(ext))
    return <FileText className="h-4 w-4 text-emerald-300" />;
  if (["docx", "doc", "txt"].includes(ext))
    return <FileText className="h-4 w-4 text-blue-300" />;
  return <File className="h-4 w-4 text-slate-300" />;
}

export default function FamilyDashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, incomeDelta: 0, expenseDelta: 0 });
  const [analytics, setAnalytics] = useState({ transactionCount: 0, averageTransaction: 0, topExpenseCategory: null });
  const [savings, setSavings] = useState({ name: "", target: 0, current: 0 });
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [familyData, setFamilyData] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth();

    setSummary(getMonthlySummaryWithComparison(y, m));
    setAnalytics(getFinanceAnalytics(y, m));
    setSavings(getSavingsTarget() || { name: "", target: 0, current: 0 });
    setUpcomingReminders(getUpcomingReminders(14));
    setTodaySchedules(getTodaySchedules());
    setFamilyData(getFamilyData());

    const folders = getFolders();
    const allFiles = [];
    folders.forEach(f => {
      if (f.files) allFiles.push(...f.files.map(file => ({ ...file, folderName: f.name })));
    });
    setRecentFiles(allFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
  }, []);

  const spendingRate = summary.income > 0 ? Math.min(100, Math.round((summary.expense / summary.income) * 100)) : 0;
  const savingsProgress = savings.target > 0 ? Math.min(100, Math.round((savings.current / savings.target) * 100)) : 0;

  const monthName = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_30%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_bottom_center,rgba(16,185,129,0.09),transparent_30%)]" />

      <div className="mx-auto max-w-7xl p-5 sm:p-7 lg:p-8">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-400">{getGreeting()} 👋</p>
            <h1 className="mt-1 bg-gradient-to-r from-white via-sky-100 to-indigo-200 bg-clip-text text-4xl font-black tracking-tight text-transparent">
              {familyData?.familyName || "Keluarga Anda"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Kelola keuangan, reminder, jadwal, dan file keluarga dalam satu tempat
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
            <p className="font-mono text-2xl font-bold tracking-widest text-sky-300">{timeStr}</p>
            <p className="text-right text-xs text-slate-400">{dateStr}</p>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Balance */}
          <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all hover:border-sky-500/40 hover:bg-white/8">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-sky-400 to-cyan-300" />
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Saldo Bulan Ini</span>
                <span className="rounded-xl bg-sky-500/15 p-2 text-sky-300"><Wallet className="h-4 w-4" /></span>
              </div>
              <p className="text-2xl font-black text-white">{formatRp(summary.balance)}</p>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-slate-400">
                  <span>Spending rate</span>
                  <span className={spendingRate >= 80 ? "text-rose-300" : spendingRate >= 60 ? "text-amber-300" : "text-emerald-300"}>{spendingRate}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${spendingRate >= 80 ? "bg-gradient-to-r from-rose-500 to-red-400" : spendingRate >= 60 ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-gradient-to-r from-emerald-500 to-teal-400"}`}
                    style={{ width: `${spendingRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income */}
          <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all hover:border-emerald-500/40 hover:bg-white/8">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-400 to-teal-300" />
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pemasukan</span>
                <span className="rounded-xl bg-emerald-500/15 p-2 text-emerald-300"><ArrowUpRight className="h-4 w-4" /></span>
              </div>
              <p className="text-2xl font-black text-white">{formatRp(summary.income)}</p>
              <div className="mt-3 flex items-center gap-2">
                {summary.incomeDelta >= 0
                  ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  : <TrendingDown className="h-3.5 w-3.5 text-rose-400" />}
                <span className={`text-xs font-semibold ${summary.incomeDelta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {summary.incomeDelta >= 0 ? "+" : ""}{summary.incomeDelta.toFixed(1)}% vs bulan lalu
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Expense */}
          <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all hover:border-rose-500/40 hover:bg-white/8">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-rose-400 to-red-300" />
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pengeluaran</span>
                <span className="rounded-xl bg-rose-500/15 p-2 text-rose-300"><ArrowDownLeft className="h-4 w-4" /></span>
              </div>
              <p className="text-2xl font-black text-white">{formatRp(summary.expense)}</p>
              <div className="mt-3 flex items-center gap-2">
                {summary.expenseDelta <= 0
                  ? <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                  : <TrendingUp className="h-3.5 w-3.5 text-rose-400" />}
                <span className={`text-xs font-semibold ${summary.expenseDelta <= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {summary.expenseDelta >= 0 ? "+" : ""}{summary.expenseDelta.toFixed(1)}% vs bulan lalu
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all hover:border-violet-500/40 hover:bg-white/8">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-400 to-indigo-300" />
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Aktivitas</span>
                <span className="rounded-xl bg-violet-500/15 p-2 text-violet-300"><Calendar className="h-4 w-4" /></span>
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-3xl font-black text-white">{todaySchedules.length}</p>
                  <p className="text-xs text-slate-400">Jadwal hari ini</p>
                </div>
                <div className="mb-1 h-8 w-px bg-white/10" />
                <div>
                  <p className="text-3xl font-black text-white">{upcomingReminders.length}</p>
                  <p className="text-xs text-slate-400">Reminder pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Analytics Mini Row ── */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
            <span className="rounded-lg bg-sky-500/15 p-1.5 text-sky-300"><BarChart3 className="h-4 w-4" /></span>
            <div>
              <p className="text-xs text-slate-400">Transaksi Bulan Ini</p>
              <p className="text-sm font-bold text-white">{analytics.transactionCount} transaksi</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
            <span className="rounded-lg bg-amber-500/15 p-1.5 text-amber-300"><Zap className="h-4 w-4" /></span>
            <div>
              <p className="text-xs text-slate-400">Rata-rata Transaksi</p>
              <p className="text-sm font-bold text-white">{formatRp(analytics.averageTransaction)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
            <span className="rounded-lg bg-rose-500/15 p-1.5 text-rose-300"><Sparkles className="h-4 w-4" /></span>
            <div>
              <p className="text-xs text-slate-400">Top Kategori</p>
              <p className="text-sm font-bold capitalize text-white">{analytics.topExpenseCategory?.[0] || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
            <span className="rounded-lg bg-teal-500/15 p-1.5 text-teal-300"><Target className="h-4 w-4" /></span>
            <div>
              <p className="text-xs text-slate-400">Progres Tabungan</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">{savingsProgress}%</p>
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all" style={{ width: `${savingsProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left col-span-2 */}
          <div className="space-y-6 lg:col-span-2">

            {/* Today's Schedule */}
            <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-violet-500/15 p-1.5 text-violet-300"><Calendar className="h-4 w-4" /></span>
                    <h2 className="font-bold text-white">Jadwal Hari Ini</h2>
                    {todaySchedules.length > 0 && (
                      <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-300">{todaySchedules.length}</span>
                    )}
                  </div>
                  <Link to="/schedule" className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300">
                    Lihat Semua <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {todaySchedules.length > 0 ? (
                    todaySchedules.slice(0, 4).map(schedule => (
                      <div key={schedule.id} className="group flex items-center gap-4 rounded-xl border border-white/8 bg-white/4 p-4 transition-all hover:border-white/15 hover:bg-white/7">
                        <div className="flex flex-col items-center">
                          <span className="rounded-lg bg-white/10 px-2 py-1 font-mono text-xs font-bold text-slate-300">{schedule.startTime}</span>
                          <div className="my-1 w-px flex-1 bg-white/10" style={{ minHeight: "8px" }} />
                          <span className="rounded-lg bg-white/8 px-2 py-0.5 font-mono text-xs text-slate-500">{schedule.endTime}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-white">{schedule.title}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-[10px] font-bold">
                              {schedule.member?.charAt(0) || "?"}
                            </div>
                            <span className="text-xs text-slate-400">{schedule.member}</span>
                          </div>
                        </div>
                        <span
                          className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-xs font-medium"
                          style={{ backgroundColor: (schedule.color || "#6366f1") + "22", color: schedule.color || "#a5b4fc", borderColor: (schedule.color || "#6366f1") + "44" }}
                        >
                          {schedule.category}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                      <Calendar className="h-8 w-8 text-slate-600" />
                      <p className="text-sm text-slate-500">Tidak ada jadwal hari ini</p>
                      <Link to="/schedule/add">
                        <Button variant="outline" className="mt-1 rounded-xl border-white/10 text-xs">
                          <PlusCircle className="mr-2 h-3 w-3" /> Tambah Jadwal
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Reminders */}
            <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-amber-500/15 p-1.5 text-amber-300"><Bell className="h-4 w-4" /></span>
                    <h2 className="font-bold text-white">Reminder Terdekat</h2>
                    {upcomingReminders.length > 0 && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">{upcomingReminders.length}</span>
                    )}
                  </div>
                  <Link to="/reminder" className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300">
                    Lihat Semua <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcomingReminders.length > 0 ? (
                    upcomingReminders.slice(0, 4).map(reminder => {
                      const countdown = daysUntil(reminder.date);
                      return (
                        <div key={reminder.id} className="group flex items-center gap-4 rounded-xl border border-white/8 bg-white/4 p-4 transition-all hover:border-white/15 hover:bg-white/7">
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-semibold text-white">{reminder.title}</p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {new Date(reminder.date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
                              {reminder.time ? ` · ${reminder.time}` : ""}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300 capitalize">
                              {reminder.category}
                            </span>
                            {countdown && (
                              <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${countdown.color}`}>
                                {countdown.label}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                      <Bell className="h-8 w-8 text-slate-600" />
                      <p className="text-sm text-slate-500">Tidak ada reminder terdekat</p>
                      <Link to="/reminder/add">
                        <Button variant="outline" className="mt-1 rounded-xl border-white/10 text-xs">
                          <PlusCircle className="mr-2 h-3 w-3" /> Tambah Reminder
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-lg bg-sky-500/15 p-1.5 text-sky-300"><Zap className="h-4 w-4" /></span>
                  <h2 className="font-bold text-white">Aksi Cepat</h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/finance/add-transaction">
                    <button className="group flex w-full flex-col items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 py-4 text-sm font-medium text-emerald-300 transition-all hover:border-emerald-400/40 hover:bg-emerald-500/15">
                      <ArrowUpRight className="h-5 w-5" />
                      <span className="text-xs">Transaksi</span>
                    </button>
                  </Link>
                  <Link to="/reminder/add">
                    <button className="group flex w-full flex-col items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/8 py-4 text-sm font-medium text-amber-300 transition-all hover:border-amber-400/40 hover:bg-amber-500/15">
                      <Bell className="h-5 w-5" />
                      <span className="text-xs">Reminder</span>
                    </button>
                  </Link>
                  <Link to="/schedule/add">
                    <button className="group flex w-full flex-col items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/8 py-4 text-sm font-medium text-violet-300 transition-all hover:border-violet-400/40 hover:bg-violet-500/15">
                      <Calendar className="h-5 w-5" />
                      <span className="text-xs">Jadwal</span>
                    </button>
                  </Link>
                  <Link to="/drive/upload">
                    <button className="group flex w-full flex-col items-center gap-2 rounded-xl border border-sky-500/20 bg-sky-500/8 py-4 text-sm font-medium text-sky-300 transition-all hover:border-sky-400/40 hover:bg-sky-500/15">
                      <FolderOpen className="h-5 w-5" />
                      <span className="text-xs">Upload File</span>
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Family Members */}
            <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-indigo-500/15 p-1.5 text-indigo-300"><Users className="h-4 w-4" /></span>
                    <h2 className="font-bold text-white">Anggota Keluarga</h2>
                  </div>
                  <Link to="/family-profile" className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300">
                    Kelola <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {familyData?.members?.length > 0 ? (
                    familyData.members.slice(0, 5).map((member, i) => {
                      const colors = ["from-sky-400 to-indigo-500", "from-emerald-400 to-teal-500", "from-rose-400 to-pink-500", "from-amber-400 to-orange-500", "from-violet-400 to-purple-500"];
                      return (
                        <div key={member.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 transition-all hover:bg-white/7">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${colors[i % colors.length]} text-xs font-bold text-white shadow`}>
                            {member.name?.charAt(0) || "?"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">{member.name}</p>
                            <p className="text-xs capitalize text-slate-400">{member.role}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="py-4 text-center text-sm text-slate-500">Belum ada anggota</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Files */}
            <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-pink-500/15 p-1.5 text-pink-300"><FolderOpen className="h-4 w-4" /></span>
                    <h2 className="font-bold text-white">File Terbaru</h2>
                  </div>
                  <Link to="/drive" className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300">
                    Kelola <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentFiles.length > 0 ? (
                    recentFiles.map(file => (
                      <div key={file.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 transition-all hover:bg-white/7">
                        <span className="shrink-0 rounded-lg bg-white/8 p-1.5"><FileIcon name={file.name} /></span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-slate-400">{file.folderName}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-sm text-slate-500">Tidak ada file</p>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
