function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={cx(
        "h-10 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-sky-400/60",
        className
      )}
    />
  );
}
