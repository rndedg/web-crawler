const { crawlPage } = require("./crawl");
const { printReport } = require("./report")


async function main(){
  if(process.argv.length < 3){
    console.log("No website provided.");
  } else if (process.argv.length > 3){
    console.log("Too many arguments provided.");
  } else {
    const baseURL = process.argv[2];
    console.log(`Excellent, starting crawl at ${baseURL}`);
    const pages = await crawlPage(baseURL, baseURL, {})

    printReport(pages);
  }
};

main();