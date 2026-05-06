import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { UserPlus, CheckCircle, Eye, EyeOff, GraduationCap } from 'lucide-react';

const KELAS_OPTIONS = [
  'VII A', 'VII B', 'VII C', 'VII D',
  'VIII A', 'VIII B', 'VIII C', 'VIII D',
  'IX A', 'IX B', 'IX C', 'IX D',
];

const Register = () => {
  const [form, setForm] = useState({
    nis: '',
    nama: '',
    kelas: '',
    password: '',
    konfirmasi: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.nis || !form.nama || !form.kelas || !form.password || !form.konfirmasi) {
      return 'Semua field wajib diisi.';
    }
    if (form.nis.length < 4) {
      return 'NIS minimal 4 karakter.';
    }
    if (form.password.length < 6) {
      return 'Password minimal 6 karakter.';
    }
    if (form.password !== form.konfirmasi) {
      return 'Konfirmasi password tidak cocok.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/auth/register', {
        nis: form.nis,
        nama: form.nama,
        kelas: form.kelas,
        password: form.password,
      });
      setSuccess('Registrasi berhasil! Silakan login dengan akun Anda.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { level: 'weak', label: 'Lemah', color: 'var(--danger)', width: '33%' };
    if (p.length < 10) return { level: 'medium', label: 'Sedang', color: 'var(--warning)', width: '66%' };
    return { level: 'strong', label: 'Kuat', color: 'var(--success)', width: '100%' };
  };

  const strength = passwordStrength();

  return (
    <div className="register-page animate-fade-in">
      {/* Decorative Blobs */}
      <div className="register-blob register-blob-1" />
      <div className="register-blob register-blob-2" />

      <div className="register-wrapper">
        {/* Left Panel */}
        <div className="register-panel-left animate-slide-up">
          <div className="register-brand">
            <div className="register-brand-icon">
              <GraduationCap size={36} strokeWidth={1.5} />
            </div>
            <h1 className="register-brand-title">Pengaduan<br />Sarana Sekolah</h1>
          </div>
          <p className="register-brand-desc">
            Platform aspirasi dan pengaduan sarana sekolah untuk menciptakan lingkungan belajar yang lebih baik.
          </p>
          <div className="register-steps">
            {[
              { num: '01', label: 'Isi data diri Anda' },
              { num: '02', label: 'Buat password yang kuat' },
              { num: '03', label: 'Mulai sampaikan aspirasi' },
            ].map((step) => (
              <div key={step.num} className="register-step-item">
                <span className="register-step-num">{step.num}</span>
                <span className="register-step-label">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel – Form */}
        <div className="register-panel-right">
          <div className="register-card glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-center mb-6">
              <div className="register-icon-wrapper">
                <UserPlus size={28} />
              </div>
              <h2 className="text-gradient" style={{ fontSize: '1.6rem', marginTop: '1rem' }}>
                Daftar Akun Siswa
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Lengkapi data di bawah untuk membuat akun
              </p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && (
              <div className="success-message">
                <CheckCircle size={16} style={{ marginRight: '0.4rem', flexShrink: 0 }} />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* NIS */}
              <div className="form-group">
                <label htmlFor="nis">
                  NIS <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="nis"
                  name="nis"
                  value={form.nis}
                  onChange={handleChange}
                  placeholder="Contoh: 2024001"
                  required
                  autoComplete="off"
                  className={form.nis && form.nis.length < 4 ? 'input-error' : ''}
                />
                {form.nis && form.nis.length < 4 && (
                  <span className="field-hint error">Minimal 4 karakter</span>
                )}
              </div>

              {/* Nama */}
              <div className="form-group">
                <label htmlFor="nama">
                  Nama Lengkap <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  autoComplete="name"
                />
              </div>

              {/* Kelas */}
              <div className="form-group">
                <label htmlFor="kelas">
                  Kelas <span className="required-star">*</span>
                </label>
                <select
                  id="kelas"
                  name="kelas"
                  value={form.kelas}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>-- Pilih Kelas --</option>
                  {KELAS_OPTIONS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required-star">*</span>
                </label>
                <div className="input-icon-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 karakter"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {strength && (
                  <div className="password-strength-bar">
                    <div
                      className="password-strength-fill"
                      style={{ width: strength.width, backgroundColor: strength.color }}
                    />
                    <span className="password-strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div className="form-group">
                <label htmlFor="konfirmasi">
                  Konfirmasi Password <span className="required-star">*</span>
                </label>
                <div className="input-icon-wrapper">
                  <input
                    type={showKonfirmasi ? 'text' : 'password'}
                    id="konfirmasi"
                    name="konfirmasi"
                    value={form.konfirmasi}
                    onChange={handleChange}
                    placeholder="Ulangi password Anda"
                    required
                    autoComplete="new-password"
                    className={
                      form.konfirmasi && form.password !== form.konfirmasi ? 'input-error' : ''
                    }
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                    aria-label="Toggle konfirmasi password visibility"
                  >
                    {showKonfirmasi ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.konfirmasi && form.password !== form.konfirmasi && (
                  <span className="field-hint error">Password tidak cocok</span>
                )}
                {form.konfirmasi && form.password === form.konfirmasi && form.konfirmasi.length > 0 && (
                  <span className="field-hint success">Password cocok ✓</span>
                )}
              </div>

              <button
                type="submit"
                id="btn-register"
                className="btn btn-primary w-full mt-4"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? (
                  <span className="register-loading">
                    <span className="register-spinner" />
                    Mendaftarkan...
                  </span>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Buat Akun
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Sudah punya akun?{' '}
              <Link to="/login" className="register-login-link">
                Masuk sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
