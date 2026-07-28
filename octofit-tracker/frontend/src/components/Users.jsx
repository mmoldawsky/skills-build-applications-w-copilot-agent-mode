import { useEffect, useState } from 'react';
import { fetchResource } from './api.js';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    fetchResource('users')
      .then((items) => {
        if (active) {
          setUsers(items);
          setError('');
        }
      })
      .catch((fetchError) => {
        if (active) {
          setError(fetchError.message || 'Could not load users.');
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
      <h2>Users</h2>
      {loading && <div className="alert alert-secondary">Loading users…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && users.length === 0 && (
        <div className="alert alert-warning">No users were found.</div>
      )}

      {users.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={`${user._id ?? user.id ?? index}`}>
                  <td>{user.name ?? 'Unknown'}</td>
                  <td>{user.email ?? '—'}</td>
                  <td>{user.role ?? 'Member'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Users;
