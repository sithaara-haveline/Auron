import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@supabase/supabase-js"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  let userId = null
  try {
    const { userId, profile } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })
    const skillSummary = Object.entries(profile.skills || {})
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

INSTRUCTIONS:
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

PROFILE:
    ${JSON.stringify(profile)}

Return ONLY valid JSON in this exact format, no other text:
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

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    console.log("GEMINI RAW:", text)

    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}') + 1
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd))

    await supabase
      .from('Users')
      .update({ chosen_path: parsed.recommendation })
      .eq('id', userId)

    await supabase.from('roadmap').delete().eq('user_id', userId)

    const milestones = parsed.milestones.map(m => ({
      ...m,
      user_id: userId
    }))

    await supabase.from('roadmap').insert(milestones)

    return Response.json({ success: true })

  } catch (error) {
    console.error("GEMINI ERROR:", error)
    await supabase.from('roadmap').insert([
    {
      user_id: userId,
      milestone_title: "Fallback milestone",
      description: "AI failed, but system is working",
      due_date: "2026-01-01",
      category: "technical",
      status: "pending",
      version: 1
    }
  ])
    return Response.json({
      success: true,
      fallback: true,
      recommendation: "Unclear",
      reasoning: "AI failed, showing default roadmap",
      milestones: [
        {
          milestone_title: "Build 2 projects",
          description: "Focus on practical work",
          due_date: "2026-12-01",
          category: "project",
          status: "pending",
          version: 1
        }
      ]
    })
  }
}
