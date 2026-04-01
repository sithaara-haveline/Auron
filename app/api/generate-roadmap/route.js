import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { userId, profile } = await request.json()

    // Build the prompt — this is where Auron's intelligence lives
    const skillSummary = Object.entries(profile.skills)
      .map(([skill, confidence]) => {
        const labels = ['', 'heard of it', 'basics only', 'can use it', 'comfortable', 'can teach it']
        return `${skill}: ${labels[confidence]}`
      })
      .join(', ')

const prompt = `You are Auron, an expert AI career strategist for Indian engineering students.

A student has shared their profile with you. Your job is to:
1. Decide if they should pursue Masters or Placements (or explain why it is genuinely unclear)
2. Generate a detailed, personalised semester-by-semester roadmap
You MUST generate a highly practical, realistic roadmap. No generic advice.

STUDENT PROFILE:
- Name: ${profile.name}
- Branch: ${profile.branch}
- Semester: ${profile.semester}
- CGPA: ${profile.cgpa}
- Tier: ${profile.tier}
- Passout Year: ${profile.passoutYear}
- Skills: ${skillSummary}
- Dream: ${profile.dreamFuture}
- Target: ${profile.dreamTarget || 'Not specified'}
- Priority: ${profile.priority}
- Abroad: ${profile.abroad}
- Funding: ${profile.funding}

RULES:
- Be brutally practical, not motivational
- Then generate 6-10 roadmap milestones. Each milestone must be specific, not generic advice.
- Each milestone must be SPECIFIC and ACTIONABLE
- Mention exact tools, technologies, or exams where relevant
- Avoid generic phrases like "improve skills"
- Spread milestones realistically over time until ${profile.passoutYear}
- Focus on outcomes that improve job or masters chances
- For skill gaps: name the exact skill, why it matters for their specific dream target, and suggest one free resource (preferably NPTEL or YouTube).
- Give a frank, honest recommendation first (Masters or Placements) with 2-3 specific reasons based on THIS student's actual profile. Do not be generic.
- Categories must be one of: technical, project, career, soft, exam, application

Return ONLY valid JSON:

{
  "recommendation": "Masters" | "Placements" | "Unclear",
  "reasoning": "2-3 lines specific to THIS student",
  "milestones": [
    {
      "milestone_title": "Specific action (e.g. Build a CNN-based image classifier using TensorFlow)",
      "description": "Explain exactly what to do and why it matters",
      "due_date": "YYYY-MM-DD",
      "category": "technical",
      "status": "pending",
      "version": 1
    }
  ]
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })

    const responseText = message.content[0].text

    // Extract JSON safely
    const jsonStart = responseText.indexOf('{')
    const jsonEnd = responseText.lastIndexOf('}') + 1
    const cleanJson = responseText.slice(jsonStart, jsonEnd)

    const parsed = JSON.parse(cleanJson)

    // Save recommendation to Users table
    await supabase
      .from('users')
      .update({ chosen_path: parsed.recommendation })
      .eq('id', userId)

    // Delete old roadmap, insert new
    await supabase.from('roadmap').delete().eq('user_id', userId)

    const milestones = parsed.milestones.map(m => ({
      ...m,
      user_id: userId
    }))

    await supabase.from('roadmap').insert(milestones)

    return Response.json({
      success: true,
      recommendation: parsed.recommendation,
      reasoning: parsed.reasoning
    })

  } catch (error) {
    console.error('Roadmap generation error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
