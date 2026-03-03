# Contributing to Daily JavaScript & React Newsletter

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/news-automation.git`
3. Add the upstream repository: `git remote add upstream https://github.com/LucasCaixeta/news-automation.git`

## Development Setup

1. Install Node.js (version 18 or higher recommended)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the newsletter update script locally:
   ```bash
   npm run update
   ```

## How to Contribute

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- If not, create a new issue with a clear title and description
- Include steps to reproduce the bug
- Add relevant logs or screenshots if applicable

### Suggesting Enhancements

- Open an issue with the tag "enhancement"
- Clearly describe the feature and its benefits
- Provide examples of how it would work

### Adding New News Sources

To add a new news source:

1. Edit `src/updateNewsletter.js`
2. Add a new entry to the `NEWS_SOURCES` array:
   ```javascript
   {
     name: 'Source Name',
     url: 'https://source-url.com',
     selector: '.css-selector-for-articles',
     baseUrl: 'https://source-url.com',
     getTitle: (el) => el.text().trim(),
     getLink: (el) => el.attr('href')
   }
   ```
3. Test the new source locally
4. Update documentation if needed

## Coding Standards

This project uses ESLint to maintain code quality. Please ensure your code follows these standards:

- Run `npm run lint` to check for issues
- Run `npm run lint:fix` to automatically fix formatting issues
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep functions small and focused on a single task

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use `const` by default, `let` when reassignment is needed
- Avoid using `var`

## Testing

All contributions should include tests when applicable:

- Write tests for new features
- Ensure existing tests pass: `npm test`
- Check test coverage: `npm run test:coverage`
- Aim for at least 80% code coverage

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Pull Request Process

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: description of what you added"
   ```

3. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request against the `main` branch of the upstream repository

5. Ensure your PR:
   - Has a clear title and description
   - References any related issues
   - Passes all tests and linting checks
   - Includes tests for new functionality
   - Updates documentation if needed

6. Wait for review and address any feedback

### Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

Examples:
```
Add support for Hacker News as a news source

- Implement scraper for Hacker News front page
- Add tests for new functionality
- Update documentation

Fixes #123
```

## Questions?

If you have questions, feel free to:
- Open an issue with the "question" tag
- Reach out to the maintainers

Thank you for contributing! 🎉
