import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import { ArrowLeft, Save, User, Calendar, MapPin, Tags, Info, RefreshCw } from 'lucide-react';

const DetailAspirasi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aspirasi, setAspirasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    status: '',
    feedback: ''
  });

  useEffect(() => {
    const fetchAspirasi = async () => {
      try {
        const response = await axios.get(`/aspirasi/${id}`);
        setAspirasi(response.data);
        setFormData({
          status: response.data.status,
          feedback: response.data.feedback || ''
        });
      } catch (error) {
        console.error('Error fetching aspirasi:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAspirasi();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await axios.put(`/aspirasi/${id}`, formData);
      setMessage('Perubahan berhasil disimpan!');
      
      setAspirasi({
        ...aspirasi,
        status: formData.status,
        feedback: formData.feedback
      });
    } catch (error) {
      setMessage('Gagal menyimpan perubahan.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="loading-spinner mb-4"></div>
      <p className="text-muted">Menyiapkan detail laporan...</p>
    </div>
  );

  if (!aspirasi) return (
    <div className="text-center p-20">
      <h2 className="text-danger mb-2">Laporan Tidak Ditemukan</h2>
      <button onClick={() => navigate('/admin/aspirasi')} className="btn btn-outline">Kembali ke Daftar</button>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="btn btn-outline flex items-center gap-2 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Kembali ke Daftar</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">Status Saat Ini:</span>
          <StatusBadge status={aspirasi.status} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="col-span-2 space-y-8">
          <div className="glass-card overflow-hidden">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">#{aspirasi.id_pelaporan}</span>
                  <span className="text-muted">•</span>
                  <span className="text-sm text-muted">{new Date(aspirasi.tanggal_lapor).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <h1 className="text-3xl font-black">{aspirasi.kategori}</h1>
              </div>
            </div>

            <div className="space-y-8">
              <section className="p-6 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <MapPin size={80} />
                </div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MapPin size={14} /> Lokasi Kejadian
                </h3>
                <p className="text-lg font-medium text-white">{aspirasi.lokasi}</p>
              </section>

              <section>
                <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info size={14} /> Keterangan Laporan
                </h3>
                <div className="p-6 bg-surface border border-white/5 rounded-2xl shadow-inner italic leading-relaxed text-slate-300">
                  "{aspirasi.ket}"
                </div>
              </section>
            </div>
          </div>

          <div className="glass-card">
             <h3 className="text-xs font-bold text-success uppercase tracking-widest mb-6 flex items-center gap-2">
                <User size={14} /> Informasi Pelapor
             </h3>
             <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                  {aspirasi.nama_siswa.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{aspirasi.nama_siswa}</h4>
                  <div className="flex gap-4 text-sm text-muted">
                    <span>NIS: <b className="text-slate-200">{aspirasi.nis}</b></span>
                    <span>Kelas: <b className="text-slate-200">{aspirasi.kelas}</b></span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="col-span-1">
          <div className="glass-card sticky top-24 border-t-4 border-primary">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <RefreshCw size={20} className="text-primary" /> Tindak Lanjut
            </h3>
            
            {message && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium animate-bounce-short ${
                message.includes('berhasil') ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-6">
              <div className="form-group">
                <label className="text-xs font-bold text-muted uppercase mb-2">Ubah Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full">
                  <option value="Menunggu">Menunggu Konfirmasi</option>
                  <option value="Proses">Dalam Proses</option>
                  <option value="Selesai">Telah Selesai</option>
                </select>
              </div>

              <div className="form-group">
                <label className="text-xs font-bold text-muted uppercase mb-2">Tanggapan Admin</label>
                <textarea 
                  name="feedback" 
                  value={formData.feedback} 
                  onChange={handleChange}
                  rows="6"
                  placeholder="Berikan instruksi atau tanggapan..."
                  className="w-full text-sm"
                ></textarea>
              </div>

              <button 
                className="btn btn-primary w-full py-4 shadow-xl" 
                onClick={handleSave}
                disabled={saving || (formData.status === aspirasi.status && formData.feedback === aspirasi.feedback)}
              >
                {saving ? 'Memproses...' : <><Save size={18} /> Terapkan Perubahan</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAspirasi;
