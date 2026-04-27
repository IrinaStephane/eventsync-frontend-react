import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blink } from '../blink/client'
import { useAuth } from './useAuth'

export interface Event {
  id: string
  userId: string
  slug: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  location: string | null
  imageUrl: string | null
}

export function useEvents() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      return await blink.db.events.list({
        orderBy: { startDate: 'desc' },
      }) as Event[]
    },
  })

  const userEventsQuery = useQuery({
    queryKey: ['events', 'user', user?.id],
    queryFn: async () => {
      if (!user) return []
      return await blink.db.events.list({
        where: { userId: user.id },
        orderBy: { startDate: 'desc' },
      }) as Event[]
    },
    enabled: !!user,
  })

  const createEvent = useMutation({
    mutationFn: async (newEvent: Omit<Event, 'id' | 'userId'>) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.events.create({
        ...newEvent,
        userId: user.id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Event> & { id: string }) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.events.update(id, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.events.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  return {
    events: eventsQuery.data ?? [],
    userEvents: userEventsQuery.data ?? [],
    isLoading: eventsQuery.isLoading || userEventsQuery.isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
  }
}

export function useEvent(slugOrId: string) {
  return useQuery({
    queryKey: ['event', slugOrId],
    queryFn: async () => {
      // Try by ID first, then by slug
      let event = await blink.db.events.get(slugOrId) as Event | null
      
      if (!event) {
        const events = await blink.db.events.list({
          where: { slug: slugOrId },
          limit: 1,
        }) as Event[]
        event = events[0] || null
      }
      
      return event
    },
  })
}
