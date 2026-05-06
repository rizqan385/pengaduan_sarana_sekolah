import express from 'express';
import { createAspirasi, getAspirasi, getAspirasiById, updateAspirasi, getStatistik } from '../controllers/aspirasiController.js';
import { verifyToken, verifyAdmin, verifySiswa } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for both Admin and Siswa
router.get('/', verifyToken, getAspirasi);
router.get('/:id', verifyToken, getAspirasiById);

// Routes specific to Siswa
router.post('/', verifySiswa, createAspirasi);

// Routes specific to Admin
router.put('/:id', verifyAdmin, updateAspirasi);
router.get('/statistik/dashboard', verifyAdmin, getStatistik);

export default router;
