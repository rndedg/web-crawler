const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");

function normalizeURL(url) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;

  if (fullPath.length > 0 && fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  let aTags = dom.window.document.querySelectorAll("a");

  for (const aTag of aTags) {
    if (aTag.href.slice(0, 1) === "/") {
      try {
        urls.push(new URL(aTag.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${aTag.href}`);
      }
    } else {
      try {
        urls.push(new URL(aTag.href).href);
      } catch (err) {
        console.log(`${err.message}: ${aTag.href}`);
      }
    }
  }
  return urls;
}

async function crawlPage(baseURL, currentURL, pages) {

  const currentUrlObj = new URL(currentURL);
  const baseUrlObj = new URL(baseURL);
  if (currentUrlObj.hostname !== baseUrlObj.hostname){
    return pages;
  }

  const normalizedURL = normalizeURL(currentURL);

  if (pages[normalizedURL] > 0){
    pages[normalizedURL]++
    return pages;
  }

  pages[normalizedURL] = 1;


  console.log(`Crawling ${currentURL}`)
  let htmlBody = '';
  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.log(`Got an error, status code: ${response.status}`);
      return pages;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`Got a non-html response: ${contentType}`);
      return pages;
    }
    htmlBody = await response.text();
  } catch (error) {
    console.log(error.message);
  }

  const nextURLs = getURLsFromHTML(htmlBody, baseURL)
  for (const nextURL of nextURLs){
    pages = await crawlPage(baseURL, nextURL, pages)
  }
  
  return pages;
}

module.exports = { normalizeURL, getURLsFromHTML, crawlPage };
