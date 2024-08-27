const axios = require('axios');
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data/");
const outputFile = path.join(dataDir, "webOfScienceData.json");

// Set your Clarivate API key here
const apiKey = '77178473434ebfb7bd93704f57f53fc59dfd3b1f'; // Replace with your actual API key

// Function to extract the identifier from the profile link
const extractIdentifier = (profileLink) => {
  const parts = profileLink.split('/');
  return parts.pop(); // Returns the last part of the URL
};


// Function to get publications by the extracted identifier
const getPublicationsByIdentifier = async (profileLink) => {
  try {
    // Construct the API URL
    const identifier=extractIdentifier(profileLink);
    const url = 'http://api.clarivate.com/apis/wos-starter/v1/documents';
    console.log('Request URL:', url);

    // Make the API request without sortField, limit, or page
    const response = await axios.get(url, {
      headers: {
        'X-ApiKey': apiKey,
        'Accept': 'application/json',
      },
      params: {
        q: `AI="${identifier}"`, // Use 'AI' for Author Identifier
        db: 'WOS',          // Database to query
      },
    });

    console.log('Response Data:', response.data);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }
  
      fs.writeFileSync(outputFile, JSON.stringify(response.data, null, 2));
      console.log("Successfully written data to file");

    if (response.data.hits.length === 0) {
      console.log('No publications found.');
    } else {
      console.log('Publications:', response.data);
    }
  } catch (error) {
    console.error('Error fetching publications:', error.response ? error.response.data : error.message);
  }
};

// Provide the profile link of the author

module.exports = getPublicationsByIdentifier;
