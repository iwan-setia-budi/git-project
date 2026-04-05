# 📦 Project Setup Guide

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Git

---

## Installation

### 1. Clone and Install Dependencies
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Environment Configuration
Edit `.env.local` with your settings:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Authentication
VITE_AUTH_TOKEN_KEY=auth_token
VITE_AUTH_REFRESH_URL=/api/auth/refresh

# Feature Flags
VITE_ENABLE_2FA=true
VITE_ENABLE_AUDIT_LOGS=true
```

---

## Development

### Start Dev Server
```bash
npm run dev
# Opens at http://localhost:5173
```

### Run ESLint
```bash
npm run lint
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ErrorBoundary.jsx    # Error handling
│   ├── PrivateRoute.jsx      # Route protection
│   ├── layout/
│   │   └── AppShell.jsx      # Main layout
│   └── ui/                   # UI primitives
│       ├── button.jsx
│       ├── card.jsx
│       └── input.jsx
├── pages/             # Page components
│   ├── IndexPage.jsx
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── AnalyticsPage.jsx
│   ├── BillingPage.jsx
│   ├── ActivityPage.jsx
│   ├── ReportsPage.jsx
│   ├── UsersPage.jsx
│   └── SettingsPage.jsx
├── utils/             # Utility functions
│   ├── classname.js   # CSS class utilities
│   ├── validation.js  # Input validation & sanitization
│   └── toast.js       # Notifications & exports
├── App.jsx            # Main app with routing
├── main.jsx           # Entry point
└── index.css          # Global styles
```

---

## Key Features Implemented

### ✅ Security
- [x] Error Boundary for crash prevention
- [x] Input validation & XSS prevention
- [x] CSV injection prevention
- [x] Route protection with PrivateRoute
- [x] Environment variable management

### ✅ Code Quality
- [x] Component prop validation (PropTypes)
- [x] Reusable utilities
- [x] ESLint configuration
- [x] Code organization & structure

### ✅ User Experience
- [x] Search filtering on all pages
- [x] Responsive design
- [x] Accessible components (ARIA labels)
- [x] Status-aware styling
- [x] Toast notifications

### ⚠️ TODO (For Production)
- [ ] Real authentication implementation
- [ ] API integration
- [ ] Loading states on data fetches
- [ ] Comprehensive error handling
- [ ] Unit & integration tests
- [ ] TypeScript migration
- [ ] Performance optimization

---

## Common Tasks

### Adding a New Page
```jsx
// src/pages/NewPage.jsx
import { useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function NewPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Your content */}
      </div>
    </ErrorBoundary>
  );
}
```

Then add route in `src/App.jsx`:
```jsx
<Route path="/new-page" element={<PrivateRoute><NewPage /></PrivateRoute>} />
```

### Adding a Form with Validation
```jsx
import { sanitizeInput, isValidEmail } from '@/utils/validation';

const [email, setEmail] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();
  const sanitized = sanitizeInput(email);
  if (!isValidEmail(sanitized)) {
    showToast("Invalid email", "error");
    return;
  }
  // Process form...
};
```

### Creating a New UI Component
```jsx
import PropTypes from 'prop-types';

export function MyComponent({ title, onClick, ...props }) {
  return (
    <button onClick={onClick} {...props}>
      {title}
    </button>
  );
}

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
```

---

## Troubleshooting

### "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 already in use
```bash
# Run on different port
npm run dev -- --port 3000
```

### ESLint errors
```bash
# Fix all auto-fixable issues
npm run lint -- --fix
```

---

## Performance Tips

1. **Use React.memo** for expensive components
2. **Lazy load pages** with React.lazy()
3. **Optimize images** before adding to project
4. **Monitor bundle size** with `npm run preview`

---

## Testing (When Ready)

```bash
# Setup testing
npm install --save-dev vitest @testing-library/react

# Run tests
npm test
```

---

## Deployment

See the **SECURITY.md** file for production deployment checklist.

---

## Support & Documentation

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

