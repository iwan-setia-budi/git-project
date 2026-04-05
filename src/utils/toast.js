import { escapeCSV } from './validation';

/**
 * Show toast notification message
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 */
export function showToast(message, type = 'success') {
  if (typeof message !== 'string') return;
  console.log(`[${type.toUpperCase()}] ${message}`);
  // TODO: Integrate with Sonner or React Toastify
}

/**
 * Download data as CSV file with proper escaping to prevent CSV injection
 * @param {Array|string} data - Array of objects or CSV string
 * @param {string} filename - Output filename
 */
export function downloadCSV(data, filename) {
  try {
    if (!data) {
      showToast('No data to export', 'error');
      return;
    }
    
    if (typeof filename !== 'string' || !filename.trim()) {
      filename = 'download.csv';
    }
    
    // Sanitize filename to prevent directory traversal
    filename = filename.replace(/[\/\\:*?"<>|]/g, '_');
    
    const csv = Array.isArray(data) ? convertToCSV(data) : String(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('CSV download error:', error);
    showToast('Failed to download CSV', 'error');
  }
}

/**
 * Convert array of objects to CSV string with proper escaping
 * Prevents CSV injection attacks
 * @param {Array} data - Array of objects
 * @returns {string} CSV formatted string
 */
function convertToCSV(data) {
  if (!Array.isArray(data) || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.map(h => escapeCSV(String(h))).join(',');
  const csv = [csvHeaders];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return escapeCSV(String(value === null || value === undefined ? '' : value));
    });
    csv.push(values.join(','));
  }
  
  return csv.join('\n');
}

export function printDocument(content) {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.print();
}
