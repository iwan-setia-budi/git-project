function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  disabled = false,
  children,
  ...props
}) {
  const sizeClasses = size === "icon" ? "h-10 w-10 p-0" : "px-4 py-2.5";
  const variantClasses =
    variant === "outline"
      ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
      : "bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 hover:opacity-95";
  const disabledClasses = disabled ? "cursor-not-allowed opacity-60" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(
        "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition",
        sizeClasses,
        variantClasses,
        disabledClasses,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
