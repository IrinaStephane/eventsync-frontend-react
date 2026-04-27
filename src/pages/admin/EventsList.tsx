import { motion } from 'framer-motion'
import { 
  Container, 
  DataTable, 
  Button, 
  Badge,
  toast,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger
} from '@blinkdotnew/ui'
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Search
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { AdminPage } from '../../components/AdminPage'
import { useEvents } from '../../hooks/useEvents'
import { format } from 'date-fns'
import { useState } from 'react'

export default function EventsList() {
  const { events, isLoading, deleteEvent } = useEvents()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteEvent.mutateAsync(deleteId)
      toast.success('Event deleted successfully')
      setDeleteId(null)
    } catch (err) {
      toast.error('Failed to delete event')
    }
  }

  const columns = [
    {
      accessorKey: 'title',
      header: 'Event Name',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
            <Calendar className="h-4 w-4" />
          </div>
          <span className="font-bold text-white">{row.original.title}</span>
        </div>
      )
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }: any) => <code className="text-xs text-primary bg-primary/5 px-1.5 py-0.5 rounded">{row.original.slug}</code>
    },
    {
      accessorKey: 'startDate',
      header: 'Date',
      cell: ({ row }: any) => <span className="text-muted-foreground">{format(new Date(row.original.startDate), 'MMM d, yyyy')}</span>
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }: any) => <span className="text-muted-foreground truncate max-w-[150px] inline-block">{row.original.location || 'Online'}</span>
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: any) => (
        <div className="flex items-center justify-end gap-2">
          <Link to="/events/$eventSlug" params={{ eventSlug: row.original.slug }}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/admin/events/$eventId/edit" params={{ eventId: row.original.id }}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Edit2 className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-red-500"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <AdminPage>
      <div className="bg-[#050606] border-b border-white/5 py-12">
        <Container className="px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                Manage Events
              </h1>
              <p className="text-muted-foreground">Add, edit, or remove events from the platform.</p>
            </div>
            <Link to="/admin/events/new">
              <Button className="bg-primary text-black font-bold hover:bg-primary/90 px-6">
                <Plus className="h-4 w-4 mr-2" /> New Event
              </Button>
            </Link>
          </div>
        </Container>
      </div>

      <Container className="mt-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
        >
          <DataTable 
            columns={columns} 
            data={events} 
            isLoading={isLoading}
            searchable
            searchColumn="title"
          />
        </motion.div>
      </Container>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#050606] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the event and all its associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  )
}
