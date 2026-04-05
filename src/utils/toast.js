// Simple toast notification utility
export function showToast(message, type = 'success') {
  // For now, using browser alert as simple feedback
  // In production, you'd use a proper toast library like Sonner or React Toastify
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // If you want visual feedback in browser, you could uncomment below:
  // alert(`${type.toUpperCase()}: ${message}`);
}

export function downloadCSV(data, filename) {
  const csv = Array.isArray(data) ? convertToCSV(data) : data;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'download.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function convertToCSV(data) {
  if (!Array.isArray(data) || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csv = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
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
