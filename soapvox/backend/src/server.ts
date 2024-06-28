import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import uploadRoutes from './routes/uploadRoutes';
import segmentRoutes from './routes/segmentRoutes';
import profileRoutes from './routes/profileRoutes';
import rythmoBandRoutes from './routes/rythmoBandRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/rythmo-bands', rythmoBandRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
