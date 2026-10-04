import assert from 'node:assert/strict'
import { once } from 'node:events'
import { test } from 'node:test'
import { createApp } from './app.js'

async function startApp(t) {
  const app = createApp()
  app.listen(0, '127.0.0.1')
  await once(app, 'listening')
  t.after(() => new Promise((resolve, reject) => {
    app.close((error) => error ? reject(error) : resolve())
  }))
  return `http://127.0.0.1:${app.address().port}`
}

test('GET /api/health returns JSON and accepts query parameters', async (t) => {
  const base = await startApp(t)
  for (const path of ['/api/health', '/api/health?check=1']) {
    const response = await fetch(`${base}${path}`)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8')
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.deepEqual(await response.json(), { status: 'ok', message: 'Node API is ready' })
  }
})

test('unknown routes return a JSON 404', async (t) => {
  const base = await startApp(t)
  const response = await fetch(`${base}/api/missing`)
  assert.equal(response.status, 404)
  assert.deepEqual(await response.json(), { error: 'Not found' })
})

test('unsupported health methods return 405 and the allowed method', async (t) => {
  const base = await startApp(t)
  const response = await fetch(`${base}/api/health`, { method: 'POST' })
  assert.equal(response.status, 405)
  assert.equal(response.headers.get('allow'), 'GET')
  assert.deepEqual(await response.json(), { error: 'Method not allowed' })
})
