import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { 
  Container, 
  Card, 
  Button, 
  Input, 
  Textarea, 
  Label,
  toast,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@blinkdotnew/ui'
import { 
  ArrowLeft, 
  Save, 
  Clock, 
  Users, 
  DoorOpen,
  Plus,
  Trash2,
  UserPlus
} from 'lucide-react'
import { AdminPage } from '../../components/AdminPage'
import { useSession } from '../../hooks/useSessions'
import { useEvents } from '../../hooks/useEvents'
import { useRooms } from '../../hooks/useRooms'
import { useSpeakers, useSessionSpeakers } from '../../hooks/useSpeakers'
import { blink } from '../../blink/client'

export default function SessionEditor() {
  const { sessionId } = useParams({ from: '/admin/sessions/$sessionId/edit' })
  const navigate = useNavigate()
  const { data: session, isLoading: sessionLoading } = useSession(sessionId)
  const { events } = useEvents()
  const { rooms } = useRooms(session?.eventId)
  const { speakers: allSpeakers } = useSpeakers()
  const { speakers: sessionSpeakers, addSpeakerToSession, removeSpeakerFromSession } = useSessionSpeakers(sessionId)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    roomId: '',
    capacity: 0
  })

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title || '',
        description: session.description || '',
        startTime: session.startTime ? new Date(session.startTime).toISOString().slice(0, 16) : '',
        endTime: session.endTime ? new Date(session.endTime).toISOString().slice(0, 16) : '',
        roomId: session.roomId || '',
        capacity: session.capacity || 0
      })
    }
  }, [session])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await blink.db.sessions.update(sessionId, formData)
      toast.success('Session updated successfully')
    } catch (err) {
      toast.error('Failed to update session')
    }
  }

  if (sessionLoading) {
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.history.back()}
            className="text-muted-foreground hover:text-primary mb-8 group p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Edit Session
            </h1>
            <Button 
              onClick={handleUpdate} 
              className="bg-primary text-black font-bold hover:bg-primary/90 px-8"
            >
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>
        </Container>
      </div>

      <Container className="mt-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-white/5 bg-white/[0.02] space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Session Title</Label>
                  <Input 
                    placeholder="Deep Dive into React Server Components" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/5 border-white/10 text-white font-bold h-12 focus:border-primary/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Description</Label>
                  <Textarea 
                    placeholder="What will attendees learn in this session?" 
                    className="min-h-[150px] bg-white/5 border-white/10 text-white focus:border-primary/50"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-primary">Start Time</Label>
                    <Input 
                      type="datetime-local" 
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="bg-white/5 border-white/10 text-white focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-primary">End Time</Label>
                    <Input 
                      type="datetime-local" 
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="bg-white/5 border-white/10 text-white focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Room</Label>
                    <Select 
                      value={formData.roomId} 
                      onValueChange={(val) => setFormData({ ...formData, roomId: val })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#050606] border-white/10 text-white">
                        {rooms.map(room => (
                          <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Capacity</Label>
                    <Input 
                      type="number" 
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10 text-white focus:border-primary/50"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar: Speakers Management */}
          <div className="space-y-8">
            <Card className="p-6 border-white/5 bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Session Speakers
              </h3>
              
              <div className="space-y-4 mb-8">
                {sessionSpeakers.map(speaker => (
                  <div key={speaker.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {speaker.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-white">{speaker.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-red-500"
                      onClick={() => removeSpeakerFromSession.mutate(speaker.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                {sessionSpeakers.length === 0 && (
                  <p className="text-xs text-muted-foreground italic text-center py-4">No speakers assigned.</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add Speaker</Label>
                <div className="flex gap-2">
                  <Select onValueChange={(val) => addSpeakerToSession.mutate(val)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                      <SelectValue placeholder="Select speaker..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#050606] border-white/10 text-white">
                      {allSpeakers
                        .filter(s => !sessionSpeakers.find(ss => ss.id === s.id))
                        .map(speaker => (
                          <SelectItem key={speaker.id} value={speaker.id}>{speaker.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </AdminPage>
  )
}
