import { useState, useCallback } from 'react'
import CollegeCard from './CollegeCard'
import CollegeDetailModal from './CollegeDetailModal'
import styles from './Results.module.css'

export default function Results({ recommendations, userInput, onReset }) {
  const [selectedResult, setSelectedResult] = useState(null)
  const handleExport = useCallback(() => {
    const lines = [
      'College Picker — Your Recommendations',
      '=====================================\n',
      ...recommendations.map((r, i) => {
        const parts = [`${i + 1}. ${r.college.name} — ${r.fitScore}% fit`]
        if (r.college.acceptanceRate != null) parts.push(`${r.college.acceptanceRate}% acceptance`)
        if (r.college.cost != null) parts.push(`~$${(r.college.cost / 1000).toFixed(0)}k/yr`)
        return parts.join(' | ')
      }),
      '',
      'College Picker',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'college-recommendations.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [recommendations])

  return (
    <div className={styles.results}>
      <div className={styles.toolbar}>
        <button type="button" onClick={onReset} className={styles.backBtn}>
          ← New Search
        </button>
        <button type="button" onClick={handleExport} className={styles.exportBtn}>
          Download Results
        </button>
      </div>

      <h2 className={styles.title}>Your Top Matches</h2>
      <p className={styles.subtitle}>
        Ranked by fit based on your stats, budget, major, and location.
      </p>

      <div className={styles.list}>
        {recommendations.map((result, i) => (
          <CollegeCard
            key={result.college.name + (result.college.state ?? '') + (result.college.id ?? i)}
            result={result}
            rank={i + 1}
            onClick={() => setSelectedResult(result)}
          />
        ))}
      </div>

      {selectedResult && (
        <CollegeDetailModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  )
}
