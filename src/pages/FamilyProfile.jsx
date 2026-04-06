import { useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  User,
  Camera,
  Mail,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getFamilyData,
  updateFamilyData,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  getFamilyRoleOptions,
  getFamilyStatistics,
  getMemberAge,
  isBirthdayToday,
} from "@/services/familyService";
import { isValidEmail } from "@/utils/validation";
import { showToast } from "@/utils/toast";

const defaultMemberForm = {
  name: "",
  role: "",
  email: "",
  avatarImage: "",
  birthDate: "",
  idCardImage: "",
};

export default function FamilyProfile() {
  const [familyData, setFamilyData] = useState(getFamilyData());
  const [isEditingName, setIsEditingName] = useState(false);
  const [familyName, setFamilyName] = useState(getFamilyData().familyName);

  const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
  const [memberFormMode, setMemberFormMode] = useState("add");
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [memberForm, setMemberForm] = useState(defaultMemberForm);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const roleOptions = getFamilyRoleOptions();

  const familyStats = useMemo(() => getFamilyStatistics(), [familyData]);

  const refreshFamilyData = () => {
    const latest = getFamilyData();
    setFamilyData(latest);
    setFamilyName(latest.familyName);
  };

  const openAddMemberForm = () => {
    setMemberFormMode("add");
    setEditingMemberId(null);
    setMemberForm(defaultMemberForm);
    setIsMemberFormOpen(true);
  };

  const openEditMemberForm = member => {
    setMemberFormMode("edit");
    setEditingMemberId(member.id);
    setMemberForm({
      name: member.name,
      role: member.role,
      email: member.email || "",
      avatarImage: member.avatarImage || "",
      birthDate: member.birthDate || "",
      idCardImage: member.idCardImage || "",
    });
    setIsMemberFormOpen(true);
  };

  const closeMemberForm = () => {
    setIsMemberFormOpen(false);
    setEditingMemberId(null);
    setMemberForm(defaultMemberForm);
  };

  const validateMemberForm = () => {
    const name = memberForm.name.trim();
    const role = memberForm.role.trim();
    const email = memberForm.email.trim();

    if (!name) {
      showToast("Nama wajib diisi", "error");
      return false;
    }

    if (!role) {
      showToast("Peran wajib dipilih", "error");
      return false;
    }

    if (email && !isValidEmail(email)) {
      showToast("Email tidak valid", "error");
      return false;
    }

    return true;
  };

  const handleSaveMember = () => {
    if (!validateMemberForm()) return;

    try {
      const payload = {
        ...memberForm,
        name: memberForm.name.trim(),
        role: memberForm.role.trim(),
        email: memberForm.email.trim(),
      };

      if (memberFormMode === "add") {
        addFamilyMember(payload);
        showToast("Anggota berhasil ditambahkan", "success");
      } else if (editingMemberId) {
        updateFamilyMember(editingMemberId, payload);
        showToast("Anggota berhasil diperbarui", "success");
      }

      refreshFamilyData();
      closeMemberForm();
    } catch (error) {
      showToast(error.message || "Gagal menyimpan anggota", "error");
    }
  };

  const handleDeleteMember = () => {
    if (!deleteTarget) return;

    deleteFamilyMember(deleteTarget.id);
    setDeleteTarget(null);

    if (selectedMemberId === deleteTarget.id) {
      setSelectedMemberId(null);
    }

    refreshFamilyData();
    showToast("Anggota berhasil dihapus", "success");
  };

  const handleAvatarUpload = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("File harus berupa gambar", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setMemberForm(prev => ({ ...prev, avatarImage: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const handleIdCardUpload = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("File kartu identitas harus berupa gambar", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Ukuran file maksimal 5 MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setMemberForm(prev => ({ ...prev, idCardImage: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const [showIdCard, setShowIdCard] = useState(false);

  const handleUpdateFamilyName = () => {
    const cleanFamilyName = familyName.trim();
    if (!cleanFamilyName) {
      showToast("Nama keluarga wajib diisi", "error");
      return;
    }

    updateFamilyData({ ...familyData, familyName: cleanFamilyName });
    refreshFamilyData();
    showToast("Nama keluarga berhasil diperbarui", "success");
    setIsEditingName(false);
  };

  const selectedMember = familyData.members.find(member => member.id === selectedMemberId) || null;
  const selectedMemberStats =
    familyStats.membersWithStats.find(member => member.memberId === selectedMemberId) || null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-5xl p-5 sm:p-7 lg:p-8">
        <h1 className="mb-6 text-3xl font-bold">Profil Keluarga</h1>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Total Anggota</p>
              <p className="mt-2 text-2xl font-bold text-cyan-300">{familyStats.totalMembers}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Reminder Ter-assign</p>
              <p className="mt-2 text-2xl font-bold text-amber-300">{familyStats.totalRemindersAssigned}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Jadwal Ter-assign</p>
              <p className="mt-2 text-2xl font-bold text-emerald-300">{familyStats.totalSchedulesAssigned}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Transaksi by Member</p>
              <p className="mt-2 text-2xl font-bold text-fuchsia-300">{familyStats.totalTransactionsAssigned}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-6">
            {!isEditingName ? (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-300">Nama Keluarga</p>
                  <h2 className="mt-2 text-2xl font-bold">{familyData.familyName}</h2>
                  {familyStats.topActiveMember ? (
                    <p className="mt-2 text-xs text-cyan-300">
                      Paling aktif: {familyStats.topActiveMember.memberName} ({familyStats.topActiveMember.totalActivity} aktivitas)
                    </p>
                  ) : null}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditingName(true)}
                  aria-label="Edit nama keluarga"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  value={familyName}
                  onChange={e => setFamilyName(e.target.value)}
                  placeholder="Masukkan nama keluarga"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFamilyName(familyData.familyName);
                      setIsEditingName(false);
                    }}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button onClick={handleUpdateFamilyName} className="flex-1">
                    Simpan
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Anggota Keluarga</h2>
            {!isMemberFormOpen ? (
              <Button className="gap-2" onClick={openAddMemberForm}>
                <Plus className="h-4 w-4" />
                Tambah Anggota
              </Button>
            ) : null}
          </div>

          {isMemberFormOpen ? (
            <Card className="mb-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-cyan-300">
                    {memberFormMode === "add" ? "Tambah Anggota" : "Edit Anggota"}
                  </p>

                  <Input
                    placeholder="Nama"
                    value={memberForm.name}
                    onChange={e => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  />

                  <select
                    value={memberForm.role}
                    onChange={e => setMemberForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-slate-100"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="">Pilih peran</option>
                    {roleOptions.map(role => (
                      <option key={role} value={role} className="bg-slate-900 text-slate-100">
                        {role}
                      </option>
                    ))}
                  </select>

                  <Input
                    placeholder="Email"
                    type="email"
                    value={memberForm.email}
                    onChange={e => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  />

                  <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-4">
                    <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                      <Camera className="h-4 w-4" />
                      Upload foto profil (opsional)
                    </label>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} />
                    {memberForm.avatarImage ? (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={memberForm.avatarImage}
                          alt="Preview avatar"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setMemberForm(prev => ({ ...prev, avatarImage: "" }))}
                          className="text-xs text-rose-300 hover:text-rose-200"
                        >
                          Hapus foto
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-slate-300">Tanggal Lahir (opsional)</label>
                    <Input
                      type="date"
                      value={memberForm.birthDate}
                      onChange={e => setMemberForm(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>

                  <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-4">
                    <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                      <ShieldCheck className="h-4 w-4" />
                      Upload kartu identitas — KTP / Kartu Anak (opsional)
                    </label>
                    <p className="mb-2 text-xs text-slate-500">Disimpan lokal di perangkat ini. Maks 5 MB.</p>
                    <input type="file" accept="image/*" onChange={handleIdCardUpload} />
                    {memberForm.idCardImage ? (
                      <div className="mt-3 space-y-2">
                        <img
                          src={memberForm.idCardImage}
                          alt="Preview kartu identitas"
                          className="max-h-32 rounded-lg border border-white/10 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setMemberForm(prev => ({ ...prev, idCardImage: "" }))}
                          className="text-xs text-rose-300 hover:text-rose-200"
                        >
                          Hapus kartu
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={closeMemberForm} className="flex-1">
                      Batal
                    </Button>
                    <Button onClick={handleSaveMember} className="flex-1">
                      {memberFormMode === "add" ? "Tambah" : "Simpan Perubahan"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-4 md:grid-cols-2">
              {familyData.members.map(member => (
                <Card
                  key={member.id}
                  className={`group cursor-pointer rounded-xl border backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/10 ${
                    isBirthdayToday(member.birthDate)
                      ? "border-amber-400/60 bg-amber-500/10 hover:border-amber-400"
                      : "border-white/10 bg-white/5 hover:border-cyan-400/40"
                  }`}
                  onClick={() => { setSelectedMemberId(member.id); setShowIdCard(false); }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="relative">
                          {member.avatarImage ? (
                            <img
                              src={member.avatarImage}
                              alt={member.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${member.avatarColor} text-lg font-bold text-slate-900`}>
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {isBirthdayToday(member.birthDate) ? (
                            <span className="absolute -right-1 -top-1 text-base" title="Ulang tahun hari ini!">🎂</span>
                          ) : null}
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-slate-300">{member.role}</p>
                          <p className="mt-1 text-xs text-slate-500">{member.email || "Tanpa email"}</p>
                          {member.birthDate ? (
                            <p className="mt-0.5 text-xs text-slate-500">
                              {isBirthdayToday(member.birthDate)
                                ? <span className="text-amber-300 font-medium">🎉 Ulang tahun hari ini!</span>
                                : `Usia ${getMemberAge(member.birthDate)} tahun`}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-80 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={event => {
                            event.stopPropagation();
                            openEditMemberForm(member);
                          }}
                          className="text-cyan-300 hover:text-cyan-200"
                          aria-label="Edit anggota"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={event => {
                            event.stopPropagation();
                            setDeleteTarget(member);
                          }}
                          className="text-red-400 hover:text-red-300"
                          aria-label="Hapus anggota"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-5">
                {selectedMember ? (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Detail Anggota</p>
                    <h3 className="mt-2 text-xl font-bold">{selectedMember.name}</h3>
                    <p className="mt-1 text-sm text-slate-300">{selectedMember.role}</p>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="h-4 w-4 text-cyan-300" />
                        {selectedMember.email || "Email belum diisi"}
                      </div>
                      {selectedMember.birthDate ? (
                        <div className="flex items-center gap-2 text-slate-300">
                          <span className="text-base leading-none">🎂</span>
                          <span>
                            {new Date(selectedMember.birthDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            {" — "}
                            {isBirthdayToday(selectedMember.birthDate)
                              ? <span className="text-amber-300 font-medium">Ulang tahun hari ini! 🎉</span>
                              : <span className="text-slate-400">{getMemberAge(selectedMember.birthDate)} tahun</span>}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2 text-slate-300">
                        <ShieldCheck className="h-4 w-4 text-emerald-300" />
                        Akses default: anggota keluarga
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Activity className="h-4 w-4 text-amber-300" />
                        Aktivitas total: {selectedMemberStats?.totalActivity || 0}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-300">
                        Reminder
                        <p className="mt-1 text-lg font-bold">{selectedMemberStats?.reminderCount || 0}</p>
                      </div>
                      <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-300">
                        Jadwal
                        <p className="mt-1 text-lg font-bold">{selectedMemberStats?.scheduleCount || 0}</p>
                      </div>
                      <div className="rounded-lg bg-fuchsia-500/10 p-2 text-fuchsia-300">
                        Keuangan
                        <p className="mt-1 text-lg font-bold">{selectedMemberStats?.transactionCount || 0}</p>
                      </div>
                    </div>

                    {selectedMember.idCardImage ? (
                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-medium text-slate-400">Kartu Identitas</p>
                          <button
                            type="button"
                            onClick={() => setShowIdCard(v => !v)}
                            className="text-xs text-cyan-300 hover:text-cyan-200"
                          >
                            {showIdCard ? "Sembunyikan" : "Tampilkan"}
                          </button>
                        </div>
                        {showIdCard ? (
                          <img
                            src={selectedMember.idCardImage}
                            alt="Kartu identitas"
                            className="w-full rounded-lg border border-white/10 object-contain"
                          />
                        ) : (
                          <div className="flex h-14 items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/5 text-xs text-slate-500">
                            🔒 Tersimpan — klik Tampilkan untuk melihat
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <User className="mx-auto mb-2 h-6 w-6" />
                    Klik kartu anggota untuk lihat detail.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {deleteTarget ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h3 className="text-lg font-bold">Yakin ingin menghapus anggota ini?</h3>
              <p className="mt-2 text-sm text-slate-300">{deleteTarget.name} - {deleteTarget.role}</p>
              <div className="mt-5 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                  Batal
                </Button>
                <Button onClick={handleDeleteMember} className="bg-gradient-to-r from-red-400 to-red-500 text-white">
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
