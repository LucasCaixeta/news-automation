# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ESLint configuration for code quality and consistency
- Jest testing framework with initial test suite
- Comprehensive test coverage for core functions
- CONTRIBUTING.md with contribution guidelines
- CHANGELOG.md to track project changes
- IMPROVEMENTS.md with detailed summary of all improvements
- Module exports for testability
- Request timeout configuration (10 seconds)
- User-Agent header for HTTP requests
- Better logging with visual indicators (✓ and ✗)
- Duplicate news prevention (checks if today's news already exists)
- Empty news validation (skips update if no news fetched)

### Changed
- GitHub Actions workflow now runs twice daily (8am and 8pm UTC) instead of once daily
- Improved error handling throughout the codebase
- Enhanced code documentation with JSDoc comments
- Refactored code into smaller, more testable functions
- Better separation of concerns (parsing, validation, generation)
- Improved console output for better debugging
- Updated package.json with new scripts (lint, test, coverage)
- Main execution now properly exits with error codes
- Updated all documentation to reflect twice-daily schedule

### Fixed
- Proper error propagation in async functions
- UTF-8 encoding explicitly set for file operations
- Better handling of malformed JSON in existing news data

## [1.0.0] - 2026-03-03

### Added
- Initial release
- Automated daily newsletter updates via GitHub Actions
- News fetching from Dev.to (JavaScript and React tags)
- News fetching from React official blog
- README.md automatic updates
- Support for keeping last 3 days of news
- JSON data storage within README for persistence
- GitHub Actions workflow for daily automation

[Unreleased]: https://github.com/LucasCaixeta/news-automation/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/LucasCaixeta/news-automation/releases/tag/v1.0.0
