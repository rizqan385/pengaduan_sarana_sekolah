import express from 'express';
import { getKategori } from '../controllers/kategoriController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getKategori);

export default router;
