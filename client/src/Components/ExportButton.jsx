
import * as XLSX from 'xlsx';

const ExportButton = ({ data, filename }) => {
  const handleExport = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data array to a worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate a binary string
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a blob and a download link
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport}>Export to Excel</button>
  );
};

export default ExportButton;