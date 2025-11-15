import { useState } from 'react'
import './App.css'

function App() {
  const [videoId, setVideoId] = useState('')
  const [comments, setComments] = useState([])
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!videoId) {
      setError('Please enter a video ID')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          title: 'Sample Video',
          description: 'Sample description'
        })
      })

      const data = await response.json()
      if (data.status === 'success') {
        setComments(data.analyzed)
        
        // Fetch report
        const reportRes = await fetch(`/api/report/${videoId}`)
        const reportData = await reportRes.json()
        setReport(reportData)
      } else {
        setError(data.message || 'Analysis failed')
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>YouTube Comment Forumizer</h1>
      <p>AI-powered spam detection for YouTube comments</p>

      <form onSubmit={handleAnalyze} className="form">
        <input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Enter YouTube Video ID"
          className="input"
        />
        <button type="submit" disabled={loading} className="button">
          {loading ? 'Analyzing...' : 'Analyze Comments'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {report && (
        <div className="report">
          <h2>Spam Report</h2>
          <div className="stats">
            <div className="stat">
              <span>Total Comments:</span>
              <strong>{report.totalComments}</strong>
            </div>
            <div className="stat">
              <span>Spam Detected:</span>
              <strong>{report.spamComments}</strong>
            </div>
            <div className="stat">
              <span>Spam %:</span>
              <strong>{report.spamPercentage}%</strong>
            </div>
          </div>
        </div>
      )}

      {comments.length > 0 && (
        <div className="comments-section">
          <h2>Analyzed Comments</h2>
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className={`comment ${comment.spam ? 'spam' : 'clean'}`}>
                <div className="comment-header">
                  <span className="author">{comment.author}</span>
                  <span className={`badge ${comment.spam ? 'spam-badge' : 'clean-badge'}`}>
                    {comment.spam ? 'SPAM' : 'CLEAN'}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
