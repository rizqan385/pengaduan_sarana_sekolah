import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { Send, MapPin, AlignLeft, Tags } from 'lucide-react';

const FormAspirasi = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [formData, setFormData] = useState({
    id_kategori: '',
    lokasi: '',
    ket: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await axios.get('/kategori');
        setKategoriList(response.data);
      } catch (error) {
        console.error('Error fetching kategori:', error);
      }
    };
    fetchKategori();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await axios.post('/aspirasi', formData);
      setMessage({ text: 'Aspirasi berhasil dikirim!', type: 'success' });
      setTimeout(() => {
        navigate('/siswa/histori');
      }, 1500);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Terjadi kesalahan', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="mb-6">
        <h1>Sampaikan Laporan</h1>
        <p className="text-muted">Bantu kami meningkatkan kualitas sarana dan prasarana sekolah</p>
      </div>

      <div className="glass-card">
        {message.text && (
          <div style={{ 
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id_kategori" className="flex items-center gap-2">
              <Tags size={16} /> Kategori Laporan
            </label>
            <select 
              id="id_kategori" 
              name="id_kategori" 
              value={formData.id_kategori} 
              onChange={handleChange} 
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {kategoriList.map(k => (
                <option key={k.id_kategori} value={k.id_kategori}>{k.ket_kategori}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="lokasi" className="flex items-center gap-2">
              <MapPin size={16} /> Lokasi Kejadian / Kerusakan
            </label>
            <input 
              type="text" 
              id="lokasi" 
              name="lokasi" 
              value={formData.lokasi} 
              onChange={handleChange} 
              required 
              placeholder="Contoh: Toilet Gedung B lantai 2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ket" className="flex items-center gap-2">
              <AlignLeft size={16} /> Keterangan Detail
            </label>
            <textarea 
              id="ket" 
              name="ket" 
              value={formData.ket} 
              onChange={handleChange} 
              required 
              rows="5"
              placeholder="Jelaskan secara detail mengenai laporan Anda..."
            ></textarea>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Mengirim...' : <><Send size={18} /> Kirim Laporan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAspirasi;
