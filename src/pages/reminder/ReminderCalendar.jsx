import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getRemindersByMonth } from "@/services/reminderService";
import { getFamilyMembers } from "@/services/familyService";

export default function ReminderCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [selectedMember, setSelectedMember] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDay, setSelectedDay] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setMembers(getFamilyMembers().map(member => member.name));
  }, []);

  useEffect(() => {
    const monthReminders = getRemindersByMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    setReminders(monthReminders);
  }, [currentDate]);

  const filteredReminders = useMemo(() => {
    return reminders.filter(reminder => {
      if (selectedMember !== "all" && reminder.assignee !== selectedMember) return false;
      if (selectedStatus === "done" && !reminder.completed) return false;
      if (selectedStatus === "pending" && reminder.completed) return false;
      return true;
    });
  }, [reminders, selectedMember, selectedStatus]);

  const getDaysInMonth = date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = date => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const days = [];
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getRemindersForDay = day => {
    if (!day) return [];
    return filteredReminders.filter(r => new Date(r.date).getDate() === day);
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-6xl p-5 sm:p-7 lg:p-8">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link to="/reminder">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Kalender Reminder</h1>
              <p className="text-slate-300">Tampilan kalender modern yang selaras dengan modul jadwal</p>
            </div>
          </div>

          <Link to="/reminder/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Reminder
            </Button>
          </Link>
        </div>

        <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus("all")}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  selectedStatus === "all"
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-white"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedStatus("pending")}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  selectedStatus === "pending"
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-white"
                }`}
              >
                Aktif
              </button>
              <button
                onClick={() => setSelectedStatus("done")}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  selectedStatus === "done"
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-white"
                }`}
              >
                Selesai
              </button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedMember("all")}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  selectedMember === "all"
                    ? "bg-sky-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-white"
                }`}
              >
                Semua Anggota
              </button>
              {members.map(member => (
                <button
                  key={member}
                  onClick={() => setSelectedMember(member)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    selectedMember === member
                      ? "bg-sky-400 text-slate-950"
                      : "border border-white/10 bg-white/5 text-white"
                  }`}
                >
                  {member}
                </button>
              ))}
            </div>

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
              </h2>
              <div className="flex gap-2">
                <Button onClick={previousMonth} variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button onClick={nextMonth} variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {/* Days Header */}
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(day => (
                <div
                  key={day}
                  className="flex h-12 items-center justify-center rounded-lg bg-white/5 text-xs font-bold"
                >
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-24 rounded-lg border border-white/10 p-2 ${
                    day ? "bg-white/5" : "bg-transparent"
                  }`}
                >
                  {day && (
                    <>
                      <button
                        onClick={() => setSelectedDay(day)}
                        className={`mb-1 rounded-md px-1.5 text-sm font-bold ${
                          selectedDay === day ? "bg-cyan-400 text-slate-950" : "text-white"
                        }`}
                      >
                        {day}
                      </button>
                      <div className="space-y-1">
                        {getRemindersForDay(day).slice(0, 2).map(reminder => (
                          <div
                            key={reminder.id}
                            className={`truncate rounded px-2 py-1 text-xs ${
                              reminder.completed
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-yellow-500/20 text-yellow-300"
                            }`}
                          >
                            {reminder.title}
                          </div>
                        ))}
                        {getRemindersForDay(day).length > 2 && (
                          <p className="truncate text-xs text-slate-400">
                            +{getRemindersForDay(day).length - 2} lagi
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {selectedDay ? (
              <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <p className="mb-2 text-sm font-semibold text-cyan-300">
                  Detail {selectedDay} {currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                </p>
                <div className="space-y-2">
                  {getRemindersForDay(selectedDay).length > 0 ? (
                    getRemindersForDay(selectedDay).map(item => (
                      <div
                        key={`${item.id}-detail-${selectedDay}`}
                        className="rounded-lg border border-white/10 bg-white/5 p-3"
                      >
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-slate-400">
                          {item.time} | {item.assignee || "Umum"} | {item.category}
                        </p>
                        <p className={`mt-1 text-xs ${item.completed ? "text-emerald-300" : "text-amber-300"}`}>
                          {item.completed ? "Selesai" : "Aktif"}
                        </p>
                        {item.description ? (
                          <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">Tidak ada reminder di tanggal ini.</p>
                  )}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
