import PropTypes from 'prop-types';
import { cx } from '@/utils/classname';

/**
 * Button component with variant and size support
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Button style: 'default' or 'outline'
 * @param {string} size - Button size: 'default' or 'icon'
 * @param {string} type - HTML button type
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} children - Button content
 * @param {object} props - Additional HTML attributes
 */
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
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'outline']),
  size: PropTypes.oneOf(['default', 'icon']),
  type: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
