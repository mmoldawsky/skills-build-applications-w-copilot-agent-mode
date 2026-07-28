import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
export async function clearDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(connectionString, { serverSelectionTimeoutMS: 5000 });
  }

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Workout.deleteMany({}),
  ]);
}

export async function seedDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(connectionString, { serverSelectionTimeoutMS: 5000 });
  }

  console.log('Connected to octofit_db');

  await clearDatabase();

  const users = await User.insertMany([
    { name: 'Ava', email: 'ava@example.com', role: 'student', profileImage: 'https://example.com/ava.png' },
    { name: 'Milo', email: 'milo@example.com', role: 'coach', profileImage: 'https://example.com/milo.png' },
    { name: 'Nia', email: 'nia@example.com', role: 'student', profileImage: 'https://example.com/nia.png' },
  ]);

  const teams = await Team.insertMany([
    { name: 'River Runners', points: 120, members: [users[0].name, users[2].name] },
    { name: 'Peak Pioneers', points: 98, members: [users[1].name] },
  ]);

  await Activity.insertMany([
    { type: 'run', durationMinutes: 30, points: 15, userName: users[0].name },
    { type: 'strength', durationMinutes: 45, points: 20, userName: users[2].name },
    { type: 'cycling', durationMinutes: 25, points: 12, userName: users[1].name },
  ]);

  await LeaderboardEntry.insertMany([
    { rank: 1, name: users[0].name, points: 320 },
    { rank: 2, name: users[2].name, points: 295 },
    { rank: 3, name: users[1].name, points: 280 },
  ]);

  await Workout.insertMany([
    { title: 'Morning Jog', difficulty: 'easy', durationMinutes: 25, focus: 'cardio' },
    { title: 'Core Circuit', difficulty: 'moderate', durationMinutes: 40, focus: 'strength' },
    { title: 'Trail Intervals', difficulty: 'hard', durationMinutes: 35, focus: 'endurance' },
  ]);

  console.log(`Inserted ${users.length} users, ${teams.length} teams, and sample activity, leaderboard, and workout data.`);
  await mongoose.disconnect();
}

if (require.main === module) {
  seedDatabase().catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
}
