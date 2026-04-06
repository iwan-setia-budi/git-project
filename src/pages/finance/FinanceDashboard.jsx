import { useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Sparkles,
  UserRound,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  getMonthlySummaryWithComparison,
  getTransactionsByFilters,
  getExpenseByCategory,
  getFinanceAnalytics,
  getExpenseCategories,
} from "@/services/financeService";
import { getFamilyMembers } from "@/services/familyService";

function formatCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

export default function FinanceDashboard() {
  const [monthlySummary, setMonthlySummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    previous: { income: 0, expense: 0 },
    expenseDelta: 0,
    incomeDelta: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [expenseByCategory, setExpenseByCategory] = useState({});
  const [analytics, setAnalytics] = useState({
    transactionCount: 0,
    incomeCount: 0,
    expenseCount: 0,
    averageTransaction: 0,
    topExpenseCategory: null,
    topMember: null,
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [selectedMember, setSelectedMember] = useState("all");
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setMembers(getFamilyMembers().map(member => member.name));
    setCategories(getExpenseCategories());
  }, []);

  useEffect(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const summary = getMonthlySummaryWithComparison(year, month - 1, {
      member: selectedMember,
    });
    setMonthlySummary(summary);

    const filtered = getTransactionsByFilters({
      year,
      month: month - 1,
      member: selectedMember,
    });
    setTransactions(filtered);

    const expenseData = getExpenseByCategory(year, month - 1, {
      member: selectedMember,
    });
    setExpenseByCategory(expenseData);

    setAnalytics(
      getFinanceAnalytics(year, month - 1, {
        member: selectedMember,
      })
    );
  }, [selectedMonth, selectedMember]);

  const getCategoryColor = categoryName => {
    const category = categories.find(
      c => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.color || "#6b7280";
  };

  const spendingRate =
    monthlySummary.income === 0
      ? 0
      : (monthlySummary.expense / monthlySummary.income) * 100;

  const totalExpense = Math.max(monthlySummary.expense, 1);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-7xl p-5 sm:p-7 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-sky-300">Keuangan Keluarga</p>
            <h1 className="mt-1 text-3xl font-bold">Dashboard Keuangan</h1>
            <p className="mt-2 text-sm text-slate-300">
              Kontrol pemasukan dan pengeluaran dengan insight profesional
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/finance/add-transaction">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Transaksi
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:grid-cols-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            style={{ colorScheme: "dark" }}
          />

          <select
            value={selectedMember}
            onChange={e => setSelectedMember(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            style={{ colorScheme: "dark" }}
          >
            <option className="bg-slate-900 text-slate-100" value="all">Semua Anggota</option>
            {members.map(member => (
              <option className="bg-slate-900 text-slate-100" key={member} value={member}>
                {member}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 rounded-lg border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
            <UserRound className="h-4 w-4" />
            Fokus: {selectedMember === "all" ? "Keluarga" : selectedMember}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-500/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Pemasukan</p>
                  <h3 className="mt-3 text-2xl font-bold">
                    {formatCurrency(monthlySummary.income)}
                  </h3>
                  <p className="mt-2 flex items-center gap-1 text-xs text-emerald-300">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {monthlySummary.incomeDelta.toFixed(1)}% vs bulan lalu
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border border-rose-400/20 bg-rose-500/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Pengeluaran</p>
                  <h3 className="mt-3 text-2xl font-bold">
                    {formatCurrency(monthlySummary.expense)}
                  </h3>
                  <p className="mt-2 flex items-center gap-1 text-xs text-rose-300">
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    {monthlySummary.expenseDelta.toFixed(1)}% vs bulan lalu
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border border-cyan-400/20 bg-cyan-500/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Saldo</p>
                  <h3 className="mt-3 text-2xl font-bold">
                    {formatCurrency(monthlySummary.balance)}
                  </h3>
                  <p className="mt-2 text-xs text-cyan-200">
                    Rasio belanja {spendingRate.toFixed(1)}%
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-cyan-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-4">
          <Card className="rounded-xl border border-white/10 bg-white/5">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Jumlah Transaksi</p>
              <p className="mt-2 text-xl font-bold text-white">{analytics.transactionCount}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-white/10 bg-white/5">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Rata-rata Transaksi</p>
              <p className="mt-2 text-xl font-bold text-cyan-300">{formatCurrency(analytics.averageTransaction)}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-white/10 bg-white/5">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Kategori Pengeluaran Utama</p>
              <p className="mt-2 text-xl font-bold text-amber-300 capitalize">
                {analytics.topExpenseCategory?.[0] || "-"}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-white/10 bg-white/5">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400">Anggota Paling Aktif</p>
              <p className="mt-2 text-xl font-bold text-emerald-300">
                {analytics.topMember?.[0] || "-"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Month Selector & Reports */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Transactions */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Transaksi Terbaru</h2>
                  <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
                    {transactions.length} transaksi
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {transactions.length > 0 ? (
                    transactions.map(transaction => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex flex-1 items-center gap-4">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: getCategoryColor(transaction.category),
                            }}
                          >
                            {transaction.type === "income" ? (
                              <TrendingUp className="h-5 w-5 text-white" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium capitalize">
                              {transaction.category}
                            </p>
                            <p className="text-sm text-slate-400">
                              {transaction.description || "Tanpa deskripsi"}
                            </p>
                            {transaction.member ? (
                              <p className="mt-0.5 text-xs text-cyan-300">{transaction.member}</p>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
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
                          <p className="text-xs text-slate-400">
                            {new Date(transaction.date).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">Tidak ada transaksi bulan ini</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Category Breakdown */}
          <div className="space-y-6">
            <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Pengeluaran Kategori</h2>
                <div className="space-y-3">
                  {Object.entries(expenseByCategory).length > 0 ? (
                    Object.entries(expenseByCategory)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, amount]) => (
                        <div key={category}>
                          <div className="mb-1 flex items-center justify-between">
                            <p className="text-sm font-medium capitalize">{category}</p>
                            <p className="text-sm font-bold">
                              Rp {amount.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <div className="h-2 w-full rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${
                                  (amount / totalExpense) * 100
                                }%`,
                                backgroundColor: getCategoryColor(category),
                              }}
                            />
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-slate-400">Tidak ada pengeluaran</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-sm font-semibold">Insight Cepat</p>
                </div>
                <p className="mt-3 text-sm text-slate-200">
                  Pengeluaran tertinggi ada di kategori
                  <span className="font-semibold text-amber-300"> {analytics.topExpenseCategory?.[0] || "-"}</span>
                  {analytics.topExpenseCategory
                    ? ` sebesar ${formatCurrency(analytics.topExpenseCategory[1])}`
                    : ""}.
                </p>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid gap-3">
              <Link to="/finance/history">
                <Button variant="outline" className="w-full">
                  Riwayat Lengkap
                </Button>
              </Link>
              <Link to="/finance/report">
                <Button variant="outline" className="w-full">
                  Laporan Detail
                </Button>
              </Link>
              <Link to="/finance/savings">
                <Button variant="outline" className="w-full">
                  Target Tabungan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
