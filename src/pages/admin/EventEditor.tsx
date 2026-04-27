import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { 
  Container, 
  Card, 
  Button, 
  Input, 
  Textarea, 
  Label,
  toast,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@blinkdotnew/ui'
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Calendar, 
  MapPin, 
  Link as LinkIcon,
  Clock,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react'
import { AdminPage } from '../../components/AdminPage'
import { useEvents, useEvent } from '../../hooks/useEvents'
import { useSessions } from '../../hooks/useSessions'
import { useRooms } from '../../hooks/useRooms'

export default function EventEditor() {
  const { eventId } = useParams({ from: '/admin/events/$eventId/edit', strict: false })
  const navigate = useNavigate()
  const { createEvent, updateEvent } = useEvents()
  const { data: event, isLoading: eventLoading } = useEvent(eventId || '')
  
  const isEditing = !!eventId

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    imageUrl: ''
  })

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        slug: event.slug || '',
        description: event.description || '',
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
        location: event.location || '',
        imageUrl: event.imageUrl || ''
      })
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await updateEvent.mutateAsync({ id: eventId, ...formData })
        toast.success('Event updated successfully')
      } else {
        await createEvent.mutateAsync(formData)
        toast.success('Event created successfully')
        navigate({ to: '/admin/events' })
      }
    } catch (err) {
      toast.error('Failed to save event')
    }
  }

  if (isEditing && eventLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <AdminPage>
      <div className="bg-[#050606] border-b border-white/5 py-12">
        <Container className="px-4">
          <Link to="/admin/events" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to List
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h1>
            <Button 
              onClick={handleSubmit} 
              className="bg-primary text-black font-bold hover:bg-primary/90 px-8 shadow-[0_0_20px_rgba(0,245,255,0.3)]"
              disabled={createEvent.isPending || updateEvent.isPending}
            >
              <Save className="h-4 w-4 mr-2" /> {isEditing ? 'Update Event' : 'Save Event'}
            </Button>
          </div>
        </Container>
      </div>

      <Container className="mt-12 px-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 mb-8">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-black">General Info</TabsTrigger>
            {isEditing && (
              <>
                <TabsTrigger value="sessions" className="data-[state=active]:bg-primary data-[state=active]:text-black">Sessions</TabsTrigger>
                <TabsTrigger value="rooms" className="data-[state=active]:bg-primary data-[state=active]:text-black">Rooms</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="general" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 border-white/5 bg-white/[0.02]">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6 md:col-span-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Event Title</Label>
                      <Input 
                        placeholder="Future Tech Conference 2025" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-white/5 border-white/10 text-white text-lg font-bold h-12 focus:border-primary/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">URL Slug</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input 
                          placeholder="future-tech-2025" 
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="bg-white/5 border-white/10 text-white pl-10 focus:border-primary/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Description</Label>
                    <Textarea 
                      placeholder="Tell the world about your event..." 
                      className="min-h-[150px] bg-white/5 border-white/10 text-white focus:border-primary/50"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Start Date & Time</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input 
                          type="datetime-local" 
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="bg-white/5 border-white/10 text-white pl-10 focus:border-primary/50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Location / Venue</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input 
                          placeholder="San Francisco, CA or Online" 
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="bg-white/5 border-white/10 text-white pl-10 focus:border-primary/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">End Date & Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input 
                          type="datetime-local" 
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="bg-white/5 border-white/10 text-white pl-10 focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Cover Image URL</Label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          className="bg-white/5 border-white/10 text-white pl-10 focus:border-primary/50"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="sessions" className="mt-0">
             {/* Stub for sessions management - in a real app this would be a full list */}
             <AdminSessionsSection eventId={eventId!} />
          </TabsContent>

          <TabsContent value="rooms" className="mt-0">
             <AdminRoomsSection eventId={eventId!} />
          </TabsContent>
        </Tabs>
      </Container>
    </AdminPage>
  )
}

function AdminSessionsSection({ eventId }: { eventId: string }) {
  const { sessions, isLoading, deleteSession } = useSessions(eventId)
  
  return (
    <Card className="p-8 border-white/5 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          Event Sessions
        </h3>
        {/* Note: Create session would go to AdminSessionEditor */}
        <Link to="/admin/events" /* Temporary path, in real app would have eventId context */>
          <Button variant="outline" size="sm" className="border-white/10 hover:border-primary/50">
            <Plus className="h-4 w-4 mr-2" /> Add Session
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        {sessions.map(session => (
          <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <p className="font-bold text-white">{session.title}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(session.startTime), 'HH:mm')} - {format(new Date(session.endTime), 'HH:mm')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/sessions/$sessionId/edit" params={{ sessionId: session.id }}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                onClick={() => deleteSession.mutate(session.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <p className="text-center text-muted-foreground py-10">No sessions added yet.</p>
        )}
      </div>
    </Card>
  )
}

function AdminRoomsSection({ eventId }: { eventId: string }) {
  const { rooms, isLoading, createRoom, deleteRoom } = useRooms(eventId)
  const [newName, setNewName] = useState('')

  const handleAdd = async () => {
    if (!newName) return
    await createRoom.mutateAsync({ eventId, name: newName })
    setNewName('')
    toast.success('Room added')
  }

  return (
    <Card className="p-8 border-white/5 bg-white/[0.02]">
      <h3 className="text-xl font-bold text-white mb-8">Venue Rooms</h3>
      
      <div className="flex gap-4 mb-8">
        <Input 
          placeholder="Room Name (e.g. Hall A)" 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
        <Button onClick={handleAdd} className="bg-primary text-black font-bold shrink-0">
          Add Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="font-bold text-white">{room.name}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-red-500"
              onClick={() => deleteRoom.mutate(room.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}

