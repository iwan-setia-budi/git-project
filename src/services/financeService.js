// Mock data for transactions
const initialTransactions = [
  {
    id: 1,
    type: "income",
    amount: 5000000,
    category: "gaji",
    description: "Gaji bulanan",
    date: new Date(2024, 3, 1),
    member: "Ayah",
  },
  {
    id: 2,
    type: "expense",
    amount: 1500000,
    category: "makan",
    description: "Belanja groceries",
    date: new Date(2024, 3, 5),
    member: "Ibu",
  },
  {
    id: 3,
    type: "expense",
    amount: 800000,
    category: "listrik",
    description: "Tagihan listrik",
    date: new Date(2024, 3, 10),
    member: "Ayah",
  },
];

const expenseCategories = [
  { id: 1, name: "Makan", color: "#ef4444" },
  { id: 2, name: "Sekolah", color: "#f59e0b" },
  { id: 3, name: "Listrik", color: "#eab308" },
  { id: 4, name: "Internet", color: "#84cc16" },
  { id: 5, name: "Transport", color: "#22c55e" },
  { id: 6, name: "Kesehatan", color: "#10b981" },
  { id: 7, name: "Cicilan", color: "#06b6d4" },
  { id: 8, name: "Tabungan", color: "#3b82f6" },
];

// Get all transactions
export function getTransactions() {
  const stored = localStorage.getItem("family_transactions");
  return stored ? JSON.parse(stored) : initialTransactions;
}

// Add transaction
export function addTransaction(transaction) {
  const transactions = getTransactions();
  const newTransaction = {
    ...transaction,
    id: Math.max(...transactions.map(t => t.id), 0) + 1,
  };
  transactions.push(newTransaction);
  localStorage.setItem("family_transactions", JSON.stringify(transactions));
  return newTransaction;
}

// Update transaction
export function updateTransaction(id, updates) {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    localStorage.setItem("family_transactions", JSON.stringify(transactions));
    return transactions[index];
  }
  return null;
}

// Delete transaction
export function deleteTransaction(id) {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  localStorage.setItem("family_transactions", JSON.stringify(filtered));
  return true;
}

// Get monthly summary
export function getMonthlySummary(year, month) {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  const income = filtered
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filtered
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
}

// Get expense by category
export function getExpenseByCategory(year, month) {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => {
    const date = new Date(t.date);
    return (
      t.type === "expense" &&
      date.getFullYear() === year &&
      date.getMonth() === month
    );
  });

  const byCategory = {};
  filtered.forEach(t => {
    if (!byCategory[t.category]) {
      byCategory[t.category] = 0;
    }
    byCategory[t.category] += t.amount;
  });

  return byCategory;
}

// Get expense categories
export function getExpenseCategories() {
  return expenseCategories;
}

// Get savings target
export function getSavingsTarget() {
  const stored = localStorage.getItem("savings_target");
  return stored
    ? JSON.parse(stored)
    : {
        target: 50000000,
        current: 15000000,
        name: "Liburan Keluarga 2025",
      };
}

// Update savings target
export function updateSavingsTarget(data) {
  localStorage.setItem("savings_target", JSON.stringify(data));
  return data;
}
