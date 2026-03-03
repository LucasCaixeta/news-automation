const {
  parseExistingNewsData,
  hasTodaysNews,
  generateReadmeContent
} = require('../src/updateNewsletter');

describe('Newsletter Update Functions', () => {
  describe('parseExistingNewsData', () => {
    it('should parse valid news data from README content', () => {
      const readmeContent = `
# Some content
<!-- NEWS_DATA_START -->
[{"date": "2026-03-03", "formattedDate": "March 3, 2026", "news": []}]
<!-- NEWS_DATA_END -->
      `;
      
      const result = parseExistingNewsData(readmeContent);
      
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2026-03-03');
    });

    it('should return empty array for invalid JSON', () => {
      const readmeContent = `
<!-- NEWS_DATA_START -->
invalid json
<!-- NEWS_DATA_END -->
      `;
      
      const result = parseExistingNewsData(readmeContent);
      
      expect(result).toEqual([]);
    });

    it('should return empty array when no news data markers exist', () => {
      const readmeContent = '# Just a regular README';
      
      const result = parseExistingNewsData(readmeContent);
      
      expect(result).toEqual([]);
    });
  });

  describe('hasTodaysNews', () => {
    it('should return true when today\'s news exists', () => {
      const newsData = [
        { date: '2026-03-03', news: [] },
        { date: '2026-03-02', news: [] }
      ];
      
      const result = hasTodaysNews(newsData, '2026-03-03');
      
      expect(result).toBe(true);
    });

    it('should return false when today\'s news does not exist', () => {
      const newsData = [
        { date: '2026-03-02', news: [] },
        { date: '2026-03-01', news: [] }
      ];
      
      const result = hasTodaysNews(newsData, '2026-03-03');
      
      expect(result).toBe(false);
    });

    it('should return false for empty news data', () => {
      const result = hasTodaysNews([], '2026-03-03');
      
      expect(result).toBe(false);
    });
  });

  describe('generateReadmeContent', () => {
    it('should generate README with news data', () => {
      const newsData = [
        {
          date: '2026-03-03',
          formattedDate: 'March 3, 2026',
          news: [
            {
              title: 'Test Article',
              link: 'https://example.com/article',
              source: 'Test Source'
            }
          ]
        }
      ];
      
      const result = generateReadmeContent(newsData);
      
      expect(result).toContain('# Daily JavaScript & React Newsletter');
      expect(result).toContain('Today\'s Updates (March 3, 2026)');
      expect(result).toContain('Test Article');
      expect(result).toContain('https://example.com/article');
      expect(result).toContain('<!-- NEWS_DATA_START -->');
      expect(result).toContain('<!-- NEWS_DATA_END -->');
    });

    it('should handle empty news array', () => {
      const newsData = [
        {
          date: '2026-03-03',
          formattedDate: 'March 3, 2026',
          news: []
        }
      ];
      
      const result = generateReadmeContent(newsData);
      
      expect(result).toContain('*No news available for this day*');
    });

    it('should group news by source', () => {
      const newsData = [
        {
          date: '2026-03-03',
          formattedDate: 'March 3, 2026',
          news: [
            { title: 'Article 1', link: 'https://example.com/1', source: 'Source A' },
            { title: 'Article 2', link: 'https://example.com/2', source: 'Source A' },
            { title: 'Article 3', link: 'https://example.com/3', source: 'Source B' }
          ]
        }
      ];
      
      const result = generateReadmeContent(newsData);
      
      expect(result).toContain('#### Source A');
      expect(result).toContain('#### Source B');
    });
  });
});
