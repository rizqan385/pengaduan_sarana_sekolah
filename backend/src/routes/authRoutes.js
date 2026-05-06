import express from 'express';
import { login, registerSiswa } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', registerSiswa); // Optional for testing

export default router;
