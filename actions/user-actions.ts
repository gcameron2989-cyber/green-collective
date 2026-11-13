'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type AffiliationType = 'neighbourhood' | 'association' | 'company' | 'faculty' | 'other'

export interface BatchActionItem {
  actionId: string
  quantity: number
  distanceKm?: number // Added distance support for commuting/travel actions
  notes?: string
}

export interface LogBatchActionsInput {
  items: BatchActionItem[]
  sector: 'public' | 'campus'
  affiliationType: AffiliationType
  affiliationName: string
}

export async function logBatchUserActions(input: LogBatchActionsInput) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('You must be logged in to record actions.')
  }

  const { items, sector, affiliationType, affiliationName } = input

  if (!items || items.length === 0) {
    throw new Error('No actions selected to log.')
  }

  if (!sector || !affiliationType || !affiliationName) {
    throw new Error('Please select both a sector and a specific affiliation.')
  }

  // 2. Prepare multi-row payload (including optional distance tracking in notes)
  const rowsToInsert = items.map((item) => {
    let formattedNotes = item.notes || ''
    if (item.distanceKm && item.distanceKm > 0) {
      formattedNotes = formattedNotes 
        ? `${formattedNotes} | Distance: ${item.distanceKm} km` 
        : `Distance: ${item.distanceKm} km`
    }

    return {
      user_id: user.id,
      action_id: item.actionId,
      sector: sector,
      affiliation_type: affiliationType,
      affiliation_name: affiliationName,
      quantity: item.quantity || 1,
      notes: formattedNotes,
      created_at: new Date().toISOString(),
    }
  })

  const { error } = await supabase.from('logged_actions').insert(rowsToInsert)

  if (error) {
    throw new Error(error.message)
  }

  // 3. Revalidate cached routes
  revalidatePath('/actions')
  revalidatePath('/dashboard')
  revalidatePath('/profile')
  revalidatePath('/competition')

  return { success: true, count: items.length }
}
