import { STATE_REGIONS } from '../constants'
import fallbackColleges from '../data/colleges.json'

/**
 * Get the region for a given state
 */
function getRegion(state) {
  if (!state) return 'other'
  for (const [region, states] of Object.entries(STATE_REGIONS)) {
    if (states.includes(state)) return region
  }
  return 'other'
}

/**
 * Score a college against user inputs (0-100 scale per factor)
 * Weights: stats match 35%, cost 25%, major 25%, location 15%
 */
export function scoreCollege(college, userInput) {
  const {
    gpa,
    sat,
    act,
    major,
    location,
    budget,
    homeState,
  } = userInput

  let statsScore = 50
  let costScore = 50
  let majorScore = 50
  let locationScore = 50

  // --- STATS SCORE ---
  const userSAT = sat || (act ? Math.round(act * 22.5 + 405) : null)
  const userACT = act || (sat ? Math.round((sat - 405) / 22.5) : null)

  if (gpa != null && college.avgGPA != null) {
    const gpaDiff = college.avgGPA - gpa
    statsScore += Math.min(25, Math.max(-25, gpaDiff * 15))
  }
  if (userSAT != null && college.avgSAT != null) {
    const satDiff = (userSAT - college.avgSAT) / 40
    statsScore += Math.min(25, Math.max(-25, satDiff * 5))
  }
  if (userACT != null && college.avgACT != null) {
    const actDiff = userACT - college.avgACT
    statsScore += Math.min(25, Math.max(-25, actDiff * 5))
  }

  const acceptanceRate = college.acceptanceRate ?? 50
  if (acceptanceRate < 15 && statsScore < 60) statsScore -= 10
  if (acceptanceRate > 80 && statsScore > 80) statsScore -= 5

  // --- COST SCORE ---
  const cost = college.cost ?? 40000
  if (budget === 'any') {
    costScore = 100
  } else {
    const budgetMax = { free: 0, '20k': 20000, '50k': 50000, '50k+': 100000 }[budget] ?? 50000
    if (budgetMax === 0)
      costScore = cost <= 5000 ? 100 : Math.max(0, 60 - cost / 5000)
    else if (cost <= budgetMax)
      costScore = 100
    else
      costScore = Math.max(0, 100 - (cost - budgetMax) / 1000)
  }

  // --- MAJOR SCORE ---
  const majors = (college.majors || []).map(m => m.toLowerCase())
  const majorLower = (major || '').toLowerCase()
  if (majorLower && majors.length) {
    const hasMajor = majors.some(m => m.includes(majorLower) || majorLower.includes(m))
    majorScore = hasMajor ? 100 : 30
  } else if (majorLower) {
    // API colleges often have no majors; match by common keywords
    const keywords = majorLower.split(/\s+/).filter(Boolean)
    const collegeName = (college.name || '').toLowerCase()
    const match = keywords.some(k => collegeName.includes(k))
    majorScore = match ? 70 : 50
  } else {
    majorScore = 70
  }

  // --- LOCATION SCORE ---
  const collegeRegion = getRegion(college.state)
  if (location === 'any') locationScore = 100
  else if (location === 'in-state' && homeState && college.state === homeState) locationScore = 100
  else if (location === 'in-state') locationScore = 20
  else if (location === collegeRegion) locationScore = 100
  else locationScore = 40

  const total = (
    statsScore * 0.35 +
    costScore * 0.25 +
    majorScore * 0.25 +
    locationScore * 0.15
  )

  return {
    college,
    fitScore: Math.round(Math.min(100, Math.max(0, total))),
    breakdown: {
      stats: Math.round(statsScore),
      cost: Math.round(costScore),
      major: Math.round(majorScore),
      location: Math.round(locationScore),
    },
    matchReasons: buildMatchReasons(college, userInput, {
      statsScore,
      costScore,
      majorScore,
      locationScore,
    }),
  }
}

function buildMatchReasons(college, userInput, scores) {
  const reasons = []
  if (scores.statsScore >= 70)
    reasons.push('Your stats align well with admitted students.')
  if (scores.costScore >= 80) {
    const cost = college.cost
    if (cost != null)
      reasons.push(`Fits your budget (est. $${(cost / 1000).toFixed(0)}k/year).`)
    else if (userInput.budget === 'any')
      reasons.push('Budget flexibility opens more options.')
  }
  if (scores.majorScore >= 80 && userInput.major)
    reasons.push(`Strong program in ${userInput.major}.`)
  if (scores.locationScore >= 80)
    reasons.push('Location matches your preference.')

  const ar = college.acceptanceRate
  if (ar != null && ar < 30)
    reasons.push('Selective school — competitive but achievable.')
  if (ar != null && ar >= 70)
    reasons.push('Strong chance of admission based on your profile.')

  return reasons.length ? reasons : ['Worth considering based on your profile.']
}

/**
 * Filter colleges by advanced options (community college, institution type)
 */
function filterByAdvanced(colleges, userInput) {
  const { communityCollege = 'no', institutionType = 'any' } = userInput || {}

  return colleges.filter(c => {
    // Community college: 2 = associate/2-year, 3 = bachelor's/4-year. null = assume 4-year.
    if (communityCollege === 'no') {
      if (c.predominantDegree === 2) return false
    }

    // Institution type: 1 = public, 2 = private nonprofit, 3 = private for-profit
    if (institutionType === 'public' && c.ownership != null && c.ownership !== 1) return false
    if (institutionType === 'private' && c.ownership != null && c.ownership !== 2) return false

    return true
  })
}

/**
 * Get top N recommended colleges for the user
 */
export function getRecommendations(colleges, userInput, topN = 10) {
  let list = Array.isArray(colleges) && colleges.length ? colleges : fallbackColleges
  list = filterByAdvanced(list, userInput)
  const scored = list.map(c => scoreCollege(c, userInput))
  scored.sort((a, b) => b.fitScore - a.fitScore)
  return scored.slice(0, topN)
}
