const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data/");

const normalizeKey = (key) => {
  // Replace spaces with underscores and make sure key is in lower case
  return key.replace(/\s+/g, '_').toLowerCase();
};

const scrapeGoogleScholarProfile = async (profileUrl) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to profile URL
    await page.goto(profileUrl);
    await page.waitForSelector(".gsc_a_tr");

    // Extract publication links
    const publicationLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".gsc_a_tr .gsc_a_at"))
        .map(link => link.href)
        .filter(href => href);
    });

    console.log("Publication links collected:", publicationLinks);

    const detailedPublications = [];

    for (const link of publicationLinks) {
      // Ensure the link is a complete URL
      const fullLink = link.startsWith("http") ? link : `https://scholar.google.com${link}`;

      await page.goto(fullLink);
      await page.waitForSelector("#gsc_oci_title");

      // Extract detailed publication data
      const publicationDetails = await page.evaluate(() => {
        const details = {};
        const fields = document.querySelectorAll(".gsc_oci_field");

        fields.forEach((field, index) => {
          const key = normalizeKey(field.textContent.trim());
          const value = field.nextElementSibling?.textContent.trim() || null;
          details[key] = value;
        });

        // Additional extraction for the title and href
        const titleElement = document.querySelector(".gsc_oci_title_link");
        if (titleElement) {
          details.title = titleElement.textContent.trim();
          details.href = titleElement.href;
        }

        return details;
      });

      publicationDetails.link = fullLink;  // Add the full link to the details
      detailedPublications.push(publicationDetails);
      console.log("Scraped detailed publication:", publicationDetails);
    }

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Write data to file
    fs.writeFile(
      path.join(dataDir, "googleScholarDetailedData.json"),
      JSON.stringify(detailedPublications, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }
        console.log("Successfully written detailed data to file");
      }
    );

    await browser.close();
  } catch (error) {
    console.error("Error during scraping:", error);
  }
};

const profileUrl = 'https://scholar.google.com/citations?hl=en&user=flp93UcAAAAJ';
scrapeGoogleScholarProfile(profileUrl);

module.exports = scrapeGoogleScholarProfile;