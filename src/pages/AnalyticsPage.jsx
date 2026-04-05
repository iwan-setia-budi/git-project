import { useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Globe,
  MousePointerClick,
  Search,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast, downloadCSV } from "@/utils/toast";

const summaryStats = [
  {
    title: "Total Visitors",
    value: "184.2K",
    growth: "+14.8%",
    icon: Users,
    note: "Compared to last 30 days",
  },
  {
    title: "Conversion Rate",
    value: "7.42%",
    growth: "+1.9%",
    icon: TrendingUp,
    note: "Strong acquisition performance",
  },
  {
    title: "Avg. Session",
    value: "5m 18s",
    growth: "+12.1%",
    icon: MousePointerClick,
    note: "Higher engagement quality",
  },
  {
    title: "Sales Volume",
    value: "$92.8K",
    growth: "+10.4%",
    icon: ShoppingBag,
    note: "Revenue from tracked channels",
  },
];

const trafficSources = [
  { source: "Organic Search", visitors: "58.4K", percent: 78 },
  { source: "Paid Ads", visitors: "39.1K", percent: 56 },
  { source: "Social Media", visitors: "28.7K", percent: 44 },
  { source: "Direct", visitors: "22.5K", percent: 31 },
  { source: "Referral", visitors: "17.3K", percent: 24 },
];

const topPages = [
  { page: "/dashboard", views: "28.4K", bounce: "18%", conversion: "9.4%" },
  { page: "/pricing", views: "19.7K", bounce: "26%", conversion: "7.8%" },
  { page: "/analytics", views: "16.3K", bounce: "21%", conversion: "8.5%" },
  { page: "/login", views: "12.8K", bounce: "14%", conversion: "11.1%" },
  { page: "/contact-sales", views: "8.6K", bounce: "29%", conversion: "6.2%" },
];

const devices = [
  { label: "Desktop", value: 64 },
  { label: "Mobile", value: 27 },
  { label: "Tablet", value: 9 },
];

const lineData = [42, 51, 48, 60, 66, 58, 71, 76, 82, 79, 91, 96];
const revenueData = [28, 34, 31, 42, 48, 46, 58, 63, 68, 72, 78, 84];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function PremiumAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleDetailedView = () => {
    showToast("Detailed analytics view opened - Showing 12-month trend analysis");
  };

  const handleExportAnalytics = () => {
    const analyticsData = summaryStats.map(stat => ({
      Title: stat.title,
      Value: stat.value,
      Growth: stat.growth
    }));
    downloadCSV(analyticsData, "analytics-summary.csv");
    showToast("Analytics data exported successfully!");
  };

  const handleOpenFullAnalytics = () => {
    showToast("Opening full analytics dashboard - Advanced metrics and reports");
  };

  const maxLine = Math.max(...lineData);
  const maxRevenue = Math.max(...revenueData);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_22%)]" />

      <div className="mx-auto max-w-7xl p-5 sm:p-7 lg:p-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-sky-300">Analytics Workspace</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Performance Analytics Overview</h1>
              <p className="mt-2 text-sm text-slate-300">
                Insight premium untuk memantau traffic, konversi, revenue, dan performa channel dalam satu halaman.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
              <div className="relative min-w-0 flex-1 sm:min-w-[240px] sm:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search analytics..."
                  className="rounded-2xl border-white/10 bg-slate-950/40 pl-10 text-white placeholder:text-slate-400"
                />
              </div>
              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 Days
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button className="rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 hover:opacity-95">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="rounded-[1.75rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-300">{stat.title}</p>
                      <h3 className="mt-3 text-3xl font-semibold tracking-tight">{stat.value}</h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-indigo-500/20">
                      <Icon className="h-5 w-5 text-sky-300" />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                      {stat.growth}
                    </span>
                    <p className="text-right text-xs text-slate-400">{stat.note}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 overflow-hidden xl:grid-cols-[1.55fr_1fr]">
          <Card className="min-w-0 rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-300">Traffic Trend</p>
                  <h2 className="mt-1 text-2xl font-semibold">Visitor Growth</h2>
                </div>
                <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={handleDetailedView}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Detailed View
                </Button>
              </div>

              <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5">
                <div className="flex h-[320px] min-w-full items-end gap-4 overflow-x-auto">
                  {lineData.map((point, index) => {
                    const height = (point / maxLine) * 240;
                    const revHeight = (revenueData[index] / maxRevenue) * 180;
                    return (
                      <div key={months[index]} className="flex flex-1 flex-col items-center justify-end gap-3">
                        <div className="relative flex w-full items-end justify-center gap-2">
                          <div
                            className="w-3 rounded-t-full bg-white/20"
                            style={{ height: `${revHeight}px` }}
                          />
                          <div
                            className="w-4 rounded-t-full bg-gradient-to-t from-sky-500 via-cyan-400 to-indigo-400 shadow-lg"
                            style={{ height: `${height}px` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">{months[index]}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500" />
                    Visitors
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-white/30" />
                    Revenue Influence
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-0 rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <p className="text-sm text-sky-300">Device Distribution</p>
              <h2 className="mt-1 text-2xl font-semibold">Audience Segments</h2>

              <div className="mt-8 flex items-center justify-center">
                <div className="relative flex h-56 w-56 flex-shrink-0 items-center justify-center rounded-full border-[18px] border-sky-400/25">
                  <div className="absolute inset-0 rounded-full border-[18px] border-transparent border-t-sky-400 border-r-indigo-400 border-b-emerald-400/70" />
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Total Reach</p>
                    <h3 className="mt-1 text-3xl font-semibold">184K</h3>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {devices.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="text-white">{item.value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 overflow-hidden xl:grid-cols-[1fr_1fr]">
          <Card className="min-w-0 rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-300">Traffic Sources</p>
                  <h2 className="mt-1 text-2xl font-semibold">Channel Performance</h2>
                </div>
                <Globe className="h-5 w-5 text-slate-400" />
              </div>

              <div className="mt-6 space-y-5">
                {trafficSources.map((item) => (
                  <div key={item.source}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-200">{item.source}</span>
                      <span className="text-slate-400">{item.visitors}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-0 rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-300">Top Performing Pages</p>
                  <h2 className="mt-1 text-2xl font-semibold">Page Insights</h2>
                </div>
                <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                  View Report
                </Button>
              </div>

              <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-white/10\">
                <div className="grid grid-cols-4 min-w-full bg-white/10 px-5 py-4 text-sm text-slate-300\">
                  <span>Page</span>
                  <span>Views</span>
                  <span>Bounce</span>
                  <span>Conversion</span>
                </div>
                {topPages.map((item) => (
                  <div key={item.page} className="grid grid-cols-4 items-center border-t border-white/10 px-5 py-4 text-sm\">
                    <span className="font-medium\">{item.page}</span>
                    <span className="text-slate-300\">{item.views}</span>
                    <span className="text-slate-300">{item.bounce}</span>
                    <span className="text-emerald-300">{item.conversion}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-sky-300">Executive Insight</p>
                  <h2 className="mt-1 text-2xl font-semibold">Performance Summary</h2>
                </div>
                <Button className="rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 hover:opacity-95" onClick={handleOpenFullAnalytics}>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Open Full Analytics
                </Button>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5">
                  <p className="text-sm text-slate-400">Best Growth Segment</p>
                  <h3 className="mt-2 text-xl font-semibold">Organic Search</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Channel ini menunjukkan performa paling stabil dengan volume traffic tertinggi dan conversion rate yang sehat.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5">
                  <p className="text-sm text-slate-400">Most Engaging Page</p>
                  <h3 className="mt-2 text-xl font-semibold">/login</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Bounce rate rendah dan conversion tinggi menunjukkan pengalaman halaman yang efektif dan terarah.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5">
                  <p className="text-sm text-slate-400">Recommended Action</p>
                  <h3 className="mt-2 text-xl font-semibold">Scale Paid Campaigns</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Perkuat iklan dengan landing page terbaik untuk meningkatkan conversion dan menjaga ROI tetap optimal.
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
