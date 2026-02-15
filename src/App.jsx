import { useState, useEffect, useCallback } from 'react'
import { getRecommendations } from './utils/matchingAlgorithm'
import { fetchColleges } from './services/collegeScorecardApi'
import InputForm from './components/InputForm'
import Results from './components/Results'
import styles from './App.module.css'

export default function App() {
  const [colleges, setColleges] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recommendations, setRecommendations] = useState(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_COLLEGE_SCORECARD_API_KEY
    if (!apiKey || apiKey === 'your_api_key_here') {
      setColleges(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchColleges(apiKey, { perPage: 100, maxPages: 5 })
      .then(data => {
        if (!cancelled) {
          setColleges(data)
          setError(null)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setColleges(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleSubmit = useCallback((userInput) => {
    const recs = getRecommendations(colleges, userInput, 10)
    setRecommendations({ recs, userInput })
  }, [colleges])

  const handleReset = () => setRecommendations(null)

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.logo}>College Picker</h1>
        <p className={styles.tagline}>Find colleges that match your profile</p>
        {loading && <p className={styles.apiStatus}>Loading college data...</p>}
        {error && (
          <p className={styles.apiError} title={error}>
            Using built-in data. API error: {error}
          </p>
        )}
      </header>

      <main className={styles.main}>
        {!recommendations ? (
          <section className={styles.hero}>
            <h2 className={styles.heroTitle}>Tell us about yourself</h2>
            <p className={styles.heroSubtitle}>
              We’ll recommend colleges that fit your stats, interests, and budget.
            </p>
            <InputForm onSubmit={handleSubmit} />
          </section>
        ) : (
          <Results
            recommendations={recommendations.recs}
            userInput={recommendations.userInput}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className={styles.footer}>
        <p>Built to help students make data-driven college decisions.</p>
      </footer>
    </div>
  )
}
