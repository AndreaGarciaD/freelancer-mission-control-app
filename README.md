# 📈 Freelancer Mission Control

A full-stack freelance management dashboard built with React, TypeScript, and Node.js. Thought for freelancers who need to manage clients, projects, phases, and documents from a single, responsive interface.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)

---

## Features

### Auth
- JWT-based login and registration
- Protected routes — unauthenticated users are redirected automatically
- Token persistence across page refreshes via `localStorage` hydration

### Clients
- Full CRUD — create, view, edit, and delete clients
- Live search with debounce (no unnecessary API calls)
- Server-side pagination

### Projects
- Full CRUD with status (`active`, `completed`, `on_hold`, `cancelled`) and priority (`low`, `medium`, `high`) filters
- Combined search + filter — all params sent cleanly to the backend
- Deadline tracking with color-coded urgency (overdue in red, due soon in amber)
- Clickable rows navigate to a dedicated project detail page

### Project Detail
- Full project metadata — client, budget, rate, deadline, description
- **Animated phase timeline** — vertical timeline UI with staggered entrance animations, progress bar, and one-click status cycling (`pending → in_progress → completed`)
- **Document & link storage** — attach docs, meeting recordings, designs, or other links with type-specific color-coded cards

### Dashboard
- Metric cards — total clients, active projects, overdue count, active budget
- Upcoming deadlines panel sorted by urgency
- Recent projects panel with status badges
- Personalized greeting based on time of day

### UX & Polish
- Framer Motion page transitions, animated modals, staggered list entrances
- Toast notifications for all CRUD actions
- Confirm dialog before any destructive delete
- Loading skeletons on every data-fetching view
- Collapsible sidebar with smooth animation
- Fully responsive — mobile drawer navigation with hamburger menu
- Dark / light mode toggle with View Transition API ripple effect

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router v7 |
| Animations | Framer Motion |
| Global state | Zustand |
| Forms | React Hook Form + Zod |
| HTTP client | Axios |
| Icons | Lucide React |
| Date utilities | date-fns |

---

## React Concepts Demonstrated

This project was built specifically to showcase intermediate React + TypeScript skills:

- **Custom hooks**. `useAuth`, `useDebounce`, `usePagination`, `useClients`, `useProjects`, `usePhases`, `useDocuments` each expose a clean, reusable API
- **Container vs presentation components**. All data-fetching and state logic lives in hooks and page components only render
- **Controlled forms**. `react-hook-form` + `zod` for schema validation across all forms
- **Protected routes**. `ProtectedRoute` and `PublicRoute` guards using Zustand auth state
- **`useMemo`**. dashboard stats and derived data computed only when source data changes
- **`useCallback`**. all hook action functions memoized to prevent unnecessary child re-renders
- **`useEffect` with cleanup**. debounce timers, resize listeners, and MutationObservers all cleaned up properly
- **Separation of concerns** . API layer, store, hooks, and components each have a single responsibility

---

## 📁 Project Structure

```
src/
├── api/                  # Axios instance + typed endpoint functions
│   ├── axios.ts          # Instance with request/response interceptors
│   ├── auth.api.ts
│   ├── clients.api.ts
│   ├── projects.api.ts
│   ├── phases.api.ts
│   └── documents.api.ts
├── components/
│   ├── ui/               # Reusable primitives: Button, Input, Modal, Badge, etc.
│   └── layout/           # AppLayout, Sidebar, Header, PageTransition
├── features/
│   ├── auth/             # LoginPage
│   ├── dashboard/        # DashboardPage, MetricCard, DeadlineItem
│   ├── clients/          # ClientsPage, ClientForm
│   └── projects/         # ProjectsPage, ProjectDetailPage, PhaseTimeline,
│                         # PhaseForm, DocumentList, DocumentForm
├── hooks/                # All custom hooks
├── router/               # Route definitions + ProtectedRoute / PublicRoute guards
├── store/                # Zustand stores: auth, toast, ui
├── types/                # All TypeScript interfaces aligned to DB schema
└── utils/                # Format helpers (dates, currency, deadline status)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- The [backend API](https://github.com/AndreaGarciaD/freelancer-mission-control.git) running on `http://localhost:3000`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/freelancer-mission-control.git
cd freelancer-mission-control

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

```bash
# .env.example
VITE_API_URL=http://localhost:3000
```

---

## API Endpoints Consumed

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/auth/me` | Get current user from token |

### Clients
| Method | Endpoint | Description |
|---|---|---|
| GET | `/clients` | List clients (search, pagination) |
| POST | `/clients` | Create a client |
| PUT | `/clients/:id` | Update a client |
| DELETE | `/clients/:id` | Delete a client |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects` | List projects (search, status, priority, pagination) |
| GET | `/projects/:id` | Get a single project |
| POST | `/projects` | Create a project |
| PUT | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project |

### Phases
| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/:id/phases` | List phases for a project |
| POST | `/projects/:id/phases` | Create a phase |
| PUT | `/phases/:id` | Update a phase |
| DELETE | `/phases/:id` | Delete a phase |

### Documents
| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/:id/documents` | List documents for a project |
| POST | `/projects/:id/documents` | Attach a document link |
| PUT | `/projects/:id/documents/:docId` | Update a document |
| DELETE | `/projects/:id/documents/:docId` | Delete a document |

---

## 📸 Pages Overview

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Animated login / register with form validation |
| Dashboard | `/dashboard` | Metrics, upcoming deadlines, recent projects |
| Clients | `/clients` | Searchable, paginated client table with CRUD |
| Projects | `/projects` | Filtered project table with status/priority/search |
| Project Detail | `/projects/:id` | Full project info, phase timeline, document links |

---

## Database Schema

The frontend types are aligned to a MySQL database with the following tables:

- **users** — `id`, `name`, `email`, `password_hash`, `created_at`, `updated_at`
- **clients** — `id`, `user_id`, `name`, `email`, `company`, `notes`, `created_at`, `updated_at`
- **projects** — `id`, `user_id`, `client_id`, `title`, `description`, `status`, `deadline`, `rate`, `budget`, `priority`, `created_at`, `updated_at`
- **phases** — `id`, `project_id`, `title`, `description`, `status`, `order_index`, `due_date`, `created_at`, `updated_at`
- **documents** — `id`, `project_id`, `title`, `url`, `type`, `created_at`, `updated_at`

