import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MoreHorizontal,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserPlus,
  Users,
  UserCog,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast, downloadCSV } from "@/utils/toast";

const userStats = [
  {
    title: "Total Members",
    value: "248",
    note: "+18 active this month",
    icon: Users,
  },
  {
    title: "Admins",
    value: "12",
    note: "Full access accounts",
    icon: ShieldCheck,
  },
  {
    title: "Managers",
    value: "34",
    note: "Team-level permissions",
    icon: UserCog,
  },
  {
    title: "Invitations",
    value: "9",
    note: "Pending join requests",
    icon: Mail,
  },
];

const members = [
  {
    name: "Primaya Bhaktiwara",
    email: "primaya@company.com",
    role: "Admin",
    team: "Executive",
    status: "Active",
  },
  {
    name: "Alya Putri",
    email: "alya@company.com",
    role: "Finance Lead",
    team: "Finance",
    status: "Active",
  },
  {
    name: "Raka Mahendra",
    email: "raka@company.com",
    role: "Growth Manager",
    team: "Marketing",
    status: "Pending",
  },
  {
    name: "Dion Saputra",
    email: "dion@company.com",
    role: "Data Analyst",
    team: "Analytics",
    status: "Active",
  },
  {
    name: "Nadia Prameswari",
    email: "nadia@company.com",
    role: "HR Manager",
    team: "People Ops",
    status: "Active",
  },
];

const quickActions = [
  "Invite New Member",
  "Manage Roles & Permissions",
  "Open Access Audit Logs",
  "Review Pending Invitations",
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInviteUser = () => {
    showToast("Invite User dialog opened - Enter email and select role");
  };

  const handleFilterUsers = () => {
    showToast("Filter panel opened - Filter by role, status, or department");
  };

  const handleExportUsers = () => {
    const usersData = members.map(member => ({
      Name: member.name,
      Email: member.email,
      Role: member.role,
      Status: member.status,
      "Joined Date": member.joined
    }));
    downloadCSV(usersData, "team-members.csv");
    showToast("Team members list exported successfully!");
  };

  const handleMoreActions = (memberName) => {
    showToast(`Actions for ${memberName} - Edit role, Remove, Resend invite`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-7xl p-5 sm:p-7 lg:p-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-sky-300">Users Workspace</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Team & User Management</h1>
              <p className="mt-2 text-sm text-slate-300">
                Kelola anggota tim, role, akses workspace, dan kolaborasi dalam tampilan premium yang modern dan profesional.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search members..."
                  className="rounded-2xl border-white/10 bg-slate-950/40 pl-10 text-white placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={handleFilterUsers}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button className="rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 hover:opacity-95" onClick={handleInviteUser}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {userStats.map((item) => {
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

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-300">Workspace Members</p>
                  <h2 className="mt-1 text-2xl font-semibold">User Directory</h2>
                </div>
                <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                  Manage Roles
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                {members.map((member) => (
                  <div
                    key={member.email}
                    className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 font-semibold text-slate-950">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-slate-400">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{member.role}</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{member.team}</span>
                      <span
                        className={`rounded-full px-3 py-1 ${
                          member.status === "Active"
                            ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            : "border border-amber-400/20 bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        {member.status}
                      </span>
                      <button className="rounded-xl p-2 hover:bg-white/10">
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-2xl">
              <CardContent className="p-6">
                <p className="text-sm text-sky-300">Quick Actions</p>
                <h2 className="mt-1 text-2xl font-semibold">Team Tools</h2>

                <div className="mt-6 grid gap-4">
                  {quickActions.map((item) => (
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
                <p className="text-sm text-sky-300">Access Overview</p>
                <h2 className="mt-1 text-2xl font-semibold">Permission Status</h2>

                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Workspace Security</p>
                      <h3 className="mt-2 text-xl font-semibold">Role-based access active</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Semua user dikelola dengan hak akses berbeda untuk menjaga keamanan dan efisiensi operasional tim.
                      </p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-emerald-300" />
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
