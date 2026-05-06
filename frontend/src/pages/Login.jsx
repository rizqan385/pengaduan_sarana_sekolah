import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState(''); // NIS will be stored here
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
        role: 'siswa'
      });
      
      login(response.data.token, response.data.user);
      navigate('/siswa/histori');
    } catch (err) {
      setError(err.response?.data?.message || 'NIS atau Password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] animate-fade-in student-login-page">
      <div className="glass-card student-card" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-6">
          <ShieldAlert size={48} className="text-secondary mx-auto mb-4" />
          <h2 className="text-gradient">Portal Siswa</h2>
          <p className="text-muted">Sistem Pengaduan Sarana Sekolah</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">NIS (Nomor Induk Siswa)</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Masukkan NIS Anda"
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
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Memproses...' : <><LogIn size={18} /> Masuk sebagai Siswa</>}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/admin" className="text-sm text-muted hover:text-secondary transition-colors">
            Login sebagai Admin
          </a>
          <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Belum punya akun?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
