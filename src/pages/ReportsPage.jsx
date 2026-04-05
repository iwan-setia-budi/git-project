import { useState } from "react";
import {
  Download,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast, downloadCSV } from "@/utils/toast";

const reportStats = [
  {
    title: "Total Reports",
    value: "128",
    note: "+12 this month",
    icon: FileText,
  },
  {
    title: "Generated",
    value: "94",
    note: "Ready to download",
    icon: FileBarChart,
  },
  {
    title: "Scheduled",
    value: "18",
    note: "Auto monthly reports",
    icon: Calendar,
  },
  {
    title: "Exports",
    value: "236",
    note: "+18.4% activity",
    icon: FileSpreadsheet,
  },
];

const reports = [
  {
    name: "Executive Performance Report",
    category: "Executive",
    format: "PDF",
    created: "08 Apr 2026",
    status: "Ready",
  },
  {
    name: "Monthly Revenue Summary",
    category: "Finance",
    format: "XLSX",
    created: "07 Apr 2026",
    status: "Ready",
  },
  {
    name: "Marketing Channel Analysis",
    category: "Marketing",
    format: "PDF",
    created: "06 Apr 2026",
    status: "Processing",
  },
  {
    name: "User Growth Breakdown",
    category: "Analytics",
    format: "CSV",
    created: "05 Apr 2026",
    status: "Ready",
  },
  {
    name: "Security Access Audit",
    category: "Security",
    format: "PDF",
    created: "03 Apr 2026",
    status: "Archived",
  },
];

const quickReports = [
  "Create Financial Report",
  "Generate User Activity Report",
  "Export Analytics Summary",
  "Open Archive Center",
];

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleNewReport = () => {
    showToast("Create New Report dialog opened - Choose template");
  };

  const handleExportReports = () => {
    const reportsData = reports.map(report => ({
      "Report ID": report.id,
      Title: report.title,
      Generated: report.created,
      Format: report.format
    }));
    downloadCSV(reportsData, "reports-list.csv");
    showToast("Reports list exported successfully!");
  };

  const handleFilterReports = () => {
    showToast("Filter panel opened - Select date range, type, or status");
  };

  const handleDownload = (reportId) => {
    showToast(`Downloading report ${reportId}...`);
  };

  const handleDeleteReport = (reportId) => {
    showToast(`Report ${reportId} marked for deletion (with confirmation)`);
  };

  const handleMoreActions = (reportId) => {
    showToast(`More actions menu for ${reportId} - Edit, Share, Archive`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-7xl p-5 sm:p-7 lg:p-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-sky-300">Reports Workspace</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Business Reports Center</h1>
              <p className="mt-2 text-sm text-slate-300">
                Kelola laporan, export data, dan dokumen penting dalam tampilan premium yang modern dan profesional.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search reports..."
                  className="rounded-2xl border-white/10 bg-slate-950/40 pl-10 text-white placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={handleFilterReports}>
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button className="rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 hover:opacity-95" onClick={handleNewReport}>
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reportStats.map((item) => {
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

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-300">Generated Reports</p>
                  <h2 className="mt-1 text-2xl font-semibold">Recent Documents</h2>
                </div>
                <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                  View Archive
                </Button>
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
                <div className="grid grid-cols-5 bg-white/10 px-5 py-4 text-sm text-slate-300">
                  <span>Name</span>
                  <span>Category</span>
                  <span>Format</span>
                  <span>Created</span>
                  <span>Status</span>
                </div>

                {reports
                  .filter(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.status.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-5 items-center border-t border-white/10 px-5 py-4 text-sm hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/60 border border-white/10">
                          <FileText className="h-4 w-4 text-sky-300" />
                        </div>
                        <span className="font-medium text-sky-300">{item.name}</span>
                      </div>
                      <span className="text-slate-300">{item.category}</span>
                      <span className="text-slate-300 font-semibold">{item.format}</span>
                      <span className="text-slate-300">{item.created}</span>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          item.status === 'Ready' ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300' :
                          item.status === 'Processing' ? 'border border-blue-400/20 bg-blue-400/10 text-blue-300' :
                          'border border-slate-400/20 bg-slate-400/10 text-slate-300'
                        }`}>
                          {item.status}
                        </span>
                        <button className="rounded-lg p-2 hover:bg-white/10 transition">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                
                {reports.filter(item =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.status.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="px-5 py-8 text-center text-slate-400">
                    No reports found matching "{searchTerm}"
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
              <CardContent className="p-6">
                <p className="text-sm text-sky-300">Quick Actions</p>
                <h2 className="mt-1 text-2xl font-semibold">Report Tools</h2>

                <div className="mt-6 grid gap-4">
                  {quickReports.map((item) => (
                    <button
                      key={item}
                      className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/30 px-4 py-4 text-left transition hover:bg-white/10"
                    >
                      <span>{item}</span>
                      <ArrowUpRight className="h-4 w-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
              <CardContent className="p-6">
                <p className="text-sm text-sky-300">Export Center</p>
                <h2 className="mt-1 text-2xl font-semibold">Download Summary</h2>

                <div className="mt-6 space-y-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Monthly Summary Pack</p>
                        <h3 className="mt-1 text-lg font-semibold">Executive Bundle</h3>
                      </div>
                      <Button className="rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 hover:opacity-95">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4">
                    <p className="text-sm text-slate-400">Automation Status</p>
                    <h3 className="mt-2 text-lg font-semibold">8 scheduled reports active</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Laporan bulanan, mingguan, dan executive snapshot berjalan otomatis dan siap dikirim.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
