import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast, downloadCSV } from "@/utils/toast";

const billingStats = [
  {
    title: "Current Plan",
    value: "Enterprise",
    note: "Premium business workspace",
    icon: ShieldCheck,
  },
  {
    title: "Monthly Cost",
    value: "$2,400",
    note: "Billed every 12th",
    icon: Wallet,
  },
  {
    title: "Invoices",
    value: "28",
    note: "All billing history stored",
    icon: Receipt,
  },
  {
    title: "Payment Method",
    value: "Visa •••• 2048",
    note: "Primary active card",
    icon: CreditCard,
  },
];

const invoices = [
  {
    id: "INV-2048",
    description: "Enterprise Workspace Subscription",
    amount: "$2,400",
    date: "12 Apr 2026",
    status: "Paid",
  },
  {
    id: "INV-2041",
    description: "Enterprise Workspace Subscription",
    amount: "$2,400",
    date: "12 Mar 2026",
    status: "Paid",
  },
  {
    id: "INV-2035",
    description: "Business Add-on Package",
    amount: "$680",
    date: "12 Feb 2026",
    status: "Pending",
  },
  {
    id: "INV-2029",
    description: "Security Suite Renewal",
    amount: "$320",
    date: "12 Jan 2026",
    status: "Paid",
  },
  {
    id: "INV-2023",
    description: "Analytics Expansion Module",
    amount: "$540",
    date: "12 Dec 2025",
    status: "Archived",
  },
];

const plans = [
  {
    name: "Business",
    price: "$1,250",
    note: "For growing teams",
  },
  {
    name: "Enterprise",
    price: "$2,400",
    note: "Best for advanced companies",
    featured: true,
  },
  {
    name: "Custom",
    price: "Contact Us",
    note: "Tailored solution",
  },
];

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleExportBilling = () => {
    const billingData = invoices.map(inv => ({
      "Invoice ID": inv.id,
      Description: inv.description,
      Amount: inv.amount,
      Date: inv.date,
      Status: inv.status
    }));
    downloadCSV(billingData, "billing-invoices.csv");
    showToast("Billing records exported successfully!");
  };

  const handleUpgradePlan = () => {
    showToast("Upgrade dialog opened - Select your desired plan (Pro, Enterprise, Enterprise Plus)");
  };

  const handleDownloadInvoice = (invoiceId) => {
    showToast(`Downloading invoice ${invoiceId}...`);
  };

  const handleAddPaymentMethod = () => {
    showToast("Add Payment Method dialog opened - Enter your card details");
  };

  const handleQuickAction = (action) => {
    showToast(`Opening: ${action}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_22%)]" />

      <div className="mx-auto max-w-7xl p-5 sm:p-7 lg:p-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-sky-300">Billing Workspace</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Billing & Subscription Center
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Kelola paket langganan, invoice, pembayaran, dan metode transaksi
                dalam tampilan premium dan profesional.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search billing..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button variant="outline" onClick={handleExportBilling}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>

              <Button onClick={handleUpgradePlan}>
                <Plus className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {billingStats.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="rounded-[1.75rem] backdrop-blur-xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-300">{item.title}</p>
                      <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                        {item.value}
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-indigo-500/20">
                      <Icon className="h-5 w-5 text-sky-300" />
                    </div>
                  </div>
                  <p className="mt-5 text-xs text-slate-400">{item.note}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-300">Invoice History</p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    Recent Transactions
                  </h2>
                </div>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
                <div className="grid grid-cols-5 bg-white/10 px-5 py-4 text-sm text-slate-300">
                  <span>Invoice</span>
                  <span>Description</span>
                  <span>Amount</span>
                  <span>Date</span>
                  <span>Status</span>
                </div>

                {invoices.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-5 items-center border-t border-white/10 px-5 py-4 text-sm"
                  >
                    <span className="font-medium">{item.id}</span>
                    <span className="text-slate-300">{item.description}</span>
                    <span className="text-slate-300">{item.amount}</span>
                    <span className="text-slate-300">{item.date}</span>
                    <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-sky-300">Current Subscription</p>
                <h2 className="mt-1 text-2xl font-semibold">Plan Details</h2>

                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Active Package</p>
                      <h3 className="mt-2 text-2xl font-semibold">
                        Enterprise Suite
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Includes advanced analytics, premium security,
                        executive reports, and multi-user workspace access.
                      </p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                  </div>

                  <Button className="mt-5 w-full" onClick={handleUpgradePlan}>
                    Manage Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-sky-300">Plan Options</p>
                <h2 className="mt-1 text-2xl font-semibold">Upgrade Choices</h2>

                <div className="mt-6 space-y-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`rounded-[1.5rem] border p-4 ${
                        plan.featured
                          ? "border-sky-400/30 bg-gradient-to-r from-sky-400/10 to-indigo-500/10"
                          : "border-white/10 bg-slate-950/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {plan.note}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-sky-300">
                          {plan.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-5 flex w-full items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/30 px-4 py-4 text-left transition hover:bg-white/10" onClick={() => handleQuickAction('Open Billing Settings')}>
                  <span>Open Billing Settings</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                </button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}