# Career Copilot Frontend

Career Copilot is an AI-powered career management platform built with modern web
technologies. This repository contains the frontend application built with
React, TypeScript, and Material-UI.

## Features

- **Modern UI/UX** with Material-UI components
- **Responsive Design** that works on all devices
- **Type-Safe** with TypeScript
- **Fast Development** with Vite
- **Comprehensive Testing** with Vitest and React Testing Library

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library
- **State Management**: React Context API
- **Routing**: React Router v7

## Prerequisites

- Node.js 18+
- Yarn 4+

## Getting Started

1. **Install Dependencies**

   ```bash
   yarn install
   ```

2. **Start Development Server**

   ```bash
   yarn dev
   ```

   This will start the development server at `http://localhost:3000`

3. **Build for Production**
   ```bash
   yarn build
   ```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn test` - Run tests
- `yarn test:coverage` - Run tests with coverage
- `yarn lint` - Lint code
- `yarn format` - Format code with Prettier
- `yarn type-check` - Check TypeScript types

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── services/      # API services
├── styles/        # Global styles
└── types/         # TypeScript type definitions
```

## UI Components

We use Material-UI (MUI) as our component library. All custom components are
built on top of MUI components for consistency and accessibility.

### Component Development

1. **Creating a New Component**
   - Create a new directory in `src/components`
   - Follow the pattern of existing components
   - Include tests and stories

2. **Component Structure**
   ```
   ComponentName/
   ├── ComponentName.tsx   # Main component
   ├── ComponentName.stories.tsx  # Storybook stories
   ├── ComponentName.test.tsx     # Tests
   └── index.ts            # Export
   ```

## Testing

We use Vitest and React Testing Library for testing our components.

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows (coming soon)

To run tests:

```bash
yarn test
```

## Contributing

1. Create a new branch for your feature
2. Write tests for your changes
3. Submit a pull request

## Design System

- **Design Files**:
  [Figma](https://www.figma.com/design/OQizDLqM9Y3qitGXiabkAv/Career-Copilot)
- **Colors**: Use theme colors from MUI
- **Typography**: Use MUI's typography system

## License

MIT
