import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blink } from '../blink/client'
import { useAuth } from './useAuth'

export interface Speaker {
  id: string
  userId: string
  name: string
  bio: string | null
  imageUrl: string | null
  socialLinks: string | null // JSON string
}

export function useSpeakers() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const speakersQuery = useQuery({
    queryKey: ['speakers'],
    queryFn: async () => {
      return await blink.db.speakers.list({
        orderBy: { name: 'asc' },
      }) as Speaker[]
    },
  })

  const userSpeakersQuery = useQuery({
    queryKey: ['speakers', 'user', user?.id],
    queryFn: async () => {
      if (!user) return []
      return await blink.db.speakers.list({
        where: { userId: user.id },
        orderBy: { name: 'asc' },
      }) as Speaker[]
    },
    enabled: !!user,
  })

  const createSpeaker = useMutation({
    mutationFn: async (newSpeaker: Omit<Speaker, 'id' | 'userId'>) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.speakers.create({
        ...newSpeaker,
        userId: user.id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers'] })
    },
  })

  const updateSpeaker = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Speaker> & { id: string }) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.speakers.update(id, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers'] })
    },
  })

  const deleteSpeaker = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.speakers.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers'] })
    },
  })

  return {
    speakers: speakersQuery.data ?? [],
    userSpeakers: userSpeakersQuery.data ?? [],
    isLoading: speakersQuery.isLoading || userSpeakersQuery.isLoading,
    createSpeaker,
    updateSpeaker,
    deleteSpeaker,
  }
}

export function useSessionSpeakers(sessionId: string) {
  const queryClient = useQueryClient()

  const speakersQuery = useQuery({
    queryKey: ['session_speakers', sessionId],
    queryFn: async () => {
      const links = await blink.db.sessionSpeakers.list({
        where: { sessionId },
      })
      
      if (links.length === 0) return []
      
      const speakerIds = links.map(l => l.speakerId)
      const speakers = await blink.db.speakers.list({
        where: { id: { IN: speakerIds } }
      }) as Speaker[]
      
      return speakers
    },
    enabled: !!sessionId,
  })

  const addSpeakerToSession = useMutation({
    mutationFn: async (speakerId: string) => {
      return await blink.db.sessionSpeakers.create({
        sessionId,
        speakerId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session_speakers', sessionId] })
    },
  })

  const removeSpeakerFromSession = useMutation({
    mutationFn: async (speakerId: string) => {
      return await blink.db.sessionSpeakers.deleteMany({
        where: { sessionId, speakerId }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session_speakers', sessionId] })
    },
  })

  return {
    speakers: speakersQuery.data ?? [],
    isLoading: speakersQuery.isLoading,
    addSpeakerToSession,
    removeSpeakerFromSession,
  }
}

export function useSpeakerSessions(speakerId: string) {
  const queryClient = useQueryClient()

  const sessionsQuery = useQuery({
    queryKey: ['speaker_sessions', speakerId],
    queryFn: async () => {
      const links = await blink.db.sessionSpeakers.list({
        where: { speakerId },
      })
      
      if (links.length === 0) return []
      
      const sessionIds = links.map(l => l.sessionId)
      const sessions = await blink.db.sessions.list({
        where: { id: { IN: sessionIds } }
      }) as any[]
      
      return sessions
    },
    enabled: !!speakerId,
  })

  return {
    sessions: sessionsQuery.data ?? [],
    isLoading: sessionsQuery.isLoading,
  }
}
