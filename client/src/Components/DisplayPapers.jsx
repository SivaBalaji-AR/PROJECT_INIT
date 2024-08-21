import { useEffect, useState } from "react";
import './DisplayPapers.css';
import Model from './Model';
import ExportButton from "./ExportButton";


const DisplayPapers = () => {
  const [scholarData, setScholarData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/googlescholaruser")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Scholar data:", data);
        setScholarData(data.filter(item => item.title));
        setFilteredData(data.filter(item => item.title));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  }, []);

  const handleFilter = () => {
    const filtered = scholarData.filter((item) => {
      const itemYear = parseInt(item.year, 10);
      const start = parseInt(startYear, 10);
      const end = parseInt(endYear, 10);
      return itemYear >= start && itemYear <= end;
    });
    setFilteredData(filtered);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    const sortedData = [...filteredData].sort((a, b) => {
      const yearA = parseInt(a.year, 10);
      const yearB = parseInt(b.year, 10);
      return order === "latest" ? yearB - yearA : yearA - yearB;
    });
    setFilteredData(sortedData);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let year = 1900; year <= currentYear; year++) {
      options.push(<option key={year} value={year}>{year}</option>);
    }
    return options;
  };

  const openModal = (article) => {
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="container">
      <h1 className="main-title">Google Scholar Data</h1>
      <ExportButton data={filteredData} filename="data.xlsx" />

      {error && <p className="error">Error: {error}</p>}

      <div className="filter-sort-container">
        <div className="filter-container">
          <label htmlFor="startYear">Start Year:</label>
          <select id="startYear" value={startYear} onChange={(e) => setStartYear(e.target.value)}>
            <option value="">Select Start Year</option>
            {generateYearOptions()}
          </select>

          <label htmlFor="endYear">End Year:</label>
          <select id="endYear" value={endYear} onChange={(e) => setEndYear(e.target.value)}>
            <option value="">Select End Year</option>
            {generateYearOptions()}
          </select>

          <button onClick={handleFilter}>Filter</button>
        </div>

        <div className="sort-container">
          <select value={sortOrder} onChange={(e) => handleSort(e.target.value)}>
            <option value="">Sort</option>
            <option value="latest">Latest First</option>
            <option value="earliest">Earliest First</option>
          </select>
        </div>
      </div>

      <div className="scholar-item-container">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id} className="scholar-item">
              <h4>{item.title}</h4>
              <p>Authors: {item.authors}</p>
              <p>Published At: {item.publicationDate}</p>
              <p>Publisher: {item.publisher}</p>
              <p>
                <button onClick={() => openModal(item)}>Open</button>
              </p>
            </div>
          ))
        ) : (
          <p>No Google Scholar data available for the selected year range</p>
        )}
      </div>

      {selectedArticle && <Model article={selectedArticle} onClose={closeModal} />}
    </div>
  );
}

export default DisplayPapers;
