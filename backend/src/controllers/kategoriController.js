import db from '../config/db.js';

export const getKategori = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kategori');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
