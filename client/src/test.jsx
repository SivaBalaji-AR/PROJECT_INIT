import { useState, useEffect } from 'react';
import axios from 'axios';

const WebOfScienceAPIComponent = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Replace with your actual API key
        const apiKey = 'https://api.clarivate.com/apis/wos-researcher/researchers';
        const apiUrl = 'https://api.clarivate.com/apis/wos-researcher/researchers';

        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'X-Api-Key': apiKey
                    }
                });
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Web of Science Researcher API Data</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default WebOfScienceAPIComponent;
