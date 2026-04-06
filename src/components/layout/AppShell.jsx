import { useState } from "react";
import {
  Home,
  Wallet,
  Bell,
  Calendar,
  HardDrive,
  Users,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clearAuthToken } from "@/services/authService";
import { useReminderEngine } from "@/hooks/useReminderEngine";
import { showToast } from "@/utils/toast";

const sidebarItems = [
  { label: "Beranda", icon: Home, path: "/dashboard", end: true },
  { 
    label: "Keuangan", 
    icon: Wallet, 
    path: "/finance",
    submenu: [
      { label: "Pemasukan & Pengeluaran", path: "/finance" },
      { label: "Laporan", path: "/finance/report" },
      { label: "Tabungan", path: "/finance/savings" },
      { label: "Riwayat", path: "/finance/history" },
    ]
  },
  { label: "Pengingat", icon: Bell, path: "/reminder" },
  { label: "Jadwal", icon: Calendar, path: "/schedule" },
  { label: "Penyimpanan", icon: HardDrive, path: "/drive" },
  { label: "Profil Keluarga", icon: Users, path: "/family-profile" },
  { label: "Pengaturan", icon: Settings, path: "/settings" },
];

export default function AppShell() {
  useReminderEngine();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      clearAuthToken();
      showToast("Logout berhasil! Sampai jumpa lagi.", "success");
      navigate("/login");
    } catch (error) {
      showToast("Gagal logout. Silakan coba lagi.", "error");
      setIsLoggingOut(false);
    }
  };

  const isMenuActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 font-bold text-slate-950">
              F
            </div>
            <div>
              <p className="text-sm text-slate-300">Family App</p>
              <h1 className="text-lg font-semibold">Keluarga</h1>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = isMenuActive(item.path);
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <div key={item.label}>
                  {hasSubmenu ? (
                    <button
                      onClick={() => setExpandedMenu(expandedMenu === item.label ? null : item.label)}
                      className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                        isActive
                          ? "border border-sky-400/20 bg-gradient-to-r from-sky-400/20 to-indigo-500/20 text-white shadow-lg"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedMenu === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <NavLink
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
                  )}

                  {/* Submenu */}
                  {hasSubmenu && expandedMenu === item.label && (
                    <div className="mt-2 space-y-1 pl-4">
                      {item.submenu.map((subitem) => (
                        <NavLink
                          key={subitem.path}
                          to={subitem.path}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition ${
                              isActive
                                ? "bg-sky-400/20 text-sky-300"
                                : "text-slate-400 hover:bg-white/5 hover:text-slate-300"
                            }`
                          }
                        >
                          <div className="h-1 w-1 rounded-full bg-current" />
                          {subitem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <Card className="mt-8 rounded-[1.75rem] bg-gradient-to-br from-white/10 to-white/5">
            <CardContent className="p-5">
              <p className="text-sm text-sky-300">Tip Keuangan</p>
              <h2 className="mt-2 text-xl font-semibold leading-snug">
                Kelola keuangan keluarga dengan mudah
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Pantau pemasukan, pengeluaran, dan tabungan keluarga dalam satu tempat.
              </p>
              <Button className="mt-5 w-full">Lihat Tips</Button>
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              className="w-full border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Sedang keluar..." : "Keluar"}
            </Button>
          </div>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
