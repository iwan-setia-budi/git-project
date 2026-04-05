/**
 * Utility function to conditionally join classnames
 * Filters out falsy values and joins with space
 * @param {...any} parts - CSS class names or conditions
 * @returns {string} Joined class names
 */
export function cx(...parts) {
  return parts
    .filter(Boolean)
    .join(' ');
}
