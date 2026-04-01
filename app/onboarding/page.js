'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

// ─── TYPEWRITER COMPONENT ───────────────────────────────────────
function Typewriter({ onDone }) {
  const [display, setDisplay] = useState('')
  const [phase, setPhase] = useState('typing1')
  const [name, setName] = useState('there')

useEffect(() => {
  const stored = JSON.parse(localStorage.getItem('auron_temp') || '{}')
  if (stored.name) setName(stored.name)
}, [])

  const line1 = `Hi, ${name}!`
  const line2 = "Let's figure out what your dream future looks like."

  useEffect(() => {
    let timeout

    if (phase === 'typing1') {
      if (display.length < line1.length) {
        timeout = setTimeout(() => {
          setDisplay(line1.slice(0, display.length + 1))
        }, 55)
      } else {
        timeout = setTimeout(() => setPhase('pause1'), 1200)
      }
    }

    if (phase === 'pause1') {
      timeout = setTimeout(() => setPhase('erasing'), 300)
    }

    if (phase === 'erasing') {
      if (display.length > 0) {
        timeout = setTimeout(() => {
          setDisplay(display.slice(0, -1))
        }, 30)
      } else {
        timeout = setTimeout(() => setPhase('typing2'), 300)
      }
    }

    if (phase === 'typing2') {
      if (display.length < line2.length) {
        timeout = setTimeout(() => {
          setDisplay(line2.slice(0, display.length + 1))
        }, 45)
      } else {
        timeout = setTimeout(() => setPhase('done'), 600)
      }
    }

    if (phase === 'done') {
      onDone()
    }

    return () => clearTimeout(timeout)
  }, [display, phase])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F0E8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '20px' }}>
        <h1 style={{
          fontSize: '42px',
          color: '#3D1F00',
          minHeight: '60px',
          lineHeight: '1.3'
        }}>
          {display}
          <span style={{
            borderRight: '3px solid #3D1F00',
            marginLeft: '2px',
            animation: 'blink 1s infinite'
          }} />
        </h1>
        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  )
}

// ─── STYLES (reused everywhere) ──────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: '#F5F0E8',
    fontFamily: 'Georgia, serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '540px',
    boxShadow: '0 4px 24px hsla(0, 0%, 0%, 0.08)'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#8B6A50',
    marginBottom: '6px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid hsla(0, 0%, 0%, 0.08)',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'Georgia, serif',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '20px',
    color: '#3d1f00'     
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid hsla(0, 0%, 0%, 0.08)',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'Georgia, serif',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '20px',
    background: 'white',
    color: '#3d1f00'
  },
  btn: {
    width: '100%',
    background: '#3D1F00',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    marginTop: '8px'
  },
  btnBack: {
    width: '100%',
    background: 'transparent',
    color: '#8B6A50',
    border: '1px solid #DDD',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '15px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    marginTop: '10px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3D1F00',
    marginBottom: '8px'
  },
  sub: {
    fontSize: '14px',
    color: '#8B6A50',
    marginBottom: '28px',
    lineHeight: '1.6'
  },
  progress: {
    display: 'flex',
    gap: '6px',
    marginBottom: '32px'
  }
}

// ─── PROGRESS BAR ────────────────────────────────────────────────
function Progress({ step, total }) {
  return (
    <div style={S.progress}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1,
          height: '4px',
          borderRadius: '2px',
          background: i <= step ? '#3D1F00' : '#DDD',
          transition: 'background 0.3s'
        }} />
      ))}
    </div>
  )
}

// ─── STEP 1: ACADEMIC PROFILE ────────────────────────────────────
function StepAcademic({ data, onChange, onNext }) {
  return (
    <div style={S.page}>
      <div style={S.card}>
        <Progress step={0} total={5} />
        <div style={S.title}>Your academic profile</div>
        <div style={S.sub}>Tell Auron about where you are right now.</div>

        <label style={S.label}>Branch / Degree</label>
        <select
          style={S.select}
          value={data.branch}
          onChange={e => onChange('branch', e.target.value)}>
          <option value="">Select your branch</option>
          <option>Computer Science Engineering</option>
          <option>AI & Data Science</option>
          <option>Electronics & Communication</option>
          <option>Mechanical Engineering</option>
          <option>Civil Engineering</option>
          <option>Electrical Engineering</option>
          <option>Information Technology</option>
          <option>Other</option>
        </select>

        <label style={S.label}>Current Semester</label>
        <select
          style={S.select}
          value={data.semester}
          onChange={e => onChange('semester', e.target.value)}>
          <option value="">Select semester</option>
          {[1,2,3,4,5,6,7,8].map(s => (
            <option key={s}>Semester {s}</option>
          ))}
        </select>

        <label style={S.label}>CGPA</label>
        <input
          style={S.input}
          type="number"
          step="0.1"
          min="0"
          max="10"
          placeholder="e.g. 7.8"
          value={data.cgpa}
          onChange={e => onChange('cgpa', e.target.value)}
        />

        <label style={S.label}>Expected passout</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            style={{ ...S.select, flex: 1 }}
            value={data.passoutMonth}
            onChange={e => onChange('passoutMonth', e.target.value)}>
            <option value="">Month</option>
            {['January','February','March','April','May','June',
              'July','August','September','October','November','December'
            ].map(m => <option key={m}>{m}</option>)}
          </select>
          <select
            style={{ ...S.select, flex: 1 }}
            value={data.passoutYear}
            onChange={e => onChange('passoutYear', e.target.value)}>
            <option value="">Year</option>
            {[2025,2026,2027,2028,2029].map(y => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        <label style={S.label}>College tier</label>
        <select
          style={S.select}
          value={data.tier}
          onChange={e => onChange('tier', e.target.value)}>
          <option value="">Select tier</option>
          <option value="1">Tier 1 — IIT / NIT / BITS</option>
          <option value="2">Tier 2 — Good private/state college</option>
          <option value="3">Tier 3 — Other colleges</option>
        </select>

        <button style={S.btn} onClick={() => {
          if (!data.branch || !data.semester || !data.cgpa || !data.passoutYear) {
            alert('Please fill all fields')
            return
          }
          onNext()
        }}>
          Continue →
        </button>
      </div>
    </div>
  )
}

// ─── STEP 2: SKILLS ──────────────────────────────────────────────
const SKILL_OPTIONS = [
  'Python', 'Java', 'C/C++', 'JavaScript', 'SQL',
  'Machine Learning', 'Deep Learning', 'Data Structures & Algorithms',
  'System Design', 'React', 'Node.js', 'Cloud (AWS/GCP/Azure)',
  'Computer Networks', 'Operating Systems', 'DBMS',
  'Communication', 'Leadership', 'Problem Solving',
  'Research', 'Statistics & Math'
]

function StepSkills({ data, onChange, onNext, onBack }) {
  const [selected, setSelected] = useState(data.skills || {})

  function toggleSkill(skill) {
    const updated = { ...selected }
    if (updated[skill]) {
      delete updated[skill]
    } else {
      updated[skill] = 3
    }
    setSelected(updated)
    onChange('skills', updated)
  }

  function setConfidence(skill, val) {
    const updated = { ...selected, [skill]: parseInt(val) }
    setSelected(updated)
    onChange('skills', updated)
  }

  const confidenceLabels = ['', 'Heard of it', 'Basics only', 'Can use it', 'Comfortable', 'Can teach it']

  return (
    <div style={{ ...S.page, justifyContent: 'flex-start', paddingTop: '60px' }}>
      <div style={{ ...S.card, maxWidth: '600px' }}>
        <Progress step={1} total={5} />
        <div style={S.title}>What skills do you have?</div>
        <div style={S.sub}>
          Click to select skills. Then rate how confident you are in each one.
        </div>

        {/* Skill chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
          {SKILL_OPTIONS.map(skill => (
            <div
              key={skill}
              onClick={() => toggleSkill(skill)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: selected[skill] ? '2px solid #3D1F00' : '1px solid #DDD',
                background: selected[skill] ? '#F5F0E8' : 'white',
                cursor: 'pointer',
                fontSize: '14px',
                color: selected[skill] ? '#3D1F00' : '#666',
                fontWeight: selected[skill] ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}>
              {selected[skill] ? '✓ ' : ''}{skill}
            </div>
          ))}
        </div>

        {/* Confidence sliders for selected skills */}
        {Object.keys(selected).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#8B6A50', marginBottom: '16px', fontWeight: 'bold' }}>
              Rate your confidence in each selected skill:
            </div>
            {Object.keys(selected).map(skill => (
              <div key={skill} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', color: '#3D1F00' }}>{skill}</span>
                  <span style={{ fontSize: '13px', color: '#8B6A50' }}>
                    {confidenceLabels[selected[skill]]}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={selected[skill]}
                  onChange={e => setConfidence(skill, e.target.value)}
                  style={{ width: '100%', accentColor: '#3D1F00' }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: '#BBB',
                  marginTop: '2px'
                }}>
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button style={S.btn} onClick={() => {
          if (Object.keys(selected).length === 0) {
            alert('Please select at least one skill')
            return
          }
          onNext()
        }}>
          Continue →
        </button>
        <button style={S.btnBack} onClick={onBack}>← Back</button>
      </div>
    </div>
  )
}

// ─── STEP 3: DREAM FUTURE ────────────────────────────────────────
function StepDream({ data, onChange, onNext, onBack }) {
  return (
    <div style={S.page}>
      <div style={S.card}>
        <Progress step={2} total={5} />
        <div style={S.title}>What does your dream future look like?</div>
        <div style={S.sub}>
          Be honest. Auron won't judge you — it will help you get there.
        </div>

        <label style={S.label}>In 5 years, I want to be...</label>
        <textarea
          style={{
            ...S.input,
            minHeight: '90px',
            resize: 'vertical',
            lineHeight: '1.6'
          }}
          placeholder="e.g. Building AI products at a top tech company, or doing research at a great university, or starting my own company..."
          value={data.dreamFuture}
          onChange={e => onChange('dreamFuture', e.target.value)}
        />

        <label style={S.label}>Dream company or university (optional)</label>
        <input
          style={S.input}
          placeholder="e.g. Google, DeepMind, IIT Bombay MTech, Stanford MS..."
          value={data.dreamTarget}
          onChange={e => onChange('dreamTarget', e.target.value)}
        />

        <label style={S.label}>What matters more to you right now?</label>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {['Earning soon', 'Deep expertise first', 'Not sure yet'].map(opt => (
            <div
              key={opt}
              onClick={() => onChange('priority', opt)}
              style={{
                flex: 1,
                padding: '14px 10px',
                borderRadius: '10px',
                border: data.priority === opt ? '2px solid #3D1F00' : '1px solid #DDD',
                background: data.priority === opt ? '#F5F0E8' : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '13px',
                color: data.priority === opt ? '#3D1F00' : '#666',
                fontWeight: data.priority === opt ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}>
              {opt}
            </div>
          ))}
        </div>

        <label style={S.label}>Open to studying or working abroad?</label>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {['Yes, definitely', 'Maybe', 'No, India only'].map(opt => (
            <div
              key={opt}
              onClick={() => onChange('abroad', opt)}
              style={{
                flex: 1,
                padding: '14px 10px',
                borderRadius: '10px',
                border: data.abroad === opt ? '2px solid #3D1F00' : '1px solid #DDD',
                background: data.abroad === opt ? '#F5F0E8' : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '13px',
                color: data.abroad === opt ? '#3D1F00' : '#666',
                fontWeight: data.abroad === opt ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}>
              {opt}
            </div>
          ))}
        </div>

        <label style={S.label}>Funding preference</label>
        <select
          style={S.select}
          value={data.funding}
          onChange={e => onChange('funding', e.target.value)}>
          <option value="">Select preference</option>
          <option>Fully funded only</option>
          <option>Open to scholarships</option>
          <option>Can self-fund partially</option>
          <option>No preference</option>
        </select>

        <button style={S.btn} onClick={() => {
          if (!data.dreamFuture || !data.priority) {
            alert('Please fill your dream future and priority')
            return
          }
          onNext()
        }}>
          Continue →
        </button>
        <button style={S.btnBack} onClick={onBack}>← Back</button>
      </div>
    </div>
  )
}

// ─── STEP 4: EMAIL FOR REMINDERS ─────────────────────────────────
function StepReminders({ data, onChange, onNext, onBack }) {
  return (
    <div style={S.page}>
      <div style={S.card}>
        <Progress step={3} total={5} />
        <div style={S.title}>Stay on track</div>
        <div style={S.sub}>
          Auron will email you when milestones are approaching.
          This is what makes the plan actually work.
        </div>

        <label style={S.label}>Your email</label>
        <input
          style={S.input}
          type="email"
          placeholder="you@example.com"
          value={data.reminderEmail}
          onChange={e => onChange('reminderEmail', e.target.value)}
        />

        <label style={S.label}>How often do you want reminders?</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {[
            { val: 'weekly', label: 'Weekly digest', desc: 'One email every Sunday with your upcoming week' },
            { val: 'milestone', label: 'Milestone alerts only', desc: 'Only when a deadline is 7 days or 1 day away' },
            { val: 'daily', label: 'Daily check-in', desc: 'Short daily nudge (recommended for final year students)' }
          ].map(opt => (
            <div
              key={opt.val}
              onClick={() => onChange('reminderFreq', opt.val)}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: data.reminderFreq === opt.val ? '2px solid #3D1F00' : '1px solid #DDD',
                background: data.reminderFreq === opt.val ? '#F5F0E8' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
              <div style={{
                fontWeight: 'bold',
                color: data.reminderFreq === opt.val ? '#3D1F00' : '#333',
                fontSize: '14px',
                marginBottom: '3px'
              }}>
                {opt.label}
              </div>
              <div style={{ fontSize: '12px', color: '#8B6A50' }}>{opt.desc}</div>
            </div>
          ))}
        </div>

        <button style={S.btn} onClick={() => {
          if (!data.reminderEmail || !data.reminderFreq) {
            alert('Please enter your email and reminder preference')
            return
          }
          onNext()
        }}>
          Generate my roadmap →
        </button>
        <button style={S.btnBack} onClick={onBack}>← Back</button>
      </div>
    </div>
  )
}

// ─── STEP 5: GENERATING (loading screen) ─────────────────────────
function StepGenerating() {
  const messages = [
    'Analysing your profile...',
    'Mapping your skill gaps...',
    'Checking what top companies look for...',
    'Building your personalised roadmap...',
    'Almost there...'
  ]
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F0E8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid #DDD',
        borderTop: '3px solid #3D1F00',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#3D1F00', fontSize: '18px', textAlign: 'center' }}>
        {messages[msgIndex]}
      </p>
    </div>
  )
}

// ─── MAIN ONBOARDING ORCHESTRATOR ────────────────────────────────
export default function Onboarding() {
  const router = useRouter()
  const [phase, setPhase] = useState('typewriter')
  const [step, setStep] = useState(0)
  const [generating, setGenerating] = useState(false)

  const tempData = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('auron_temp') || '{}')
    : {}

  const [profile, setProfile] = useState({
    // From landing page
    name: tempData.name || '',
    college: tempData.college || '',
    cgpa: tempData.cgpa || '',
    // Academic step
    branch: '',
    semester: '',
    passoutMonth: '',
    passoutYear: '',
    tier: '',
    // Skills step
    skills: {},
    // Dream step
    dreamFuture: '',
    dreamTarget: '',
    priority: '',
    abroad: '',
    funding: '',
    // Reminders step
    reminderEmail: '',
    reminderFreq: ''
  })

  function update(key, val) {
    setProfile(prev => ({ ...prev, [key]: val }))
  }

  async function handleFinish() {
    setGenerating(true)

    try {
      // 1. Get current logged-in user from Supabase Auth
      const { data: { user } } = await supabase.auth.getUser()

// If no logged in user, use email from form as fallback for testing
const userEmail = user?.email || profile.reminderEmail
const userId = user?.id || crypto.randomUUID()

const { data: savedUser, error: userError } = await supabase
  .from('users')
  .upsert({
    id: userId,
    email: userEmail,
    name: profile.name,
    college: profile.college,
    branch: profile.branch,
    cgpa: parseFloat(profile.cgpa),
    passout_date: `${profile.passoutYear}-05-01`,
    chosen_path: 'pending'
  })
  .select()
  .single()

if (userError) {
  console.error('User save error FULL:', JSON.stringify(userError, null, 2))
  throw userError
}


      // 3. Save skills to user_skills table
      const skillInserts = Object.entries(profile.skills).map(([skillName, confidence]) => ({
        user_id: userId,
        skill_name: skillName,
        confidence: confidence
      }))

      if (skillInserts.length > 0) {
        await supabase.from('user_skills').insert(skillInserts)
      }

      // 4. Call our API route to generate roadmap with Claude
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          profile: {
            name: profile.name,
            branch: profile.branch,
            semester: profile.semester,
            cgpa: profile.cgpa,
            passoutYear: profile.passoutYear,
            tier: profile.tier,
            skills: profile.skills,
            dreamFuture: profile.dreamFuture,
            dreamTarget: profile.dreamTarget,
            priority: profile.priority,
            abroad: profile.abroad,
            funding: profile.funding
          }
        })
      })

      if (!response.ok) {
        console.error('API failed, continuing with fallback')
      }

      // 5. Clear temp data and go to dashboard
      localStorage.removeItem('auron_temp')
      router.push('/dashboard')

    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
      setGenerating(false)
    }
  }

  if (generating) return <StepGenerating />

  if (phase === 'typewriter') {
    return <Typewriter onDone={() => setPhase('steps')} />
  }

  const steps = [
    <StepAcademic
      key="academic"
      data={profile}
      onChange={update}
      onNext={() => setStep(1)}
    />,
    <StepSkills
      key="skills"
      data={profile}
      onChange={update}
      onNext={() => setStep(2)}
      onBack={() => setStep(0)}
    />,
    <StepDream
      key="dream"
      data={profile}
      onChange={update}
      onNext={() => setStep(3)}
      onBack={() => setStep(1)}
    />,
    <StepReminders
      key="reminders"
      data={profile}
      onChange={update}
      onNext={handleFinish}
      onBack={() => setStep(2)}
    />
  ]

  return steps[step]
} 