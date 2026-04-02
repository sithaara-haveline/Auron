'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AuronChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m Auron, your AI career advisor. Ask me anything about your roadmap or career goals!'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: data.content
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--color-caramel)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(101,53,15,0.3)',
          zIndex: 40
        } as React.CSSProperties}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '24px',
              width: '380px',
              height: '500px',
              borderRadius: '12px',
              background: 'white',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 41,
              overflow: 'hidden'
            } as React.CSSProperties}
          >
            {/* Header */}
            <div style={{
              padding: '16px',
              background: 'var(--color-caramel)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MessageCircle size={20} />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 600 }}>Auron</h3>
                <p style={{ margin: '0', fontSize: '12px', opacity: 0.9 }}>Your AI Career Advisor</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: msg.role === 'user' ? 'var(--color-caramel)' : '#f0ede8',
                      color: msg.role === 'user' ? 'white' : '#3d1f00',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      wordWrap: 'break-word'
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#ccc', animation: 'pulse 1.5s infinite'
                  }} />
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#ccc', animation: 'pulse 1.5s infinite',
                    animationDelay: '0.2s'
                  }} />
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#ccc', animation: 'pulse 1.5s infinite',
                    animationDelay: '0.4s'
                  }} />
                  <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '12px',
              borderTop: '1px solid #ede9e3',
              display: 'flex',
              gap: '8px'
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Auron..."
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #ede9e3',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                style={{
                  padding: '10px 12px',
                  background: input.trim() && !loading ? 'var(--color-caramel)' : '#ddd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
