'use client'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { AuronChat } from '@/components/dashboard/AuronChat'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E8' }}>
      {/* Sidebar - always visible */}
      <DashboardSidebar />
      
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
      
      {/* Chat widget */}
      <AuronChat />
    </div>
  )
}
