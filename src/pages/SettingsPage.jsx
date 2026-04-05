import { useState } from "react";
import {
  Bell,
  Globe,
  Lock,
  Palette,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/utils/toast";

const settingStats = [
  {
    title: "Security Level",
    value: "High",
    note: "2FA and audit enabled",
    icon: ShieldCheck,
  },
  {
    title: "Notifications",
    value: "12 Rules",
    note: "Email & in-app active",
    icon: Bell,
  },
  {
    title: "Workspace Theme",
    value: "Premium Dark",
    note: "Professional UI preset",
    icon: Palette,
  },
  {
    title: "Region",
    value: "Asia / Jakarta",
    note: "Localized workspace setup",
    icon: Globe,
  },
];

const preferences = [
  "Custom brand logo enabled",
  "Weekly summary email activated",
  "Timezone synced with workspace",
  "Language set to English (US)",
];

const securityItems = [
  "Two-factor authentication required",
  "Single sign-on connected",
  "Audit logs retention: 180 days",
  "Admin approval needed for new members",
];

const notifications = [
  "Product update alerts",
  "Billing payment reminders",
  "Weekly analytics digest",
  "Team invitation notifications",
];

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSaveSettings = () => {
    showToast("Settings saved successfully! Your preferences have been updated.");
  };

  const handleEnableTwoFactor = () => {
    showToast("Two-factor authentication setup opened - Scan QR code or enter backup codes");
  };

  const handleThemeChange = () => {
    showToast("Theme changed to Dark Mode");
  };

  const handleNotificationSettings = () => {
    showToast("Notification preferences dialog opened - Configure email and push notifications");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-7xl p-5 sm:p-7 lg:p-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-sky-300">Settings Workspace</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">System & Workspace Settings</h1>
              <p className="mt-2 text-sm text-slate-300">
                Kelola keamanan, notifikasi, tampilan, branding, dan preferensi workspace dalam desain premium dan profesional.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search settings..."
                  className="rounded-2xl border-white/10 bg-slate-950/40 pl-10 text-white placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={handleNotificationSettings}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Preferences
              </Button>
              <Button className="rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 hover:opacity-95" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {settingStats.map((item) => {
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

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <UserCog className="h-5 w-5 text-sky-300" />
                <div>
                  <p className="text-sm text-sky-300">General Preferences</p>
                  <h2 className="mt-1 text-2xl font-semibold">Workspace Configuration</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {preferences.map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-sky-300" />
                <div>
                  <p className="text-sm text-sky-300">Security Controls</p>
                  <h2 className="mt-1 text-2xl font-semibold">Access Protection</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {securityItems.map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-sky-300" />
                <div>
                  <p className="text-sm text-sky-300">Notifications</p>
                  <h2 className="mt-1 text-2xl font-semibold">Alert Preferences</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {notifications.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4">
                    <span className="text-sm text-slate-300">{item}</span>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                      Enabled
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-sky-300" />
                <div>
                  <p className="text-sm text-sky-300">Appearance</p>
                  <h2 className="mt-1 text-2xl font-semibold">Theme & Branding</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-[1.5rem] border border-sky-400/30 bg-gradient-to-r from-sky-400/10 to-indigo-500/10 p-5">
                  <p className="text-sm text-slate-400">Active Theme</p>
                  <h3 className="mt-2 text-xl font-semibold">Premium Dark Interface</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Desain gelap elegan dengan nuansa modern, premium, dan profesional untuk dashboard workspace.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5">
                  <p className="text-sm text-slate-400">Brand Identity</p>
                  <h3 className="mt-2 text-xl font-semibold">Custom Logo & Accent Active</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Branding workspace dapat disesuaikan untuk kebutuhan perusahaan, startup, atau admin system internal.
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
