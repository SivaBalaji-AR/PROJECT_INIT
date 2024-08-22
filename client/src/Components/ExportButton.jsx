import * as XLSX from 'xlsx';


const ExportButton = ({ data, filename }) => {
  const handleExport = () => {
    // Step 1: Collect all unique columns
    const allColumns = new Set();
    data.forEach(item => {
      Object.keys(item).forEach(key => allColumns.add(key));
    });

    // Convert Set to Array for easier processing
    const columnsArray = Array.from(allColumns);

    // Step 2: Normalize data
    const normalizedData = data.map(item => {
      const normalizedItem = {};
      columnsArray.forEach(column => {
        normalizedItem[column] = item[column] || null;
      });
      return normalizedItem;
    });

    // Step 3: Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(normalizedData, { header: columnsArray });

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Step 4: Generate a binary string and export the file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

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