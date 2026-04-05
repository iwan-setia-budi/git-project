/**
 * Input validation utilities
 * Provides sanitization and validation for user inputs
 */

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and requirements
 */
export function validatePassword(password) {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isValid = Object.values(requirements).every(Boolean);

  return { isValid, requirements };
}

/**
 * Escape special characters for CSV to prevent injection
 * @param {string} value - Value to escape
 * @returns {string} Escaped value
 */
export function escapeCSV(value) {
  if (typeof value !== 'string') return String(value);
  
  // If value contains comma, newline, or double quote, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  
  return value;
}

/**
 * Check if value is safe to render as HTML (basic check)
 * @param {string} value - Value to check
 * @returns {boolean} True if appears safe
 */
export function isSafeHTML(value) {
  if (typeof value !== 'string') return false;
  
  // Reject if contains HTML tags
  const tagRegex = /<[^>]*>/g;
  return !tagRegex.test(value);
}

/**
 * Validate URL is from same origin (prevent open redirect)
 * @param {string} url - URL to validate
 * @returns {boolean} True if safe URL
 */
export function isSafeURL(url) {
  try {
    if (!url.startsWith('/')) return false; // Only allow relative URLs
    const path = url.split('?')[0]; // Remove query string
    return /^\/[a-zA-Z0-9\-_/]*$/.test(path);
  } catch {
    return false;
  }
}
