import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, userId }: { prompt: string; userId: string } = await req.json()

    if (!prompt || !userId) {
      return NextResponse.json({ error: 'Missing prompt or userId' }, { status: 400 })
    
    }

    const webhookURL = 'https://ibraheem123.app.n8n.cloud/webhook/generate-recipe'

    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error('Webhook error')
    }

    const data = await response.json()

    return NextResponse.json({
      recipe: data.recipe || 'No recipe returned',
    })
  } catch (error) {
    console.error('Route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
