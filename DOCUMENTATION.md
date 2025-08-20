# JavaScript & React Newsletter - Documentation

## Overview

This project creates an automated newsletter that updates daily with the latest JavaScript and React news. It uses GitHub Actions to automatically fetch news from popular sources and update the README.md file with the latest information.

## How It Works

### Components

1. **News Fetching Script** (`src/updateNewsletter.js`)
   - Fetches news from configured sources using web scraping
   - Formats the news into a readable format
   - Updates the README.md file with the latest news
   - Stores news data in a hidden JSON format within the README for future updates

2. **GitHub Actions Workflow** (`.github/workflows/daily-update.yml`)
   - Runs automatically every day at 8:00 UTC
   - Installs dependencies
   - Runs the news fetching script
   - Commits and pushes changes to the repository if the README was updated

### News Sources

The newsletter currently fetches news from the following sources:

- **Dev.to JavaScript** - Latest JavaScript articles from Dev.to
- **Dev.to React** - Latest React articles from Dev.to
- **React Blog** - Official React blog updates

## Setup Instructions

### Prerequisites

- GitHub account
- Basic knowledge of Git and GitHub

### Installation

1. **Fork the Repository**
   - Visit the repository on GitHub
   - Click the "Fork" button to create your own copy

2. **Enable GitHub Actions**
   - Go to the "Actions" tab in your forked repository
   - Click "I understand my workflows, go ahead and enable them"

3. **Verify Setup**
   - The workflow will run automatically every day at 8:00 UTC
   - You can also manually trigger the workflow by going to the Actions tab, selecting the "Daily Newsletter Update" workflow, and clicking "Run workflow"

## Customization

### Adding New News Sources

To add a new news source, edit the `src/updateNewsletter.js` file and add a new entry to the `NEWS_SOURCES` array:

```javascript
{
  name: 'Source Name',
  url: 'https://source-url.com',
  selector: '.css-selector-for-news-items',
  baseUrl: 'https://source-url.com', // Used for relative links
  getTitle: (el) => el.text().trim(),
  getLink: (el) => el.attr('href')
}
```

### Changing Update Frequency

To change how often the newsletter updates, edit the cron schedule in `.github/workflows/daily-update.yml`:

```yaml
schedule:
  # Format: minute hour day-of-month month day-of-week
  # This example runs at 8:00 UTC every day
  - cron: '0 8 * * *'
```

### Modifying the Number of Days to Keep

By default, the newsletter keeps news from the last 3 days. To change this, edit the `DAYS_TO_KEEP` constant in `src/updateNewsletter.js`:

```javascript
// Number of days to keep in the newsletter
const DAYS_TO_KEEP = 3; // Change this to your desired number
```

## Troubleshooting

### Common Issues

1. **Workflow Not Running**
   - Check if GitHub Actions is enabled in your repository
   - Verify that the workflow file is correctly formatted
   - Check the Actions tab for any error messages

2. **No News Being Fetched**
   - The website structure of the news sources might have changed
   - Update the selectors in the `NEWS_SOURCES` array to match the new structure
   - Check if the news sources are accessible from GitHub's servers

3. **Dependency Issues**
   - If you encounter dependency issues, update the package.json file with compatible versions
   - Run `npm install` locally to test if the dependencies work correctly

## Contributing

Contributions to improve the newsletter are welcome! Here are some ways you can contribute:

- Add new news sources
- Improve the formatting of the newsletter
- Fix bugs or issues
- Add new features

To contribute:

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.