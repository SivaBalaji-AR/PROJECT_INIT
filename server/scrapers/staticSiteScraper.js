// staticSiteScraper.js
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const dataDir = path.join(__dirname, "../data/");
const url = "http://books.toscrape.com/";

const scrapeStaticWebpage = async () => {
  try {
    const { data } = await axios.get(url);
    console.log("Fetched data from books.toscrape.com");
    processData(data);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

const processData = (data) => {
  const $ = cheerio.load(data);
  const list = $(".product_pod"); // Class for each book container

  console.log("Found product blocks:", list.length); // Debugging line

  const books = [];
  list.each(function (idx, ele) {
    const targeted = $(ele);
    const title = targeted.find("h3 a").attr("title");
    const price = targeted.find(".price_color").text().trim();
    const availability = targeted.find(".availability").text().trim();
    const link = targeted.find("h3 a").attr("href");
    const imageUrl = targeted.find("img").attr("src"); // Get the relative image URL

    if (title && price && imageUrl) { // Ensuring only valid items are pushed
      const book = {
        id: idx + 1,
        title: title,
        price: price,
        availability: availability,
        link: url + link, // Constructing the full URL for the book
        image: url + imageUrl // Constructing the full URL for the image
      };
      books.push(book);
    } else {
      console.log("Missing data for item:", { title, price, imageUrl, link }); // Debugging line
    }
  });

  if (books.length === 0) {
    console.error("No books found. Check the HTML structure and selectors.");
  } else {
    console.log("Found books:", books); // Debugging line
  }

  fs.writeFile(
    path.join(dataDir, "booksData.json"),
    JSON.stringify(books, null, 2),
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("Successfully written data to booksData.json");
    }
  );
};

module.exports = scrapeStaticWebpage;
