import mongoose, { Schema, type Model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    profileImage: { type: String, default: '' },
  },
  { timestamps: true },
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    points: { type: Number, default: 0 },
    members: [{ type: String }],
  },
  { timestamps: true },
);

const activitySchema = new Schema(
  {
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    points: { type: Number, required: true },
    userName: { type: String, default: 'Guest' },
  },
  { timestamps: true },
);

const leaderboardSchema = new Schema(
  {
    rank: { type: Number, required: true },
    name: { type: String, required: true },
    points: { type: Number, required: true },
  },
  { timestamps: true },
);

const workoutSchema = new Schema(
  {
    title: { type: String, required: true },
    difficulty: { type: String, required: true },
    durationMinutes: { type: Number, default: 30 },
    focus: { type: String, default: 'fitness' },
  },
  { timestamps: true },
);

export const User: Model<any> = mongoose.model('User', userSchema, 'users');
export const Team: Model<any> = mongoose.model('Team', teamSchema, 'teams');
export const Activity: Model<any> = mongoose.model('Activity', activitySchema, 'activities');
export const LeaderboardEntry: Model<any> = mongoose.model('LeaderboardEntry', leaderboardSchema, 'leaderboard');
export const Workout: Model<any> = mongoose.model('Workout', workoutSchema, 'workouts');
