import { motion } from 'framer-motion'
import { Card, Badge, Button } from '@blinkdotnew/ui'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import type { Event } from '../hooks/useEvents'

interface EventCardProps {
  event: Event
  index: number
}

export function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(0,245,255,0.1)]">
        {event.imageUrl && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <Badge variant="outline" className="border-primary/30 text-primary">
              Upcoming
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(event.startDate), 'MMM d, yyyy')}
            </div>
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-primary">
            {event.title}
          </h3>
          
          <p className="mb-5 line-clamp-2 text-sm text-muted-foreground">
            {event.description || 'Join us for this amazing event filled with networking, learning, and fun.'}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {event.location || 'Online'}
            </div>
            
            <Link to="/events/$eventSlug" params={{ eventSlug: event.slug }}>
              <Button size="sm" variant="ghost" className="gap-2 text-xs font-semibold hover:bg-primary hover:text-black">
                View Event <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
