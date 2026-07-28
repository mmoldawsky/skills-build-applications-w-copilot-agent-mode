import { useMemo } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';
import { getApiBaseUrl } from './components/api.js';
import './App.css';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/users', label: 'Users' },
  { path: '/teams', label: 'Teams' },
  { path: '/activities', label: 'Activities' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/workouts', label: 'Workouts' },
];

function Home() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  const apiHost = getApiBaseUrl();
  const exampleUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/[component]/`
    : 'http://localhost:8000/api/[component]/';

  return (
    <section>
      <h1>Octofit Tracker</h1>
      <p className="lead">
        Navigate the tracker using the buttons above. The frontend loads data from the backend API using Vite environment variables.
      </p>
      <p>
        Current API base URL: <strong>{apiHost}</strong>
      </p>
      <div className="alert alert-info">
        <p className="mb-1">
          Define <code>VITE_CODESPACE_NAME</code> in <code>.env.local</code> when running in GitHub Codespaces.
        </p>
        <p className="mb-0">Example endpoint:
          <code>{exampleUrl}</code>
        </p>
      </div>
    </section>
  );
}

function App() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  return (
    <div className="container py-4">
      <header className="mb-4 text-center">
        <h2>Octofit Tracker</h2>
        <p className="text-muted">A React 19 presentation tier with router-driven views and API integration.</p>
      </header>

      <nav className="nav nav-pills justify-content-center flex-wrap mb-4">
        {navItems.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="mt-5 text-center text-muted">
        API base URL: <code>{apiBaseUrl}</code>
      </footer>
    </div>
  );
}

export default App;
