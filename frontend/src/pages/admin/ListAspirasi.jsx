import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import { Eye, Search, Filter } from 'lucide-react';

const ListAspirasi = () => {
  const [aspirasi, setAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');

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

  const filteredAspirasi = aspirasi.filter(item => {
    const matchFilter = filter === 'Semua' || item.status === filter;
    const matchSearch = item.nama_siswa.toLowerCase().includes(search.toLowerCase()) || 
                        item.kategori.toLowerCase().includes(search.toLowerCase()) ||
                        item.lokasi.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="mb-1">Data Aspirasi</h1>
          <p className="text-muted">Kelola dan tinjau seluruh laporan sarana prasarana sekolah</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Cari laporan..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              style={{ width: '300px', marginBottom: 0 }}
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-surface rounded-xl border border-white/5">
            <Filter size={16} className="text-primary" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
              style={{ width: 'auto', marginBottom: 0, padding: '0.4rem 0.5rem' }}
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Proses">Diproses</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="p-12 text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-muted animate-pulse">Menghimpun data aspirasi...</p>
          </div>
        ) : filteredAspirasi.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-5xl mb-4">Empty</div>
            <p className="text-muted">Tidak ada laporan yang sesuai dengan kriteria Anda.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th width="80">ID</th>
                <th width="150">Tanggal</th>
                <th>Pelapor</th>
                <th>Kategori</th>
                <th>Lokasi</th>
                <th width="150">Status</th>
                <th width="120" className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAspirasi.map((item, index) => (
                <tr key={item.id_aspirasi} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
                  <td>
                    <span className="py-1 px-2 bg-white/5 rounded text-xs font-mono text-primary">
                      #{item.id_pelaporan}
                    </span>
                  </td>
                  <td className="text-sm font-medium">
                    {new Date(item.tanggal_lapor).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{item.nama_siswa}</span>
                      <span className="text-xs text-muted">Kelas {item.kelas}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm py-1 px-3 bg-primary/10 text-primary-hover rounded-full border border-primary/20">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="text-sm">{item.lokasi}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td className="text-right">
                    <Link to={`/admin/aspirasi/${item.id_aspirasi}`} className="btn btn-outline btn-sm" style={{ padding: '0.5rem' }}>
                      <Eye size={16} />
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

export default ListAspirasi;
