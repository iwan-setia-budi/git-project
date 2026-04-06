import { getReminders } from "@/services/reminderService";
import { getSchedules } from "@/services/scheduleService";
import { getTransactions } from "@/services/financeService";

// Family member data
const initialFamily = {
  familyName: "Keluarga Besar",
  members: [
    { id: 1, name: "Ayah", role: "Ayah", email: "ayah@family.com", avatarColor: "from-sky-400 to-indigo-500", avatarImage: "" },
    { id: 2, name: "Ibu", role: "Ibu", email: "ibu@family.com", avatarColor: "from-emerald-400 to-teal-500", avatarImage: "" },
    { id: 3, name: "Anak Pertama", role: "Anak", email: "anak1@family.com", avatarColor: "from-pink-400 to-rose-500", avatarImage: "" },
    { id: 4, name: "Anak Kedua", role: "Anak", email: "anak2@family.com", avatarColor: "from-amber-400 to-orange-500", avatarImage: "" },
  ],
  createdAt: new Date(2024, 0, 1),
};

const roleOptions = ["Ayah", "Ibu", "Anak", "Lainnya"];

const avatarPalettes = [
  "from-sky-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-pink-400 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-fuchsia-500",
  "from-cyan-400 to-blue-500",
];

function isValidEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function normalizeMember(member, index = 0) {
  return {
    ...member,
    id: Number(member.id),
    name: String(member.name || "").trim(),
    role: roleOptions.includes(member.role) ? member.role : "Lainnya",
    email: String(member.email || "").trim(),
    avatarImage: member.avatarImage || "",
    avatarColor: member.avatarColor || avatarPalettes[index % avatarPalettes.length],
    birthDate: String(member.birthDate || ""),
    idCardImage: String(member.idCardImage || ""),
  };
}

function normalizeFamily(data) {
  const members = Array.isArray(data?.members) ? data.members : [];
  return {
    familyName: String(data?.familyName || initialFamily.familyName).trim(),
    members: members.map((member, index) => normalizeMember(member, index)),
    createdAt: data?.createdAt || initialFamily.createdAt,
  };
}

// Get family data
export function getFamilyData() {
  const stored = localStorage.getItem("family_data");
  const raw = stored ? JSON.parse(stored) : initialFamily;
  const normalized = normalizeFamily(raw);
  localStorage.setItem("family_data", JSON.stringify(normalized));
  return normalized;
}

// Update family data
export function updateFamilyData(data) {
  const normalized = normalizeFamily(data);
  localStorage.setItem("family_data", JSON.stringify(normalized));
  return normalized;
}

// Add family member
export function addFamilyMember(member) {
  const family = getFamilyData();
  const name = String(member?.name || "").trim();
  const role = String(member?.role || "").trim();
  const email = String(member?.email || "").trim();

  if (!name) {
    throw new Error("Nama wajib diisi");
  }

  if (!role || !roleOptions.includes(role)) {
    throw new Error("Peran wajib dipilih");
  }

  if (!isValidEmail(email)) {
    throw new Error("Email tidak valid");
  }

  const newMember = {
    ...member,
    name,
    role,
    email,
    id: Math.max(...family.members.map(m => m.id), 0) + 1,
    avatarColor:
      member?.avatarColor || avatarPalettes[family.members.length % avatarPalettes.length],
    avatarImage: member?.avatarImage || "",
  };
  family.members.push(normalizeMember(newMember, family.members.length));
  updateFamilyData(family);
  return newMember;
}

// Update family member
export function updateFamilyMember(id, updates) {
  const family = getFamilyData();
  const index = family.members.findIndex(m => m.id === id);
  if (index !== -1) {
    const name = String(updates?.name ?? family.members[index].name).trim();
    const role = String(updates?.role ?? family.members[index].role).trim();
    const email = String(updates?.email ?? family.members[index].email).trim();

    if (!name) {
      throw new Error("Nama wajib diisi");
    }

    if (!role || !roleOptions.includes(role)) {
      throw new Error("Peran wajib dipilih");
    }

    if (!isValidEmail(email)) {
      throw new Error("Email tidak valid");
    }

    family.members[index] = normalizeMember(
      {
        ...family.members[index],
        ...updates,
        name,
        role,
        email,
      },
      index
    );
    updateFamilyData(family);
    return family.members[index];
  }
  return null;
}

// Delete family member
export function deleteFamilyMember(id) {
  const family = getFamilyData();
  family.members = family.members.filter(m => m.id !== id);
  updateFamilyData(family);
  return true;
}

// Get all members
export function getFamilyMembers() {
  return getFamilyData().members;
}

// Get member by id
export function getFamilyMemberById(id) {
  return getFamilyData().members.find(m => m.id === id);
}

export function getFamilyRoleOptions() {
  return roleOptions;
}

export function getMemberAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function isBirthdayToday(birthDate) {
  if (!birthDate) return false;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return false;
  const today = new Date();
  return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
}

export function getMembersBirthdayToday() {
  return getFamilyData().members.filter(m => isBirthdayToday(m.birthDate));
}

export function getFamilyStatistics() {
  const family = getFamilyData();
  const reminders = getReminders();
  const schedules = getSchedules();
  const transactions = getTransactions();

  const membersWithStats = family.members.map(member => {
    const reminderCount = reminders.filter(r =>
      String(r.assignee || "").toLowerCase() === member.name.toLowerCase()
    ).length;

    const scheduleCount = schedules.filter(s =>
      String(s.member || "").toLowerCase() === member.name.toLowerCase()
    ).length;

    const transactionCount = transactions.filter(t =>
      String(t.member || "").toLowerCase() === member.name.toLowerCase()
    ).length;

    return {
      memberId: member.id,
      memberName: member.name,
      reminderCount,
      scheduleCount,
      transactionCount,
      totalActivity: reminderCount + scheduleCount + transactionCount,
    };
  });

  const topActiveMember = [...membersWithStats].sort(
    (a, b) => b.totalActivity - a.totalActivity
  )[0] || null;

  return {
    totalMembers: family.members.length,
    totalRemindersAssigned: reminders.filter(r => Boolean(r.assignee)).length,
    totalSchedulesAssigned: schedules.filter(s => Boolean(s.member)).length,
    totalTransactionsAssigned: transactions.filter(t => Boolean(t.member)).length,
    topActiveMember,
    membersWithStats,
  };
}
