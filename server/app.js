// app.js
const PORT = 8000;
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Import scraping functions
const scrapeStaticWebpage = require("./scrapers/staticSiteScraper");
const scrapeGoogleScholar = require("./scrapers/googleSiteScraper"); // Ensure this path is correct

const dataDir = path.join(__dirname, "data");

// Middleware
app.use(cors());

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log("Data directory created successfully.");
}

// Define routes
app.get("/", (req, res) => {
  res.send("Happy web scraping");
});

app.get("/api/v1/items", (req, res) => {
  fs.readFile(path.join(dataDir, "booksData.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data file");
    } else {
      console.log("Data returned from API:", JSON.parse(data));
      res.json(JSON.parse(data));
    }
  });
});
app.get("/api/v1/googlescholar", (req, res) => {
  fs.readFile(path.join(dataDir, "googleScholarData.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data file");
    } else {
      console.log("Data returned from API:", JSON.parse(data));
      res.json(JSON.parse(data));
    }
  });
});
app.get("/api/v1/googlescholaruser", (req, res) => {
  fs.readFile(path.join(dataDir, "googleScholarProfileData.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data file");
    } else {
      console.log("Data returned from API:", JSON.parse(data));
      res.json(JSON.parse(data));
    }
  });
});

// Start server and initiate scraping
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  // Run scraping tasks
  scrapeStaticWebpage();
  scrapeGoogleScholar(); // Call the Google Scholar scraping function
});
