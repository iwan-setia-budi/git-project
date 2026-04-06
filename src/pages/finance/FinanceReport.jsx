import { useState, useEffect } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  getTransactions,
  getMonthlySummary,
  getExpenseByCategory,
  getExpenseCategories,
} from "@/services/financeService";

export default function FinanceReport() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reports, setReports] = useState([]);
  const [categories] = useState(getExpenseCategories());

  useEffect(() => {
    const allTransactions = getTransactions();
    const monthlyReports = [];

    for (let month = 0; month < 12; month++) {
      const summary = getMonthlySummary(selectedYear, month);
      const expenseData = getExpenseByCategory(selectedYear, month);
      monthlyReports.push({
        month: new Date(selectedYear, month, 1).toLocaleDateString("id-ID", {
          month: "long",
        }),
        ...summary,
        expenses: expenseData,
      });
    }

    setReports(monthlyReports);
  }, [selectedYear]);

  const getCategoryColor = categoryName => {
    const category = categories.find(
      c => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.color || "#6b7280";
  };

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
          <div className="flex gap-3">
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(parseInt(e.target.value))}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
            >
              {[2024, 2025, 2026, 2027].map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Monthly Reports */}
        <div className="space-y-4">
          {reports.map((report, index) => (
            <Card key={index} className="rounded-xl backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold capitalize">{report.month}</h3>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-slate-400">Pemasukan</p>
                      <p className="font-bold text-green-400">
                        Rp {report.income.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Pengeluaran</p>
                      <p className="font-bold text-red-400">
                        Rp {report.expense.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Saldo</p>
                      <p className="font-bold text-sky-400">
                        Rp {report.balance.toLocaleString("id-ID")}
                      </p>
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
                          <div key={category} className="rounded-lg bg-white/5 p-3">
                            <p className="text-xs capitalized text-slate-400">
                              {category}
                            </p>
                            <p className="mt-1 font-bold">
                              Rp {amount.toLocaleString("id-ID")}
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
