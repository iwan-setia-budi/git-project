import { useState, useEffect } from "react";
import {
  Wallet,
  Bell,
  Calendar,
  HardDrive,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getMonthlySummary, getExpenseCategories } from "@/services/financeService";
import { getUpcomingReminders } from "@/services/reminderService";
import { getTodaySchedules } from "@/services/scheduleService";
import { getFolders } from "@/services/driveService";
import { getFamilyData } from "@/services/familyService";

export default function FamilyDashboard() {
  const [monthlySummary, setMonthlySummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [familyData, setFamilyData] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    // Load monthly summary
    const now = new Date();
    const summary = getMonthlySummary(now.getFullYear(), now.getMonth());
    setMonthlySummary(summary);

    // Load upcoming reminders
    setUpcomingReminders(getUpcomingReminders(7));

    // Load today's schedules
    setTodaySchedules(getTodaySchedules());

    // Load family data
    setFamilyData(getFamilyData());

    // Get recent files
    const folders = getFolders();
    const allFiles = [];
    folders.forEach(f => {
      if (f.files) {
        allFiles.push(...f.files.map(file => ({ ...file, folderName: f.name })));
      }
    });
    setRecentFiles(allFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-7xl p-5 sm:p-7 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-sky-300">Selamat datang di</p>
          <h1 className="mt-1 text-4xl font-bold">
            {familyData?.familyName || "Keluarga Anda"}
          </h1>
          <p className="mt-2 text-slate-300">
            Kelola keuangan, reminder, jadwal, dan file keluarga dalam satu tempat
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="rounded-[1.75rem] backdrop-blur-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Saldo Bulan Ini</p>
                  <h3 className="mt-3 text-2xl font-bold">
                    Rp {monthlySummary.balance.toLocaleString("id-ID")}
                  </h3>
                </div>
                <Wallet className="h-8 w-8 text-sky-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] backdrop-blur-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Pengeluaran</p>
                  <h3 className="mt-3 text-2xl font-bold">
                    Rp {monthlySummary.expense.toLocaleString("id-ID")}
                  </h3>
                </div>
                <ArrowDownLeft className="h-8 w-8 text-red-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] backdrop-blur-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Reminder Terdekat</p>
                  <h3 className="mt-3 text-2xl font-bold">
                    {upcomingReminders.length}
                  </h3>
                </div>
                <Bell className="h-8 w-8 text-yellow-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] backdrop-blur-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Jadwal Hari Ini</p>
                  <h3 className="mt-3 text-2xl font-bold">
                    {todaySchedules.length}
                  </h3>
                </div>
                <Calendar className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Upcoming Reminders */}
            <Card className="rounded-2xl backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Reminder Terdekat</h2>
                  <Link to="/reminder" className="text-sm text-sky-400 hover:text-sky-300">
                    Lihat Semua
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcomingReminders.length > 0 ? (
                    upcomingReminders.slice(0, 3).map(reminder => (
                      <div
                        key={reminder.id}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{reminder.title}</h3>
                            <p className="text-sm text-slate-400">
                              {new Date(reminder.date).toLocaleDateString("id-ID")} -
                              {reminder.time}
                            </p>
                          </div>
                          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                            {reminder.category}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">Tidak ada reminder terdekat</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card className="rounded-2xl backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Jadwal Hari Ini</h2>
                  <Link to="/schedule" className="text-sm text-sky-400 hover:text-sky-300">
                    Lihat Semua
                  </Link>
                </div>
                <div className="space-y-3">
                  {todaySchedules.length > 0 ? (
                    todaySchedules.slice(0, 3).map(schedule => (
                      <div
                        key={schedule.id}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{schedule.title}</h3>
                            <p className="text-sm text-slate-400">
                              {schedule.startTime} - {schedule.endTime} • {schedule.member}
                            </p>
                          </div>
                          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                            {schedule.category}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">Tidak ada jadwal hari ini</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Files */}
            <Card className="rounded-2xl backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">File Terbaru</h2>
                  <Link to="/drive" className="text-sm text-sky-400 hover:text-sky-300">
                    Kelola
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentFiles.length > 0 ? (
                    recentFiles.slice(0, 5).map(file => (
                      <div key={file.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-sm">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{file.name}</p>
                          <p className="text-xs text-slate-400">{file.folderName}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">Tidak ada file</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="rounded-2xl backdrop-blur-xl">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Aksi Cepat</h2>
                <div className="space-y-2">
                  <Link to="/finance/add-transaction" className="block">
                    <Button className="w-full" variant="outline">
                      Tambah Transaksi
                    </Button>
                  </Link>
                  <Link to="/reminder/add" className="block">
                    <Button className="w-full" variant="outline">
                      Tambah Reminder
                    </Button>
                  </Link>
                  <Link to="/schedule/add" className="block">
                    <Button className="w-full" variant="outline">
                      Tambah Jadwal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Family Members */}
            <Card className="rounded-2xl backdrop-blur-xl">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Anggota Keluarga</h2>
                <div className="space-y-2">
                  {familyData?.members?.slice(0, 4).map(member => (
                    <div key={member.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-slate-400">{member.role}</p>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-xs font-bold">
                        {member.name.charAt(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
