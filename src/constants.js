// Comprehensive list of majors for searchable dropdown
export const MAJORS = [
  'Accounting', 'Actuarial Science', 'Advertising', 'Aerospace Engineering',
  'African American Studies', 'Agriculture', 'American Studies', 'Animal Science',
  'Anthropology', 'Applied Mathematics', 'Architecture', 'Art & Design',
  'Art History', 'Asian Studies', 'Astronomy', 'Athletic Training',
  'Biochemistry', 'Bioengineering', 'Biology', 'Biomedical Engineering',
  'Biostatistics', 'Biotechnology', 'Broadcasting', 'Business',
  'Business Administration', 'Chemical Engineering', 'Chemistry',
  'Child Development', 'Civil Engineering', 'Classics', 'Communications',
  'Comparative Literature', 'Computer Engineering', 'Computer Science',
  'Construction Management', 'Creative Writing', 'Criminal Justice',
  'Criminology', 'Dance', 'Data Science', 'Dental Hygiene',
  'Dietetics', 'Economics', 'Education', 'Electrical Engineering',
  'Elementary Education', 'Engineering', 'English', 'Entrepreneurship',
  'Environmental Engineering', 'Environmental Science', 'Exercise Science',
  'Fashion Design', 'Film', 'Finance', 'Food Science',
  'Forensic Science', 'French', 'Game Design', 'Geography',
  'Geology', 'German', 'Graphic Design', 'Health Sciences',
  'Healthcare Administration', 'History', 'Hospitality Management',
  'Human Resources', 'Industrial Design', 'Industrial Engineering',
  'Information Systems', 'International Business', 'International Relations',
  'Journalism', 'Kinesiology', 'Landscape Architecture', 'Latin American Studies',
  'Law (Pre-Law)', 'Liberal Arts', 'Linguistics', 'Management',
  'Marketing', 'Mass Communications', 'Materials Engineering',
  'Mathematics', 'Mechanical Engineering', 'Media Studies',
  'Medical Laboratory Science', 'Medicine (Pre-Med)', 'Music',
  'Music Education', 'Neuroscience', 'Nursing', 'Nutrition',
  'Occupational Therapy', 'Organizational Behavior', 'Philosophy',
  'Physical Education', 'Physical Therapy', 'Physics', 'Political Science',
  'Psychology', 'Public Health', 'Public Policy', 'Public Relations',
  'Religious Studies', 'Respiratory Therapy', 'Russian', 'Social Work',
  'Sociology', 'Software Engineering', 'Spanish', 'Special Education',
  'Speech Pathology', 'Sports Management', 'Statistics', 'Supply Chain Management',
  'Theater', 'Urban Planning', 'Veterinary (Pre-Vet)', 'Women\'s Studies',
  'Undecided / General',
]

// Location preference options
export const LOCATIONS = [
  { value: 'in-state', label: 'In-state preferred' },
  { value: 'any', label: 'Any location' },
  { value: 'northeast', label: 'Northeast' },
  { value: 'southeast', label: 'Southeast' },
  { value: 'midwest', label: 'Midwest' },
  { value: 'southwest', label: 'Southwest' },
  { value: 'west', label: 'West Coast' },
]

// Budget options (annual cost)
export const BUDGETS = [
  { value: 'any', label: "Doesn't matter", maxCost: null },
  { value: 'free', label: 'Full ride / Free', maxCost: 0 },
  { value: '20k', label: 'Under $20k/year', maxCost: 20000 },
  { value: '50k', label: '$20k - $50k/year', maxCost: 50000 },
  { value: '50k+', label: '$50k+/year', maxCost: 100000 },
]

// US states for in-state preference
export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
]

// Advanced options
export const COMMUNITY_COLLEGE_OPTIONS = [
  { value: 'no', label: 'No — 4-year schools only' },
  { value: 'yes', label: 'Yes — include 2-year/community colleges' },
]

export const INSTITUTION_TYPE_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'public', label: 'Public only' },
  { value: 'private', label: 'Private only' },
]

// Region mapping for US states
export const STATE_REGIONS = {
  northeast: ['CT', 'DE', 'ME', 'MD', 'MA', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'],
  southeast: ['AL', 'AR', 'FL', 'GA', 'KY', 'LA', 'MS', 'NC', 'SC', 'TN', 'VA', 'WV'],
  midwest: ['IL', 'IN', 'IA', 'KS', 'MI', 'MN', 'MO', 'NE', 'ND', 'OH', 'SD', 'WI'],
  southwest: ['AZ', 'NM', 'OK', 'TX'],
  west: ['CA', 'CO', 'ID', 'MT', 'NV', 'OR', 'UT', 'WA', 'WY'],
}
