import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Container, 
  Card, 
  Button, 
  Input, 
  Textarea, 
  Label,
  toast,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@blinkdotnew/ui'
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Globe, 
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react'
import { AdminPage } from '../../components/AdminPage'
import { useSpeakers } from '../../hooks/useSpeakers'

export default function SpeakersList() {
  const { speakers, isLoading, createSpeaker, updateSpeaker, deleteSpeaker } = useSpeakers()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSpeaker, setEditingSpeaker] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    imageUrl: '',
    twitter: '',
    linkedin: '',
    website: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      imageUrl: '',
      twitter: '',
      linkedin: '',
      website: ''
    })
    setEditingSpeaker(null)
  }

  const handleEdit = (speaker: any) => {
    const socials = speaker.socialLinks ? JSON.parse(speaker.socialLinks) : {}
    setEditingSpeaker(speaker)
    setFormData({
      name: speaker.name,
      bio: speaker.bio || '',
      imageUrl: speaker.imageUrl || '',
      twitter: socials.twitter || '',
      linkedin: socials.linkedin || '',
      website: socials.website || ''
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const socialLinks = JSON.stringify({
      twitter: formData.twitter,
      linkedin: formData.linkedin,
      website: formData.website
    })

    const payload = {
      name: formData.name,
      bio: formData.bio,
      imageUrl: formData.imageUrl,
      socialLinks
    }

    try {
      if (editingSpeaker) {
        await updateSpeaker.mutateAsync({ id: editingSpeaker.id, ...payload })
        toast.success('Speaker updated')
      } else {
        await createSpeaker.mutateAsync(payload)
        toast.success('Speaker created')
      }
      setIsDialogOpen(false)
      resetForm()
    } catch (err) {
      toast.error('Operation failed')
    }
  }

  return (
    <AdminPage>
      <div className="bg-[#050606] border-b border-white/5 py-12">
        <Container className="px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                Speakers
              </h1>
              <p className="text-muted-foreground">Manage speaker profiles and their credentials.</p>
            </div>
            <Button 
              onClick={() => { resetForm(); setIsDialogOpen(true); }}
              className="bg-primary text-black font-bold hover:bg-primary/90 px-6"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Speaker
            </Button>
          </div>
        </Container>
      </div>

      <Container className="mt-12 px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-2xl bg-white/[0.02] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {speakers.map((speaker, index) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-14 w-14 border border-white/10">
                      <AvatarImage src={speaker.imageUrl || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {speaker.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white truncate">{speaker.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{speaker.bio || 'Professional Speaker'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleEdit(speaker)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        onClick={() => {
                          if (confirm('Delete speaker?')) deleteSpeaker.mutate(speaker.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Link to="/speakers/$speakerId" params={{ speakerId: speaker.id }}>
                      <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold border-white/10 hover:border-primary/50">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Container>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#050606] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSpeaker ? 'Edit Speaker' : 'New Speaker Profile'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
                  <Input 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="bg-white/5 border-white/10 pl-10"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Bio</Label>
                <Textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Short professional biography..."
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter Handle</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
                  <Input 
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="@username"
                    className="bg-white/5 border-white/10 pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
                  <Input 
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/..."
                    className="bg-white/5 border-white/10 pl-10"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="border-t border-white/5 pt-6">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-black font-bold">Save Speaker</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPage>
  )
}
