import { motion } from 'framer-motion'
import { Card, Avatar, AvatarFallback, AvatarImage, Button } from '@blinkdotnew/ui'
import { Link } from '@tanstack/react-router'
import { Globe, ChevronRight, Link as LinkIcon } from 'lucide-react'
import type { Speaker } from '../hooks/useSpeakers'

interface SpeakerCardProps {
  speaker: Speaker
  index?: number
}

export function SpeakerCard({ speaker, index = 0 }: SpeakerCardProps) {
  const socialLinks = speaker.socialLinks ? JSON.parse(speaker.socialLinks) : {}

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all group">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20 group-hover:border-primary transition-colors">
            <AvatarImage src={speaker.imageUrl || ''} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {speaker.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
              {speaker.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-3">
              {speaker.bio || 'Professional speaker and industry expert.'}
            </p>
            
            <div className="flex items-center gap-2">
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Globe className="h-3.5 w-3.5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <LinkIcon className="h-3.5 w-3.5" />
                </a>
              )}
              {socialLinks.website && (
                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Globe className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
        
        <Link to="/speakers/$speakerId" params={{ speakerId: speaker.id }} className="mt-4 block">
          <Button variant="ghost" size="sm" className="w-full text-[10px] uppercase tracking-widest font-bold gap-2 hover:bg-primary hover:text-black">
            Full Profile <ChevronRight className="h-3 w-3" />
          </Button>
        </Link>
      </Card>
    </motion.div>
  )
}
