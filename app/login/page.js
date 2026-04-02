'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:3000/onboarding'
      }
    })
    
    if (error) {
      alert('Something went wrong: ' + error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/onboarding'
      }
    })
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F0E8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3D1F00' }}>
            auron
          </div>
          <p style={{ color: '#8B6A50', marginTop: '8px' }}>
            Sign in to continue
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', color: '#3D1F00' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📬</div>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Check your email
            </p>
            <p style={{ color: '#8B6A50', fontSize: '14px' }}>
              We sent a magic link to <strong>{email}</strong>. 
              Click it to sign in — no password needed.
            </p>
          </div>
        ) : (
          <>
            <button
            onClick={handleGoogle}
            style={{
              width: '100%',
              padding: '13px',
              border: '1px solid #DDD',
              borderRadius: '10px',
              background: 'white',
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#3D1F00' 
            }}>
              <span style={{ color: '#3D1F00', fontWeight: 'bold' }}>G</span>Continue with Google
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#EEE' }} />
              <span style={{ color: '#8B6A50', fontSize: '13px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#EEE' }} />
            </div>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #DDD',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontFamily: 'Georgia, serif',
                  marginBottom: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  color: '#3D1F00'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: '#3D1F00',
                  color: 'white',
                  border: 'none',
                  padding: '13px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif'
                }}>
                {loading ? 'Sending...' : 'Send magic link →'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}