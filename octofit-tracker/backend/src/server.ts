import express from 'express';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

const PORT = Number(process.env.PORT ?? 8000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

export function getApiBaseUrl(port: number): string {
  const codespaceName = process.env.CODESPACE_NAME?.trim();
  if (codespaceName) {
    const codespaceUrlSuffix = '-8000.app.github.dev';
    return `https://${codespaceName}${codespaceUrlSuffix}`;
  }

  return `http://localhost:${port}`;
}

async function ensureDatabaseConnection() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  }
}

function createResourceRoute<T>(loader: () => Promise<T[]>) {
  return async (_req: express.Request, res: express.Response) => {
    try {
      const items = await loader();
      return res.json(items);
    } catch (error) {
      console.error('Failed to load resource', error);
      return res.status(500).json({ error: 'Failed to load resource' });
    }
  };
}

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      port: PORT,
      apiUrl: getApiBaseUrl(PORT),
    });
  });

  app.get(['/api/users', '/api/users/'], createResourceRoute(async () => {
    await ensureDatabaseConnection();
    return User.find({}).lean();
  }));

  app.get(['/api/teams', '/api/teams/'], createResourceRoute(async () => {
    await ensureDatabaseConnection();
    return Team.find({}).lean();
  }));

  app.get(['/api/activities', '/api/activities/'], createResourceRoute(async () => {
    await ensureDatabaseConnection();
    return Activity.find({}).lean();
  }));

  app.get(['/api/leaderboard', '/api/leaderboard/'], createResourceRoute(async () => {
    await ensureDatabaseConnection();
    return LeaderboardEntry.find({}).sort({ rank: 1 }).lean();
  }));

  app.get(['/api/workouts', '/api/workouts/'], createResourceRoute(async () => {
    await ensureDatabaseConnection();
    return Workout.find({}).lean();
  }));

  return app;
}

export async function startServer() {
  const app = createApp();

  try {
    await ensureDatabaseConnection();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.warn('MongoDB connection unavailable, continuing without database', error);
  }

  return app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}
