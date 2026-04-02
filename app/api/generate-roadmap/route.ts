import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import type { OnboardingProfile, Milestone } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

const model = genAI.getGenerativeModel({model: 'models/gemini-2.5-flash'})

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

interface RoadmapGenerationBody {
  userId: string
  profile: OnboardingProfile
}

interface GeminiResponse {
  recommendation: string
  reasoning: string
  milestones: Array<{
    milestone_title: string
    description: string
    due_date: string
    category: string
    status: string
    version: number
  }>
}

export async function POST(request: NextRequest) {
  let userId: string | null = null
  let parsedProfile: OnboardingProfile | null = null

  try {
    const body = (await request.json()) as RoadmapGenerationBody
    userId = body.userId
    parsedProfile = body.profile

    console.log('=== ROADMAP GENERATION START ===')
    console.log('userId:', userId)
    console.log('profile name:', parsedProfile?.name)

    if (!userId) {
      throw new Error('No userId provided in request body')
    }

    // Build skill summary
    const skillSummary = Object.entries(parsedProfile.skills || {})
      .map(([skill, confidence]) => {
        const labels = ['', 'heard of it', 'basics only', 'can use it', 'comfortable', 'can teach it']
        return `${skill}: ${labels[confidence as number] || confidence}`
      })
      .join(', ') || 'No skills listed'

    console.log('skillSummary:', skillSummary)

    // Save/update user in DB first (before AI call)
    console.log('Saving user to DB...')
    const { data: savedUser, error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        name: parsedProfile.name,
        college: parsedProfile.college,
        branch: parsedProfile.branch,
        cgpa: parseFloat(parsedProfile.cgpa) || 0,
        passout_date: `${parsedProfile.passoutYear || 2027}-05-01`,
        chosen_path: 'pending'
      }, { onConflict: 'id' })
      .select()
      .single()

    if (userError) {
      console.error('User save error details:', JSON.stringify(userError))
      // Don't throw — continue even if user save fails
    } else {
      console.log('User saved successfully:', savedUser?.id)
    }

    // Call Gemini
    console.log('Calling Gemini...')

    const prompt = `You are Auron, an AI career advisor for Indian engineering students.

STUDENT PROFILE:
- Name: ${parsedProfile.name}
- Branch: ${parsedProfile.branch}
- Semester: ${parsedProfile.semester}
- CGPA: ${parsedProfile.cgpa}
- College Tier: ${parsedProfile.tier}
- Passout Year: ${parsedProfile.passoutYear}
- Skills: ${skillSummary}
- Dream future: ${parsedProfile.dreamFuture}
- Dream target: ${parsedProfile.dreamTarget || 'Not specified'}
- Priority: ${parsedProfile.priority}
- Open to abroad: ${parsedProfile.abroad}
- Funding: ${parsedProfile.funding}

Generate a personalised career recommendation and roadmap for this specific student.

Rules:
- Be brutally practical, not motivational
- Then generate 6-10 roadmap milestones. Each milestone must be specific, not generic advice.
- Each milestone must be SPECIFIC and ACTIONABLE
- Mention exact tools, technologies, or exams where relevant
- Avoid generic phrases like "improve skills"
- Each milestone MUST include:
  - exact platform (Coursera/NPTEL/Kaggle/etc)
  - exact measurable output
  - deadline within 2–6 weeks range
- Spread milestones realistically over time until ${parsedProfile.passoutYear}
- Focus on outcomes that improve job or masters chances
- For skill gaps: name the exact skill, why it matters for their specific dream target, and suggest one free resource (preferably NPTEL or YouTube).
- Give a frank, honest recommendation first (Masters or Placements) with 2-3 specific reasons based on THIS student's actual profile. Do not be generic.
- Categories must be one of: technical, project, career, soft, exam, application


Return ONLY this JSON, no markdown, no backticks, no explanation:
{
  "recommendation": "Masters",
  "reasoning": "2-3 sentences specific to this student",
  "milestones": [
    {
      "milestone_title": "Complete DSA fundamentals on NPTEL",
      "description": "Focus on arrays, trees, graphs. Required for product company interviews.",
      "due_date": "2025-09-01",
      "category": "technical",
      "status": "pending",
      "version": 1
    }
  ]
}`

    async function callGeminiWithRetry(
      model: any,
      prompt: string,
      retries: number = 3
    ): Promise<string> {
      for (let i = 0; i < retries; i++) {
        try {
          const result = await model.generateContent(prompt)
          return result.response.text()
        } catch (err) {
          console.log(`Gemini attempt ${i + 1} failed`)

          if (i === retries - 1) throw err

          // wait before retry (1s, 2s, 3s)
          await new Promise(res => setTimeout(res, 1000 * (i + 1)))
        }
      }
      throw new Error('All Gemini retries failed')
    }

    const text = await callGeminiWithRetry(model, prompt)
    console.log('Gemini raw response (first 200 chars):', text.slice(0, 200))

    // Parse JSON — strip any markdown backticks if present
    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const jsonStart = cleaned.indexOf('{')
    const jsonEnd = cleaned.lastIndexOf('}') + 1

    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('Gemini did not return valid JSON. Raw: ' + text.slice(0, 300))
    }

    const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd)) as GeminiResponse
    console.log('Parsed recommendation:', parsed.recommendation)
    console.log('Number of milestones:', parsed.milestones?.length)

    // Update user's chosen path
    await supabase
      .from('users')
      .update({ chosen_path: parsed.recommendation })
      .eq('id', userId)

    // Delete old roadmap and insert new one
    const allowedCategories = ['technical', 'project', 'career', 'soft', 'exam', 'application']

    const milestones = parsed.milestones.map(m => {
      let category = (m.category || '').toLowerCase().trim()

      // Normalize AI output
      if (category.includes('tech')) category = 'technical'
      else if (category.includes('proj')) category = 'project'
      else if (category.includes('career')) category = 'career'
      else if (category.includes('soft')) category = 'soft'
      else if (category.includes('exam')) category = 'exam'
      else if (category.includes('apply')) category = 'application'

      // Final safety fallback
      if (!allowedCategories.includes(category)) {
        category = 'technical'
      }

      return {
        milestone_title: m.milestone_title,
        description: m.description,
        due_date: m.due_date,
        category,
        status: 'pending',
        version: 1,
        user_id: userId
      }
    })

    await supabase.from('roadmap').delete().eq('user_id', userId)
    const { error: insertError } = await supabase.from('roadmap').insert(milestones)

    if (insertError) {
      console.error('Roadmap insert error:', JSON.stringify(insertError))
      throw new Error('Failed to save roadmap: ' + insertError.message)
    }

    console.log('=== ROADMAP SAVED SUCCESSFULLY ===')

    return NextResponse.json({
      success: true,
      recommendation: parsed.recommendation,
      reasoning: parsed.reasoning
    })

  } catch (error) {
    console.error('=== ROUTE ERROR ===')
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('userId at time of error:', userId)

    // Try fallback insert if we have a userId
    if (userId) {
      console.log('Attempting fallback insert...')
      const { error: fallbackError } = await supabase.from('roadmap').insert([{
        user_id: userId,
        milestone_title: 'Start your journey',
        description: 'Auron is setting up your personalised roadmap. Check back shortly.',
        due_date: '2026-06-01',
        category: 'career',
        status: 'pending',
        version: 1
      }])

      if (fallbackError) {
        console.error('Fallback also failed:', JSON.stringify(fallbackError))
      } else {
        console.log('Fallback milestone inserted successfully')
      }
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
