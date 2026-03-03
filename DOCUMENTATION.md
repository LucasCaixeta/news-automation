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

2. **GitHub Actions Workflow** (`.github/workflows/newsletter-daily.yml`)
   - Runs automatically twice daily at 8:00 UTC (8am) and 20:00 UTC (8pm)
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
   - The workflow will run automatically twice daily at 8:00 UTC (8am) and 20:00 UTC (8pm)
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

To change how often the newsletter updates, edit the cron schedule in `.github/workflows/newsletter-daily.yml`:

```yaml
schedule:
  # Format: minute hour day-of-month month day-of-week
  # Currently runs twice daily at 8am and 8pm UTC
  - cron: '0 8 * * *'   # 8:00 AM UTC
  - cron: '0 20 * * *'  # 8:00 PM UTC
```

### Modifying the Number of Days to Keep

By default, the newsletter keeps news from the last 3 days. To change this, edit the `DAYS_TO_KEEP` constant in `src/updateNewsletter.js`:

```javascript
// Number of days to keep in the newsletter
const DAYS_TO_KEEP = 3; // Change this to your desired number
```

## Development

### Local Development

To run the newsletter update script locally:

```bash
# Install dependencies
npm install

# Run the update script
npm run update

# Or use the start script
npm start
```

### Code Quality

This project uses ESLint to maintain code quality and consistency:

```bash
# Check for linting issues
npm run lint

# Automatically fix linting issues
npm run lint:fix
```

### Testing

The project includes a comprehensive test suite using Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Project Structure

```
news-automation/
├── .github/
│   └── workflows/
│       └── newsletter-daily.yml  # GitHub Actions workflow
├── src/
│   └── updateNewsletter.js       # Main newsletter update script
├── tests/
│   └── updateNewsletter.test.js  # Test suite
├── .eslintrc.json                # ESLint configuration
├── .eslintignore                 # ESLint ignore patterns
├── jest.config.js                # Jest configuration
├── package.json                  # Project dependencies and scripts
├── CHANGELOG.md                  # Project changelog
├── CONTRIBUTING.md               # Contribution guidelines
├── DOCUMENTATION.md              # This file
└── README.md                     # Newsletter content (auto-updated)
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
   - Check the timeout settings (default: 10 seconds)

3. **Dependency Issues**
   - If you encounter dependency issues, update the package.json file with compatible versions
   - Run `npm install` locally to test if the dependencies work correctly
   - Clear npm cache if needed: `npm cache clean --force`

4. **Duplicate News Entries**
   - The script now automatically checks if today's news already exists
   - If you need to force an update, manually delete the current day's entry from the README

5. **Tests Failing**
   - Ensure all dependencies are installed: `npm install`
   - Check if Node.js version is compatible (18+ recommended)
   - Review test output for specific error messages

## Code Quality Standards

### Code Style

- 2 spaces for indentation
- Single quotes for strings
- Semicolons at the end of statements
- `const` by default, `let` when reassignment needed
- Avoid using `var`
- Meaningful variable and function names
- JSDoc comments for all functions

### Best Practices

- Keep functions small and focused
- Handle errors gracefully
- Add tests for new features
- Update documentation when making changes
- Follow the existing code structure
- Use async/await for asynchronous operations

## Contributing

Contributions to improve the newsletter are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Reporting bugs
- Suggesting enhancements
- Adding new news sources
- Code standards and style
- Testing requirements
- Pull request process

Quick contribution steps:

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes following the code standards
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Ensure code passes linting: `npm run lint`
7. Submit a pull request

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes to this project.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
