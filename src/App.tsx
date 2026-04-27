import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router'
import { Toaster, BlinkUIProvider } from '@blinkdotnew/ui'
import { SharedAppLayout } from './layouts/shared-app-layout'
import Home from './pages/Home'
import EventDetail from './pages/EventDetail'
import SessionDetail from './pages/SessionDetail'
import RoomDetail from './pages/RoomDetail'
import Favorites from './pages/Favorites'
import SpeakerDetail from './pages/SpeakerDetail'
import AdminDashboard from './pages/admin/Dashboard'
import AdminEvents from './pages/admin/EventsList'
import AdminEventEditor from './pages/admin/EventEditor'
import AdminSessionEditor from './pages/admin/SessionEditor'
import AdminSpeakers from './pages/admin/SpeakersList'
import AdminRooms from './pages/admin/RoomsList'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const rootRoute = createRootRoute({
  component: () => (
    <SharedAppLayout appName="EventSync">
      <Outlet />
      <Toaster position="top-right" />
    </SharedAppLayout>
  ),
})

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const eventDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events/$eventSlug', component: EventDetail })
const sessionDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events/$eventSlug/sessions/$sessionId', component: SessionDetail })
const roomDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events/$eventSlug/rooms/$roomName', component: RoomDetail })
const favoritesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events/$eventSlug/favorites', component: Favorites })
const speakerDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/speakers/$speakerId', component: SpeakerDetail })

// Admin Routes
const adminDashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/dashboard', component: AdminDashboard })
const adminEventsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/events', component: AdminEvents })
const adminEventNewRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/events/new', component: AdminEventEditor })
const adminEventEditRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/events/$eventId/edit', component: AdminEventEditor })
const adminSessionEditRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/sessions/$sessionId/edit', component: AdminSessionEditor })
const adminSpeakersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/speakers', component: AdminSpeakers })
const adminRoomsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/rooms', component: AdminRooms })

const routeTree = rootRoute.addChildren([
  indexRoute,
  eventDetailRoute,
  sessionDetailRoute,
  roomDetailRoute,
  favoritesRoute,
  speakerDetailRoute,
  adminDashboardRoute,
  adminEventsRoute,
  adminEventNewRoute,
  adminEventEditRoute,
  adminSessionEditRoute,
  adminSpeakersRoute,
  adminRoomsRoute,
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlinkUIProvider theme="linear" darkMode="system">
        <RouterProvider router={router} />
      </BlinkUIProvider>
    </QueryClientProvider>
  )
}
