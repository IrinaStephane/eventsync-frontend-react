import { motion } from 'framer-motion'
import { 
  Container, 
  StatGroup, 
  Stat, 
  Card,
  Button
} from '@blinkdotnew/ui'
import { 
  Calendar, 
  Users, 
  Clock, 
  DoorOpen, 
  Plus,
  ArrowRight,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { AdminPage } from '../../components/AdminPage'
import { useEvents } from '../../hooks/useEvents'
import { useSpeakers } from '../../hooks/useSpeakers'
import { useRooms } from '../../hooks/useRooms'
import { useSessions } from '../../hooks/useSessions'

export default function AdminDashboard() {
  const { events } = useEvents()
  const { speakers } = useSpeakers()
  const { rooms } = useRooms() // Note: global rooms might not work without eventId, depends on hook
  const { sessions } = useSessions()

  return (
    <AdminPage>
      <div className="bg-[#050606] border-b border-white/5 py-12">
        <Container className="px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                Admin Console
              </h1>
              <p className="text-muted-foreground">Manage your events, speakers, and schedule.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin/events/new">
                <Button className="bg-primary text-black font-bold hover:bg-primary/90 px-6">
                  <Plus className="h-4 w-4 mr-2" /> Create Event
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Container className="mt-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatGroup className="mb-12">
            <Stat 
              label="Total Events" 
              value={events.length.toString()} 
              icon={<Calendar className="h-5 w-5" />}
              trend={10}
              trendLabel="vs last quarter"
            />
            <Stat 
              label="Speakers" 
              value={speakers.length.toString()} 
              icon={<Users className="h-5 w-5" />}
              trend={24}
              trendLabel="new profiles"
            />
            <Stat 
              label="Sessions" 
              value={sessions.length.toString()} 
              icon={<Clock className="h-5 w-5" />}
            />
          </StatGroup>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 border-white/5 bg-white/[0.02] flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" /> Recent Events
                </h3>
                <Link to="/admin/events" className="text-xs text-primary hover:underline font-bold uppercase tracking-widest">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4 flex-1">
                {events.slice(0, 5).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white truncate max-w-[200px]">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(event.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Link to="/admin/events/$eventId/edit" params={{ eventId: event.id }}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary/20 hover:text-primary">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-center text-muted-foreground py-10">No events found.</p>
                )}
              </div>
            </Card>

            <Card className="p-8 border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" /> Engagement
                </h3>
              </div>
              <div className="aspect-[4/3] bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                <p className="text-muted-foreground text-sm italic">Analytics chart placeholder</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-bold">Live Q&A</p>
                  <p className="text-2xl font-black text-white">124</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-bold">Total Favorites</p>
                  <p className="text-2xl font-black text-white">842</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </Container>
    </AdminPage>
  )
}
