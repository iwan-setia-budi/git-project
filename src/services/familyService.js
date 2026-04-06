// Family member data
const initialFamily = {
  familyName: "Keluarga Besar",
  members: [
    { id: 1, name: "Ayah", role: "Kepala Keluarga", email: "ayah@family.com" },
    { id: 2, name: "Ibu", role: "Ibu Rumah Tangga", email: "ibu@family.com" },
    { id: 3, name: "Anak Pertama", role: "Pelajar", email: "anak1@family.com" },
    { id: 4, name: "Anak Kedua", role: "Pelajar", email: "anak2@family.com" },
  ],
  createdAt: new Date(2024, 0, 1),
};

// Get family data
export function getFamilyData() {
  const stored = localStorage.getItem("family_data");
  return stored ? JSON.parse(stored) : initialFamily;
}

// Update family data
export function updateFamilyData(data) {
  localStorage.setItem("family_data", JSON.stringify(data));
  return data;
}

// Add family member
export function addFamilyMember(member) {
  const family = getFamilyData();
  const newMember = {
    ...member,
    id: Math.max(...family.members.map(m => m.id), 0) + 1,
  };
  family.members.push(newMember);
  updateFamilyData(family);
  return newMember;
}

// Update family member
export function updateFamilyMember(id, updates) {
  const family = getFamilyData();
  const index = family.members.findIndex(m => m.id === id);
  if (index !== -1) {
    family.members[index] = { ...family.members[index], ...updates };
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
