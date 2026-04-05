import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "@/services/authService";
import { sanitizeInput, isValidEmail } from "@/utils/validation";
import { showToast } from "@/utils/toast";

export default function PremiumLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      const cleanEmail = sanitizeInput(email.trim());
      const cleanPassword = sanitizeInput(password);

      if (!cleanEmail || !isValidEmail(cleanEmail)) {
        showToast("Email tidak valid", "error");
        setIsLoading(false);
        return;
      }

      if (!cleanPassword || cleanPassword.length < 6) {
        showToast("Password minimal 6 karakter", "error");
        setIsLoading(false);
        return;
      }

      // Demo login - dalam production ini akan fetch ke backend
      // const response = await apiRequest("/auth/login", {
      //   method: "POST",
      //   body: { email: cleanEmail, password: cleanPassword }
      // });
      // const token = response.token;

      // Demo token generation (untuk testing saja)
      const token = `demo_token_${Date.now()}`;

      setAuthToken(token);
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      showToast("Login berhasil! Selamat datang.", "success");
      
      // Redirect ke dashboard
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      showToast("Login gagal. Periksa email dan password Anda.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_30%)]" />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between p-12 xl:p-16 border-r border-white/10 bg-white/5 backdrop-blur-xl">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 shadow-lg">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Secure Workspace Access
            </div>

            <div className="mt-10 max-w-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Enterprise Suite</p>
              <h1 className="mt-5 text-5xl font-semibold leading-tight xl:text-6xl">
                Login experience yang modern, premium, dan profesional.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Didesain untuk produk digital kelas atas dengan visual elegan, struktur yang rapi, dan kesan terpercaya sejak interaksi pertama.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Encrypted', desc: 'Perlindungan berlapis untuk setiap sesi login.' },
              { title: 'Fast Access', desc: 'Alur masuk singkat dengan UX yang efisien.' },
              { title: 'Trusted', desc: 'Tampilan yang memberi rasa aman dan kredibel.' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-md"
              >
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-sky-300">Welcome back</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Sign in</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-lg font-bold shadow-lg">
                S
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Email address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-white outline-none ring-0 placeholder:text-slate-400 transition focus:border-sky-400/70 disabled:opacity-60"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-200">Password</label>
                  <button type="button" className="text-sm text-sky-300 transition hover:text-sky-200" disabled={isLoading}>
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-white outline-none ring-0 placeholder:text-slate-400 transition focus:border-sky-400/70 disabled:opacity-60"
                />
              </div>

              <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-white/20 bg-slate-900 disabled:opacity-60 cursor-pointer" 
                  />
                  Remember me
                </label>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  Protected login
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-xl transition hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="relative py-2 text-center text-sm text-slate-400">
                <span className="relative z-10 bg-transparent px-3">or continue with</span>
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isLoading}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Google
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Microsoft
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Belum punya akun?{' '}
              <button type="button" disabled={isLoading} className="font-medium text-sky-300 hover:text-sky-200 disabled:opacity-60">
                Create account
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
