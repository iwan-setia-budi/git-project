import { useEffect } from "react";
import {
  evaluateReminderNotification,
  getRemindersAsync,
  markReminderNotifiedAsync,
  syncReminderQueue,
} from "@/services/reminderService";
import { getMembersBirthdayToday } from "@/services/familyService";

function processBirthdayNotifications() {
  const today = new Date().toISOString().split("T")[0];
  const storageKey = "family_birthday_notified";
  let notified = {};
  try {
    notified = JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch (_) {
    notified = {};
  }

  // Reset if the stored date is not today
  if (notified.date !== today) {
    notified = { date: today, ids: [] };
  }

  const birthdayMembers = getMembersBirthdayToday();
  for (const member of birthdayMembers) {
    if (notified.ids.includes(member.id)) continue;

    const body = `\ud83c\udf89 Selamat ulang tahun, ${member.name}! Semoga selalu sehat dan bahagia.`;

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("Ulang Tahun \ud83c\udf82", { body });
    } else {
      alert(body);
    }

    notified.ids.push(member.id);
  }

  localStorage.setItem(storageKey, JSON.stringify(notified));
}

export function useReminderEngine() {
  useEffect(() => {
    let stopped = false;

    const processReminderNotifications = async () => {
      if (stopped) return;

      const reminders = await getRemindersAsync();

      for (const reminder of reminders) {
        const event = evaluateReminderNotification(reminder);
        if (!event) continue;

        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          new Notification("Pengingat", {
            body: event.body,
          });
        } else {
          alert(event.body);
        }

        await markReminderNotifiedAsync(reminder.id, event.type);
      }
    };

    const bootstrap = async () => {
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
      }

      await syncReminderQueue();
      await processReminderNotifications();
      processBirthdayNotifications();
    };

    bootstrap();

    const intervalId = window.setInterval(async () => {
      await syncReminderQueue();
      await processReminderNotifications();
      processBirthdayNotifications();
    }, 30000);

    const handleVisibility = async () => {
      if (document.visibilityState === "visible") {
        await syncReminderQueue();
        await processReminderNotifications();
      }
    };

    const handleStorage = async event => {
      if (event.key === "family_reminders") {
        await processReminderNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("storage", handleStorage);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);
}
