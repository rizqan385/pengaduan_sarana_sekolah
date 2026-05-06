import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import { FileSearch, Eye } from 'lucide-react';

const HistoriAspirasi = () => {
  const [aspirasi, setAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAspirasi = async () => {
      try {
        const response = await axios.get('/aspirasi');
        setAspirasi(response.data);
      } catch (error) {
        console.error('Error fetching aspirasi:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAspirasi();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Riwayat Laporan</h1>
          <p className="text-muted">Pantau status laporan yang telah Anda buat</p>
        </div>
        <Link to="/siswa/form" className="btn btn-primary">
          Buat Laporan Baru
        </Link>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="p-8 text-center text-muted">Memuat data...</div>
        ) : aspirasi.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <FileSearch size={48} className="text-muted opacity-50" />
            <p className="text-muted">Belum ada riwayat laporan.</p>
            <Link to="/siswa/form" className="btn btn-outline mt-2">Buat Laporan Pertama</Link>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Lokasi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {aspirasi.map((item) => (
                <tr key={item.id_aspirasi}>
                  <td>{new Date(item.tanggal_lapor).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td>{item.kategori}</td>
                  <td>{item.lokasi}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <Link to={`/siswa/aspirasi/${item.id_aspirasi}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                      <Eye size={16} /> Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoriAspirasi;
