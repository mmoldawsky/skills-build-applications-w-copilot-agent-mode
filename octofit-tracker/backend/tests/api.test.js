const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const mongoose = require('mongoose');

const { createApp, getApiBaseUrl } = require('../dist/server.js');

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

test('health endpoint exposes api metadata', async () => {
  const response = await get('/api/health');
  assert.equal(response.statusCode, 200);
  const payload = JSON.parse(response.body);
  assert.equal(payload.status, 'ok');
  assert.ok(payload.apiUrl);
});

test('getApiBaseUrl uses Codespaces URLs when available and localhost otherwise', () => {
  const previousCodespaceName = process.env.CODESPACE_NAME;

  try {
    delete process.env.CODESPACE_NAME;
    assert.equal(getApiBaseUrl(8000), 'http://localhost:8000');

    process.env.CODESPACE_NAME = 'octofit-demo';
    assert.equal(getApiBaseUrl(8000), 'https://octofit-demo-8000.app.github.dev');
  } finally {
    if (previousCodespaceName === undefined) {
      delete process.env.CODESPACE_NAME;
    } else {
      process.env.CODESPACE_NAME = previousCodespaceName;
    }
  }
});

test('resource endpoints return arrays', async () => {
  for (const path of ['/api/users/', '/api/teams/', '/api/activities/', '/api/leaderboard/', '/api/workouts/']) {
    const response = await get(path);
    assert.equal(response.statusCode, 200);
    const payload = JSON.parse(response.body);
    assert.ok(Array.isArray(payload));
  }
});
