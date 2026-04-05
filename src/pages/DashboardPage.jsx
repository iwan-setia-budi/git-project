import {
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  Users,
  Wallet,
  Activity,
  ArrowUpRight,
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  LayoutDashboard,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stats = [
  {
    title: "Total Revenue",
    value: "$128,430",
    change: "+12.8%",
    icon: Wallet,
    note: "Compared to last month",
  },
  {
    title: "Active Users",
    value: "24,892",
    change: "+8.2%",
    icon: Users,
    note: "Realtime engagement growth",
  },
  {
    title: "Conversion Rate",
    value: "6.84%",
    change: "+1.4%",
    icon: TrendingUp,
    note: "Optimized acquisition funnel",
  },
  {
    title: "System Health",
    value: "99.98%",
    change: "Stable",
    icon: ShieldCheck,
    note: "Infrastructure running normally",
  },
];

const activities = [
  {
    title: "Enterprise plan upgraded",
    time: "10 minutes ago",
    desc: "PT Aurora Digital upgraded from Business to Enterprise.",
  },
  {
    title: "Monthly report generated",
    time: "32 minutes ago",
    desc: "Financial and user activity report has been exported successfully.",
  },
  {
    title: "Security review completed",
    time: "1 hour ago",
    desc: "No critical issues were found in the latest access audit.",
  },
  {
    title: "New team member invited",
    time: "Today, 08:40",
    desc: "A new manager account was invited to the workspace.",
  },
];

const projects = [
  { name: "Executive Overview", progress: 84, owner: "Marketing", status: "On Track" },
  { name: "Customer Analytics", progress: 68, owner: "Growth", status: "In Review" },
  { name: "Infrastructure Upgrade", progress: 92, owner: "Engineering", status: "Stable" },
  { name: "Q2 Financial Planning", progress: 58, owner: "Finance", status: "Pending" },
];

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", end: true },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Billing", icon: CreditCard, path: "/billing" },
  { label: "Activity", icon: Activity, path: "/activity" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 font-bold text-slate-950">
              S
            </div>
            <div>
              <p className="text-sm text-slate-300">Workspace</p>
              <h1 className="text-lg font-semibold">Sobat Suite</h1>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                      isActive
                        ? "border border-sky-400/20 bg-gradient-to-r from-sky-400/20 to-indigo-500/20 text-white shadow-lg"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <Card className="mt-8 rounded-[1.75rem] bg-gradient-to-br from-white/10 to-white/5">
            <CardContent className="p-5">
              <p className="text-sm text-sky-300">Premium Insight</p>
              <h2 className="mt-2 text-xl font-semibold leading-snug">
                Monitor every metric in one elegant workspace.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Designed for high-level reporting, executive visibility, and confident
                decision making.
              </p>
              <Button className="mt-5 w-full">Upgrade Experience</Button>
            </CardContent>
          </Card>
        </aside>

        <main className="p-5 sm:p-7 lg:p-8">
          <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-sky-300">Overview Dashboard</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                Welcome back, Primaya
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Here is your business performance summary for today.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search dashboard..."
                  className="pl-10"
                />
              </div>

              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                This Month
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="rounded-[1.75rem] backdrop-blur-xl">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-300">{stat.title}</p>
                        <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                          {stat.value}
                        </h3>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-indigo-500/20">
                        <Icon className="h-5 w-5 text-sky-300" />
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                        {stat.change}
                      </span>
                      <p className="text-xs text-slate-400">{stat.note}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sky-300">Performance Analytics</p>
                    <h3 className="mt-1 text-2xl font-semibold">Growth Overview</h3>
                  </div>
                  <Button variant="outline">Export Report</Button>
                </div>

                <div className="mt-8 grid h-[300px] grid-cols-12 items-end gap-3 rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5">
                  {[42, 58, 51, 67, 62, 80, 74, 88, 79, 96, 90, 104].map((v, i) => (
                    <div key={i} className="flex h-full flex-col items-center justify-end gap-2">
                      <div
                        className="w-full rounded-t-2xl bg-gradient-to-t from-sky-500 via-cyan-400 to-indigo-400 shadow-lg"
                        style={{ height: `${v * 2}px` }}
                      />
                      <span className="text-[10px] text-slate-400">
                        {[
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-sky-300">Recent Activity</p>
                <h3 className="mt-1 text-2xl font-semibold">Live Updates</h3>
                <div className="mt-6 space-y-4">
                  {activities.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {item.desc}
                          </p>
                        </div>
                        <ArrowUpRight className="mt-1 h-4 w-4 text-slate-400" />
                      </div>
                      <p className="mt-3 text-xs text-slate-400">{item.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sky-300">Project Tracking</p>
                    <h3 className="mt-1 text-2xl font-semibold">Operational Progress</h3>
                  </div>
                  <Button variant="outline">View All</Button>
                </div>

                <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
                  <div className="grid grid-cols-4 bg-white/10 px-5 py-4 text-sm text-slate-300">
                    <span>Project</span>
                    <span>Owner</span>
                    <span>Progress</span>
                    <span>Status</span>
                  </div>
                  {projects.map((project) => (
                    <div
                      key={project.name}
                      className="grid grid-cols-4 items-center border-t border-white/10 px-5 py-4 text-sm"
                    >
                      <span className="font-medium">{project.name}</span>
                      <span className="text-slate-300">{project.owner}</span>
                      <div className="pr-4">
                        <div className="h-2.5 rounded-full bg-white/10">
                          <div
                            className="h-2.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                          {project.progress}% complete
                        </p>
                      </div>
                      <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-sky-300">Quick Actions</p>
                <h3 className="mt-1 text-2xl font-semibold">Workspace Shortcuts</h3>

                <div className="mt-6 grid gap-4">
                  {[
                    "Create New Report",
                    "Invite Team Member",
                    "Open Billing Center",
                    "Review Security Logs",
                  ].map((action) => (
                    <button
                      key={action}
                      className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/30 px-4 py-4 text-left transition hover:bg-white/10"
                    >
                      <span>{action}</span>
                      <ArrowUpRight className="h-4 w-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}