# CareerCopilot Chrome Extension - React + TypeScript + Vite

Modern Chrome Extension built with React, TypeScript, and Vite, featuring Hot Module Replacement (HMR) for rapid development.

## 🚀 Features

- **React 18** with TypeScript for type-safe component development
- **Vite** for lightning-fast builds and HMR
- **@crxjs/vite-plugin** for seamless Chrome Extension development with auto-reload
- **Tailwind CSS** for modern, responsive styling
- **Universal Job Scraper** with multi-strategy extraction:
  - Schema.org JSON-LD (structured data)
  - Meta tags (Open Graph, Twitter Cards)
  - DOM selectors (common patterns)
  - Generic fallback
- **Python Backend Integration** via FastAPI

## 📁 Project Structure

```
chrome-extension/
├── src/
│   ├── pages/
│   │   ├── sidepanel/          # React app for side panel
│   │   │   ├── index.html      # Entry HTML
│   │   │   ├── index.tsx       # React root
│   │   │   └── App.tsx         # Main app component
│   │   ├── content/            # Content script (TypeScript)
│   │   │   └── index.ts        # Job scraper logic
│   │   └── background/         # Background service worker
│   │       └── index.ts        # Extension management
│   ├── components/             # React components
│   │   ├── Header.tsx          # Header component
│   │   ├── JobAnalyzer.tsx     # Main analyzer UI
│   │   ├── JobInfo.tsx         # Job data display
│   │   ├── AnalysisResult.tsx  # Analysis results
│   │   └── StatusMessage.tsx   # Status notifications
│   ├── styles/                 # Global styles
│   │   └── global.css          # Tailwind imports
│   └── types/                  # TypeScript types
│       └── index.ts            # Shared interfaces
├── public/                     # Static assets
│   └── icon*.png               # Extension icons
├── manifest.json               # Chrome Extension manifest
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd chrome-extension
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

This starts Vite dev server with HMR on `http://localhost:5173`

### 3. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Reload** on the CareerCopilot extension (if already loaded)
   OR
   Click **Load unpacked** and select `chrome-extension/dist` directory

### 4. Start Python Backend

```bash
# From project root
./start-chrome-extension-api.sh
```

Backend runs on `http://localhost:8000`

## 🔥 Hot Module Replacement (HMR)

With `@crxjs/vite-plugin`, the extension automatically reloads when you make changes:

- **Side Panel UI Changes:** Auto-reload without losing state
- **Content Script Changes:** Auto-reload on affected pages
- **Background Script Changes:** Service worker auto-updates

Just save your file and see changes instantly! 🎉

## 🎨 Styling with Tailwind CSS

The extension uses Tailwind CSS with a custom color palette:

```tsx
// Example: Using Tailwind classes
<button className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600">
  Analyze Job
</button>
```

**Custom Colors:**
- `primary-*`: Purple gradient (#667eea)
- `secondary-*`: Deep purple (#764ba2)

Edit `tailwind.config.js` to customize.

## 📝 Usage

### Scrape Job Data

1. Navigate to any job posting (LinkedIn, Indeed, etc.)
2. Click the CareerCopilot extension icon
3. Side panel opens → Click **"Scrape Job Data"**
4. Job info is extracted using the universal scraper

### Analyze Job

1. After scraping, click **"Analyze Job"**
2. Job data is sent to Python backend
3. AI analysis appears in the panel

## 🔧 Development

### Building for Production

```bash
npm run build
```

Creates optimized build in `dist/` directory.

### Type Checking

```bash
npm run type-check
```

### Project Commands

- `npm run dev` - Start dev server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - TypeScript type checking

## 🏗️ Architecture

### Data Flow

```
Web Page → Content Script (Scraper) → Side Panel (React)
                                           ↓
                                    HTTP POST
                                           ↓
                               Python Backend (FastAPI)
                                           ↓
                                  AI Analysis → Response
```

### Message Passing

```typescript
// Side Panel → Content Script
chrome.tabs.sendMessage(tabId, { type: 'EXTRACT_JOB_DATA' });

// Content Script → Response
sendResponse({ success: true, data: jobData });
```

### API Integration

```typescript
// Side Panel → Python Backend
const response = await fetch('http://localhost:8000/api/chrome-extension/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(jobData),
});
```

## 🎯 Key Components

### JobAnalyzer.tsx

Main component handling job scraping and analysis:
- Manages state for job data, analysis, and status
- Communicates with content script via Chrome API
- Sends data to Python backend for analysis

### UniversalJobScraper (content/index.ts)

Multi-strategy job data extraction:
1. **Structured Data:** Parses JSON-LD Schema.org
2. **Meta Tags:** Extracts Open Graph/Twitter Cards
3. **DOM Selectors:** Uses common CSS patterns
4. **Generic Fallback:** Page content analysis

### Background Service Worker

Manages extension lifecycle:
- Opens side panel on icon click
- Routes messages between components

## 🔌 Backend Integration

The Python backend endpoint:

```python
# backend/app/api/endpoints/chrome_extension.py

@router.post("/analyze")
async def analyze_job_posting(job_data: JobPostingData):
    # Your AI agent logic here
    analysis = your_agent.analyze(job_data)
    return JobAnalysisResponse(
        success=True,
        analysis=analysis,
        metadata={...}
    )
```

## 🐛 Troubleshooting

### Extension doesn't load

- Check `chrome://extensions/` for errors
- Verify all files are in `dist/` after build
- Reload the extension

### HMR not working

- Ensure dev server is running (`npm run dev`)
- Check Vite dev server is on port 5173
- Reload the extension

### Backend connection fails

- Verify Python backend is running on port 8000
- Check CORS configuration in `backend/app/main.py`
- Look for CORS errors in browser Network tab

### Scraping fails

- Check browser console (F12) for content script logs
- Verify the page has job posting data
- Inspect page source for structured data

## 📦 Dependencies

### Production

- `react` ^18.2.0
- `react-dom` ^18.2.0

### Development

- `@crxjs/vite-plugin` - Chrome extension support with HMR
- `@vitejs/plugin-react` - React integration for Vite
- `vite` - Build tool and dev server
- `typescript` - Type checking
- `tailwindcss` - Utility-first CSS
- `@types/chrome` - Chrome extension types

## 🚀 Deployment

### Publishing to Chrome Web Store

1. Build production version:
   ```bash
   npm run build
   ```

2. Create icons (see `public/README.md`)

3. Test the `dist/` folder:
   - Load unpacked in Chrome
   - Test all features
   - Verify no console errors

4. Create ZIP archive:
   ```bash
   cd dist
   zip -r ../careercopilot-extension.zip .
   ```

5. Upload to Chrome Web Store Developer Dashboard

## 🔐 Security

- All API calls use POST with JSON payloads
- CORS configured for localhost development
- No sensitive data stored in extension
- Content script runs in isolated world

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
      },
    },
  },
},
```

### Add New Components

```bash
# Create new component
touch src/components/YourComponent.tsx
```

### Modify Scraper Logic

Edit `src/pages/content/index.ts` to add custom selectors or extraction logic.

## 🤝 Contributing

This extension is part of the CareerCopilot project. See main [README](../README.md) for contribution guidelines.

## 📄 License

Same as CareerCopilot project.
