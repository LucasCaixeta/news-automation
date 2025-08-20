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

// Maximum number of news items to fetch per source
const MAX_NEWS_PER_SOURCE = 3;

// Number of days to keep in the newsletter
const DAYS_TO_KEEP = 3;

/**
 * Fetches news from a given source
 * @param {Object} source - The news source configuration
 * @returns {Promise<Array>} - Array of news items
 */
async function fetchNewsFromSource(source) {
  try {
    const response = await axios.get(source.url);
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
      
      if (title && link) {
        newsItems.push({
          title,
          link,
          source: source.name
        });
      }
    });
    
    return newsItems;
  } catch (error) {
    console.error(`Error fetching news from ${source.name}:`, error.message);
    return [];
  }
}

/**
 * Fetches news from all sources
 * @returns {Promise<Array>} - Array of news items from all sources
 */
async function fetchAllNews() {
  const allPromises = NEWS_SOURCES.map(source => fetchNewsFromSource(source));
  const allResults = await Promise.all(allPromises);
  return allResults.flat();
}

/**
 * Updates the README.md file with the latest news
 */
async function updateReadme() {
  try {
    // Path to the README file
    const readmePath = path.join(__dirname, '..', 'README.md');
    
    // Read the current README content
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Get today's date
    const today = moment();
    
    // Fetch today's news
    const todaysNews = await fetchAllNews();
    
    // Create a new news entry for today
    const newsEntry = {
      date: today.format('YYYY-MM-DD'),
      formattedDate: today.format('MMMM D, YYYY'),
      news: todaysNews
    };
    
    // Try to load existing news data from README
    let newsData = [];
    const newsDataMatch = readmeContent.match(/<!-- NEWS_DATA_START -->([\s\S]*?)<!-- NEWS_DATA_END -->/);
    
    if (newsDataMatch && newsDataMatch[1]) {
      try {
        newsData = JSON.parse(newsDataMatch[1]);
      } catch (e) {
        console.warn('Could not parse existing news data, starting fresh');
      }
    }
    
    // Add today's news to the beginning of the array
    newsData.unshift(newsEntry);
    
    // Keep only the last DAYS_TO_KEEP days
    newsData = newsData.slice(0, DAYS_TO_KEEP);
    
    // Generate the new README content
    let newReadmeContent = generateReadmeContent(newsData);
    
    // Update the README file
    fs.writeFileSync(readmePath, newReadmeContent);
    
    console.log(`README updated with news for ${today.format('YYYY-MM-DD')}`);
  } catch (error) {
    console.error('Error updating README:', error);
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
    
    content += `### ${dayLabel} (${entry.formattedDate})
\n`;
    
    if (entry.news.length === 0) {
      content += '- *No news available for this day*\n\n';
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

// Run the update function
updateReadme().catch(console.error);