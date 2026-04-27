import { motion } from 'framer-motion'
import { 
  Badge, 
  Button, 
  Card,
  Container,
  EmptyState,
  Separator
} from '@blinkdotnew/ui'
import { 
  Clock, 
  MapPin, 
  Heart, 
  ChevronRight,
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useFavorites } from '../hooks/useFavorites'
import { useEvents } from '../hooks/useEvents'
import { useSessions } from '../hooks/useSessions'
import { useRooms } from '../hooks/useRooms'
import { format, parseISO } from 'date-fns'

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites()
  const { events } = useEvents()
  
  // This is a bit complex because favorites are just session IDs.
  // We need to fetch sessions for all events and filter.
  // In a real app, we might have a specific hook for this.
  // For now, I'll fetch sessions for all events that are in the events list.
  
  // Note: This is an expensive operation if there are many events.
  // But let's assume it's fine for this demo/small scale.
  
  // Better yet, I'll just show the favorites across all events.
  // But I need to fetch the sessions.
  
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-[#050606] border-b border-white/5 py-16">
        <Container className="px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,245,255,0.2)]">
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              My Schedule
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            All your favorited sessions across all events. Plan your day and never miss a key moment.
          </p>
        </Container>
      </div>

      <Container className="mt-12 px-4">
        {favorites.length > 0 ? (
          <div className="space-y-12">
            {events.map(event => (
              <EventFavoritesGroup 
                key={event.id} 
                event={event} 
                favoriteIds={favorites} 
                onRemove={toggleFavorite} 
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="h-10 w-10 text-primary/30" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Your schedule is empty</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
              Start exploring events and favoriting sessions that interest you to build your personalized event schedule.
            </p>
            <Link to="/">
              <Button size="lg" className="bg-primary text-black font-bold px-8 hover:bg-primary/90">
                Discover Events
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  )
}

function EventFavoritesGroup({ event, favoriteIds, onRemove }: { event: any, favoriteIds: string[], onRemove: (id: string) => void }) {
  const { sessions, isLoading } = useSessions(event.id)
  const { rooms } = useRooms(event.id)
  
  const favoritedSessions = sessions.filter(s => favoriteIds.includes(s.id))
  
  if (isLoading) return null
  if (favoritedSessions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          {event.title}
          <div className="h-1 w-8 bg-primary/30 rounded-full" />
        </h2>
        <Badge variant="outline" className="text-[10px] uppercase font-black border-white/10 text-muted-foreground">
          {favoritedSessions.length} favorited
        </Badge>
      </div>

      <div className="grid gap-4">
        {favoritedSessions.map((session, index) => {
          const room = rooms.find(r => r.id === session.roomId)
          return (
            <Card key={session.id} className="border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all group">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex flex-col min-w-[100px]">
                  <span className="text-lg font-black text-white">
                    {format(parseISO(session.startTime), 'HH:mm')}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">
                    {format(parseISO(session.startTime), 'MMM d')}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary">{room?.name || 'Venue'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {session.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onRemove(session.id)}
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <Link to="/events/$eventSlug/sessions/$sessionId" params={{ eventSlug: event.slug, sessionId: session.id }}>
                    <Button variant="outline" size="sm" className="border-white/10 hover:border-primary/50 group/btn">
                      Details <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </motion.div>
  )
}
