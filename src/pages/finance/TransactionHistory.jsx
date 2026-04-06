import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  getTransactions,
  deleteTransaction,
  getExpenseCategories,
} from "@/services/financeService";
import { showToast } from "@/utils/toast";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories] = useState(getExpenseCategories());

  useEffect(() => {
    const allTransactions = getTransactions();
    setTransactions(
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (filterType !== "all") {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        t =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, filterType, searchTerm]);

  const handleDelete = id => {
    if (confirm("Yakin ingin menghapus transaksi ini?")) {
      deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
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
        <div className="mb-8 flex items-center gap-4">
          <Link to="/finance">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Riwayat Transaksi</h1>
            <p className="text-slate-300">Lihat semua transaksi keluarga</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 rounded-2xl backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                type="text"
                placeholder="Cari kemarin..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400"
              />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              >
                <option value="all">Semua Transaksi</option>
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <Card key={transaction.id} className="rounded-xl backdrop-blur-xl">
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
                          {transaction.description}
                        </p>
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
