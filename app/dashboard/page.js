'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [roadmap, setRoadmap] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('roadmap')
        .select('*')

      setRoadmap(data || [])
    }

    fetchData()
  }, [])

  return (
    <div style={{ padding: '40px' }}>
      <h1>Dashboard</h1>

      {roadmap.length === 0 ? (
        <p>No roadmap found</p>
      ) : (
        roadmap.map((m, i) => (
          <div key={i} style={{ marginBottom: '20px' }}>
            <h3>{m.milestone_title}</h3>
            <p>{m.description}</p>
          </div>
        ))
      )}
    </div>
  )
}