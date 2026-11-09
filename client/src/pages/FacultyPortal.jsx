import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalShell from '../components/PortalShell.jsx';
import {
  fetchAssignments,
  createAssignment,
  deleteAssignment,
  errorMessage
} from '../services/api.js';

const tabs = [
  { path: 'assignments', label: 'Manage Assignments' },
  { path: 'submissions', label: 'View Submissions' }
];

function ManageAssignments({ assignments, error, onCreate, onDelete }) {
  const [form, setForm] = useState({ subject: '', title: '', dueDate: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await onCreate(form);
    if (created) setForm({ subject: '', title: '', dueDate: '' });
  };

  return (
    <div>
      <h3>Create Assignment</h3>
      <form className="inline-form" onSubmit={handleSubmit}>
        <input className="field" name="subject" placeholder="Subject (e.g. CS3301)" value={form.subject} onChange={handleChange} required />
        <input className="field" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input className="field" name="dueDate" placeholder="Due date" value={form.dueDate} onChange={handleChange} />
        <button className="submit-btn" type="submit">Create</button>
      </form>
      {error && <div className="msg-error">{error}</div>}
      <ul className="list">
        {assignments.map((item) => (
          <li key={item._id} className="list-item">
            <div>
              <strong>{item.title}</strong>
              <p className="sub-text">{item.subject}{item.dueDate ? ` \u2022 Due: ${item.dueDate}` : ''}</p>
            </div>
            <button className="action-btn danger-btn" onClick={() => onDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Submissions({ assignments }) {
  return (
    <div>
      <h3>Submission Status</h3>
      <ul className="list">
        {assignments.map((item) => (
          <li key={item._id} className="list-item">
            <div>
              <strong>{item.title}</strong>
              <p className="sub-text">{item.subject}</p>
            </div>
            <span className={item.status === 'Submitted' ? 'badge-ok' : 'badge-pending'}>{item.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FacultyPortal() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignments()
      .then((res) => setAssignments(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const handleCreate = async (payload) => {
    try {
      const { data } = await createAssignment(payload);
      setAssignments((current) => [...current, data]);
      setError('');
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAssignment(id);
      setAssignments((current) => current.filter((item) => item._id !== id));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <PortalShell title="Faculty Portal View" icon="🧑‍🏫" base="/faculty" tabs={tabs}>
      <Routes>
        <Route index element={<Navigate to="assignments" replace />} />
        <Route
          path="assignments"
          element={<ManageAssignments assignments={assignments} error={error} onCreate={handleCreate} onDelete={handleDelete} />}
        />
        <Route path="submissions" element={<Submissions assignments={assignments} />} />
      </Routes>
    </PortalShell>
  );
}
