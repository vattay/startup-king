import { createApp } from './app.js'

const app = createApp()

app.on('error', (error) => {
  console.error('API failed to start:', error.message)
  process.exit(1)
})

app.listen(3001, '127.0.0.1', () => {
  console.log('API listening at http://127.0.0.1:3001')
})
