import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('eventsync_favorites')
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse favorites', e)
      }
    }
  }, [])

  const toggleFavorite = (sessionId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
      localStorage.setItem('eventsync_favorites', JSON.stringify(next))
      return next
    })
  }

  const isFavorite = (sessionId: string) => favorites.includes(sessionId)

  return { favorites, toggleFavorite, isFavorite }
}
