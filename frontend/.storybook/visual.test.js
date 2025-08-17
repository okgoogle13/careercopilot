// Percy visual regression example (Storybook)
import { percySnapshot } from '@percy/puppeteer';

describe('Visual Regression', () => {
  it('should match the Dashboard page', async () => {
    await page.goto('http://localhost:6006/?path=/story/pages-dashboard--default');
    await percySnapshot(page, 'Dashboard Page');
  });
});
