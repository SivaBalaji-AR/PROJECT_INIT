import { useEffect, useState } from "react";
import './DisplayPapers.css';
import ExportButton from "./ExportButton";
import DownloadWordButton from './DownloadWordButton'

const DisplayPapers = () => {
  const [scholarData, setScholarData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("");

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
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure start and end dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error("Invalid start or end date.");
    return;
  }
  
  const filtered = scholarData.filter((item) => {
    const itemDate = parseDate(item.publication_date);
    // Skip entries with invalid dates
    if (isNaN(itemDate.getTime())) {
      console.warn('Skipping entry with invalid date:', item.publication_date);
      return false;
    }
    return itemDate >= start && itemDate <= end;
  });
  
  setFilteredData(filtered);
};



const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    console.error('Invalid date string:', dateString);
    return new Date(NaN);
  }

  const dateParts = dateString.split('/');
  
  if (dateParts.length === 3) { // yyyy/mm/dd
    return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  } else if (dateParts.length === 2) { // yyyy/mm
    return new Date(dateParts[0], dateParts[1] - 1);
  } else if (dateParts.length === 1) { // yyyy
    return new Date(dateParts[0], 0); // January
  } else {
    console.error('Unexpected date format:', dateString);
    return new Date(NaN);
  }
};



const handleSort = (order) => {
  setSortOrder(order);
  
  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = parseDate(a.publication_date);
    const dateB = parseDate(b.publication_date);
    
    // Skip entries with invalid dates
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      console.warn('Skipping entry with invalid date:', a.publication_date, b.publication_date);
      return 0; // Consider invalid dates as equal
    }
    
    return order === "latest" ? dateB - dateA : dateA - dateB;
  });
  
  setFilteredData(sortedData);
};



  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="container">
      <h1 className="main-title">Google Scholar Data</h1>

            <p>number of papers : {filteredData.length}</p>


      {error && <p className="error no-print">Error: {error}</p>}

      <div className="filter-sort-container no-print">
        <div className="filter-container">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button onClick={handleFilter}>Filter</button>
        </div>

        <div className="sort-container">
          <select value={sortOrder} onChange={(e) => handleSort(e.target.value)}>
            <option value="">Sort</option>
            <option value="latest">Latest First</option>
            <option value="earliest">Earliest First</option>
          </select>
        </div>
        <div className="button-container no-print">
          <DownloadWordButton publications={filteredData} />
        </div>
        <ExportButton data={filteredData} filename="google_scholar_data.xlsx"/>
      </div>

      <div className="scholar-item-container">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id} className="scholar-item">
              <h4>{item.title}</h4>
              <p><strong>Authors: </strong>{item.authors}</p>
              <p><strong>Published At: </strong>{item.publication_date}</p>
              <p><strong>Publisher: </strong>{item.journal}</p>
              <p><strong>Description: </strong>{item.description}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="modal-link">View Article</a>

             
            </div>
          ))
        ) : (
          <p>No Google Scholar data available for the selected date range</p>
        )}
      </div>

    </div>
  );
}

export default DisplayPapers;
