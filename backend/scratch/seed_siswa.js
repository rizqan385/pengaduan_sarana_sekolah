import db from '../src/config/db.js';
import bcrypt from 'bcrypt';

const seedSiswa = async () => {
  const nis = '112233';
  const nama = 'Siswa Test';
  const kelas = 'XII-RPL';
  const password = 'password123';
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  try {
    await db.query('INSERT INTO siswa (nis, nama, kelas, password) VALUES (?, ?, ?, ?)', [nis, nama, kelas, hashedPassword]);
    console.log('Siswa test berhasil dibuat:');
    console.log('NIS: 112233');
    console.log('Password: password123');
  } catch (error) {
    console.error('Error seeding siswa:', error.message);
  } finally {
    process.exit();
  }
};

seedSiswa();
