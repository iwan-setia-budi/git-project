import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Clock3,
  Download,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showToast, downloadCSV } from "@/utils/toast";

const activityStats = [
  { title: "Events Today", value: "1,284", note: "Across all workspaces", icon: Activity },
  { title: "Security Alerts", value: "4", note: "Need verification", icon: ShieldCheck },
  { title: "Notifications", value: "38", note: "Unread updates", icon: Bell },
  { title: "Avg Response", value: "2m 14s", note: "Operational latency", icon: Clock3 },
];

const activityLog = [
  {
    title: "Role permissions updated",
    time: "08:42",
    detail: "Admin changed marketing workspace access level to Manager.",
  },
  {
    title: "Invoice exported",
    time: "08:15",
    detail: "Billing report for April 2026 exported as PDF.",
  },
  {
    title: "New device login",
    time: "07:56",
    detail: "A new Chrome session was detected from Jakarta.",
  },
  {
    title: "Analytics dashboard viewed",
    time: "07:21",
    detail: "Executive board opened monthly growth metrics.",
  },
];

export default function ActivityPage() {
  const [filterType, setFilterType] = useState("all");

  const handleDownloadActivity = () => {
    const activityData = activityLog.map(log => ({
      Title: log.title,
      Time: log.time,
      Detail: log.detail
    }));
    downloadCSV(activityData, "activity-log.csv");
    showToast("Activity log exported successfully!");
  };

  const handleExportFullReport = () => {
    showToast("Generating full activity report - PDF download will start soon");
  };

  const handleFilterActivity = () => {
    showToast("Filter panel opened - Select by event type, user, or date range");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-7xl p-5 sm:p-7 lg:p-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-sky-300">Activity Workspace</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Live Activity Center</h1>
              <p className="mt-2 text-sm text-slate-300">
                Pantau seluruh event penting, keamanan akun, dan jejak operasional tim secara real-time.
              </p>
            </div>
            <Button onClick={handleDownloadActivity}>
              <Download className="mr-2 h-4 w-4" />
              Export Activity Log
            </Button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {activityStats.map((item) => {
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

        <section className="mt-6">
          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-300">Recent Timeline</p>
                  <h2 className="mt-1 text-2xl font-semibold">Operational Activity Feed</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {activityLog.map((item) => (
                  <div
                    key={`${item.time}-${item.title}`}
                    className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="mt-3 text-xs text-slate-400">{item.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
