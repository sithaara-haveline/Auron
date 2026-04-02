'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { motion } from 'framer-motion'
import { MessageCircle, Send, Loader2 } from 'lucide-react'
import type { AuthUser } from '@/lib/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login'
    }
  }, [user, authLoading])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages,
            userMessage
          ],
          context: `User: ${user.email}`
        })
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to get response from API'
        throw new Error(errorMsg)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Chat error:', error?.message || error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error?.message || 'Unable to connect to Auron. Please check your API key and try again.'}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={32} color="var(--color-caramel)" />
          <p style={{ marginTop: '16px', color: 'var(--color-warm-greige)' }}>Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F5F0E8', marginLeft: '280px' }}>
      {/* Header */}
      <div style={{ padding: '24px 40px', borderBottom: '1px solid #ede9e3', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MessageCircle size={24} color="var(--color-caramel)" />
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-caramel)', margin: 0 }}>
            Chat with Auron
          </h1>
        </div>
        <p style={{ color: 'var(--color-warm-greige)', marginTop: '4px', fontSize: '14px' }}>
          Ask AI questions about your career roadmap, skills, or next steps
        </p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <MessageCircle size={48} color="var(--color-warm-greige)" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--color-warm-greige)', fontSize: '16px' }}>
              Start a conversation with Auron. Ask about your roadmap, skill gaps, or career goals.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '8px'
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: msg.role === 'user' ? 'var(--color-caramel)' : 'white',
                color: msg.role === 'user' ? 'white' : 'var(--color-caramel)',
                border: msg.role === 'user' ? 'none' : '1px solid #ede9e3',
                fontSize: '14px',
                lineHeight: '1.6',
                wordWrap: 'break-word'
              }}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--color-warm-greige)',
              animation: 'pulse 1.5s infinite'
            }} />
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--color-warm-greige)',
              animation: 'pulse 1.5s infinite',
              animationDelay: '0.2s'
            }} />
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--color-warm-greige)',
              animation: 'pulse 1.5s infinite',
              animationDelay: '0.4s'
            }} />
            <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        style={{
          padding: '20px 40px',
          borderTop: '1px solid #ede9e3',
          background: 'white',
          display: 'flex',
          gap: '12px'
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Auron anything..."
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #ede9e3',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            backgroundColor: '#fafaf9'
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() && !loading ? 'var(--color-caramel)' : '#ddd',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          <Send size={16} />
          Send
        </button>
      </form>
    </div>
  )
}
