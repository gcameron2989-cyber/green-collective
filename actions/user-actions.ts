'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface LogActionInput {
  actionId: string
  sector: 'public' | 'campus'
  affiliationType: 'neighbourhood' | 'association' | 'company' | 'faculty'
  affiliationName: string
  quantity: number
  notes?: string
}

export async function logUserAction(input: LogActionInput) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('You must be logged in to record an action.')
  }

  const { actionId, sector, affiliationType, affiliationName, quantity, notes } = input

  if (!actionId || !sector || !affiliationType || !affiliationName) {
    throw new Error('Please select both a sector and a specific neighbourhood/faculty.')
  }

  // 2. Insert into Supabase table with exact selected affiliation name (e.g. "Kitsilano")
  const { error } = await supabase.from('logged_actions').insert({
    user_id: user.id,
    action_id: actionId,
    sector: sector, // 'public' | 'campus'
    affiliation_type: affiliationType, // 'neighbourhood' | 'faculty' etc.
    affiliation_name: affiliationName, // e.g., 'Kitsilano' instead of profile fallback
    quantity: quantity || 1,
    notes: notes || '',
    created_at: new Date().toISOString(),
  })

  if (error) {
    throw new Error(error.message)
  }

  // 3. Revalidate paths
  revalidatePath('/actions')
  revalidatePath('/dashboard')
  revalidatePath('/profile')

  return { success: true }
}
