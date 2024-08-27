import { useEffect, useState } from 'react';
import ExportWos from './ExportWos';
import './DisplayWebOfScience.css';
import DownloadWordWos from './DownloadeWordWos';

const DisplayWebOfScience = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/webofscience')
      .then(response => response.json())
      .then(data => {
        setData(data.hits);
        setFilteredData(data.hits);
      })
      .catch(error => setError(error.message));
  }, []);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    applyFilterAndSort(e.target.value, startYear, endYear);
  };

  const handleStartYearChange = (e) => {
    setStartYear(e.target.value);
  };

  const handleEndYearChange = (e) => {
    setEndYear(e.target.value);
  };

  const handleFilter = () => {
    applyFilterAndSort(sortOrder, startYear, endYear);
  };

  const applyFilterAndSort = (sortOrder, startYear, endYear) => {
    const filtered = data.filter(item => {
      const publicationYear = item.source.publishYear;
      const start = startYear ? parseInt(startYear, 10) : -Infinity;
      const end = endYear ? parseInt(endYear, 10) : Infinity;
      return publicationYear >= start && publicationYear <= end;
    });

    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(`${a.source.publishYear}-${a.source.publishMonth}-01`);
      const dateB = new Date(`${b.source.publishYear}-${b.source.publishMonth}-01`);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredData(sorted);
  };

  const generateYearOptions = () => {
    const startYear = 2000;
    const endYear = new Date().getFullYear();
    const years = [];

    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    return years;
  };

  return (
    <div className="web-of-science-container">
      <h1 className="web-of-science-title">Web of Science Data</h1>
      <p>Number of papers: {filteredData.length}</p>
      {error && <p className="web-of-science-error">Error: {error}</p>}
      
      <div className="filter-sort-container">
        <div className="filter-container">
          <label htmlFor="startYear">Start Year:</label>
          <select id="startYear" value={startYear} onChange={handleStartYearChange}>
            <option value="">Select Year</option>
            {generateYearOptions().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <label htmlFor="endYear">End Year:</label>
          <select id="endYear" value={endYear} onChange={handleEndYearChange}>
            <option value="">Select Year</option>
            {generateYearOptions().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <button className="filter-button" onClick={handleFilter}>Filter</button>
        </div>
        
        <div className="sort-container">
          <label htmlFor="sortOrder">Sort by: </label>
          <select id="sortOrder" value={sortOrder} onChange={handleSortChange}>
            <option value="">Sort</option>
            <option value="latest">Latest First</option>
            <option value="earliest">Earliest First</option>
          </select>
        </div>
        <DownloadWordWos publications={filteredData} />
        <ExportWos data={filteredData} filename="web_of_science_data.xlsx" />
      </div>
      
      <div className="web-of-science-publication-list">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div key={index} className="web-of-science-publication-item">
              <h4 className="web-of-science-publication-title">{item.title}</h4>
              <p className="web-of-science-publication-authors">
                <strong>Authors: </strong>{item.names.authors.map(author => author.displayName).join(' | ')}
              </p>
              <p className="web-of-science-publication-date">
                <strong>Published Date: </strong>{item.source.publishMonth} {item.source.publishYear}
              </p>
              <p className="web-of-science-publication-journal">
                <strong>Journal: </strong>{item.source.sourceTitle}
              </p>
              <p className="web-of-science-publication-pages">
                <strong>Pages: </strong>{item.source.pages.range}
              </p>
              <a href={item.links.record} target="_blank" rel="noopener noreferrer" className="web-of-science-publication-link">View Full Record</a>
            </div>
          ))
        ) : (
          <p className="web-of-science-no-data">No Web of Science data available</p>
        )}
      </div>
    </div>
  );
};

export default DisplayWebOfScience;
