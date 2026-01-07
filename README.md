# User Management Dashboard

A modern, full-featured user management dashboard built with React, TypeScript, and Material-UI. This application provides a complete solution for managing users with authentication, data fetching, internationalization, and comprehensive testing.

## 🌐 Live Demo

**🚀 [View Live Application](https://user-management-dashboard-wine-chi.vercel.app/)**

### Test Credentials

- **Email**: `q@quantum.io`
- **Password**: `qTask123#`

> Try out all features including user management, search, pagination, theme switching, and more!

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development Guide](#-development-guide)
- [Testing](#-testing)
- [Authentication](#-authentication)
- [Internationalization](#-internationalization)
- [Contributing](#-contributing)

## ✨ Features

- **User Management**: Browse, search, and manage users with pagination and filtering
- **Authentication**: Secure login/logout with JWT token management
- **Protected Routes**: Route-level authentication guards
- **Dark/Light Theme**: Toggle between dark and light themes with system preference detection
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Internationalization**: Multi-language support (i18next)
- **Data Grid**: Advanced data table with sorting, filtering, and pagination (MUI X Data Grid)
- **Form Validation**: React Hook Form with Zod schema validation
- **API Integration**: RESTful API integration with Axios
- **Real-time Search**: Debounced search with optimized performance
- **Error Handling**: Comprehensive error boundaries and validation
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance Monitoring**: Built-in Web Vitals tracking

## 🛠 Tech Stack

### Core

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### UI & Styling

- **Material-UI (MUI) v7** - Component library
- **MUI X Data Grid** - Advanced data tables
- **Emotion** - CSS-in-JS styling
- **Mui-icons** - Icon library

### Routing & Data

- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client

### Forms & Validation

- **React Hook Form** - Form management
- **Zod** - Schema validation

### Internationalization

- **i18next** - Internationalization framework
- **react-i18next** - React bindings for i18next

### Authentication

- **js-cookie** - Cookie management for JWT tokens

### Development & Testing

- **Vitest** - Unit testing framework
- **Testing Library** - React component testing
- **ESLint** - Linting
- **Prettier** - Code formatting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd user-management-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables** (optional)

Create a `.env` file in the root directory:

```env
VITE_RANDOM_USER_API=https://randomuser.me/api/
```

4. **Start the development server**

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── api/                    # API clients and types
│   ├── axios.ts           # Axios configuration
│   ├── users.ts           # User API functions
│   └── types.ts           # API type definitions
├── components/            # React components
│   ├── dialogs/          # Modal dialogs
│   ├── errors/           # Error boundaries & 404
│   ├── forms/            # Form components
│   │   ├── auth/         # Login form
│   │   └── profile.tsx   # Profile form
│   └── layout/           # Layout components
│       ├── Header.tsx    # App header with theme toggle
│       ├── SideMenu.tsx  # Navigation sidebar
│       ├── Layout.tsx    # Main layout wrapper
│       └── Breadcrumb.tsx # Breadcrumb navigation
├── hooks/                 # Custom React hooks
│   ├── use-theme.tsx     # Theme management
│   └── use-debounce.tsx  # Debounced values
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication utilities
│   └── constants.ts      # App constants
├── routes/                # File-based routing
│   ├── __root.tsx        # Root layout
│   ├── _auth/            # Public routes (login)
│   └── _protected/       # Protected routes (dashboard, profile)
├── theme/                 # MUI theme configuration
│   ├── theme.ts          # Theme customization
│   └── ThemeProvider.tsx # Theme context provider
├── test/                  # Test utilities
│   ├── setup.ts          # Test setup
│   └── test-utils.tsx    # Custom render functions
├── integrations/          # Third-party integrations
│   └── tanstack-query/   # React Query setup
├── i18n.ts               # Internationalization config
├── main.tsx              # Application entry point
└── styles.css            # Global styles
```

## 💻 Development Guide

### Adding a New Route

Routes are file-based. Create a new file in `src/routes/`:

```tsx
// src/routes/_protected/settings.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return <div>Settings Page</div>;
}
```

For protected routes, place them under `_protected/`. For public routes, use `_auth/`.

### Creating a New Component

```tsx
// src/components/MyComponent.tsx
import { Box, Typography } from "@mui/material";

interface MyComponentProps {
  title: string;
}

export const MyComponent = ({ title }: MyComponentProps) => {
  return (
    <Box>
      <Typography variant="h4">{title}</Typography>
    </Box>
  );
};
```

### Adding API Endpoints

```typescript
// src/api/myservice.ts
import { apiClient } from "./axios";

export interface MyData {
  id: string;
  name: string;
}

export const fetchMyData = async (): Promise<MyData[]> => {
  const { data } = await apiClient.get<MyData[]>("/my-endpoint");
  return data;
};
```

### Using React Query

```tsx
import { useQuery } from "@tanstack/react-query";

import { fetchUsers } from "@/api/users";

export const UsersList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", { page: 1 }],
    queryFn: () => fetchUsers({ page: 1, results: 10 }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.users.map((user) => (
        <div key={user.email}>{user.name.first}</div>
      ))}
    </div>
  );
};
```

### Form Validation

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register("password")} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
};
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

```tsx
// MyComponent.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("should render title", () => {
    renderWithProviders(<MyComponent title="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("should handle click events", async () => {
    const { user } = renderWithProviders(<MyComponent title="Test" />);
    const button = screen.getByRole("button");
    await user.click(button);
    // assertions...
  });
});
```

### Test Utilities

Use `renderWithProviders` instead of `render` to include all necessary providers:

```tsx
import { renderWithProviders } from "@/test/test-utils";

const { user, queryClient } = renderWithProviders(<MyComponent />);
```

## 🔐 Authentication

### How It Works

1. **Login**: User submits credentials to `/auth/login`
2. **Token Storage**: Access and refresh tokens stored in HTTP-only cookies
3. **User Data**: User profile stored in localStorage
4. **Protected Routes**: Routes under `_protected/` check authentication status
5. **Auto-redirect**: Unauthenticated users redirected to login page

### Auth Functions

```typescript
import {
  clearAllAuthData,
  getUser,
  isAuthenticated,
  setUser,
} from "@/lib/auth";

// Check if user is logged in
if (isAuthenticated()) {
  const user = getUser();
  console.log(user?.name);
}

// Logout
const handleLogout = () => {
  clearAllAuthData();
  router.navigate({ to: "/login" });
};
```

### Token Management

```typescript
import { clearAuthTokens, getAccessToken, setAuthTokens } from "@/lib/auth";

// Get current token
const token = getAccessToken();

// Set new tokens
setAuthTokens("access_token", "refresh_token");

// Clear tokens
clearAuthTokens();
```

## 🌍 Internationalization

### Available Languages

- English (en)
- Additional languages can be added in `public/messages/`

### Adding Translations

1. **Create translation file**: `public/messages/{lang}.json`

```json
{
  "common": {
    "welcome": "Welcome",
    "login": "Login"
  }
}
```

2. **Use in components**:

```tsx
import { useTranslation } from "react-i18next";

export const MyComponent = () => {
  const { t } = useTranslation();

  return <h1>{t("common.welcome")}</h1>;
};
```

### Changing Language

```tsx
import { useTranslation } from "react-i18next";

export const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  return <button onClick={() => i18n.changeLanguage("en")}>English</button>;
};
```

## 🎨 Theming

### Using Theme

```tsx
import { useTheme } from "@/hooks/use-theme";

export const ThemedComponent = () => {
  const { mode, toggleTheme } = useTheme();

  return <button onClick={toggleTheme}>Current theme: {mode}</button>;
};
```

### Customizing Theme

Edit `src/theme/theme.ts` to customize colors, typography, spacing, etc:

```typescript
export const createAppTheme = (mode: "light" | "dark") => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#1976d2", // Your brand color
      },
      secondary: {
        main: "#dc004e",
      },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
  });
};
```

## 📦 Deployment

### Build Optimization

```bash
# Production build with type checking
npm run build

# Build output in dist/ directory
```

### Environment Variables

Create a `.env` file (use `.env.example` as template):

```env
VITE_RANDOM_USER_API=https://randomuser.me/api/
NODE_ENV=production
```
