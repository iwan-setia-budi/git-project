import {
  Activity,
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", end: true },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Billing", icon: CreditCard, path: "/billing" },
  { label: "Activity", icon: Activity, path: "/activity" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function AppShell() {
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

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
