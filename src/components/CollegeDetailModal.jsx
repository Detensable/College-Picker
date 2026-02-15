import { useEffect } from 'react'
import styles from './CollegeDetailModal.module.css'

const OWNERSHIP_LABELS = { 1: 'Public', 2: 'Private nonprofit', 3: 'Private for-profit' }
const DEGREE_LABELS = { 1: 'Certificate', 2: 'Associate (2-year)', 3: "Bachelor's (4-year)" }

export default function CollegeDetailModal({ result, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!result) return null

  const { college, fitScore, matchReasons, breakdown } = result

  return (
    <div className={styles.overlay} onClick={onClose}>
      <article
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="college-detail-title"
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <header className={styles.header}>
          <h2 id="college-detail-title" className={styles.name}>{college.name}</h2>
          <div className={styles.location}>
            {[college.city, college.state].filter(Boolean).join(', ')}
          </div>
          <div className={styles.fitBadge}>{fitScore}% fit</div>
        </header>

        <section className={styles.section}>
          <h3>Admissions</h3>
          <dl className={styles.grid}>
            {college.acceptanceRate != null && (
              <>
                <dt>Acceptance rate</dt>
                <dd>{college.acceptanceRate}%</dd>
              </>
            )}
            {college.avgSAT != null && (
              <>
                <dt>Avg SAT</dt>
                <dd>{college.avgSAT}</dd>
              </>
            )}
            {college.avgACT != null && (
              <>
                <dt>Avg ACT</dt>
                <dd>{college.avgACT}</dd>
              </>
            )}
            {college.avgGPA != null && (
              <>
                <dt>Avg GPA</dt>
                <dd>{college.avgGPA}</dd>
              </>
            )}
          </dl>
        </section>

        <section className={styles.section}>
          <h3>Cost & size</h3>
          <dl className={styles.grid}>
            {college.cost != null && (
              <>
                <dt>Est. annual cost</dt>
                <dd>~${(college.cost / 1000).toFixed(0)}k/year</dd>
              </>
            )}
            {college.enrollment != null && (
              <>
                <dt>Enrollment</dt>
                <dd>{college.enrollment.toLocaleString()}</dd>
              </>
            )}
            {college.graduationRate != null && (
              <>
                <dt>Graduation rate</dt>
                <dd>{college.graduationRate}%</dd>
              </>
            )}
            {college.ownership != null && (
              <>
                <dt>Type</dt>
                <dd>{OWNERSHIP_LABELS[college.ownership] ?? 'Unknown'}</dd>
              </>
            )}
            {college.predominantDegree != null && (
              <>
                <dt>Degree level</dt>
                <dd>{DEGREE_LABELS[college.predominantDegree] ?? 'Unknown'}</dd>
              </>
            )}
          </dl>
        </section>

        {college.majors?.length > 0 && (
          <section className={styles.section}>
            <h3>Popular majors</h3>
            <p className={styles.majors}>{college.majors.join(', ')}</p>
          </section>
        )}

        <section className={styles.section}>
          <h3>Why it matches</h3>
          <ul className={styles.reasons}>
            {matchReasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h3>Score breakdown</h3>
          <div className={styles.breakdown}>
            <span>Stats {breakdown.stats}%</span>
            <span>Cost {breakdown.cost}%</span>
            <span>Major {breakdown.major}%</span>
            <span>Location {breakdown.location}%</span>
          </div>
        </section>

        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.visitBtn}
          >
            Visit {college.name} website →
          </a>
        )}
      </article>
    </div>
  )
}
