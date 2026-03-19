import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes'
import applicationsRoutes from './routes/applications.routes'
import statsRoutes from './routes/stats.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://job-application-tracker-one-indol.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());

//RUTAS
app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationsRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
