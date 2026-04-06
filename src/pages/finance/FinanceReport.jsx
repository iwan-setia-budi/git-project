import { useState, useEffect } from "react";
import { ArrowLeft, Download, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  getMonthlySummary,
  getExpenseByCategory,
  getFinanceAnalytics,
} from "@/services/financeService";

function formatCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function exportReportCsv(year, reports) {
  const header = ["Bulan", "Pemasukan", "Pengeluaran", "Saldo"];
  const rows = reports.map(report => [report.month, report.income, report.expense, report.balance]);
  const csv = [header, ...rows]
    .map(cols => cols.map(col => `"${String(col).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `laporan-keuangan-${year}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function FinanceReport() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reports, setReports] = useState([]);
  const [yearSummary, setYearSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    transactionCount: 0,
  });
  useEffect(() => {
    const monthlyReports = [];
    let totalIncome = 0;
    let totalExpense = 0;
    let totalTransactions = 0;

    for (let month = 0; month < 12; month++) {
      const summary = getMonthlySummary(selectedYear, month);
      const expenseData = getExpenseByCategory(selectedYear, month);
      const analytics = getFinanceAnalytics(selectedYear, month);

      totalIncome += summary.income;
      totalExpense += summary.expense;
      totalTransactions += analytics.transactionCount;

      monthlyReports.push({
        month: new Date(selectedYear, month, 1).toLocaleDateString("id-ID", {
          month: "long",
        }),
        ...summary,
        expenses: expenseData,
        transactionCount: analytics.transactionCount,
      });
    }

    setReports(monthlyReports);
    setYearSummary({
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: totalTransactions,
    });
  }, [selectedYear]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-6xl p-5 sm:p-7 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <Link to="/finance">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
              <p className="text-slate-300">Analisis menyeluruh untuk tahun {selectedYear}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(parseInt(e.target.value))}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white sm:flex-none"
            >
              {[2024, 2025, 2026, 2027].map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Button onClick={() => exportReportCsv(selectedYear, reports)} className="flex-1 gap-2 sm:flex-none">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="rounded-xl border border-emerald-400/20 bg-emerald-500/10">
            <CardContent className="p-4">
              <p className="text-xs text-slate-300">Total Pemasukan</p>
              <p className="mt-2 text-xl font-bold text-emerald-300">{formatCurrency(yearSummary.income)}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-rose-400/20 bg-rose-500/10">
            <CardContent className="p-4">
              <p className="text-xs text-slate-300">Total Pengeluaran</p>
              <p className="mt-2 text-xl font-bold text-rose-300">{formatCurrency(yearSummary.expense)}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-cyan-400/20 bg-cyan-500/10">
            <CardContent className="p-4">
              <p className="text-xs text-slate-300">Saldo Tahunan</p>
              <p className="mt-2 text-xl font-bold text-cyan-300">{formatCurrency(yearSummary.balance)}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-white/10 bg-white/5">
            <CardContent className="p-4">
              <p className="text-xs text-slate-300">Jumlah Transaksi</p>
              <p className="mt-2 text-xl font-bold text-white">{yearSummary.transactionCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Reports */}
        <div className="space-y-4">
          {reports.map((report, index) => (
            <Card key={index} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-bold capitalize">{report.month}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:gap-6">
                    <div>
                      <p className="text-xs text-slate-400">Pemasukan</p>
                      <p className="flex items-center gap-1 font-bold text-green-400 text-sm sm:text-base">
                        <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{formatCurrency(report.income)}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Pengeluaran</p>
                      <p className="flex items-center gap-1 font-bold text-red-400 text-sm sm:text-base">
                        <TrendingDown className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{formatCurrency(report.expense)}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Saldo</p>
                      <p className="flex items-center gap-1 font-bold text-sky-400 text-sm sm:text-base">
                        <Wallet className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{formatCurrency(report.balance)}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Transaksi</p>
                      <p className="font-bold text-slate-200 text-sm sm:text-base">{report.transactionCount}</p>
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                {Object.keys(report.expenses).length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <p className="mb-3 text-sm font-medium">Rincian Pengeluaran</p>
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {Object.entries(report.expenses)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, amount]) => (
                          <div key={category} className="rounded-lg border border-white/10 bg-white/5 p-3">
                            <p className="text-xs capitalized text-slate-400">
                              {category}
                            </p>
                            <p className="mt-1 font-bold">
                              {formatCurrency(amount)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
