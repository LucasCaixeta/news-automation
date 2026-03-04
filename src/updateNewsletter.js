const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

// Sources for JavaScript and React news
const NEWS_SOURCES = [
  {
    name: 'Dev.to JavaScript',
    url: 'https://dev.to/t/javascript',
    selector: '.crayons-story__title a',
    baseUrl: 'https://dev.to',
    getTitle: (el) => el.text().trim(),
    getLink: (el) => el.attr('href')
  },
  {
    name: 'Dev.to React',
    url: 'https://dev.to/t/react',
    selector: '.crayons-story__title a',
    baseUrl: 'https://dev.to',
    getTitle: (el) => el.text().trim(),
    getLink: (el) => el.attr('href')
  },
  {
    name: 'React Blog',
    url: 'https://react.dev/blog',
    selector: 'article a',
    baseUrl: 'https://react.dev',
    getTitle: (el) => el.text().trim(),
    getLink: (el) => el.attr('href')
  }
];

// Configuration constants
const MAX_NEWS_PER_SOURCE = 3;
const DAYS_TO_KEEP = 3;
const REQUEST_TIMEOUT = 10000; // 10 seconds
const USER_AGENT = 'Mozilla/5.0 (compatible; NewsletterBot/1.0)';

/**
 * Fetches news from a given source with error handling and timeout
 * @param {Object} source - The news source configuration
 * @returns {Promise<Array>} - Array of news items
 */
async function fetchNewsFromSource(source) {
  try {
    console.log(`Fetching news from ${source.name}...`);
    
    const response = await axios.get(source.url, {
      timeout: REQUEST_TIMEOUT,
      headers: {
        'User-Agent': USER_AGENT
      }
    });
    
    const $ = cheerio.load(response.data);
    const newsItems = [];
    
    $(source.selector).slice(0, MAX_NEWS_PER_SOURCE).each((i, el) => {
      const $el = $(el);
      const title = source.getTitle($el);
      let link = source.getLink($el);
      
      // Make sure the link is absolute
      if (link && !link.startsWith('http')) {
        link = `${source.baseUrl}${link}`;
      }
      
      // Validate that we have both title and link
      if (title && link) {
        newsItems.push({
          title,
          link,
          source: source.name
        });
      }
    });
    
    console.log(`✓ Fetched ${newsItems.length} items from ${source.name}`);
    return newsItems;
  } catch (error) {
    console.error(`✗ Error fetching news from ${source.name}:`, error.message);
    return [];
  }
}

/**
 * Fetches news from all sources concurrently
 * @returns {Promise<Array>} - Array of news items from all sources
 */
async function fetchAllNews() {
  console.log('Starting to fetch news from all sources...');
  
  const allPromises = NEWS_SOURCES.map(source => fetchNewsFromSource(source));
  const allResults = await Promise.all(allPromises);
  const allNews = allResults.flat();
  
  console.log(`Total news items fetched: ${allNews.length}`);
  return allNews;
}

/**
 * Parses existing news data from README content
 * @param {string} readmeContent - The README file content
 * @returns {Array} - Array of existing news entries
 */
function parseExistingNewsData(readmeContent) {
  const newsDataMatch = readmeContent.match(/<!-- NEWS_DATA_START -->([\s\S]*?)<!-- NEWS_DATA_END -->/);
  
  if (newsDataMatch && newsDataMatch[1]) {
    try {
      const newsData = JSON.parse(newsDataMatch[1]);
      console.log(`Loaded ${newsData.length} existing news entries`);
      return newsData;
    } catch (error) {
      console.warn('Could not parse existing news data, starting fresh:', error.message);
    }
  }
  
  return [];
}

/**
 * Finds the index of today's news entry if it exists
 * @param {Array} newsData - Array of news entries
 * @param {string} todayDate - Today's date in YYYY-MM-DD format
 * @returns {number} - Index of today's news entry, or -1 if not found
 */
function findTodaysNewsIndex(newsData, todayDate) {
  return newsData.findIndex(entry => entry.date === todayDate);
}

/**
 * Updates the README.md file with the latest news
 */
async function updateReadme() {
  try {
    const readmePath = path.join(__dirname, '..', 'README.md');
    
    // Read the current README content
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Get today's date
    const today = moment();
    const todayDate = today.format('YYYY-MM-DD');
    
    // Parse existing news data
    let newsData = parseExistingNewsData(readmeContent);
    
    // Fetch today's news
    const todaysNews = await fetchAllNews();
    
    if (todaysNews.length === 0) {
      console.warn('No news items were fetched. Skipping README update.');
      return;
    }
    
    // Create a new news entry for today
    const newsEntry = {
      date: todayDate,
      formattedDate: today.format('MMMM D, YYYY'),
      news: todaysNews
    };
    
    // Check if we already have today's news
    const todaysIndex = findTodaysNewsIndex(newsData, todayDate);
    if (todaysIndex !== -1) {
      console.log(`Updating existing news for ${todayDate}`);
      // Replace the existing entry with fresh news
      newsData[todaysIndex] = newsEntry;
    } else {
      console.log(`Adding new news for ${todayDate}`);
      // Add today's news to the beginning of the array
      newsData.unshift(newsEntry);
    }
    
    // Keep only the last DAYS_TO_KEEP days
    newsData = newsData.slice(0, DAYS_TO_KEEP);
    
    // Generate the new README content
    const newReadmeContent = generateReadmeContent(newsData);
    
    // Update the README file
    fs.writeFileSync(readmePath, newReadmeContent, 'utf8');
    
    console.log(`✓ README successfully updated with news for ${todayDate}`);
  } catch (error) {
    console.error('✗ Error updating README:', error);
    throw error; // Re-throw to ensure the process exits with error code
  }
}

/**
 * Generates the README content with the news data
 * @param {Array} newsData - Array of news entries
 * @returns {string} - The generated README content
 */
function generateReadmeContent(newsData) {
  // Start with the header
  let content = `# Daily JavaScript & React Newsletter

This repository contains an automated newsletter that updates daily with the latest JavaScript and React news. The content is automatically refreshed every day using GitHub Actions.

## Latest News

*This section is automatically updated with the latest JavaScript and React news.*

`;
  
  // Add each day's news
  newsData.forEach((entry, index) => {
    const dayLabel = index === 0 ? "Today's Updates" :
      index === 1 ? "Yesterday's Updates" :
        `${index} Days Ago`;
    
    content += `### ${dayLabel} (${entry.formattedDate})\n\n`;
    
    if (entry.news.length === 0) {
      content += '*No news available for this day*\n\n';
    } else {
      // Group news by source
      const newsBySource = {};
      entry.news.forEach(item => {
        if (!newsBySource[item.source]) {
          newsBySource[item.source] = [];
        }
        newsBySource[item.source].push(item);
      });
      
      // Add news items grouped by source
      Object.keys(newsBySource).forEach(source => {
        content += `#### ${source}\n\n`;
        newsBySource[source].forEach(item => {
          content += `- [${item.title}](${item.link})\n`;
        });
        content += '\n';
      });
    }
  });
  
  // Add the rest of the README
  content += `## How It Works

This newsletter uses:
- GitHub Actions for daily automation
- JavaScript to fetch the latest news from relevant sources
- Automatic commits to update this README.md file

## Setup

To set up this newsletter in your own repository:

1. Fork this repository
2. Enable GitHub Actions in your repository settings
3. The newsletter will automatically update daily

## Contributing

Contributions to improve the newsletter format or sources are welcome!
`;
  
  // Add hidden news data for future updates
  content += '\n<!-- NEWS_DATA_START -->\n';
  content += JSON.stringify(newsData, null, 2);
  content += '\n<!-- NEWS_DATA_END -->\n';
  
  return content;
}

// Main execution
if (require.main === module) {
  updateReadme()
    .then(() => {
      console.log('Newsletter update completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Newsletter update failed:', error);
      process.exit(1);
    });
}

// Export functions for testing
module.exports = {
  fetchNewsFromSource,
  fetchAllNews,
  parseExistingNewsData,
  findTodaysNewsIndex,
  generateReadmeContent,
  updateReadme
};
