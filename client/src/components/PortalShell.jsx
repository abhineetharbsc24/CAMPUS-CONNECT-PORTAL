import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function PortalShell({ title, icon, base, tabs, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (tab) => {
    const target = `${base}/${tab.path}`;
    if (location.pathname === base) return tab.path === tabs[0].path;
    return location.pathname.startsWith(target);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="portal">
      <header className="portal-header">
        <div>
          <h2>{icon} {title}</h2>
          <span>Welcome, {user?.name}</span>
        </div>
        <button className="gold-btn" onClick={handleLogout}>Log out</button>
      </header>

      <div className="portal-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={isActive(tab) ? 'portal-tab active' : 'portal-tab'}
            onClick={() => navigate(`${base}/${tab.path}`)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="portal-body">{children}</div>
    </div>
  );
}
