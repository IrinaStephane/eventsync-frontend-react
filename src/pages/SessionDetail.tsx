import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Badge, 
  Button, 
  Card,
  Container,
  Input,
  Textarea,
  Separator,
  Avatar,
  AvatarFallback,
  toast
} from '@blinkdotnew/ui'
import { 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  ThumbsUp, 
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react'
import { useSession, isSessionLive } from '../hooks/useSessions'
import { useSessionSpeakers } from '../hooks/useSpeakers'
import { useQuestions } from '../hooks/useQuestions'
import { useRooms } from '../hooks/useRooms'
import { SpeakerCard } from '../components/SpeakerCard'
import { format, parseISO } from 'date-fns'

export default function SessionDetail() {
  const { eventSlug, sessionId } = useParams({ from: '/events/$eventSlug/sessions/$sessionId' })
  const { data: session, isLoading: sessionLoading } = useSession(sessionId)
  const { speakers, isLoading: speakersLoading } = useSessionSpeakers(sessionId)
  const { questions, addQuestion, upvoteQuestion, isLive } = useQuestions(sessionId)
  const { rooms } = useRooms(session?.eventId)
  
  const [questionText, setQuestionText] = useState('')
  const [authorName, setAuthorName] = useState('')

  const room = rooms.find(r => r.id === session?.roomId)

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionText.trim()) return
    
    try {
      await addQuestion.mutateAsync({
        content: questionText,
        authorName: authorName || 'Anonymous'
      })
      setQuestionText('')
      toast.success('Question submitted!')
    } catch (err) {
      toast.error('Failed to submit question')
    }
  }

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-[#050606] border-b border-white/5 pt-12 pb-16">
        <Container className="px-4">
          <Link to="/events/$eventSlug" params={{ eventSlug }} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Schedule
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-4">
                {isLive && (
                  <Badge className="bg-red-500 text-white border-none animate-pulse px-3 py-1 text-xs font-black uppercase tracking-tighter">
                    ● Live Session
                  </Badge>
                )}
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {room?.name || 'Main Stage'}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                {session.title}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {format(parseISO(session.startTime), 'HH:mm')} - {format(parseISO(session.endTime), 'HH:mm')}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {room?.name || 'Venue'}
                </div>
                {session.capacity && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Capacity: {session.capacity}
                  </div>
                )}
              </div>
            </motion.div>
            
            <div className="flex items-center gap-4 shrink-0">
              <Button size="lg" className="bg-primary text-black font-black hover:bg-primary/90 px-8 rounded-xl shadow-[0_0_20px_rgba(0,245,255,0.3)]">
                Add to Calendar
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="mt-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                About this Session
                <div className="h-1 w-12 bg-primary rounded-full" />
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                {session.description || 'Join this insightful session to learn more about industry trends and best practices.'}
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                Speakers
                <div className="h-1 w-12 bg-primary rounded-full" />
              </h2>
              {speakersLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => <div key={i} className="h-32 rounded-2xl bg-white/[0.02] animate-pulse" />)}
                </div>
              ) : speakers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {speakers.map((speaker, idx) => (
                    <SpeakerCard key={speaker.id} speaker={speaker} index={idx} />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/10">
                  <p className="text-muted-foreground italic">No speakers assigned yet.</p>
                </div>
              )}
            </motion.section>
          </div>

          {/* Sidebar / Q&A */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-primary/20 bg-primary/[0.02] overflow-hidden">
                <div className="bg-primary/10 px-6 py-4 border-b border-primary/20">
                  <h3 className="font-black text-primary uppercase tracking-widest text-xs flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5" /> Live Q&A
                  </h3>
                </div>
                
                <div className="p-6">
                  {isLive ? (
                    <>
                      <form onSubmit={handleSubmitQuestion} className="space-y-4 mb-8">
                        <div>
                          <Input 
                            placeholder="Your Name (Optional)" 
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary/50"
                          />
                        </div>
                        <div className="relative">
                          <Textarea 
                            placeholder="Ask a question..." 
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary/50 resize-none pb-12"
                          />
                          <Button 
                            type="submit" 
                            size="sm"
                            disabled={!questionText.trim() || addQuestion.isPending}
                            className="absolute bottom-2 right-2 bg-primary text-black font-bold hover:bg-primary/90"
                          >
                            <Send className="h-3.5 w-3.5 mr-2" /> Post
                          </Button>
                        </div>
                      </form>

                      <Separator className="bg-white/5 my-6" />

                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence initial={false}>
                          {questions.length > 0 ? (
                            questions.map((q) => (
                              <motion.div
                                key={q.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 group"
                              >
                                <div className="flex justify-between gap-4 mb-2">
                                  <span className="text-xs font-bold text-primary truncate">
                                    {q.authorName || 'Anonymous'}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground shrink-0">
                                    {format(parseISO(q.createdAt), 'HH:mm')}
                                  </span>
                                </div>
                                <p className="text-sm text-white/90 mb-3">{q.content}</p>
                                <div className="flex items-center justify-between">
                                  <Badge variant="ghost" className="h-6 text-[10px] bg-white/5 text-muted-foreground">
                                    {q.upvotes || 0} upvotes
                                  </Badge>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => upvoteQuestion.mutate(q.id)}
                                    className="h-7 w-7 p-0 rounded-full hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <Sparkles className="h-8 w-8 text-primary/20 mx-auto mb-3" />
                              <p className="text-xs text-muted-foreground">No questions yet. Be the first to ask!</p>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 px-4">
                      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h4 className="text-white font-bold mb-2">Q&A Not Active</h4>
                      <p className="text-xs text-muted-foreground">Questions can only be asked during the live session. Check back once it starts!</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  )
}
