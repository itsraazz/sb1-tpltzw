import cors from 'cors';
import express from 'express';
import { authRouter } from './routes/auth';
import { noticesRouter } from './routes/notices';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/notices', authenticateToken, noticesRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});