import { JobData } from '../../types';

/**
 * Enhanced Universal Job Scraper for CareerCopilot
 * Supports Australian job sites: ethicaljobs.com.au, seek.com.au, jora.com
 * Includes robust HTML cleanup and data extraction
 */
class UniversalJobScraper {
    private jobData: JobData;
    private hostname: string;

    constructor() {
        this.jobData = {
            title: '',
            company: null,
            description: '',
            location: null,
            employmentType: null,
            datePosted: null,
            salary: null,
            url: window.location.href,
            source: null,
        };
        this.hostname = window.location.hostname;
    }

    /**
     * Main extraction method - tries multiple strategies in order
     */
    async extract(): Promise<JobData> {
        // Strategy 1: Site-specific extraction (highest priority for known sites)
        if (this.extractFromKnownSite()) {
            this.jobData.source = `site-specific:${this.hostname}`;
            return this.clean();
        }

        // Strategy 2: Schema.org JSON-LD
        if (this.extractFromStructuredData()) {
            this.jobData.source = 'structured-data';
            return this.clean();
        }

        // Strategy 3: Meta tags (Open Graph, Twitter Cards)
        if (this.extractFromMetaTags()) {
            this.jobData.source = 'meta-tags';
            return this.clean();
        }

        // Strategy 4: Common DOM selectors
        if (this.extractFromDOM()) {
            this.jobData.source = 'dom-selectors';
            return this.clean();
        }

        // Strategy 5: Fallback - generic content extraction
        this.extractGenericContent();
        this.jobData.source = 'generic-fallback';

        return this.clean();
    }

    /**
     * Extract from known Australian job sites
     */
    private extractFromKnownSite(): boolean {
        // EthicalJobs.com.au
        if (this.hostname.includes('ethicaljobs.com.au')) {
            return this.extractEthicalJobs();
        }

        // Seek.com.au
        if (this.hostname.includes('seek.com.au')) {
            return this.extractSeek();
        }

        // Jora.com
        if (this.hostname.includes('jora.com')) {
            return this.extractJora();
        }

        return false;
    }

    /**
     * Extract from EthicalJobs.com.au
     */
    private extractEthicalJobs(): boolean {
        try {
            // Title
            const titleEl = document.querySelector('h1.job-view__title') || document.querySelector('h1');
            if (titleEl) {
                this.jobData.title = this.cleanText(titleEl.textContent || '');
            }

            // Company
            const companyEl = document.querySelector('.job-view__company-name') ||
                document.querySelector('[class*="company"]');
            if (companyEl) {
                this.jobData.company = this.cleanText(companyEl.textContent || '');
            }

            // Location
            const locationEl = document.querySelector('.job-view__location') ||
                document.querySelector('[class*="location"]');
            if (locationEl) {
                this.jobData.location = this.cleanText(locationEl.textContent || '');
            }

            // Description (look for the main content area)
            const descEl = document.querySelector('.job-view__description') ||
                document.querySelector('[class*="job-description"]') ||
                document.querySelector('article') ||
                document.querySelector('.content');
            if (descEl) {
                this.jobData.description = this.cleanHTML(descEl.innerHTML);
            }

            // Deadline
            const deadlineEl = document.querySelector('[class*="closing"]') ||
                document.querySelector('[class*="deadline"]');
            if (deadlineEl) {
                this.jobData.datePosted = this.cleanText(deadlineEl.textContent || '');
            }

            return !!this.jobData.title && !!this.jobData.description;
        } catch (e) {
            console.warn('EthicalJobs extraction failed:', e);
            return false;
        }
    }

    /**
     * Extract from Seek.com.au
     */
    private extractSeek(): boolean {
        try {
            // Title
            const titleEl = document.querySelector('h1[data-automation="job-detail-title"]') ||
                document.querySelector('h1._1csutds0');
            if (titleEl) {
                this.jobData.title = this.cleanText(titleEl.textContent || '');
            }

            // Company
            const companyEl = document.querySelector('[data-automation="advertiser-name"]') ||
                document.querySelector('span[class*="advertiser"]');
            if (companyEl) {
                this.jobData.company = this.cleanText(companyEl.textContent || '');
            }

            // Location
            const locationEl = document.querySelector('[data-automation="job-detail-location"]') ||
                document.querySelector('[class*="location"]');
            if (locationEl) {
                this.jobData.location = this.cleanText(locationEl.textContent || '');
            }

            // Description - Seek often hides content behind "Show more"
            const descEl = document.querySelector('[data-automation="jobAdDetails"]') ||
                document.querySelector('[class*="job-description"]');
            if (descEl) {
                // Click "Show more" if present
                const showMoreBtn = descEl.querySelector('button[class*="ShowMore"]');
                if (showMoreBtn) {
                    (showMoreBtn as HTMLButtonElement).click();
                    // Wait a bit for content to expand
                    setTimeout(() => { }, 100);
                }
                this.jobData.description = this.cleanHTML(descEl.innerHTML);
            }

            // Salary
            const salaryEl = document.querySelector('[data-automation="job-detail-salary"]');
            if (salaryEl) {
                this.jobData.salary = this.cleanText(salaryEl.textContent || '');
            }

            return !!this.jobData.title && !!this.jobData.description;
        } catch (e) {
            console.warn('Seek extraction failed:', e);
            return false;
        }
    }

    /**
     * Extract from Jora.com
     */
    private extractJora(): boolean {
        try {
            // Title
            const titleEl = document.querySelector('h1.job-title') ||
                document.querySelector('h1[class*="job"]');
            if (titleEl) {
                this.jobData.title = this.cleanText(titleEl.textContent || '');
            }

            // Company
            const companyEl = document.querySelector('.company-name') ||
                document.querySelector('[class*="company"]');
            if (companyEl) {
                this.jobData.company = this.cleanText(companyEl.textContent || '');
            }

            // Location
            const locationEl = document.querySelector('.location') ||
                document.querySelector('[class*="location"]');
            if (locationEl) {
                this.jobData.location = this.cleanText(locationEl.textContent || '');
            }

            // Description
            const descEl = document.querySelector('.job-description') ||
                document.querySelector('[class*="description"]') ||
                document.querySelector('article');
            if (descEl) {
                this.jobData.description = this.cleanHTML(descEl.innerHTML);
            }

            return !!this.jobData.title && !!this.jobData.description;
        } catch (e) {
            console.warn('Jora extraction failed:', e);
            return false;
        }
    }

    /**
     * Clean HTML content - strip tags, normalize whitespace, remove "Show more" text
     */
    private cleanHTML(html: string): string {
        if (!html) return '';

        // Create a temporary div to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Remove script and style elements
        temp.querySelectorAll('script, style').forEach(el => el.remove());

        // Remove "Show more" buttons and similar
        temp.querySelectorAll('button, [class*="ShowMore"], [class*="show-more"]').forEach(el => el.remove());

        // Get text content
        let text = temp.textContent || '';

        // Clean up whitespace
        text = text
            .replace(/\s+/g, ' ')           // Multiple spaces to single space
            .replace(/\n\s*\n/g, '\n\n')    // Multiple newlines to double newline
            .replace(/^\s+|\s+$/g, '')      // Trim leading/trailing whitespace
            .trim();

        return text;
    }

    /**
     * Clean text content - remove extra whitespace and special characters
     */
    private cleanText(text: string): string {
        if (!text) return '';

        return text
            .replace(/\s+/g, ' ')           // Multiple spaces to single space
            .replace(/[\r\n]+/g, ' ')       // Newlines to space
            .replace(/^\s+|\s+$/g, '')      // Trim
            .trim();
    }

    /**
     * Extract from Schema.org JSON-LD structured data
     */
    private extractFromStructuredData(): boolean {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        let foundData = false;

        scripts.forEach((script) => {
            try {
                const data = JSON.parse(script.textContent || '');
                const jobPostings = this.findJobPostings(data);

                jobPostings.forEach((job: any) => {
                    if (job['@type'] === 'JobPosting') {
                        this.jobData.title = job.title || this.jobData.title;
                        this.jobData.company = job.hiringOrganization?.name || this.jobData.company;
                        this.jobData.description = this.cleanHTML(job.description || '');
                        this.jobData.location = this.parseLocation(job.jobLocation);
                        this.jobData.employmentType = job.employmentType || this.jobData.employmentType;
                        this.jobData.datePosted = job.datePosted || this.jobData.datePosted;
                        this.jobData.salary = this.parseSalary(job.baseSalary);

                        // Extract deadline if available
                        if (job.validThrough) {
                            this.jobData.datePosted = job.validThrough;
                        }

                        foundData = true;
                    }
                });
            } catch (e) {
                console.warn('Failed to parse JSON-LD:', e);
            }
        });

        return foundData && !!this.jobData.title && !!this.jobData.description;
    }

    /**
     * Recursively find JobPosting objects in nested JSON-LD
     */
    private findJobPostings(data: any, results: any[] = []): any[] {
        if (!data) return results;

        if (Array.isArray(data)) {
            data.forEach((item) => this.findJobPostings(item, results));
        } else if (typeof data === 'object') {
            if (data['@type'] === 'JobPosting') {
                results.push(data);
            }
            Object.values(data).forEach((value) => this.findJobPostings(value, results));
        }

        return results;
    }

    /**
     * Extract from meta tags (Open Graph, Twitter Cards)
     */
    private extractFromMetaTags(): boolean {
        const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
        const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
        const twitterTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector<HTMLMetaElement>(
            'meta[name="twitter:description"]'
        );
        const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');

        this.jobData.title =
            ogTitle?.content || twitterTitle?.content || document.title || this.jobData.title;

        this.jobData.description = this.cleanHTML(
            ogDescription?.content ||
            twitterDescription?.content ||
            description?.content ||
            this.jobData.description
        );

        return !!this.jobData.title && !!this.jobData.description;
    }

    /**
     * Extract from DOM using common patterns across job boards
     */
    private extractFromDOM(): boolean {
        // Enhanced selectors including Australian sites
        const titleSelectors = [
            'h1[data-automation="job-detail-title"]',  // Seek
            'h1.job-view__title',                      // EthicalJobs
            'h1.job-title',                            // Jora
            'h1[class*="job-title"]',
            'h1[class*="jobTitle"]',
            '[data-testid="job-title"]',
            '[class*="JobTitle"]',
            'h1.title',
            'h1',
        ];

        const companySelectors = [
            '[data-automation="advertiser-name"]',     // Seek
            '.job-view__company-name',                 // EthicalJobs
            '.company-name',                           // Jora
            '[class*="company-name"]',
            '[class*="companyName"]',
            '[data-testid="company-name"]',
            '[class*="employer"]',
            'a[class*="company"]',
        ];

        const descriptionSelectors = [
            '[data-automation="jobAdDetails"]',        // Seek
            '.job-view__description',                  // EthicalJobs
            '.job-description',                        // Jora
            '[class*="job-description"]',
            '[class*="jobDescription"]',
            '[data-testid="job-description"]',
            '[id*="job-description"]',
            '[class*="description"]',
            'article',
        ];

        const locationSelectors = [
            '[data-automation="job-detail-location"]', // Seek
            '.job-view__location',                     // EthicalJobs
            '.location',                               // Jora
            '[class*="location"]',
        ];

        // Extract title
        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element?.textContent?.trim()) {
                this.jobData.title = this.cleanText(element.textContent);
                break;
            }
        }

        // Extract company
        for (const selector of companySelectors) {
            const element = document.querySelector(selector);
            if (element?.textContent?.trim()) {
                this.jobData.company = this.cleanText(element.textContent);
                break;
            }
        }

        // Extract location
        for (const selector of locationSelectors) {
            const element = document.querySelector(selector);
            if (element?.textContent?.trim()) {
                this.jobData.location = this.cleanText(element.textContent);
                break;
            }
        }

        // Extract description
        for (const selector of descriptionSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                // Try to click "Show more" if present
                const showMoreBtn = element.querySelector('button[class*="show"], button[class*="Show"]');
                if (showMoreBtn && showMoreBtn instanceof HTMLButtonElement) {
                    try {
                        showMoreBtn.click();
                    } catch (e) {
                        // Ignore click errors
                    }
                }

                const content = element.innerHTML || element.textContent || '';
                if (content.trim()) {
                    this.jobData.description = this.cleanHTML(content);
                    break;
                }
            }
        }

        return !!this.jobData.title && !!this.jobData.description;
    }

    /**
     * Generic fallback - extract from page structure
     */
    private extractGenericContent(): void {
        // Use the first h1 as title if not found
        if (!this.jobData.title) {
            const h1 = document.querySelector('h1');
            this.jobData.title = this.cleanText(h1?.textContent || 'Unknown Job Title');
        }

        // Extract main content as description
        if (!this.jobData.description) {
            const main = document.querySelector('main') || document.querySelector('article') || document.body;
            const paragraphs = Array.from(main.querySelectorAll('p'))
                .map((p) => this.cleanText(p.textContent || ''))
                .filter((text) => text.length > 50)
                .slice(0, 10)
                .join('\n\n');

            this.jobData.description = paragraphs || 'No description available';
        }
    }

    /**
     * Parse location from various formats
     */
    private parseLocation(location: any): string | null {
        if (!location) return null;

        if (typeof location === 'string') return this.cleanText(location);

        if (location.address) {
            const addr = location.address;
            return [addr.addressLocality, addr.addressRegion, addr.addressCountry]
                .filter(Boolean)
                .join(', ');
        }

        return null;
    }

    /**
     * Parse salary information
     */
    private parseSalary(baseSalary: any): string | null {
        if (!baseSalary) return null;

        if (typeof baseSalary === 'string') return this.cleanText(baseSalary);

        const value = baseSalary.value;
        const currency = baseSalary.currency || 'AUD';

        if (value?.minValue && value?.maxValue) {
            return `${currency} ${value.minValue} - ${value.maxValue}`;
        }

        return value ? `${currency} ${value}` : null;
    }

    /**
     * Clean and validate extracted data
     */
    private clean(): JobData {
        // Truncate description if too long (keep first 15000 chars for better context)
        if (this.jobData.description && this.jobData.description.length > 15000) {
            this.jobData.description = this.jobData.description.substring(0, 15000) + '...';
        }

        // Clean all text fields
        this.jobData.title = this.cleanText(this.jobData.title);
        if (this.jobData.company) {
            this.jobData.company = this.cleanText(this.jobData.company);
        }
        if (this.jobData.location) {
            this.jobData.location = this.cleanText(this.jobData.location);
        }

        return this.jobData;
    }
}

// Listen for messages from side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'EXTRACT_JOB_DATA') {
        const scraper = new UniversalJobScraper();
        scraper
            .extract()
            .then((data) => {
                console.log('✅ Job data extracted:', {
                    title: data.title,
                    company: data.company,
                    source: data.source,
                    descriptionLength: data.description.length,
                });
                sendResponse({ success: true, data });
            })
            .catch((error) => {
                console.error('❌ Scraping failed:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true; // Keep channel open for async response
    }
});

console.log('CareerCopilot: Enhanced Universal Job Scraper loaded (supports AU sites)');
