import { useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  Avatar,
  AvatarFallback,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@blinkdotnew/ui'
import {
  LayoutDashboard,
  Calendar,
  Users,
  DoorOpen,
  LogOut,
  PanelLeft,
  Home,
  Heart,
  LogIn,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'
import { blink } from '../blink/client'

const SIDEBAR_KEY = 'sidebar_collapsed'

interface NavItemDef {
  href: string
  icon: ReactNode
  label: string
}

function NavItem({ item, collapsed }: { item: NavItemDef; collapsed: boolean }) {
  const router = useRouterState()
  const isActive = router.location.pathname === item.href

  const link = (
    <Link
      to={item.href}
      className={cn(
        'flex items-center gap-2.5 rounded-md text-sm transition-all duration-200 cursor-pointer',
        collapsed ? 'justify-center w-8 h-8 mx-auto' : 'px-3 py-2 w-full',
        isActive
          ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,245,255,0.3)] font-medium'
          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
      )}
    >
      <span className="shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  )
  if (!collapsed) return link
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}

export function AppSidebarShell() {
  const { user, isAuthenticated } = useAuth()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(SIDEBAR_KEY) === 'true'
  })

  const toggle = useCallback(() => {
    setCollapsed(v => {
      const next = !v
      localStorage.setItem(SIDEBAR_KEY, String(next))
      return next
    })
  }, [])

  const publicItems: NavItemDef[] = [
    { href: '/', icon: <Home className="h-4 w-4" />, label: 'Discover' },
    { href: '/favorites', icon: <Heart className="h-4 w-4" />, label: 'My Schedule' },
  ]

  const adminItems: NavItemDef[] = [
    { href: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Dashboard' },
    { href: '/admin/events', icon: <Calendar className="h-4 w-4" />, label: 'Manage Events' },
    { href: '/admin/speakers', icon: <Users className="h-4 w-4" />, label: 'Speakers' },
    { href: '/admin/rooms', icon: <DoorOpen className="h-4 w-4" />, label: 'Rooms' },
  ]

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'flex flex-col h-full bg-[#050606] border-r border-white/5 overflow-hidden',
          'transition-[width] duration-300 ease-in-out shrink-0',
          collapsed ? 'w-[4rem]' : 'w-[16.5rem]'
        )}
      >
        {/* Header */}
        {/* Header */}
<div
  className={cn(
    'flex items-center gap-3 shrink-0 h-[64px] px-4',
    collapsed && 'justify-center px-2'
  )}
>
  {!collapsed && (
    <div className="flex items-center gap-2 flex-1">
      {/* On ajoute onClick={toggle} et cursor-pointer ici */}
      <button
        onClick={toggle}
        className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-black font-black text-lg shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:opacity-80 transition-opacity"
      >
        E
      </button>
      <span className="font-bold text-lg tracking-tight text-white">EventSync</span>
    </div>
  )}

  {collapsed && (
    /* Même chose pour la version réduite */
    <button
      onClick={toggle}
      className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-black font-black text-lg shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:opacity-80 transition-opacity"
    >
      E
    </button>
  )}

  {!collapsed && (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-muted-foreground hover:text-white hover:bg-white/5"
      onClick={toggle}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  )}
</div>

        {/* Navigation */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6">
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-50">
                Explore
              </p>
            )}
            {publicItems.map(item => (
              <NavItem key={item.href} item={item} collapsed={collapsed} />
            ))}
          </div>

          {isAuthenticated && (
            <div className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3" /> Admin
                </p>
              )}
              {adminItems.map(item => (
                <NavItem key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={cn('shrink-0 p-3 space-y-2 border-t border-white/5 bg-black/20')}>
          {isAuthenticated ? (
            <>
              {!collapsed && (
                <div className="flex items-center gap-3 px-2 py-2 mb-2">
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarFallback className="bg-muted text-xs font-bold">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.displayName || 'Admin'}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full text-muted-foreground hover:text-white hover:bg-white/5",
                  collapsed ? "justify-center p-0 h-10" : "justify-start px-3 gap-3"
                )}
                onClick={() => blink.auth.logout()}
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Logout</span>}
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              className={cn(
                "w-full bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,245,255,0.2)]",
                collapsed ? "justify-center p-0 h-10" : "justify-start px-3 gap-3"
              )}
              onClick={() => blink.auth.login()}
            >
              <LogIn className="h-4 w-4" />
              {!collapsed && <span>Admin Login</span>}
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
