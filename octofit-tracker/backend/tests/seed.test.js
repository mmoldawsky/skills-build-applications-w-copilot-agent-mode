const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const mongoose = require('mongoose');

const { createApp } = require('../dist/server.js');
const { seedDatabase, clearDatabase } = require('../dist/scripts/seed.js');

async function get(path) {
  const app = createApp();
  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();
    const response = await new Promise((resolve, reject) => {
      http.get({ hostname: '127.0.0.1', port, path }, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, body });
        });
      }).on('error', reject);
    });

    return response;
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

after(async () => {
  await mongoose.disconnect();
});

test('seed script populates API data from MongoDB models', async () => {
  await clearDatabase();
  await seedDatabase();

  const usersResponse = await get('/api/users/');
  assert.equal(usersResponse.statusCode, 200);
  const users = JSON.parse(usersResponse.body);
  assert.ok(Array.isArray(users));
  assert.ok(users.length >= 2);
  assert.ok(users.some((user) => user.name === 'Ava'));

  const teamsResponse = await get('/api/teams/');
  assert.equal(teamsResponse.statusCode, 200);
  const teams = JSON.parse(teamsResponse.body);
  assert.ok(teams.some((team) => team.name === 'River Runners'));
});
