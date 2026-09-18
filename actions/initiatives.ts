'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInitiative(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('You must be logged in to create an initiative.')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const location = formData.get('location') as string

  if (!title || !category) {
    throw new Error('Title and category are required.')
  }

  const { error } = await supabase.from('initiatives').insert({
    title,
    description,
    category,
    location,
    user_id: user.id,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
}

export async function upvoteInitiative(initiativeId: string) {
  const supabase = await createClient()
  
  // Fetch current upvotes
  const { data: initiative, error: fetchError } = await supabase
    .from('initiatives')
    .select('upvotes')
    .eq('id', initiativeId)
    .single()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  const currentVotes = initiative?.upvotes || 0

  // Increment upvote count
  const { error } = await supabase
    .from('initiatives')
    .update({ upvotes: currentVotes + 1 })
    .eq('id', initiativeId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/initiatives')
}
