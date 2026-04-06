import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Trash2,
  TrendingUp,
  TrendingDown,
  Download,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  getTransactionsByFilters,
  deleteTransaction,
  getExpenseCategories,
  getIncomeCategories,
} from "@/services/financeService";
import { getFamilyMembers } from "@/services/familyService";
import { showToast } from "@/utils/toast";

function toMonthValue(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function exportToCsv(rows) {
  const header = ["Tanggal", "Tipe", "Kategori", "Deskripsi", "Anggota", "Jumlah"];
  const csvRows = rows.map(row => [
    row.date,
    row.type,
    row.category,
    row.description || "",
    row.member || "",
    row.amount,
  ]);
  const csvContent = [header, ...csvRows]
    .map(cols => cols.map(col => `"${String(col).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "riwayat-transaksi.csv";
  link.click();
  window.URL.revokeObjectURL(url);
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterMember, setFilterMember] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(toMonthValue());
  const [searchTerm, setSearchTerm] = useState("");
  const [categories] = useState([...getExpenseCategories(), ...getIncomeCategories()]);
  const [members] = useState(getFamilyMembers());
  const [reloadKey, setReloadKey] = useState(0);

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    total: 0,
  });

  useEffect(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const filtered = getTransactionsByFilters({
      year,
      month: month - 1,
      type: filterType,
      member: filterMember,
      category: filterCategory,
    }).filter(transaction => {
      const keyword = searchTerm.trim().toLowerCase();
      if (!keyword) return true;
      return (
        transaction.category.toLowerCase().includes(keyword) ||
        String(transaction.description || "").toLowerCase().includes(keyword) ||
        String(transaction.member || "").toLowerCase().includes(keyword)
      );
    });

    setTransactions(filtered);

    const income = filtered
      .filter(transaction => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);
    const expense = filtered
      .filter(transaction => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);

    setSummary({ income, expense, total: filtered.length });
  }, [filterType, filterMember, filterCategory, searchTerm, selectedMonth, reloadKey]);

  const handleDelete = id => {
    if (confirm("Yakin ingin menghapus transaksi ini?")) {
      deleteTransaction(id);
      setReloadKey(prev => prev + 1);
      showToast("Transaksi berhasil dihapus", "success");
    }
  };

  const getCategoryColor = categoryName => {
    const category = categories.find(
      c => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.color || "#6b7280";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-4xl p-5 sm:p-7 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link to="/finance">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Riwayat Transaksi</h1>
              <p className="text-slate-300">Audit pemasukan dan pengeluaran dengan filter profesional</p>
            </div>
          </div>
          <Button onClick={() => exportToCsv(transactions)} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card className="rounded-xl border border-emerald-400/20 bg-emerald-500/10">
            <CardContent className="p-4">
              <p className="text-xs text-slate-300">Pemasukan</p>
              <p className="mt-2 text-xl font-bold text-emerald-300">Rp {summary.income.toLocaleString("id-ID")}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-rose-400/20 bg-rose-500/10">
            <CardContent className="p-4">
              <p className="text-xs text-slate-300">Pengeluaran</p>
              <p className="mt-2 text-xl font-bold text-rose-300">Rp {summary.expense.toLocaleString("id-ID")}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-cyan-400/20 bg-cyan-500/10">
            <CardContent className="p-4">
              <p className="text-xs text-slate-300">Jumlah Transaksi</p>
              <p className="mt-2 text-xl font-bold text-cyan-300">{summary.total}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari transaksi"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-white placeholder-slate-400"
                />
              </div>
              <input
                type="month"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                style={{ colorScheme: "dark" }}
              />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                style={{ colorScheme: "dark" }}
              >
                <option className="bg-slate-900 text-slate-100" value="all">Semua Tipe</option>
                <option className="bg-slate-900 text-slate-100" value="income">Pemasukan</option>
                <option className="bg-slate-900 text-slate-100" value="expense">Pengeluaran</option>
              </select>
              <select
                value={filterMember}
                onChange={e => setFilterMember(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                style={{ colorScheme: "dark" }}
              >
                <option className="bg-slate-900 text-slate-100" value="all">Semua Anggota</option>
                {members.map(member => (
                  <option className="bg-slate-900 text-slate-100" key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                style={{ colorScheme: "dark" }}
              >
                <option className="bg-slate-900 text-slate-100" value="all">Semua Kategori</option>
                {categories.map(category => (
                  <option className="bg-slate-900 text-slate-100" key={category.value} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <Card key={transaction.id} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: getCategoryColor(transaction.category),
                        }}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-6 w-6 text-white" />
                        ) : (
                          <TrendingDown className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold capitalize">
                          {transaction.category}
                        </p>
                        <p className="text-sm text-slate-400">
                          {transaction.description || "Tanpa keterangan"}
                        </p>
                        {transaction.member ? <p className="text-xs text-cyan-300">{transaction.member}</p> : null}
                        <p className="text-xs text-slate-500">
                          {new Date(transaction.date).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p
                        className={`font-bold ${
                          transaction.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"} Rp
                        {transaction.amount.toLocaleString("id-ID")}
                      </p>
                      <button
                        onClick={() => handleDelete(transaction.id)}
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
              <p className="text-slate-400">Tidak ada transaksi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
