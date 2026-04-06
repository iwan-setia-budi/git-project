import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getFamilyData,
  updateFamilyData,
  addFamilyMember,
  deleteFamilyMember,
} from "@/services/familyService";
import { showToast } from "@/utils/toast";

export default function FamilyProfile() {
  const [familyData, setFamilyData] = useState(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    email: "",
  });

  useEffect(() => {
    const data = getFamilyData();
    setFamilyData(data);
    setFamilyName(data.familyName);
  }, []);

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role) {
      showToast("Isi nama dan peran anggota", "error");
      return;
    }
    addFamilyMember(newMember);
    setFamilyData(getFamilyData());
    setNewMember({ name: "", role: "", email: "" });
    setIsAddingMember(false);
    showToast("Anggota keluarga berhasil ditambahkan", "success");
  };

  const handleDeleteMember = id => {
    if (confirm("Hapus anggota keluarga ini?")) {
      deleteFamilyMember(id);
      setFamilyData(getFamilyData());
      showToast("Anggota keluarga berhasil dihapus", "success");
    }
  };

  const handleUpdateFamilyName = () => {
    updateFamilyData({ ...familyData, familyName });
    showToast("Nama keluarga berhasil diperbarui", "success");
    setIsEditingName(false);
  };

  if (!familyData) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-4xl p-5 sm:p-7 lg:p-8">
        <h1 className="mb-8 text-3xl font-bold">Profil Keluarga</h1>

        {/* Family Name Card */}
        <Card className="mb-8 rounded-2xl backdrop-blur-xl">
          <CardContent className="p-6">
            {!isEditingName ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Nama Keluarga</p>
                  <h2 className="mt-2 text-2xl font-bold">{familyData.familyName}</h2>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditingName(true)}
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
                    onClick={() => setIsEditingName(false)}
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

        {/* Members */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Anggota Keluarga</h2>
            {!isAddingMember && (
              <Button className="gap-2" onClick={() => setIsAddingMember(true)}>
                <Plus className="h-4 w-4" />
                Tambah Anggota
              </Button>
            )}
          </div>

          {/* Add Member Form */}
          {isAddingMember && (
            <Card className="mb-6 rounded-xl backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Input
                    placeholder="Nama"
                    value={newMember.name}
                    onChange={e =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  />
                  <Input
                    placeholder="Peran (Ayah, Ibu, Anak, dll)"
                    value={newMember.role}
                    onChange={e =>
                      setNewMember({ ...newMember, role: e.target.value })
                    }
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newMember.email}
                    onChange={e =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingMember(false)}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button onClick={handleAddMember} className="flex-1">
                      Tambah
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Members List */}
          <div className="grid gap-4 md:grid-cols-2">
            {familyData.members.map(member => (
              <Card key={member.id} className="rounded-xl backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-lg font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-slate-400">{member.role}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
