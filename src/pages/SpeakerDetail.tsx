import { useParams, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { 
  Badge, 
  Button, 
  Card,
  Container,
  Avatar,
  AvatarFallback,
  AvatarImage,
  EmptyState
} from '@blinkdotnew/ui'
import { 
  Clock, 
  MapPin, 
  ArrowLeft, 
  ChevronRight,
  Globe,
  Mail,
  Calendar,
  Link as LinkIcon
} from 'lucide-react'
import { useSpeakers, useSpeakerSessions } from '../hooks/useSpeakers'
import { useEvents } from '../hooks/useEvents'
import { format, parseISO } from 'date-fns'

export default function SpeakerDetail() {
  const { speakerId } = useParams({ from: '/speakers/$speakerId' })
  const { speakers } = useSpeakers()
  const { sessions, isLoading: sessionsLoading } = useSpeakerSessions(speakerId)
  const { events } = useEvents()

  const speaker = speakers.find(s => s.id === speakerId)
  const socialLinks = speaker?.socialLinks ? JSON.parse(speaker.socialLinks) : {}

  if (!speaker && !sessionsLoading) {
    return (
      <Container className="py-20">
        <EmptyState 
          icon={<Users className="h-10 w-10" />} 
          title="Speaker not found" 
          description="The speaker you're looking for doesn't exist."
        />
      </Container>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-[#050606] border-b border-white/5 py-16">
        <Container className="px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.history.back()}
            className="text-muted-foreground hover:text-primary mb-8 group p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back
          </Button>
          
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Avatar className="h-40 w-40 border-4 border-primary/20 shadow-[0_0_30px_rgba(0,245,255,0.2)]">
                <AvatarImage src={speaker?.imageUrl || ''} />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl font-black">
                  {speaker?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <Badge className="bg-primary text-black font-black uppercase tracking-widest text-[10px] mb-4">
                Global Speaker
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                {speaker?.name}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                {speaker?.bio || 'An industry leader and visionary sharing insights on the latest technological advancements.'}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                {socialLinks.twitter && (
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:border-primary/50 group" asChild>
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2 text-primary" /> Twitter
                    </a>
                  </Button>
                )}
                {socialLinks.linkedin && (
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:border-primary/50 group" asChild>
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-4 w-4 mr-2 text-primary" /> LinkedIn
                    </a>
                  </Button>
                )}
                {socialLinks.website && (
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:border-primary/50 group" asChild>
                    <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2 text-primary" /> Website
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </div>

      <Container className="mt-16 px-4">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          Speaking Sessions
          <div className="h-1 w-12 bg-primary rounded-full" />
        </h2>

        {sessionsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => <div key={i} className="h-32 rounded-2xl bg-white/[0.02] animate-pulse" />)}
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessions.map((session, index) => {
              const event = events.find(e => e.id === session.eventId)
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all group h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="ghost" className="bg-primary/10 text-primary text-[10px] font-black uppercase">
                        {event?.title || 'Unknown Event'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(session.startTime), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors flex-1">
                      {session.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {format(parseISO(session.startTime), 'HH:mm')}
                        </div>
                      </div>
                      
                      <Link to="/events/$eventSlug/sessions/$sessionId" params={{ eventSlug: event?.slug || 'event', sessionId: session.id }}>
                        <Button variant="ghost" size="sm" className="gap-2 group/btn hover:text-primary">
                          Details <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
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
            <h3 className="text-lg font-bold text-white mb-2">No sessions yet</h3>
            <p className="text-muted-foreground">This speaker doesn't have any scheduled sessions yet.</p>
          </div>
        )}
      </Container>
    </div>
  )
}
