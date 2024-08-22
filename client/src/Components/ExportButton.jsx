import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';  // Add PropTypes for validation

const ExportButton = ({ data, filename }) => {
  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
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

// PropTypes validation
ExportButton.propTypes = {
  data: PropTypes.array.isRequired,
  filename: PropTypes.string.isRequired,
};

export default ExportButton;
