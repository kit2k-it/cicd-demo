import { useState, useEffect } from 'react'
import './App.css'

interface HealthResponse {
  status: string
  uptime: number
  timestamp: string
}

function App() {
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

  const checkHealth = async () => {
    setLoading(true)
    setApiError(null)
    try {
      const res = await fetch(`${backendUrl}/health`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setBackendHealth(data)
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Cannot reach backend')
      setBackendHealth(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <div className="cicd-container">
      <header className="header">
        <div className="badge">CI/CD Fullstack Pipeline Demo</div>
        <h1>NestJS + React Vite CI/CD Lab</h1>
        <p className="subtitle">
          Thực hành tích hợp liên tục (CI) &amp; triển khai liên tục (CD) tự động với GitHub Actions &amp; Docker
        </p>
      </header>

      <main className="grid">
        {/* Pipeline Visualizer */}
        <section className="card">
          <h2>Quy trình Pipeline tự động</h2>
          <div className="pipeline-steps">
            <div className="step-item">
              <span className="step-icon">1</span>
              <div>
                <strong>Continuous Integration (CI)</strong>
                <p>Linting &bull; Vitest Unit Tests &bull; TypeScript Typecheck &bull; Build</p>
              </div>
            </div>
            <div className="step-arrow">&darr;</div>
            <div className="step-item">
              <span className="step-icon">2</span>
              <div>
                <strong>Docker Multi-stage Build</strong>
                <p>Build image NestJS (Node Alpine) &amp; Frontend (Nginx Alpine)</p>
              </div>
            </div>
            <div className="step-arrow">&darr;</div>
            <div className="step-item">
              <span className="step-icon">3</span>
              <div>
                <strong>Continuous Deployment (CD)</strong>
                <p>Push to Container Registry &amp; Auto Deploy Server</p>
              </div>
            </div>
          </div>
        </section>

        {/* Backend Connectivity Status */}
        <section className="card">
          <h2>Trạng thái Backend API</h2>
          <p className="meta-text">Target URL: <code>{backendUrl}</code></p>

          <div className="status-box">
            {loading ? (
              <p className="status-loading">Đang kết nối backend...</p>
            ) : backendHealth ? (
              <div className="status-success">
                <span className="indicator-dot online"></span>
                <strong>NestJS Backend: Hoạt động bình thường</strong>
                <div className="details">
                  <p>Trạng thái: <code>{backendHealth.status}</code></p>
                  <p>Uptime: {Math.round(backendHealth.uptime)}s</p>
                  <p>Thời gian: {new Date(backendHealth.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ) : (
              <div className="status-fail">
                <span className="indicator-dot offline"></span>
                <strong>Chưa kết nối được Backend</strong>
                <p className="error-hint">({apiError || 'Chưa bật server NestJS'})</p>
                <small>Hãy chạy <code>npm run start:dev</code> ở thư mục <code>backend</code> hoặc bật Docker Compose.</small>
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn-refresh"
            onClick={checkHealth}
            disabled={loading}
          >
            {loading ? 'Đang kiểm tra...' : 'Kiểm tra lại kết nối'}
          </button>
        </section>
      </main>
    </div>
  )
}

export default App
