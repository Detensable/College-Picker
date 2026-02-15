import { useState } from 'react'
import { LOCATIONS, BUDGETS, US_STATES, COMMUNITY_COLLEGE_OPTIONS, INSTITUTION_TYPE_OPTIONS } from '../constants'
import MajorSearch from './MajorSearch'
import styles from './InputForm.module.css'

const initialState = {
  gpa: '',
  sat: '',
  act: '',
  major: '',
  location: 'any',
  budget: 'any',
  homeState: '',
  extracurriculars: '',
  communityCollege: 'no',
  institutionType: 'any',
}

export default function InputForm({ onSubmit }) {
  const [form, setForm] = useState(initialState)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const hasGPA = form.gpa && parseFloat(form.gpa) >= 3
    const hasSAT = form.sat && parseInt(form.sat, 10) >= 400
    const hasACT = form.act && parseInt(form.act, 10) >= 1
    if (!hasGPA && !hasSAT && !hasACT) {
      alert('Please enter your GPA and/or SAT or ACT score.')
      return
    }
    const payload = {
      gpa: form.gpa ? parseFloat(form.gpa) : null,
      sat: form.sat ? parseInt(form.sat, 10) : null,
      act: form.act ? parseInt(form.act, 10) : null,
      major: form.major?.trim() || null,
      location: form.location,
      budget: form.budget,
      homeState: form.location === 'in-state' ? form.homeState : null,
      extracurriculars: form.extracurriculars.trim() || null,
      communityCollege: form.communityCollege,
      institutionType: form.institutionType,
    }
    onSubmit(payload)
  }

  const showHomeState = form.location === 'in-state'

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="gpa">GPA (3.00 - 4.00)</label>
          <input
            id="gpa"
            type="number"
            step="0.01"
            min="3"
            max="4.2"
            placeholder="e.g. 3.75"
            value={form.gpa}
            onChange={e => handleChange('gpa', e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="sat">SAT Score (400-1600)</label>
          <input
            id="sat"
            type="number"
            min="400"
            max="1600"
            placeholder="e.g. 1350"
            value={form.sat}
            onChange={e => handleChange('sat', e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="act">ACT Score (1-36)</label>
          <input
            id="act"
            type="number"
            min="1"
            max="36"
            placeholder="e.g. 30"
            value={form.act}
            onChange={e => handleChange('act', e.target.value)}
          />
        </div>

        <p className={styles.hint}>Enter SAT or ACT (or both). We’ll use what you provide.</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="major">Intended Major</label>
        <MajorSearch
          id="major"
          value={form.major}
          onChange={v => handleChange('major', v)}
          placeholder="Search majors..."
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="location">Location Preference</label>
        <select
          id="location"
          value={form.location}
          onChange={e => handleChange('location', e.target.value)}
        >
          {LOCATIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {showHomeState && (
        <div className={styles.field}>
          <label htmlFor="homeState">Your State (for in-state tuition)</label>
          <select
            id="homeState"
            value={form.homeState}
            onChange={e => handleChange('homeState', e.target.value)}
          >
            <option value="">Select your state</option>
            {US_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="budget">Budget Range (annual cost)</label>
        <select
          id="budget"
          value={form.budget}
          onChange={e => handleChange('budget', e.target.value)}
        >
          {BUDGETS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="extracurriculars">Extracurriculars (optional)</label>
        <textarea
          id="extracurriculars"
          placeholder="e.g. varsity soccer, debate team, volunteer work..."
          rows={2}
          value={form.extracurriculars}
          onChange={e => handleChange('extracurriculars', e.target.value)}
        />
      </div>

      <details className={styles.advanced}>
        <summary>Advanced options</summary>
        <div className={styles.advancedFields}>
          <div className={styles.field}>
            <label htmlFor="communityCollege">Include community colleges</label>
            <select
              id="communityCollege"
              value={form.communityCollege}
              onChange={e => handleChange('communityCollege', e.target.value)}
            >
              {COMMUNITY_COLLEGE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="institutionType">Institution type</label>
            <select
              id="institutionType"
              value={form.institutionType}
              onChange={e => handleChange('institutionType', e.target.value)}
            >
              {INSTITUTION_TYPE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </details>

      <button type="submit" className={styles.submit}>
        Find My Colleges
      </button>
    </form>
  )
}
