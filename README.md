# AI-based Career Navigator — Frontend

Vue 3 + TypeScript + Vite frontend application for career guidance and professional development.

## Features

- User authentication and registration
- Skills assessment and tracking
- Career recommendations
- Job listings and search
- Mentor directory
- Case studies catalog
- Admin panel

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- Tailwind CSS
- Vue Router

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```powershell
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
VITE_API_BASE_URL=
```

Leave empty for development (uses `/api` proxy). For production, set your backend URL.

### Development Server

```powershell
npm run dev
```

Open http://localhost:5173

### Build for Production

```powershell
npm run build
```

### Preview Production Build

```powershell
npm run preview
```

## API Endpoints

The backend should implement these endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/profile` - Update user profile
- `GET /api/recommendations` - Get career recommendations
- `GET /api/jobs` - Get job listings
- `GET /api/mentors` - Get mentor directory
- `GET /api/cases` - Get case studies

## Project Structure

```
src/
├── components/       # Reusable Vue components
├── composables/      # Vue composition functions
├── pages/           # Page components
├── router/          # Vue Router configuration
├── services/        # API service layer
└── types/           # TypeScript type definitions
```

## License

MIT
