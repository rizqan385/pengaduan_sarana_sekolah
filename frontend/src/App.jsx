import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ListAspirasi from './pages/admin/ListAspirasi';
import AdminDetailAspirasi from './pages/admin/DetailAspirasi';
import FormAspirasi from './pages/siswa/FormAspirasi';
import HistoriAspirasi from './pages/siswa/HistoriAspirasi';
import SiswaDetailAspirasi from './pages/siswa/DetailAspirasi';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLogin />} />

            {/* Rute Siswa */}
            <Route path="/siswa/form" element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <FormAspirasi />
              </ProtectedRoute>
            } />
            <Route path="/siswa/histori" element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <HistoriAspirasi />
              </ProtectedRoute>
            } />
            <Route path="/siswa/aspirasi/:id" element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <SiswaDetailAspirasi />
              </ProtectedRoute>
            } />

            {/* Rute Admin */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/aspirasi" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ListAspirasi />
              </ProtectedRoute>
            } />
            <Route path="/admin/aspirasi/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDetailAspirasi />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
