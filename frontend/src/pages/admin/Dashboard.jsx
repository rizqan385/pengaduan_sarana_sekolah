import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import { FileText, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const [statistik, setStatistik] = useState({
    total: 0,
    menunggu: 0,
    proses: 0,
    selesai: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistik = async () => {
      try {
        const response = await axios.get('/aspirasi/statistik/dashboard');
        setStatistik({
          total: response.data.total || 0,
          menunggu: response.data.menunggu || 0,
          proses: response.data.proses || 0,
          selesai: response.data.selesai || 0
        });
      } catch (error) {
        console.error('Error fetching statistik:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatistik();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted">Memuat dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1>Dashboard Admin</h1>
        <p className="text-muted">Ringkasan status pengaduan sarana dan prasarana sekolah</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="glass-card flex items-center gap-4" style={{ borderBottom: '4px solid var(--primary)' }}>
          <div className="p-4 rounded-full" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>
            <FileText size={32} />
          </div>
          <div>
            <p className="text-muted text-sm font-medium">Total Laporan</p>
            <h2 className="mb-0 text-3xl">{statistik.total}</h2>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4" style={{ borderBottom: '4px solid var(--warning)' }}>
          <div className="p-4 rounded-full" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)' }}>
            <Clock size={32} />
          </div>
          <div>
            <p className="text-muted text-sm font-medium">Menunggu</p>
            <h2 className="mb-0 text-3xl">{statistik.menunggu}</h2>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4" style={{ borderBottom: '4px solid var(--primary)' }}>
          <div className="p-4 rounded-full" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>
            <RefreshCw size={32} />
          </div>
          <div>
            <p className="text-muted text-sm font-medium">Diproses</p>
            <h2 className="mb-0 text-3xl">{statistik.proses}</h2>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4" style={{ borderBottom: '4px solid var(--success)' }}>
          <div className="p-4 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
            <CheckCircle2 size={32} />
          </div>
          <div>
            <p className="text-muted text-sm font-medium">Selesai</p>
            <h2 className="mb-0 text-3xl">{statistik.selesai}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
