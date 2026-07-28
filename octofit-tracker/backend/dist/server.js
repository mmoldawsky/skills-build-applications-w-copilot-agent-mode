"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiBaseUrl = getApiBaseUrl;
exports.createApp = createApp;
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("./models");
const PORT = Number(process.env.PORT ?? 8000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
function getApiBaseUrl(port) {
    const codespaceName = process.env.CODESPACE_NAME?.trim();
    if (codespaceName) {
        return `https://${codespaceName}-${port}.app.github.dev`;
    }
    return `http://localhost:${port}`;
}
async function ensureDatabaseConnection() {
    if (mongoose_1.default.connection.readyState !== 1) {
        await mongoose_1.default.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    }
}
function createResourceRoute(loader) {
    return async (_req, res) => {
        try {
            const items = await loader();
            return res.json(items);
        }
        catch (error) {
            console.error('Failed to load resource', error);
            return res.status(500).json({ error: 'Failed to load resource' });
        }
    };
}
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get('/api/health', (_req, res) => {
        res.json({
            status: 'ok',
            port: PORT,
            apiUrl: getApiBaseUrl(PORT),
        });
    });
    app.get(['/api/users', '/api/users/'], createResourceRoute(async () => {
        await ensureDatabaseConnection();
        return models_1.User.find({}).lean();
    }));
    app.get(['/api/teams', '/api/teams/'], createResourceRoute(async () => {
        await ensureDatabaseConnection();
        return models_1.Team.find({}).lean();
    }));
    app.get(['/api/activities', '/api/activities/'], createResourceRoute(async () => {
        await ensureDatabaseConnection();
        return models_1.Activity.find({}).lean();
    }));
    app.get(['/api/leaderboard', '/api/leaderboard/'], createResourceRoute(async () => {
        await ensureDatabaseConnection();
        return models_1.LeaderboardEntry.find({}).sort({ rank: 1 }).lean();
    }));
    app.get(['/api/workouts', '/api/workouts/'], createResourceRoute(async () => {
        await ensureDatabaseConnection();
        return models_1.Workout.find({}).lean();
    }));
    return app;
}
async function startServer() {
    const app = createApp();
    try {
        await ensureDatabaseConnection();
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.warn('MongoDB connection unavailable, continuing without database', error);
    }
    return app.listen(PORT, () => {
        console.log(`Backend listening on port ${PORT}`);
    });
}
if (require.main === module) {
    startServer();
}
