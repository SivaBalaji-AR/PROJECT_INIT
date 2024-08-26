import { useEffect, useState } from 'react';
import ExportButton from './ExportButton';
import './DisplayWebOfScience.css';
import DownloadWordButton from './DownloadWordButton'


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
        setData(data);
        setFilteredData(data);
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
      const publicationYear = parseInt(item.publicationDate.replace(' |', '').split('-')[0], 10);
      const start = startYear ? parseInt(startYear, 10) : -Infinity;
      const end = endYear ? parseInt(endYear, 10) : Infinity;
      return publicationYear >= start && publicationYear <= end;
    });

    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.publicationDate.replace(' |', ''));
      const dateB = new Date(b.publicationDate.replace(' |', ''));
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
      <p>number of papers : {filteredData.length}</p>
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
        <DownloadWordButton publications={filteredData} />
        <ExportButton data={filteredData} filename="web_of_science_data.xlsx" />
      </div>
      
      <div className="web-of-science-publication-list">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div key={index} className="web-of-science-publication-item">
              <h4 className="web-of-science-publication-title">{item.title}</h4>
              <p className="web-of-science-publication-authors"><strong>Authors: </strong>{item.authors}</p>
              <p className="web-of-science-publication-date"><strong>Published Date: </strong>{item.publicationDate.replace(' |', '')}</p>
              <p className="web-of-science-publication-journal"><strong>Journal: </strong>{item.journal}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="web-of-science-publication-link">View Full Record</a>
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
