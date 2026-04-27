import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blink } from '../blink/client'
import { useAuth } from './useAuth'

export interface Room {
  id: string
  userId: string
  eventId: string
  name: string
}

export function useRooms(eventId?: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const roomsQuery = useQuery({
    queryKey: ['rooms', eventId],
    queryFn: async () => {
      const query: any = {
        orderBy: { name: 'asc' },
      }
      if (eventId) {
        query.where = { eventId }
      }
      return await blink.db.rooms.list(query) as Room[]
    },
  })

  const createRoom = useMutation({
    mutationFn: async (newRoom: Omit<Room, 'id' | 'userId'>) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.rooms.create({
        ...newRoom,
        userId: user.id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', eventId] })
    },
  })

  const updateRoom = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Room> & { id: string }) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.rooms.update(id, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', eventId] })
    },
  })

  const deleteRoom = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Unauthorized')
      return await blink.db.rooms.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', eventId] })
    },
  })

  return {
    rooms: roomsQuery.data ?? [],
    isLoading: roomsQuery.isLoading,
    createRoom,
    updateRoom,
    deleteRoom,
  }
}
