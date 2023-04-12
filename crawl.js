const { JSDOM } = require('jsdom');

function normalizeURL(url) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;

  if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
};

function getURLsFromHTML(htmlBody, baseURL){
  const urls = [];
  const dom = new JSDOM(htmlBody);
  let aTags = dom.window.document.querySelectorAll('a');

  for (const aTag of aTags){
    if (aTag.href.slice(0,1) === '/'){
      try {
        urls.push(new URL(aTag.href, baseURL).href)
      } catch (err){
        console.log(`${err.message}: ${aTag.href}`)
      }
    } else {
      try {
        urls.push(new URL(aTag.href).href)
      } catch (err){
        console.log(`${err.message}: ${aTag.href}`)
      }
    }
  }
  return urls;
};

module.exports = { normalizeURL, getURLsFromHTML };
