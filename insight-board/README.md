# InsightBoard – Team Productivity Dashboard

A frontend-only React application demonstrating a task management and analytics dashboard with role-based access.

## Features

- **Authentication**: Simulated login with role selection (manager or team member), email/password validation and persistence via `localStorage`.
- **Role-Based UI**: Managers can create, assign, edit and delete tasks; members see only their assigned tasks and can update status.
- **Task Management**: Full CRUD for tasks with fields like title, description, assignee, priority, deadline and status. State is saved in `localStorage`.
- **Analytics Dashboard**: Summary cards and charts (pie, bar, line) powered by Chart.js showing task statistics and trends.
- **Settings**: Change password, toggle two-factor authentication, and delete account with confirmation.
- **Dark Mode**: Toggle between light/dark themes using Context API and persisted preference.
- **Landing Page**: A modern welcome page with a call-to-action.

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser. You can use the pre-populated accounts:

- Manager: `manager@test.com` / `password123`
- Member: `member@test.com` / `password123`

Any new user that logs in is stored in `localStorage` and can be assigned tasks accordingly.

## Project Structure

The source code lives under `src/`:

```
src/
├── components/         # UI pieces like forms, tables and layout
├── context/            # Providers for auth, tasks and theme
├── hooks/              # custom hooks (e.g. useTasks)
├── pages/              # route-level components (Landing, Login, Dashboard, etc.)
└── utils/              # validation helpers
```

## Persistence & Local Storage

On app load the provider checks `localStorage` for an authenticated user and any saved tasks. Updating tasks or user settings automatically syncs with storage.

## Development Notes

- TailwindCSS is used for styling; dark mode is enabled via the `class` strategy.
- Chart.js with `react-chartjs-2` provides the visualizations.
- UUID is used for unique task IDs.

Feel free to extend functionality, add API integration, or convert to TypeScript for production readiness.
