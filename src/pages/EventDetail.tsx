import { useParams, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent, 
  Badge, 
  Button, 
  Card,
  Container,
  EmptyState
} from '@blinkdotnew/ui'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Heart, 
  ChevronRight,
  Info,
  DoorOpen,
  CalendarDays
} from 'lucide-react'
import { useEvent } from '../hooks/useEvents'
import { useSessions, isSessionLive } from '../hooks/useSessions'
import { useRooms } from '../hooks/useRooms'
import { useFavorites } from '../hooks/useFavorites'
import { format, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'

export default function EventDetail() {
  const { eventSlug } = useParams({ from: '/events/$eventSlug' })
  const { data: event, isLoading: eventLoading } = useEvent(eventSlug)
  const { sessions, isLoading: sessionsLoading } = useSessions(event?.id)
  const { rooms } = useRooms(event?.id)
  const { isFavorite, toggleFavorite } = useFavorites()

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <Container className="py-20">
        <EmptyState 
          icon={<Calendar />} 
          title="Event not found" 
          description="The event you're looking for doesn't exist or has been moved."
        />
      </Container>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Event Header */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover opacity-40"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <Container className="absolute bottom-0 left-0 right-0 pb-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-primary text-black font-bold mb-4 uppercase tracking-wider">
              Conference
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {format(parseISO(event.startDate), 'MMMM d')} - {format(parseISO(event.endDate), 'd, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {event.location || 'Online / Hybrid'}
              </div>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Content Tabs */}
      <Container className="mt-8 px-4">
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 mb-8">
            <TabsTrigger value="schedule" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-black">
              <Clock className="h-4 w-4" /> Schedule
            </TabsTrigger>
            <TabsTrigger value="rooms" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-black">
              <DoorOpen className="h-4 w-4" /> Rooms
            </TabsTrigger>
            <TabsTrigger value="info" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-black">
              <Info className="h-4 w-4" /> Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="mt-0">
            {sessionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 rounded-2xl bg-white/[0.02] animate-pulse" />
                ))}
              </div>
            ) : sessions.length > 0 ? (
              <div className="grid gap-4">
                {sessions.map((session, index) => {
                  const isLive = isSessionLive(session)
                  const favorite = isFavorite(session.id)
                  const room = rooms.find(r => r.id === session.roomId)

                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Card className="group relative overflow-hidden border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          {/* Time */}
                          <div className="flex flex-col min-w-[120px]">
                            <span className="text-xl font-black text-white">
                              {format(parseISO(session.startTime), 'HH:mm')}
                            </span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                              {format(parseISO(session.startTime), 'aaa')}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {isLive && (
                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20 animate-pulse font-bold text-[10px] uppercase">
                                  ● Live
                                </Badge>
                              )}
                              {room && (
                                <Link 
                                  to="/events/$eventSlug/rooms/$roomName" 
                                  params={{ eventSlug: event.slug, roomName: room.name }}
                                  className="text-xs font-bold text-primary hover:underline"
                                >
                                  {room.name}
                                </Link>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                              {session.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1 max-w-2xl">
                              {session.description || 'No description available for this session.'}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(session.id)}
                              className={cn(
                                "rounded-full transition-all",
                                favorite ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-white"
                              )}
                            >
                              <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
                            </Button>
                            
                            <Link to="/events/$eventSlug/sessions/$sessionId" params={{ eventSlug: event.slug, sessionId: session.id }}>
                              <Button variant="outline" className="border-white/10 hover:border-primary/50 hover:bg-primary/5 group/btn">
                                Details <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <EmptyState 
                icon={<Clock />} 
                title="No sessions yet" 
                description="The schedule for this event hasn't been announced yet."
              />
            )}
          </TabsContent>

          <TabsContent value="rooms" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link to="/events/$eventSlug/rooms/$roomName" params={{ eventSlug: event.slug, roomName: room.name }}>
                    <Card className="p-6 text-center hover:bg-primary/5 hover:border-primary/50 transition-all group">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-black transition-colors">
                        <DoorOpen className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-lg text-white">{room.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">View Room Schedule</p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
              {rooms.length === 0 && (
                <div className="col-span-full">
                  <EmptyState icon={<DoorOpen />} title="No rooms defined" description="Rooms will appear here once they are added." />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-0">
            <Card className="border-white/5 bg-white/[0.02] p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Info className="h-6 w-6 text-primary" /> About {event.title}
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {event.description || 'This event doesn\'t have a detailed description yet.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-white/5">
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">Date & Time</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white">
                      <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      Starts: {format(parseISO(event.startDate), 'PPP p')}
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      Ends: {format(parseISO(event.endDate), 'PPP p')}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">Location</h4>
                  <div className="flex items-start gap-3 text-white">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{event.location || 'Online Event'}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.location ? 'Physical venue access included with your ticket.' : 'Joining instructions will be sent via email.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  )
}
