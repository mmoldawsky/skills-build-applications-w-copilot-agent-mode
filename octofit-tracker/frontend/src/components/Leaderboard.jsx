import { useEffect, useMemo, useState } from 'react';
import { fetchResource } from './api.js';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const exampleApiUrl = useMemo(() => {
    const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
    return codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard`
      : 'http://localhost:8000/api/leaderboard';
  }, []);

  useEffect(() => {
    let active = true;

    fetchResource('leaderboard')
      .then((items) => {
        if (active) {
          setLeaderboard(items);
          setError('');
        }
      })
      .catch((fetchError) => {
        if (active) {
          setError(fetchError.message || 'Could not load leaderboard.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section>
      <h2>Leaderboard</h2>
      {loading && <div className="alert alert-secondary">Loading leaderboard…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && leaderboard.length === 0 && (
        <div className="alert alert-warning">No leaderboard entries were found.</div>
      )}

      {leaderboard.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={`${entry._id ?? entry.id ?? index}`}>
                  <td>{entry.rank ?? index + 1}</td>
                  <td>{entry.name ?? 'Unknown'}</td>
                  <td>{entry.points ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Leaderboard;
