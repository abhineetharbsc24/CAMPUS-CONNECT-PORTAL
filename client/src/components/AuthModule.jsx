import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../services/api.js';

export default function AuthModule({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = isLogin
        ? await login({ email: formData.email, password: formData.password })
        : await register(formData);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-head">
        <h1>RV UNIVERSITY</h1>
        <p>Excellence in Education</p>
      </div>

      <h2>{isLogin ? 'Portal Login' : 'Create Portal Account'}</h2>

      <div className="tab-row">
        <button type="button" className={isLogin ? 'tab-btn active' : 'tab-btn'} onClick={() => navigate('/login')}>
          Login
        </button>
        <button type="button" className={!isLogin ? 'tab-btn active' : 'tab-btn'} onClick={() => navigate('/register')}>
          Register
        </button>
      </div>

      <form className="form-col" onSubmit={handleSubmit}>
        {!isLogin && (
          <input className="field" type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        )}
        <input className="field" type="email" name="email" placeholder="RVU Email Address" value={formData.email} onChange={handleChange} required />
        <input className="field" type="password" name="password" placeholder="Password (min 6 characters)" value={formData.password} onChange={handleChange} minLength={6} required />
        {!isLogin && (
          <select className="field" name="role" value={formData.role} onChange={handleChange}>
            <option value="student">I am a Student</option>
            <option value="faculty">I am Faculty</option>
          </select>
        )}
        {error && <div className="msg-error">{error}</div>}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign In to Portal' : 'Create Account'}
        </button>
      </form>

      <p className="hint">Admin accounts are created by seeding the database, not through registration.</p>
    </div>
  );
}
