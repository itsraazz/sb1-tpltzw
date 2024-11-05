import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { validateRequest } from '../middleware/validateRequest';
import { randomUUID } from 'crypto';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', validateRequest(registerSchema), async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = randomUUID();

  db.prepare(`
    INSERT INTO users (id, email, password, name)
    VALUES (?, ?, ?, ?)
  `).run(userId, email, hashedPassword, name);

  const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret');
  res.json({ token });
});

router.post('/login', validateRequest(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
  res.json({ token });
});

export { router as authRouter };