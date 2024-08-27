import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const ExcelUploader = () => {
    const [data, setData] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    // Handle file upload and parsing
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true); // Show loading indicator
            const reader = new FileReader();
            reader.onload = (event) => {
                const workbook = XLSX.read(event.target.result, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet);
                setData(json);

                // Prepare dropdown options
                const names = json.map(item => item.name).filter(name => name);
                setOptions(names);

                setLoading(false); // Hide loading indicator
            };
            reader.readAsArrayBuffer(file);
        }
    };

    // Handle dropdown change
    const handleDropdownChange = (e) => {
        const name = e.target.value;
        setSelectedName(name);
    };

    // Handle sending data to the backend
    const handleSendData = async () => {
        if (selectedName) {
            const selectedData = data.find(item => item.name === selectedName);
            if (selectedData) {
                try {
                    // Send Google Scholar URL
                    await fetch('http://localhost:8000');
                    await fetch('http://localhost:8000/api/scrape/googlescholar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            url: selectedData.googlescholar,
                        }),
                    });

                    // Send Web of Science URL
                    await fetch('http://localhost:8000/api/scrape/webofscience', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            url: selectedData.wos,
                        }),
                    });

                    console.log('Data sent successfully');

                    // Redirect to the homepage
                    navigate('/Home'); // Adjust the route as necessary
                } catch (error) {
                    console.error('Error sending data:', error);
                }
            }
        }
    };

    return (
        <div>
            <h1>Upload Excel and Select Data</h1>
            <input 
                type="file" 
                accept=".xlsx" 
                onChange={handleFileUpload}
            />
            {loading && <p>Loading...</p>} {/* Loading indicator */}
            {!loading && (
                <div>
                    <label htmlFor="nameDropdown">Select Name:</label>
                    <select 
                        id="nameDropdown" 
                        onChange={handleDropdownChange}
                        value={selectedName}
                    >
                        <option value="">Select a name</option>
                        {options.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
            )}
            <button 
                onClick={handleSendData} 
                disabled={!selectedName}
            >
                Send Data
            </button>
        </div>
    );
};

export default ExcelUploader;
