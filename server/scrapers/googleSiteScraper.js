const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data/");

const scrapeGoogleScholarProfile = async (profileUrl) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(profileUrl);

    await page.waitForSelector(".gsc_a_tr");

    const data = await page.content();

    const $ = cheerio.load(data);

    const publications = [];
    $(".gsc_a_tr").each(function (idx, ele) {
      const title = $(ele).find(".gsc_a_at").text().trim();
      const link = $(ele).find(".gsc_a_at").attr("href");
      const authors = $(ele).find(".gs_gray").text().trim();
      const year = $(ele).find(".gsc_a_y").text().trim();

      const publication = {
        id: idx + 1,
        title: title,
        link: link ? `https://scholar.google.com${link}` : null,
        authors: authors,
        year: year,
      };

      publications.push(publication);
    });

    console.log("Publications scraped:", publications);

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    fs.writeFile(
      path.join(dataDir, "googleScholarProfileData.json"),
      JSON.stringify(publications, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }
        console.log("Successfully written data to file");
      }
    );

    await browser.close();

  } catch (error) {
    console.error("Error during scraping:", error);
  }
};


//const profileUrl = 'https://scholar.google.com/citations?user=BO0-COMAAAAJ&hl=en';
const profileUrl = 'https://scholar.google.com/citations?hl=en&user=flp93UcAAAAJ';
scrapeGoogleScholarProfile(profileUrl);

module.exports = scrapeGoogleScholarProfile;
