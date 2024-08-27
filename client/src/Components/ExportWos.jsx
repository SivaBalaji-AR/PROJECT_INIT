import * as XLSX from 'xlsx';

const ExportWos = ({ data, filename }) => {
  const handleExport = () => {
    // Step 1: Define the columns based on the Web of Science data structure
    const columns = [
      "uid",
      "title",
      "source.sourceTitle",
      "source.publishYear",
      "source.publishMonth",
      "source.volume",
      "source.issue",
      "source.pages.range",
      "names.authors",
      "keywords.authorKeywords",
      "identifiers.doi",
      "identifiers.issn",
      "identifiers.eissn",
      "links.record",
      "links.references",
      "links.related"
    ];

    // Step 2: Normalize data
    const normalizedData = data.map(item => {
      const normalizedItem = {};

      columns.forEach(column => {
        const keys = column.split('.');  // Split nested keys
        let value = item;
        keys.forEach(key => {
          value = value ? value[key] : null;
        });

        // Handle authors specifically
        if (column === "names.authors" && Array.isArray(value)) {
          value = value.map(author => author.displayName).join('; ');
        }

        // Handle other arrays (e.g., keywords, identifiers)
        if (Array.isArray(value) && column !== "names.authors") {
          value = value.join('; ');
        }

        normalizedItem[column] = value;
      });

      return normalizedItem;
    });

    // Step 3: Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(normalizedData, { header: columns });

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

export default ExportWos;
