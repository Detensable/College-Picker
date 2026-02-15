/**
 * College Scorecard API (api.data.gov)
 * Field names from CollegeScorecardDataDictionary.xlsx
 * Get a free API key: https://api.data.gov/signup/
 */

const BASE = import.meta.env.DEV
  ? '/api/collegescorecard'
  : 'https://api.data.gov/ed/collegescorecard/v1/schools'

// Verified fields from College Scorecard Data Dictionary (Nov 2025)
const FIELDS = [
  'id',
  'school.name',
  'school.state',
  'school.city',
  'school.school_url',
  'school.ownership',
  'school.degrees_awarded.predominant',
  'latest.admissions.admission_rate.overall',
  'latest.admissions.sat_scores.midpoint.critical_reading',
  'latest.admissions.sat_scores.midpoint.math',
  'latest.admissions.act_scores.midpoint.cumulative',
  'latest.cost.avg_net_price.public',
  'latest.cost.avg_net_price.private',
  'latest.student.size',
].join(',')

function get(obj, path) {
  const keys = path.split('.')
  let v = obj
  for (const k of keys) {
    v = v?.[k]
    if (v === undefined) return undefined
  }
  return v
}

function mapApiSchool(raw) {
  const admissions = raw?.latest?.admissions || {}
  const cost = raw?.latest?.cost || {}
  const school = raw?.school || {}

  const satRead = get(raw, 'latest.admissions.sat_scores.midpoint.critical_reading')
    ?? admissions?.sat_scores?.midpoint?.critical_reading
  const satMath = get(raw, 'latest.admissions.sat_scores.midpoint.math')
    ?? admissions?.sat_scores?.midpoint?.math
  const avgSAT = satRead != null && satMath != null ? satRead + satMath : null
  const acceptanceRate = get(raw, 'latest.admissions.admission_rate.overall')
    ?? admissions?.admission_rate?.overall
  const ratePercent =
    acceptanceRate != null ? Math.round(Number(acceptanceRate) * 100) : null

  // Data dict: avg_net_price.public and avg_net_price.private (no "overall")
  const ownership = get(raw, 'school.ownership') ?? school?.ownership
  const netPricePublic = get(raw, 'latest.cost.avg_net_price.public') ?? cost?.avg_net_price?.public
  const netPricePrivate = get(raw, 'latest.cost.avg_net_price.private') ?? cost?.avg_net_price?.private
  const costValue = (ownership === 1 || ownership === '1') ? netPricePublic : netPricePrivate
    ?? netPricePublic ?? netPricePrivate ?? null

  const actCumulative = get(raw, 'latest.admissions.act_scores.midpoint.cumulative')
    ?? admissions?.act_scores?.midpoint?.cumulative
  const schoolName = get(raw, 'school.name') ?? school?.name
  const schoolState = get(raw, 'school.state') ?? school?.state
  const schoolUrl = get(raw, 'school.school_url') ?? school?.school_url
  const predomDegree = get(raw, 'school.degrees_awarded.predominant') ?? school?.degrees_awarded?.predominant
  const enrollment = get(raw, 'latest.student.size') ?? raw?.latest?.student?.size

  return {
    id: raw?.id,
    name: schoolName || 'Unknown',
    state: schoolState || null,
    city: get(raw, 'school.city') ?? school?.city ?? null,
    website: schoolUrl ? `https://${String(schoolUrl).replace(/^https?:\/\//, '')}` : null,
    acceptanceRate: ratePercent,
    avgGPA: null,
    avgSAT,
    avgACT: actCumulative ?? null,
    cost: costValue != null ? Number(costValue) : null,
    majors: [],
    ownership: ownership != null ? Number(ownership) : null,
    predominantDegree: predomDegree != null ? Number(predomDegree) : null,
    enrollment: enrollment != null ? Number(enrollment) : null,
    graduationRate: null,
  }
}

async function fetchWithRetry(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url)
    if (res.ok) return res.json()
    if (res.status === 500 && i < retries) {
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
      continue
    }
    throw new Error(`College Scorecard API error: ${res.status} ${res.statusText}`)
  }
}

export async function fetchColleges(apiKey, options = {}) {
  const { perPage = 20, maxPages = 10 } = options
  const results = []
  let page = 0
  let hasMore = true

  while (hasMore && page < maxPages) {
    const params = new URLSearchParams({
      api_key: apiKey,
      per_page: String(perPage),
      page: String(page),
      fields: FIELDS,
      'school.degrees_awarded.predominant': '3', // 4-year schools only; smaller result set
    })
    const url = `${BASE}?${params}`
    const data = await fetchWithRetry(url)
    const items = data?.results ?? []
    results.push(...items.map(mapApiSchool))
    hasMore = items.length >= perPage
    page++
  }

  return results.filter(c => c.name && (c.avgSAT != null || c.avgACT != null || c.acceptanceRate != null || c.cost != null))
}
