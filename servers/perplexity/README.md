# Perplexity Server

A Node.js/Express server for handling Perplexity API requests in the CareerCopilot application.

## Features

- 🚀 Express.js server with modern ES modules
- 🔒 CORS support with configurable origins
- 📝 Request logging with Morgan
- 📊 Structured logging with Winston
- 🏥 Health check endpoint
- 🛠️ Error handling middleware
- 🔄 Environment configuration

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

## Installation

1. Navigate to the server directory:
   ```bash
   cd servers/perplexity
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Copy the example environment file and update with your configuration:
   ```bash
   cp .env.example .env
   ```

## Configuration

Edit the `.env` file to configure the server:

```
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
LOG_ERROR_FILE=logs/error.log

# Perplexity API Key
PERPLEXITY_API_KEY=your_api_key_here
```

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm test` - Run tests (to be implemented)

## API Endpoints

### Health Check
- `GET /health` - Check if the server is running

### API Root
- `GET /api` - API information

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The server will be available at `http://localhost:3001`

## Logs

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| NODE_ENV | Environment (development/production) | development |
| CORS_ORIGIN | Allowed CORS origin | * |
| LOG_LEVEL | Logging level | info |
| LOG_FILE | Path to the log file | logs/app.log |
| LOG_ERROR_FILE | Path to the error log file | logs/error.log |
| PERPLEXITY_API_KEY | Your Perplexity API key | |

## License

This project is part of the CareerCopilot application.
