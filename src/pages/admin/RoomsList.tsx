import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Container, 
  Card, 
  Button, 
  Input, 
  Label,
  toast,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DataTable
} from '@blinkdotnew/ui'
import { 
  DoorOpen, 
  Plus, 
  Trash2, 
  Edit2,
  Calendar
} from 'lucide-react'
import { AdminPage } from '../../components/AdminPage'
import { useRooms } from '../../hooks/useRooms'
import { useEvents } from '../../hooks/useEvents'

export default function RoomsList() {
  const { events } = useEvents()
  const { rooms, isLoading, createRoom, deleteRoom, updateRoom } = useRooms()
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [newRoomName, setNewRoomName] = useState('')

  const handleAddRoom = async () => {
    if (!selectedEventId || !newRoomName) {
      toast.error('Please select an event and enter a room name')
      return
    }
    try {
      await createRoom.mutateAsync({ eventId: selectedEventId, name: newRoomName })
      setNewRoomName('')
      toast.success('Room added successfully')
    } catch (err) {
      toast.error('Failed to add room')
    }
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Room Name',
      cell: ({ row }: any) => <span className="font-bold text-white">{row.original.name}</span>
    },
    {
      accessorKey: 'eventId',
      header: 'Event',
      cell: ({ row }: any) => {
        const event = events.find(e => e.id === row.original.eventId)
        return (
          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
            {event?.title || 'Unknown Event'}
          </Badge>
        )
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-red-500"
            onClick={() => {
              if (confirm('Delete room?')) deleteRoom.mutate(row.original.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <AdminPage>
      <div className="bg-[#050606] border-b border-white/5 py-12">
        <Container className="px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                Rooms & Venues
              </h1>
              <p className="text-muted-foreground">Define physical or virtual rooms for your events.</p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="mt-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Room Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-white/5 bg-white/[0.02] sticky top-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Add New Room
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Event</Label>
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#050606] border-white/10 text-white">
                      {events.map(event => (
                        <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Room Name</Label>
                  <Input 
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g. Main Hall, Room 101"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <Button 
                  onClick={handleAddRoom} 
                  className="w-full bg-primary text-black font-bold hover:bg-primary/90 mt-4"
                  disabled={createRoom.isPending}
                >
                  Create Room
                </Button>
              </div>
            </Card>
          </div>

          {/* Rooms List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
            >
              <DataTable 
                columns={columns} 
                data={rooms} 
                isLoading={isLoading}
                searchable
                searchColumn="name"
              />
            </motion.div>
          </div>
        </div>
      </Container>
    </AdminPage>
  )
}
