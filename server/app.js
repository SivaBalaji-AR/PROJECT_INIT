const PORT = 8000;
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Import scraping functions
const scrapeGoogleScholar = require("./scrapers/googleSiteScraper");
const getPublicationsByIdentifier = require("./scrapers/wosapi");

const dataDir = path.join(__dirname, "data");

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log("Data directory created successfully.");
}

// Define routes
app.get("/", (req, res) => {
  fs.rm(dataDir, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(`Error deleting directory ${dataDir}:`, err);
    } else {
      console.log(`Directory ${dataDir} deleted successfully.`);
    }
  });
  res.send("Happy web scraping");
});

app.get("/api/v1/googlescholaruser", (req, res) => {
  fs.readFile(path.join(dataDir, "googleScholarDetailedData.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data file");
    } else {
      console.log("Data returned from API:", JSON.parse(data));
      res.json(JSON.parse(data));
    }
  });
});

app.get("/api/v1/webofscience", (req, res) => {
  fs.readFile(path.join(dataDir, "webOfScienceData.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data file");
    } else {
      console.log("Data returned from API:", JSON.parse(data));
      res.json(JSON.parse(data));
    }
  });
});

// Endpoint to trigger Google Scholar scraping
app.post("/api/scrape/googlescholar", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    await scrapeGoogleScholar(url);
    res.status(200).send("Scraping Google Scholar profile initiated");
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).send("Error initiating Google Scholar scraping");
  }
});

// Endpoint to trigger Web of Science scraping
app.post("/api/scrape/webofscience", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    await getPublicationsByIdentifier(url);
    res.status(200).send("Scraping Web of Science profile initiated");
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).send("Error initiating Web of Science scraping");
  }
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
