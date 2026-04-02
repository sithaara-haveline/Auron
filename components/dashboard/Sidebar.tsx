'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, Map, TrendingDown, BookOpen, Settings, MessageCircle, LogOut } from 'lucide-react'
import type { AuthUser, Milestone } from '@/lib/types'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Map, label: 'My Roadmap', path: '/dashboard/roadmap' },
  { icon: TrendingDown, label: 'Skills', path: '/dashboard/skills' },
  { icon: MessageCircle, label: 'Chat', path: '/dashboard/chat' },
  { icon: BookOpen, label: 'Resources', path: '/dashboard/resources' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          user_metadata: authUser.user_metadata,
          app_metadata: authUser.app_metadata
        })

        const { data } = await supabase
          .from('roadmap')
          .select('*')
          .eq('user_id', authUser.id)

        setMilestones(data || [])
      }
    }
    load()
  }, [])

  const completed = milestones.filter(m => m.status === 'completed').length
  const score = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside style={{
      width: '280px',
      minHeight: '100vh',
      borderRight: '1px solid var(--color-sidebar-border)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-sidebar)',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--color-caramel)'
        }} />
        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-caramel)' }}>
          Auron
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path === '/dashboard' && pathname === '/dashboard')
          return (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                backgroundColor: isActive ? 'var(--color-sidebar-accent)' : 'transparent',
                color: isActive ? 'var(--color-caramel)' : 'var(--color-warm-greige)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '14px'
              }}
            >
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div style={{
        paddingTop: '16px',
        borderTop: '1px solid var(--color-sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-caramel)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 600
          }}>
            {userName?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-caramel)' }}>
              {userName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-warm-greige)' }}>
              Score: {score}%
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-card-border)',
            background: 'transparent',
            color: 'var(--color-warm-greige)',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(101,53,15,0.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}