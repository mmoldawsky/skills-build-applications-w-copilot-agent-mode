import { useEffect, useState } from 'react';
import { fetchResource } from './api.js';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    fetchResource('activities')
      .then((items) => {
        if (active) {
          setActivities(items);
          setError('');
        }
      })
      .catch((fetchError) => {
        if (active) {
          setError(fetchError.message || 'Could not load activities.');
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
      <h2>Activities</h2>
      {loading && <div className="alert alert-secondary">Loading activities…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && activities.length === 0 && (
        <div className="alert alert-warning">No activities were found.</div>
      )}

      {activities.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Type</th>
                <th>Duration</th>
                <th>Points</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={`${activity._id ?? activity.id ?? index}`}>
                  <td>{activity.type ?? 'Unknown'}</td>
                  <td>{activity.durationMinutes ?? activity.duration ?? '—'} min</td>
                  <td>{activity.points ?? '—'}</td>
                  <td>{activity.userName ?? 'Guest'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Activities;
