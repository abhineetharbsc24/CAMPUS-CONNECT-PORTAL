import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalShell from '../components/PortalShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchAssignments, submitAssignment, errorMessage } from '../services/api.js';

const tabs = [
  { path: 'notices', label: 'Notices & Events' },
  { path: 'assignments', label: 'Assignments' },
  { path: 'attendance', label: 'Track Attendance' },
  { path: 'profile', label: 'Profile' }
];

const notices = [
  { id: 1, title: 'Mid-Term Exam Schedule Released', date: 'Sept 10, 2026', dept: 'SOCSE' },
  { id: 2, title: 'Hackathon Registration Open', date: 'Sept 20, 2026', dept: 'RVU Tech Club' }
];

const attendance = [
  { id: 1, subject: 'CS3301 - Full Stack', percent: 88 },
  { id: 2, subject: 'CS3302 - DBMS', percent: 92 }
];

function NoticesView() {
  return (
    <div>
      <h3>Campus Notices &amp; Events</h3>
      <ul className="list">
        {notices.map((item) => (
          <li key={item.id} className="list-item">
            <div>
              <strong>{item.title}</strong>
              <p className="sub-text">{item.dept} &bull; {item.date}</p>
            </div>
            <button className="action-btn">View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AssignmentsView({ assignments, error, onSubmit }) {
  return (
    <div>
      <h3>Assignments &amp; Submissions</h3>
      {error && <div className="msg-error">{error}</div>}
      {!error && assignments.length === 0 && <p className="sub-text">No assignments yet.</p>}
      <ul className="list">
        {assignments.map((item) => (
          <li key={item._id} className="list-item">
            <div>
              <strong>{item.title}</strong>
              <p className="sub-text">{item.subject}{item.dueDate ? ` \u2022 Due: ${item.dueDate}` : ''}</p>
            </div>
            {item.status === 'Submitted' ? (
              <span className="badge-ok">Submitted</span>
            ) : (
              <button className="action-btn" onClick={() => onSubmit(item._id)}>Submit Assignment</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AttendanceView() {
  return (
    <div>
      <h3>Attendance Tracker</h3>
      <div className="metric-grid">
        {attendance.map((item) => (
          <div key={item.id} className="metric-card">
            <h4>{item.subject}</h4>
            <p className="metric-text">{item.percent}% Attendance</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileView({ user }) {
  return (
    <div>
      <h3>Student Profile</h3>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Department:</strong> School of Computer Science &amp; Engineering (SOCSE)</p>
      <p><strong>Course:</strong> CS3301 - Full Stack Development</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}

export default function StudentPortal() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignments()
      .then((res) => setAssignments(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const handleSubmit = async (id) => {
    try {
      const { data } = await submitAssignment(id);
      setAssignments((current) => current.map((item) => (item._id === id ? data : item)));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <PortalShell title="Student Portal View" icon="🎓" base="/student" tabs={tabs}>
      <Routes>
        <Route index element={<Navigate to="notices" replace />} />
        <Route path="notices" element={<NoticesView />} />
        <Route path="assignments" element={<AssignmentsView assignments={assignments} error={error} onSubmit={handleSubmit} />} />
        <Route path="attendance" element={<AttendanceView />} />
        <Route path="profile" element={<ProfileView user={user} />} />
      </Routes>
    </PortalShell>
  );
}
