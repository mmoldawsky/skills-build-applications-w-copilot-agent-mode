"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDatabase = clearDatabase;
exports.seedDatabase = seedDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function clearDatabase() {
    if (mongoose_1.default.connection.readyState !== 1) {
        await mongoose_1.default.connect(connectionString, { serverSelectionTimeoutMS: 5000 });
    }
    await Promise.all([
        models_1.User.deleteMany({}),
        models_1.Team.deleteMany({}),
        models_1.Activity.deleteMany({}),
        models_1.LeaderboardEntry.deleteMany({}),
        models_1.Workout.deleteMany({}),
    ]);
}
async function seedDatabase() {
    if (mongoose_1.default.connection.readyState !== 1) {
        await mongoose_1.default.connect(connectionString, { serverSelectionTimeoutMS: 5000 });
    }
    console.log('Connected to octofit_db');
    await clearDatabase();
    const users = await models_1.User.insertMany([
        { name: 'Ava', email: 'ava@example.com', role: 'student', profileImage: 'https://example.com/ava.png' },
        { name: 'Milo', email: 'milo@example.com', role: 'coach', profileImage: 'https://example.com/milo.png' },
        { name: 'Nia', email: 'nia@example.com', role: 'student', profileImage: 'https://example.com/nia.png' },
    ]);
    const teams = await models_1.Team.insertMany([
        { name: 'River Runners', points: 120, members: [users[0].name, users[2].name] },
        { name: 'Peak Pioneers', points: 98, members: [users[1].name] },
    ]);
    await models_1.Activity.insertMany([
        { type: 'run', durationMinutes: 30, points: 15, userName: users[0].name },
        { type: 'strength', durationMinutes: 45, points: 20, userName: users[2].name },
        { type: 'cycling', durationMinutes: 25, points: 12, userName: users[1].name },
    ]);
    await models_1.LeaderboardEntry.insertMany([
        { rank: 1, name: users[0].name, points: 320 },
        { rank: 2, name: users[2].name, points: 295 },
        { rank: 3, name: users[1].name, points: 280 },
    ]);
    await models_1.Workout.insertMany([
        { title: 'Morning Jog', difficulty: 'easy', durationMinutes: 25, focus: 'cardio' },
        { title: 'Core Circuit', difficulty: 'moderate', durationMinutes: 40, focus: 'strength' },
        { title: 'Trail Intervals', difficulty: 'hard', durationMinutes: 35, focus: 'endurance' },
    ]);
    console.log(`Inserted ${users.length} users, ${teams.length} teams, and sample activity, leaderboard, and workout data.`);
    await mongoose_1.default.disconnect();
}
if (require.main === module) {
    seedDatabase().catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    });
}
