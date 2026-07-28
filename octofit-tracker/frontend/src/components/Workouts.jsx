import { useEffect, useState } from 'react';
import { fetchResource } from './api.js';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    fetchResource('workouts')
      .then((items) => {
        if (active) {
          setWorkouts(items);
          setError('');
        }
      })
      .catch((fetchError) => {
        if (active) {
          setError(fetchError.message || 'Could not load workouts.');
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
      <h2>Workouts</h2>
      {loading && <div className="alert alert-secondary">Loading workouts…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && workouts.length === 0 && (
        <div className="alert alert-warning">No workouts were found.</div>
      )}

      {workouts.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Focus</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout, index) => (
                <tr key={`${workout._id ?? workout.id ?? index}`}>
                  <td>{workout.title ?? 'Untitled'}</td>
                  <td>{workout.difficulty ?? 'Unknown'}</td>
                  <td>{workout.durationMinutes ?? workout.duration ?? '—'} min</td>
                  <td>{workout.focus ?? 'Fitness'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Workouts;
