import { useState, useEffect } from "react";
import { Plus, Trash2, Check, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  getReminders,
  deleteReminder,
  toggleReminderCompleted,
} from "@/services/reminderService";
import { showToast } from "@/utils/toast";

export default function ReminderList() {
  const [reminders, setReminders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = () => {
    const allReminders = getReminders();
    setReminders(
      allReminders.sort((a, b) => new Date(a.date) - new Date(b.date))
    );
  };

  const handleDelete = id => {
    if (confirm("Yakin ingin menghapus reminder ini?")) {
      deleteReminder(id);
      loadReminders();
      showToast("Reminder berhasil dihapus", "success");
    }
  };

  const handleToggleCompleted = id => {
    toggleReminderCompleted(id);
    loadReminders();
  };

  const filtered =
    filterStatus === "all"
      ? reminders
      : filterStatus === "completed"
      ? reminders.filter(r => r.completed)
      : reminders.filter(r => !r.completed);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-4xl p-5 sm:p-7 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Daftar Reminder</h1>
            <p className="text-slate-300">Kelola semua reminder keluarga</p>
          </div>
          <Link to="/reminder/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Reminder
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {[
            { value: "all", label: "Semua" },
            { value: "pending", label: "Aktif" },
            { value: "completed", label: "Selesai" },
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filterStatus === filter.value
                  ? "bg-sky-400 text-slate-950"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Reminders List */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map(reminder => (
              <Card key={reminder.id} className="rounded-xl backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleCompleted(reminder.id)}
                      className="mt-1 text-slate-400 hover:text-white"
                    >
                      {reminder.completed ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${
                          reminder.completed ? "line-through text-slate-500" : ""
                        }`}
                      >
                        {reminder.title}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {new Date(reminder.date).toLocaleDateString("id-ID")} -
                        {reminder.time}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {reminder.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300 capitalize">
                        {reminder.category}
                      </span>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">Tidak ada reminder</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
