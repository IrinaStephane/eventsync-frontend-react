import { useParams, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { 
  Badge, 
  Button, 
  Card,
  Container,
  EmptyState
} from '@blinkdotnew/ui'
import { 
  Clock, 
  MapPin, 
  ArrowLeft, 
  ChevronRight,
  DoorOpen,
  Calendar
} from 'lucide-react'
import { useEvent } from '../hooks/useEvents'
import { useSessions, isSessionLive } from '../hooks/useSessions'
import { useRooms } from '../hooks/useRooms'
import { format, parseISO } from 'date-fns'

export default function RoomDetail() {
  const { eventSlug, roomName } = useParams({ from: '/events/$eventSlug/rooms/$roomName' })
  const { data: event } = useEvent(eventSlug)
  const { rooms } = useRooms(event?.id)
  const { sessions, isLoading } = useSessions(event?.id)

  const room = rooms.find(r => r.name === roomName)
  const roomSessions = sessions.filter(s => s.roomId === room?.id)

  if (!room && !isLoading) {
    return (
      <Container className="py-20 px-4">
        <EmptyState 
          icon={<DoorOpen />} 
          title="Room not found" 
          description={`The room "${roomName}" does not exist for this event.`}
          action={{ label: "Back to Event", onClick: () => window.history.back() }}
        />
      </Container>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-[#050606] border-b border-white/5 py-12">
        <Container className="px-4">
          <Link 
            to="/events/$eventSlug" 
            params={{ eventSlug: eventSlug }} 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Event
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(0,245,255,0.2)]">
              <DoorOpen className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-widest text-[10px] font-bold">
                  Room Schedule
                </Badge>
                <span className="text-muted-foreground text-xs">{roomSessions.length} Sessions</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {roomName}
              </h1>
            </div>
          </div>
        </Container>
      </div>

      <Container className="mt-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            Chronological Schedule
            <div className="h-1 w-8 bg-primary rounded-full" />
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/[0.02] animate-pulse" />)}
          </div>
        ) : roomSessions.length > 0 ? (
          <div className="relative border-l border-white/10 ml-4 md:ml-6 pl-8 md:pl-10 space-y-8 pb-8">
            {roomSessions.map((session, index) => {
              const isLive = isSessionLive(session)
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[41px] md:-left-[51px] top-6 h-4 w-4 rounded-full border-2 border-[#050606] ${isLive ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-white/20'}`} />
                  
                  <Card className={`group border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all overflow-hidden ${isLive ? 'border-primary/30 ring-1 ring-primary/20' : ''}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-primary flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {format(parseISO(session.startTime), 'HH:mm')} - {format(parseISO(session.endTime), 'HH:mm')}
                          </span>
                          {isLive && (
                            <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] font-bold uppercase py-0 px-2 h-5">
                              Live
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                          {session.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {session.description || 'No description available for this session.'}
                        </p>
                      </div>
                      
                      <Link to="/events/$eventSlug/sessions/$sessionId" params={{ eventSlug: eventSlug, sessionId: session.id }} className="shrink-0">
                        <Button variant="ghost" className="gap-2 group/btn hover:bg-primary hover:text-black">
                          View Session <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
            <Calendar className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Empty Schedule</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">No sessions have been scheduled for this room yet.</p>
          </div>
        )}
      </Container>
    </div>
  )
}
