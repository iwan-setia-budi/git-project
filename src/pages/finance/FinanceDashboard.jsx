import { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  getMonthlySummary,
  getTransactions,
  getExpenseByCategory,
  getExpenseCategories,
} from "@/services/financeService";

export default function FinanceDashboard() {
  const [monthlySummary, setMonthlySummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [expenseByCategory, setExpenseByCategory] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const summary = getMonthlySummary(year, month - 1);
    setMonthlySummary(summary);

    const allTransactions = getTransactions();
    const filtered = allTransactions.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() === month - 1;
    });
    setTransactions(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));

    const expenseData = getExpenseByCategory(year, month - 1);
    setExpenseByCategory(expenseData);

    setCategories(getExpenseCategories());
  }, [selectedMonth]);

  const getCategoryColor = (categoryName) => {
    const category = categories.find(
      c => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.color || "#6b7280";
  };

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
              Kelola pemasukan, pengeluaran, dan tabungan keluarga
            </p>
          </div>
          <Link to="/finance/add-transaction">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Transaksi
            </Button>
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="rounded-[1.75rem] backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Pemasukan</p>
                  <h3 className="mt-3 text-2xl font-bold">
                    Rp {monthlySummary.income.toLocaleString("id-ID")}
                  </h3>
                </div>
                <TrendingUp className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Pengeluaran</p>
                  <h3 className="mt-3 text-2xl font-bold">
                    Rp {monthlySummary.expense.toLocaleString("id-ID")}
                  </h3>
                </div>
                <TrendingDown className="h-8 w-8 text-red-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Saldo</p>
                  <h3 className="mt-3 text-2xl font-bold">
                    Rp {monthlySummary.balance.toLocaleString("id-ID")}
                  </h3>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500">
                  <span className="text-xs font-bold">₽</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Month Selector & Reports */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Transactions */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Transaksi Terbaru</h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={e => setSelectedMonth(e.target.value)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    />
                  </div>
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
                              {transaction.description}
                            </p>
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
            <Card className="rounded-2xl backdrop-blur-xl">
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
                                  (amount / monthlySummary.expense) * 100
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
