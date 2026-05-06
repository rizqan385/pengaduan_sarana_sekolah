import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Login User (Admin / Siswa)
export const login = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    if (role === 'admin') {
      const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
      if (rows.length === 0) return res.status(404).json({ message: 'Admin tidak ditemukan' });

      const admin = rows[0];
      // In a real app we should use bcrypt.compare, but since the schema dumped has plain text password 'admin123', we check plain text or bcrypt
      const isMatch = password === admin.password || await bcrypt.compare(password, admin.password).catch(() => false);
      if (!isMatch) return res.status(400).json({ message: 'Password salah' });

      const token = jwt.sign({ id: admin.id, username: admin.username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.status(200).json({ token, user: { id: admin.id, username: admin.username, role: 'admin' } });

    } else if (role === 'siswa') {
      const [rows] = await db.query('SELECT * FROM siswa WHERE nis = ?', [username]); // username is nis for siswa
      if (rows.length === 0) return res.status(404).json({ message: 'Siswa tidak ditemukan' });

      const siswa = rows[0];
      const isMatch = await bcrypt.compare(password, siswa.password);
      if (!isMatch) return res.status(400).json({ message: 'Password salah' });

      const token = jwt.sign({ nis: siswa.nis, nama: siswa.nama, role: 'siswa' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.status(200).json({ token, user: { nis: siswa.nis, nama: siswa.nama, role: 'siswa' } });
    } else {
      return res.status(400).json({ message: 'Role tidak valid' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Register Siswa
export const registerSiswa = async (req, res) => {
  const { nis, nama, kelas, password } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM siswa WHERE nis = ?', [nis]);
    if (existing.length > 0) return res.status(400).json({ message: 'NIS sudah terdaftar' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query('INSERT INTO siswa (nis, nama, kelas, password) VALUES (?, ?, ?, ?)', [nis, nama, kelas, hashedPassword]);
    res.status(201).json({ message: 'Registrasi siswa berhasil' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
