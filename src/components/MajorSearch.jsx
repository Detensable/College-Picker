import { useState, useRef, useEffect } from 'react'
import { MAJORS } from '../constants'
import styles from './MajorSearch.module.css'

export default function MajorSearch({ value, onChange, id, placeholder }) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const containerRef = useRef(null)

  const q = query.trim().toLowerCase()
  const filtered = q
    ? MAJORS.filter(m => m.toLowerCase().includes(q)).slice(0, 12)
    : MAJORS.slice(0, 12)

  useEffect(() => {
    if (value) setQuery(value)
  }, [value])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const select = (major) => {
    setQuery(major)
    onChange(major)
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true)
        setHighlight(0)
      }
      return
    }
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight(h => (h < filtered.length - 1 ? h + 1 : 0))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight(h => (h > 0 ? h - 1 : filtered.length - 1))
      return
    }
    if (e.key === 'Enter' && filtered[highlight]) {
      e.preventDefault()
      select(filtered[highlight])
    }
  }

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder || 'Search majors...'}
        value={query}
        onChange={e => {
          setQuery(e.target.value)
          onChange(e.target.value)
          setOpen(true)
          setHighlight(0)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={styles.input}
      />
      {open && (
        <ul className={styles.list} role="listbox">
          {filtered.length ? (
            filtered.map((major, i) => (
              <li
                key={major}
                role="option"
                aria-selected={i === highlight}
                className={i === highlight ? styles.highlight : ''}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={e => {
                  e.preventDefault()
                  select(major)
                }}
              >
                {major}
              </li>
            ))
          ) : (
            <li className={styles.empty}>No majors match "{query}"</li>
          )}
        </ul>
      )}
    </div>
  )
}
