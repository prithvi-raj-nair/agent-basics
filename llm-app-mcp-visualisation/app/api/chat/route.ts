import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { model, messages, tools } = body

    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4o-mini',
      messages,
      tools,
      temperature: 0.7,
    })

    return NextResponse.json(completion)
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to call OpenAI API' },
      { status: 500 }
    )
  }
}
