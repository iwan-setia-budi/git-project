import { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getRemindersByMonth } from "@/services/reminderService";

export default function ReminderCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const monthReminders = getRemindersByMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    setReminders(monthReminders);
  }, [currentDate]);

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
    return reminders.filter(r => new Date(r.date).getDate() === day);
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
        <div className="mb-8 flex items-center gap-4">
          <Link to="/reminder">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Kalender Reminder</h1>
        </div>

        <Card className="rounded-2xl backdrop-blur-xl">
          <CardContent className="p-6">
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

            <div className="grid gap-1">
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
                      <p className="mb-1 text-sm font-bold">{day}</p>
                      <div className="space-y-1">
                        {getRemindersForDay(day).slice(0, 2).map(reminder => (
                          <div
                            key={reminder.id}
                            className="truncate rounded bg-yellow-500/20 px-2 py-1 text-xs text-yellow-300"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
