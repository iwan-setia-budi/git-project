import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { cx } from '@/utils/classname';

/**
 * Input component with consistent styling
 * @param {string} className - Additional CSS classes
 * @param {object} props - HTML input attributes
 */
export const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={cx(
        "h-10 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-sky-400/60 transition",
        className
      )}
      aria-label={props['aria-label'] || props.placeholder}
    />
  );
});

Input.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};
