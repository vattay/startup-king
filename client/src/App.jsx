import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [api, setApi] = useState({ state: 'loading', message: 'Checking the Node API…' })

  useEffect(() => {
    const controller = new AbortController()

    async function checkApi() {
      try {
        const response = await fetch('/api/health', { signal: controller.signal })
        if (!response.ok) throw new Error('API request failed')
        const data = await response.json()
        setApi({ state: 'ready', message: data.message })
      } catch (error) {
        if (error.name !== 'AbortError') {
          setApi({ state: 'error', message: 'API unavailable. Start both apps with npm run dev, then reload.' })
        }
      }
    }

    checkApi()
    return () => controller.abort()
  }, [])

  return (
    <main>
      <h1>Startup King</h1>
      <p>Your React + Node hackathon starts here.</p>
      <p role="status" className={api.state}>{api.message}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Count is {count}
      </button>
      <p>Edit <code>client/src/App.jsx</code> and save to see your changes.</p>
      <p>Add API routes in <code>server/app.js</code>. Follow the root README for setup and team workflow.</p>
    </main>
  )
}

export default App
