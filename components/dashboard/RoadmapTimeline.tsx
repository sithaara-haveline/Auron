'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { groupBySemester } from "@/app/lib/roadmap"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RoadmapTimeline() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data: user } = await supabase.auth.getUser()

    if (!user?.user?.id) return

    const { data: milestones } = await supabase
      .from('roadmap')
      .select('*')
      .eq('user_id', user.user.id)
      .order('due_date')

    setData(groupBySemester(milestones || []))
  }

  return (
    <div className="space-y-6">
      {data.map((sem, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <h2 className="font-bold text-lg text-[var(--color-caramel)]">
            {sem.semester}
          </h2>

          <div className="mt-4 space-y-3">
            {sem.milestones.map((m: any) => (
              <div key={m.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{m.milestone_title}</h3>
                <p className="text-sm text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}