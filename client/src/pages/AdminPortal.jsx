import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalShell from '../components/PortalShell.jsx';
import { fetchUsers, errorMessage } from '../services/api.js';

const tabs = [
  { path: 'users', label: 'Manage Users' },
  { path: 'reports', label: 'System Reports' }
];

function UsersView({ users, error }) {
  return (
    <div>
      <h3>Registered Users</h3>
      {error && <div className="msg-error">{error}</div>}
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th></tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportsView({ users }) {
  const count = (role) => users.filter((item) => item.role === role).length;

  return (
    <div>
      <h3>System Reports</h3>
      <div className="metric-grid">
        <div className="metric-card"><h4>Total Users</h4><p className="metric-text">{users.length}</p></div>
        <div className="metric-card"><h4>Students</h4><p className="metric-text">{count('student')}</p></div>
        <div className="metric-card"><h4>Faculty</h4><p className="metric-text">{count('faculty')}</p></div>
        <div className="metric-card"><h4>Admins</h4><p className="metric-text">{count('admin')}</p></div>
      </div>
    </div>
  );
}

export default function AdminPortal() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers()
      .then((res) => setUsers(res.data.data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  return (
    <PortalShell title="Admin Portal View" icon="🛡️" base="/admin" tabs={tabs}>
      <Routes>
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<UsersView users={users} error={error} />} />
        <Route path="reports" element={<ReportsView users={users} />} />
      </Routes>
    </PortalShell>
  );
}
