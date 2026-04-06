import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getSchedules, deleteSchedule } from "@/services/scheduleService";
import { showToast } from "@/utils/toast";

export default function FamilyAgenda() {
  const [schedules, setSchedules] = useState([]);
  const [selectedMember, setSelectedMember] = useState("all");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = () => {
    const allSchedules = getSchedules();
    setSchedules(
      allSchedules.sort((a, b) => new Date(a.date) - new Date(b.date))
    );

    const uniqueMembers = [...new Set(allSchedules.map(s => s.member))].filter(
      Boolean
    );
    setMembers(uniqueMembers);
  };

  const handleDelete = id => {
    if (confirm("Yakin ingin menghapus jadwal ini?")) {
      deleteSchedule(id);
      loadSchedules();
      showToast("Jadwal berhasil dihapus", "success");
    }
  };

  const filtered =
    selectedMember === "all"
      ? schedules
      : schedules.filter(s => s.member === selectedMember);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-4xl p-5 sm:p-7 lg:p-8">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agenda Keluarga</h1>
            <p className="text-slate-300">Kelola jadwal keluarga</p>
          </div>
          <Link to="/schedule/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Jadwal
            </Button>
          </Link>
        </div>

        {/* Member Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedMember("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedMember === "all"
                ? "bg-sky-400 text-slate-950"
                : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            Semua
          </button>
          {members.map(member => (
            <button
              key={member}
              onClick={() => setSelectedMember(member)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedMember === member
                  ? "bg-sky-400 text-slate-950"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {member}
            </button>
          ))}
        </div>

        {/* Schedules List */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map(schedule => (
              <Card key={schedule.id} className="rounded-xl backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{schedule.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
                        <span>
                          {new Date(schedule.date).toLocaleDateString("id-ID")}
                        </span>
                        <span>
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                        {schedule.member && (
                          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-blue-300">
                            {schedule.member}
                          </span>
                        )}
                        {schedule.category && (
                          <span className="capitalize text-slate-500">
                            {schedule.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">Tidak ada jadwal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
