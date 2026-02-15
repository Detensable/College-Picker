import styles from './CollegeCard.module.css'

export default function CollegeCard({ result, rank, onClick }) {
  const { college, fitScore, matchReasons, breakdown } = result

  return (
    <article
      className={`${styles.card} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className={styles.header}>
        <span className={styles.rank}>#{rank}</span>
        <div className={styles.nameBlock}>
          <h3 className={styles.name}>{college.name}</h3>
          <span className={styles.location}>
          {[college.state, college.acceptanceRate != null && `${college.acceptanceRate}% acceptance`]
            .filter(Boolean)
            .join(' · ')}
        </span>
        </div>
        <div className={styles.scoreWrap}>
          <span className={styles.score}>{fitScore}</span>
          <span className={styles.scoreLabel}>fit</span>
        </div>
      </div>

      <div className={styles.stats}>
        {college.avgGPA != null && <span>Avg GPA {college.avgGPA}</span>}
        {college.avgSAT != null && <span>Avg SAT {college.avgSAT}</span>}
        {college.avgACT != null && <span>Avg ACT {college.avgACT}</span>}
        {college.cost != null && <span>~${(college.cost / 1000).toFixed(0)}k/yr</span>}
      </div>

      <ul className={styles.reasons}>
        {matchReasons.map((reason, i) => (
          <li key={i}>{reason}</li>
        ))}
      </ul>

      <div className={styles.breakdown}>
        <span title="Stats match">Stats {breakdown.stats}%</span>
        <span title="Cost fit">Cost {breakdown.cost}%</span>
        <span title="Major match">Major {breakdown.major}%</span>
        <span title="Location">Location {breakdown.location}%</span>
      </div>

      <div className={styles.footer}>
        {onClick && <span className={styles.clickHint}>Click card for details</span>}
        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onClick={e => e.stopPropagation()}
          >
            Visit {college.name} →
          </a>
        )}
      </div>
    </article>
  )
}
