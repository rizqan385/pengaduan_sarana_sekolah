import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, PlusCircle, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    const isAdmin = user.role === 'admin';
    logout();
    navigate(isAdmin ? '/admin' : '/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-secondary" />
          <h2 className="text-gradient">SaranaSekolah</h2>
        </div>

        <div className="nav-links">
          {user.role === 'admin' ? (
            <>
              <Link to="/admin/dashboard" className={`nav-link flex items-center gap-2 ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                <LayoutDashboard size={18} /> <span>Dashboard</span>
              </Link>
              <Link to="/admin/aspirasi" className={`nav-link flex items-center gap-2 ${location.pathname === '/admin/aspirasi' ? 'active' : ''}`}>
                <FileText size={18} /> <span>Data Aspirasi</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/siswa/form" className={`nav-link flex items-center gap-2 ${location.pathname === '/siswa/form' ? 'active' : ''}`}>
                <PlusCircle size={18} /> <span>Lapor</span>
              </Link>
              <Link to="/siswa/histori" className={`nav-link flex items-center gap-2 ${location.pathname === '/siswa/histori' ? 'active' : ''}`}>
                <FileText size={18} /> <span>Riwayat</span>
              </Link>
            </>
          )}
          
          <div className="flex items-center gap-6 ml-6 pl-6" style={{ borderLeft: '1px solid var(--border-color)' }}>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold uppercase tracking-wider text-primary" style={{ fontSize: '0.65rem' }}>{user.role}</span>
              <span className="text-sm font-semibold text-white">{user.nama || user.username}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '10px' }}>
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
