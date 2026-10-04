import { createServer } from 'node:http'

export function createApp() {
  return createServer((request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('Cache-Control', 'no-store')

    const path = request.url.split('?')[0]
    if (path !== '/api/health') {
      response.writeHead(404)
      response.end(JSON.stringify({ error: 'Not found' }))
      return
    }

    if (request.method !== 'GET') {
      response.writeHead(405, { Allow: 'GET' })
      response.end(JSON.stringify({ error: 'Method not allowed' }))
      return
    }

    response.end(JSON.stringify({ status: 'ok', message: 'Node API is ready' }))
  })
}
