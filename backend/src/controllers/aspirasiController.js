import db from '../config/db.js';

// Siswa membuat aspirasi baru
export const createAspirasi = async (req, res) => {
  const { id_kategori, lokasi, ket } = req.body;
  const nis = req.user.nis; // From authMiddleware

  try {
    // 1. Insert into input_aspirasi
    const [resultInput] = await db.query(
      'INSERT INTO input_aspirasi (nis, id_kategori, lokasi, ket) VALUES (?, ?, ?, ?)',
      [nis, id_kategori, lokasi, ket]
    );

    const id_pelaporan = resultInput.insertId;

    // 2. Insert into aspirasi (initial status 'Menunggu')
    await db.query(
      'INSERT INTO aspirasi (id_pelaporan, id_kategori, status) VALUES (?, ?, ?)',
      [id_pelaporan, id_kategori, 'Menunggu']
    );

    res.status(201).json({ message: 'Aspirasi berhasil dikirim' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Mengambil daftar aspirasi
export const getAspirasi = async (req, res) => {
  try {
    let query = `
      SELECT a.id_aspirasi, a.status, a.feedback, a.updated_at,
             i.id_pelaporan, i.lokasi, i.ket, i.tanggal_lapor,
             k.ket_kategori as kategori, s.nama as nama_siswa, s.kelas
      FROM aspirasi a
      JOIN input_aspirasi i ON a.id_pelaporan = i.id_pelaporan
      JOIN kategori k ON a.id_kategori = k.id_kategori
      JOIN siswa s ON i.nis = s.nis
    `;
    let params = [];

    // Jika yang request adalah siswa, hanya ambil aspirasinya sendiri
    if (req.user.role === 'siswa') {
      query += ' WHERE i.nis = ?';
      params.push(req.user.nis);
    }

    query += ' ORDER BY a.updated_at DESC';

    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Mengambil detail aspirasi
export const getAspirasiById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT a.id_aspirasi, a.status, a.feedback, a.updated_at,
             i.id_pelaporan, i.lokasi, i.ket, i.tanggal_lapor, i.nis,
             k.ket_kategori as kategori, s.nama as nama_siswa, s.kelas
      FROM aspirasi a
      JOIN input_aspirasi i ON a.id_pelaporan = i.id_pelaporan
      JOIN kategori k ON a.id_kategori = k.id_kategori
      JOIN siswa s ON i.nis = s.nis
      WHERE a.id_aspirasi = ?
    `;
    const [rows] = await db.query(query, [id]);
    
    if (rows.length === 0) return res.status(404).json({ message: 'Aspirasi tidak ditemukan' });

    // Cek akses untuk siswa
    if (req.user.role === 'siswa' && rows[0].nis !== req.user.nis) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Admin mengupdate status dan feedback aspirasi
export const updateAspirasi = async (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE aspirasi SET status = ?, feedback = ? WHERE id_aspirasi = ?',
      [status, feedback, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Aspirasi tidak ditemukan' });

    res.status(200).json({ message: 'Status aspirasi berhasil diupdate' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Statistik untuk dashboard admin
export const getStatistik = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Menunggu' THEN 1 ELSE 0 END) as menunggu,
        SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as proses,
        SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as selesai
      FROM aspirasi
    `);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
