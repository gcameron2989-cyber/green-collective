'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface LogActionParams {
  actionId: string;
  sector: string;
  affiliationType: string;
  affiliationName: string;
  quantity: number;
  notes?: string;
}

export async function logUserAction(params: LogActionParams) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('You must be signed in to log an action.')
  }

  const { actionId, sector, affiliationType, affiliationName, quantity, notes } = params

  if (!actionId || !sector || !affiliationType || !affiliationName) {
    throw new Error('Missing required action fields.')
  }

  // 2. Insert into Supabase database
  const { error } = await supabase.from('logged_actions').insert({
    user_id: user.id,
    action_id: actionId,
    sector,
    affiliation_type: affiliationType,
    affiliation_name: affiliationName,
    quantity,
    notes: notes || '',
  })

  if (error) {
    throw new Error(error.message)
  }

  // 3. Revalidate paths to update global points/leaderboards
  revalidatePath('/actions')
  revalidatePath('/dashboard')
  revalidatePath('/profile')

  return { success: true }
}
