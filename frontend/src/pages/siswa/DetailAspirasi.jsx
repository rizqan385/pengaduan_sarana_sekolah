import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import { ArrowLeft, MessageSquare, Calendar, MapPin, Tags, Info } from 'lucide-react';

const DetailAspirasi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aspirasi, setAspirasi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAspirasi = async () => {
      try {
        const response = await axios.get(`/aspirasi/${id}`);
        setAspirasi(response.data);
      } catch (error) {
        console.error('Error fetching aspirasi:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAspirasi();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted">Memuat data...</div>;
  if (!aspirasi) return <div className="p-8 text-center text-muted">Data tidak ditemukan</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline mb-6" style={{ padding: '0.5rem 1rem' }}>
        <ArrowLeft size={18} /> Kembali
      </button>

      <div className="glass-card mb-6">
        <div className="flex justify-between items-start mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h2 className="mb-2">Detail Laporan #{aspirasi.id_pelaporan}</h2>
            <div className="flex gap-4 text-muted text-sm">
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(aspirasi.tanggal_lapor).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><Tags size={14} /> {aspirasi.kategori}</span>
            </div>
          </div>
          <StatusBadge status={aspirasi.status} />
        </div>

        <div className="mb-6">
          <h3 className="flex items-center gap-2 mb-3 text-lg"><MapPin size={18} className="text-secondary" /> Lokasi</h3>
          <p className="p-4 rounded-md" style={{ background: 'rgba(0,0,0,0.2)' }}>{aspirasi.lokasi}</p>
        </div>

        <div className="mb-6">
          <h3 className="flex items-center gap-2 mb-3 text-lg"><Info size={18} className="text-secondary" /> Keterangan Detail</h3>
          <p className="p-4 rounded-md" style={{ background: 'rgba(0,0,0,0.2)', whiteSpace: 'pre-wrap' }}>{aspirasi.ket}</p>
        </div>
      </div>

      <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
        <h3 className="flex items-center gap-2 mb-4 text-lg"><MessageSquare size={18} className="text-primary" /> Tanggapan Admin</h3>
        {aspirasi.feedback ? (
          <div>
            <p className="mb-2">{aspirasi.feedback}</p>
            <p className="text-xs text-muted">Diperbarui pada: {new Date(aspirasi.updated_at).toLocaleString('id-ID')}</p>
          </div>
        ) : (
          <p className="text-muted italic">Belum ada tanggapan dari admin.</p>
        )}
      </div>
    </div>
  );
};

export default DetailAspirasi;
