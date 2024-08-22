const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data/");
const outputFile = path.join(dataDir, "webOfScienceData.json");

const scrapeWebOfScienceProfile = async (profileUrl) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the profile URL
    await page.goto(profileUrl, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.wat-publication-card');

    // Extract publication details
    const publications = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.wat-publication-card')).map(card => {
        const titleElement = card.querySelector('a');
        const authors = Array.from(card.querySelectorAll('.author-link')).map(a => a.textContent.trim()).join(', ');
        const publicationDate = card.querySelector('.wat-publication-published--year')?.textContent.trim() || 'Unknown';
        const journal = card.querySelector('.summary-source-title-link')?.textContent.trim() || 'Unknown';
        const link = titleElement ? titleElement.href : '';

        return {
          title: titleElement ? titleElement.textContent.trim() : 'No Title',
          authors,
          publicationDate: publicationDate.replace('Published ', ''),
          journal,
          link
        };
      });
    });

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Write data to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(publications, null, 2));
    console.log("Successfully written data to file");

    await browser.close();
  } catch (error) {
    console.error("Error during scraping:", error);
  }
};

module.exports = scrapeWebOfScienceProfile;
