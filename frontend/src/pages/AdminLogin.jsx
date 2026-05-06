import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', {
        username,
        password,
        role: 'admin'
      });
      
      login(response.data.token, response.data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat login admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] animate-fade-in admin-login-page">
      <div className="glass-card admin-card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-6">
          <div className="admin-icon-wrapper mb-4">
            <ShieldCheck size={48} className="text-primary mx-auto" />
          </div>
          <h2 className="admin-title">Admin Portal</h2>
          <p className="text-muted">Masuk ke Dashboard Administrator</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username Admin</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Masukkan Username"
              className="admin-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              className="admin-input"
            />
          </div>

          <button type="submit" className="btn btn-admin w-full mt-4" disabled={loading}>
            {loading ? 'Mengautentikasi...' : <><LogIn size={18} /> Login Admin</>}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-muted hover:text-primary transition-colors">
            Bukan Admin? Login sebagai Siswa
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
