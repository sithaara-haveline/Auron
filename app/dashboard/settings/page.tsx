'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Settings as SettingsIcon, Bell, LogOut, User, Save, AlertCircle, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [userEmail, setUserEmail] = useState('')
  const [reminderFreq, setReminderFreq] = useState('weekly')
  const [savedMessage, setSavedMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        setUser(authUser)
        setUserEmail(authUser.email || '')
        loadSettings(authUser.id)
      } else {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSettings = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (data && data.reminder_frequency) {
        setReminderFreq(data.reminder_frequency)
      }
    } catch (error) {
      // Table might not exist or no record, that's ok
      console.log('No preferences found, using defaults')
    }
  }

  const saveSettings = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          reminder_frequency: reminderFreq,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error && error.code !== 'PGRST301') throw error

      setMessageType('success')
      setSavedMessage('✓ Settings saved successfully!')
      setTimeout(() => setSavedMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessageType('error')
      setSavedMessage('Error saving settings')
      setTimeout(() => setSavedMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div style={{ marginLeft: '280px', padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #ede9e3', borderTop: '3px solid var(--color-caramel)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'var(--color-warm-greige)' }}>Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginLeft: '280px', padding: '40px 48px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <SettingsIcon size={32} color="var(--color-caramel)" />
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-caramel)', margin: 0 }}>
            Settings
          </h1>
        </div>
        <p style={{ color: 'var(--color-warm-greige)', fontSize: 15 }}>
          Manage your preferences and account settings
        </p>
      </div>

      {/* Settings Cards */}
      <div style={{ display: 'grid', gap: 24 }}>
        {/* Profile Section */}
        <div style={{
          background: 'white',
          border: '1px solid var(--color-card-border)',
          borderRadius: 12,
          padding: 32
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-caramel)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={20} /> Account Information
          </h2>
          
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-warm-greige)',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Email Address
            </label>
            <div style={{
              padding: '12px 14px',
              background: '#f7f5f0',
              borderRadius: 8,
              color: 'var(--color-caramel)',
              fontSize: 14,
              fontWeight: 500
            }}>
              {userEmail}
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-warm-greige)', marginTop: 8 }}>
              This is your registered email address. Contact support to change it.
            </p>
          </div>
        </div>

        {/* Preferences Section */}
        <div style={{
          background: 'white',
          border: '1px solid var(--color-card-border)',
          borderRadius: 12,
          padding: 32
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-caramel)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={20} /> Notification Preferences
          </h2>
          
          <div style={{ marginBottom: 32 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-warm-greige)',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Reminder Frequency
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { value: 'daily', label: 'Daily', description: 'Get reminded every day' },
                { value: 'weekly', label: 'Weekly', description: 'Get reminded once a week' },
                { value: 'milestone', label: 'Milestone', description: 'Get reminded when milestones are due' },
                { value: 'never', label: 'Never', description: 'Disable all reminders' }
              ].map(option => (
                <label key={option.value} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 8,
                  background: reminderFreq === option.value ? 'rgba(101,53,15,0.08)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="radio"
                    name="reminder"
                    value={option.value}
                    checked={reminderFreq === option.value}
                    onChange={(e) => setReminderFreq(e.target.value)}
                    style={{
                      width: 20,
                      height: 20,
                      cursor: 'pointer',
                      accentColor: 'var(--color-caramel)'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-caramel)' }}>
                      {option.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-warm-greige)' }}>
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {savedMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 8,
              background: messageType === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: messageType === 'success' ? '#047857' : '#dc2626',
              marginBottom: 16,
              fontSize: 13
            }}>
              {messageType === 'success' ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {savedMessage}
            </div>
          )}

          <button
            onClick={saveSettings}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: 'var(--color-caramel)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 600,
              opacity: isSaving ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

        {/* Danger Zone */}
        <div style={{
          background: 'white',
          border: '1px solid #fee2e2',
          borderRadius: 12,
          padding: 32,
          backgroundColor: '#fef2f2'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', marginBottom: 16 }}>
            Danger Zone
          </h2>
          
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#b91c1c'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#dc2626'
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
