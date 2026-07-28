import { useEffect, useState } from 'react';
import { fetchResource } from './api.js';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    fetchResource('teams')
      .then((items) => {
        if (active) {
          setTeams(items);
          setError('');
        }
      })
      .catch((fetchError) => {
        if (active) {
          setError(fetchError.message || 'Could not load teams.');
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
      <h2>Teams</h2>
      {loading && <div className="alert alert-secondary">Loading teams…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && teams.length === 0 && (
        <div className="alert alert-warning">No teams were found.</div>
      )}

      {teams.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Points</th>
                <th>Members</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={`${team._id ?? team.id ?? index}`}>
                  <td>{team.name ?? 'Unknown'}</td>
                  <td>{team.points ?? 0}</td>
                  <td>{Array.isArray(team.members) ? team.members.join(', ') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Teams;
