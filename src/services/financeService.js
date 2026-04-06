import { getMasterList } from "@/services/masterDataService";

const STORAGE_KEY = "family_transactions";

function toDateString(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().split("T")[0];
  }
  return date.toISOString().split("T")[0];
}

function mapMasterCategory(item) {
  return {
    id: item.id,
    name: item.label,
    value: item.value,
    color: item.color || "#64748b",
  };
}

const initialTransactions = [
  {
    id: 1,
    type: "income",
    amount: 5000000,
    category: "gaji",
    description: "Gaji bulanan",
    date: toDateString(new Date()),
    member: "Ayah",
  },
  {
    id: 2,
    type: "expense",
    amount: 1500000,
    category: "makan",
    description: "Belanja groceries",
    date: toDateString(new Date()),
    member: "Ibu",
  },
  {
    id: 3,
    type: "expense",
    amount: 800000,
    category: "listrik",
    description: "Tagihan listrik",
    date: toDateString(new Date()),
    member: "Ayah",
  },
];

function normalizeTransaction(transaction) {
  const type = transaction?.type === "income" ? "income" : "expense";
  return {
    id: Number(transaction?.id),
    type,
    amount: Math.max(Number(transaction?.amount) || 0, 0),
    category: String(transaction?.category || "lainnya").toLowerCase(),
    description: String(transaction?.description || "").trim(),
    date: toDateString(transaction?.date),
    member: String(transaction?.member || "").trim(),
  };
}

function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function applyFilters(transactions, filters = {}) {
  const { year, month, member = "all", type = "all", category = "all" } = filters;
  return transactions.filter(transaction => {
    const date = new Date(transaction.date);
    if (typeof year === "number" && date.getFullYear() !== year) return false;
    if (typeof month === "number" && date.getMonth() !== month) return false;
    if (member !== "all" && transaction.member !== member) return false;
    if (type !== "all" && transaction.type !== type) return false;
    if (category !== "all" && transaction.category !== category) return false;
    return true;
  });
}

function sumByType(transactions, type) {
  return transactions
    .filter(transaction => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getTransactions() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : initialTransactions;
  const normalized = Array.isArray(parsed)
    ? parsed.map(normalizeTransaction)
    : initialTransactions.map(normalizeTransaction);
  saveTransactions(normalized);
  return normalized;
}

export function addTransaction(transaction) {
  const transactions = getTransactions();
  const normalized = normalizeTransaction(transaction);

  if (!normalized.amount || normalized.amount <= 0) {
    throw new Error("Jumlah transaksi harus lebih besar dari 0");
  }

  if (!normalized.category) {
    throw new Error("Kategori wajib dipilih");
  }

  const newTransaction = {
    ...normalized,
    id: Math.max(...transactions.map(item => item.id), 0) + 1,
  };

  transactions.push(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
}

export function updateTransaction(id, updates) {
  const transactions = getTransactions();
  const index = transactions.findIndex(transaction => transaction.id === id);
  if (index === -1) return null;

  const updated = normalizeTransaction({ ...transactions[index], ...updates, id });
  if (!updated.amount || updated.amount <= 0) {
    throw new Error("Jumlah transaksi harus lebih besar dari 0");
  }

  transactions[index] = updated;
  saveTransactions(transactions);
  return updated;
}

export function deleteTransaction(id) {
  const transactions = getTransactions();
  const filtered = transactions.filter(transaction => transaction.id !== id);
  saveTransactions(filtered);
  return true;
}

export function getMonthlySummary(year, month, options = {}) {
  const transactions = applyFilters(getTransactions(), { year, month, member: options.member || "all" });
  const income = sumByType(transactions, "income");
  const expense = sumByType(transactions, "expense");
  return {
    income,
    expense,
    balance: income - expense,
  };
}

export function getMonthlySummaryWithComparison(year, month, options = {}) {
  const current = getMonthlySummary(year, month, options);
  const previousDate = new Date(year, month - 1, 1);
  const previous = getMonthlySummary(previousDate.getFullYear(), previousDate.getMonth(), options);

  const expenseDelta = previous.expense === 0 ? 0 : ((current.expense - previous.expense) / previous.expense) * 100;
  const incomeDelta = previous.income === 0 ? 0 : ((current.income - previous.income) / previous.income) * 100;

  return {
    ...current,
    previous,
    expenseDelta,
    incomeDelta,
  };
}

export function getExpenseByCategory(year, month, options = {}) {
  const filtered = applyFilters(getTransactions(), {
    year,
    month,
    member: options.member || "all",
    type: "expense",
  });

  const byCategory = {};
  for (const transaction of filtered) {
    byCategory[transaction.category] = (byCategory[transaction.category] || 0) + transaction.amount;
  }

  return byCategory;
}

export function getFinanceAnalytics(year, month, options = {}) {
  const scoped = applyFilters(getTransactions(), {
    year,
    month,
    member: options.member || "all",
  });

  const transactionCount = scoped.length;
  const incomeCount = scoped.filter(item => item.type === "income").length;
  const expenseCount = scoped.filter(item => item.type === "expense").length;
  const averageTransaction = transactionCount
    ? Math.round(scoped.reduce((total, item) => total + item.amount, 0) / transactionCount)
    : 0;

  const topExpenseCategory = Object.entries(
    scoped
      .filter(item => item.type === "expense")
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {})
  ).sort((a, b) => b[1] - a[1])[0] || null;

  const topMember = Object.entries(
    scoped.reduce((acc, item) => {
      if (!item.member) return acc;
      acc[item.member] = (acc[item.member] || 0) + item.amount;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0] || null;

  return {
    transactionCount,
    incomeCount,
    expenseCount,
    averageTransaction,
    topExpenseCategory,
    topMember,
  };
}

export function getTransactionsByFilters(filters = {}) {
  const sorted = [...applyFilters(getTransactions(), filters)].sort(
    (first, second) => new Date(second.date) - new Date(first.date)
  );
  return sorted;
}

export function getExpenseCategories() {
  return getMasterList("financeExpenseCategories").map(mapMasterCategory);
}

export function getIncomeCategories() {
  return getMasterList("financeIncomeCategories").map(mapMasterCategory);
}

export function getFinanceCategoriesByType(type) {
  return type === "income" ? getIncomeCategories() : getExpenseCategories();
}

export function getSavingsTarget() {
  const stored = localStorage.getItem("savings_target");
  return stored
    ? JSON.parse(stored)
    : {
        target: 50000000,
        current: 15000000,
        name: "Liburan Keluarga 2026",
      };
}

export function updateSavingsTarget(data) {
  const sanitized = {
    name: String(data?.name || "Target Tabungan").trim(),
    target: Math.max(Number(data?.target) || 0, 0),
    current: Math.max(Number(data?.current) || 0, 0),
  };
  localStorage.setItem("savings_target", JSON.stringify(sanitized));
  return sanitized;
}
