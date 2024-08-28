const axios = require('axios');
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data/");
const outputFile = path.join(dataDir, "webOfScienceData.json");

const apiKey = '77178473434ebfb7bd93704f57f53fc59dfd3b1f';

const extractIdentifier = (profileLink) => {
  const parts = profileLink.split('/');
  return parts.pop(); 
};

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const getPublicationsByIdentifier = async (profileLink) => {
  try {
    const identifier = extractIdentifier(profileLink);
    const url = 'http://api.clarivate.com/apis/wos-starter/v1/documents';
    console.log('Request URL:', url);

    let allPublications = [];
    let page = 1;
    const limit = 10;

    while (true) {
      const response = await axios.get(url, {
        headers: {
          'X-ApiKey': apiKey,
          'Accept': 'application/json',
        },
        params: {
          q: `AI="${identifier}"`,
          db: 'WOS',
          page: page,
          limit: limit,
        },
      });

      const data = response.data;
      allPublications = allPublications.concat(data.hits);

      if (data.hits.length < limit) {
        break;
      }

      page++;

      if (response.headers['x-ratelimit-remaining-second'] === '0') {
        const resetTime = parseInt(response.headers['ratelimit-reset']) * 1000;
        console.log(`Rate limit exceeded. Waiting for ${resetTime / 1000} seconds...`);
        await sleep(resetTime);
      }
    }

    console.log('Total Publications Retrieved:', allPublications.length);

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    fs.writeFileSync(outputFile, JSON.stringify(allPublications, null, 2));
    console.log("Successfully written data to file");

  } catch (error) {
    console.error('Error fetching publications:', error.response ? error.response.data : error.message);
  }
};

module.exports = getPublicationsByIdentifier;
