import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { userId, recipe } = await req.json()

  if (!userId || !recipe) {
    return NextResponse.json({ error: 'Missing userId or recipe' }, { status: 400 })
  }

 
  const { error } = await supabase.from('recipes').insert([{ user_id: userId, recipe }])


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Recipe saved successfully' })
}
