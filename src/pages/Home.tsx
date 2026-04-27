import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input, Button, Container } from '@blinkdotnew/ui'
import { Search, Sparkles } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import { EventCard } from '../components/EventCard'

export default function Home() {
  const { events, isLoading } = useEvents()
  const [search, setSearch] = useState('')

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full"
          />
        </div>

        <Container className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="h-3 w-3" /> Connect & Sync
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Synchronize Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
                Event Experience
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg mb-10 leading-relaxed">
              Discover the most exciting tech conferences, workshops, and meetups. 
              Manage your schedule, connect with speakers, and never miss a beat.
            </p>

            <div className="max-w-xl mx-auto relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 transition-all group-focus-within:border-primary/50 group-focus-within:bg-white/10">
                <Search className="h-5 w-5 ml-3 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search events by title or keywords..." 
                  className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-muted-foreground/50 h-12"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button className="rounded-xl px-6 bg-primary text-black font-bold hover:bg-primary/90">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Events Grid */}
      <Container className="mt-16 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            Featured Events
            <div className="h-1 w-12 bg-primary rounded-full" />
          </h2>
          <div className="text-sm text-muted-foreground">
            Showing {filteredEvents.length} events
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] rounded-2xl bg-white/[0.02] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
            <p className="text-muted-foreground text-lg italic">No events found matching your search.</p>
          </div>
        )}
      </Container>
    </div>
  )
}
