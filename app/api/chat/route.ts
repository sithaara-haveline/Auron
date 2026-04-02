import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Use gemini-2.0-flash (valid, available model)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // System instruction for Auron
    const systemInstruction = `You are Auron, an AI career advisor for students. You help with career planning, skill development, interview prep, industry insights, analyzing skill gaps, recommending courses with exact names/platforms, suggesting impactful projects, and work-life balance advice. Provide practical, specific, actionable advice based on real industry demand. Be conversational, supportive, and encouraging.${context ? ' ' + context : ''}`

    // Build conversation history with system instruction prepended
    const history = [
      {
        role: 'user',
        parts: [{ text: systemInstruction }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I\'m Auron, your AI career advisor. How can I help you today?' }]
      },
      ...messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    ]

    // Get the latest user message
    const latestMessage = messages[messages.length - 1]?.content || ''
    
    if (!latestMessage) {
      return NextResponse.json(
        { error: 'No message content provided' },
        { status: 400 }
      )
    }

    // Start chat session
    const chat = model.startChat({
      history
    })

    // Send message and get response
    const result = await chat.sendMessage(latestMessage)
    const text = result.response.text()

    return NextResponse.json({
      role: 'assistant',
      content: text
    })
  } catch (error: any) {
    console.error('Chat error:', error?.message || error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
