import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blink } from '../blink/client'
import { useAuth } from './useAuth'
import { isWithinInterval, parseISO } from 'date-fns'

export interface Session {
  id: string
  userId: string
  eventId: string
  roomId: string | null
  title: string
  description: string | null
  startTime: string
  endTime: string
  capacity: number | null
}

export function useSessions(eventId?: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const sessionsQuery = useQuery({
    queryKey: ['sessions', eventId],
    queryFn: async () => {
      const query: any = {
        orderBy: { startTime: 'asc' },
      }
      if (eventId) {
        query.where = { eventId }
      }
      return await blink.db.sessions.list(query) as Session[]
    },
  })

  const createSession = useMutation({
    mutationFn: async (newSession: Omit<Session, 'id' | 'userId'>) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.sessions.create({
        ...newSession,
        userId: user.id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', eventId] })
    },
  })

  const updateSession = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Session> & { id: string }) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.sessions.update(id, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', eventId] })
    },
  })

  const deleteSession = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.sessions.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', eventId] })
    },
  })

  return {
    sessions: sessionsQuery.data ?? [],
    isLoading: sessionsQuery.isLoading,
    createSession,
    updateSession,
    deleteSession,
  }
}

export function useSession(sessionId: string) {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const session = await blink.db.sessions.get(sessionId) as Session | null
      return session
    },
    enabled: !!sessionId,
  })
}

export function isSessionLive(session: Session) {
  const now = new Date()
  try {
    return isWithinInterval(now, {
      start: parseISO(session.startTime),
      end: parseISO(session.endTime),
    })
  } catch (e) {
    return false
  }
}
