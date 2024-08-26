const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data/");
const outputFile = path.join(dataDir, "webOfScienceData.json");

const scrapeWebOfScienceProfile = async (profileUrl) => {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the profile URL
    await page.goto(profileUrl, { waitUntil: 'networkidle2' });

    // Extract publication links from the first page
    const publicationLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.wat-publication-card')).map(card => {
        const titleElement = card.querySelector('a');
        return titleElement ? titleElement.href : '';
      }).filter(href => href);
    });

    console.log("Collected publication links:", publicationLinks);

    const detailedPublications = [];

    // Scrape details for each publication link
    for (const link of publicationLinks) {
      console.log(`Scraping publication details from: ${link}`);
      try {
        await page.goto(link, { waitUntil: 'networkidle2' });

        const publicationDetails = await page.evaluate(() => {
          const getContent = (selector) => {
            const element = document.querySelector(selector);
            return element ? element.textContent.trim() : 'Unknown';
          };

          return {
            title: getContent('h2.title.text--large.cdx-title'),
            abstract: getContent('div.abstract--instance p'),
            published: getContent('div.source-info-piece span#FullRTa-pubdate'),
            indexed: getContent('div.source-info-piece span#FullRTa-indexedDate'),
            publisher: getContent('div.jcr-sidenav-container span.cdx-right-panel-sub')
          };
        });

        console.log("Scraped detailed publication:", publicationDetails);
        detailedPublications.push(publicationDetails);
      } catch (innerError) {
        console.error(`Error scraping publication at ${link}:`, innerError);
      }
    }

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Write data to file
    fs.writeFileSync(outputFile, JSON.stringify(detailedPublications, null, 2));
    console.log("Successfully written data to file");

  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = scrapeWebOfScienceProfile;
