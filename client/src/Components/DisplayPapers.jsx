import { useEffect, useState } from "react";
import './DisplayPapers.css';


const DisplayPapers = () => 
{
  const [scholarData, setScholarData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => 
  {
    fetch("http://localhost:8000/api/v1/googlescholaruser")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Scholar data:", data);
        setScholarData(data.filter(item => item.title)); // Assuming Google Scholar data has no 'title'
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  }, []);

  return (
    <div>
      <h1>React Node Web Scraper</h1>
      {error && <p>Error: {error}</p>}


      <div>
        <h2>Google Scholar Data</h2>
        {scholarData.length > 0 ? (
          scholarData.map((item) => (
            <div key={item.id} className="scholar-item">
              <h4>{item.title}</h4>
              <p>Link: <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a></p>
              <p>Authors: {item.authors}</p>
              <p>Snippet: {item.snippet}</p>
            </div>
          ))
        ) : (
          <p>No Google Scholar data available</p>
        )}
      </div>
    </div>
  );
}

export default DisplayPapers;