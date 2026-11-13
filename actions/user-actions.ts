'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type AffiliationType = 'neighbourhood' | 'association' | 'company' | 'faculty' | 'other'

export interface BatchActionItem {
  actionId: string
  actionTitle?: string
  points?: number
  quantity: number
  distanceKm?: number
  notes?: string
}

export interface LogBatchActionsInput {
  items: BatchActionItem[]
  sector: 'public' | 'community' | 'campus'
  affiliationType: AffiliationType
  affiliationName: string
}

export async function logBatchUserActions(input: LogBatchActionsInput) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to record actions.' }
    }

    const { items, sector, affiliationType, affiliationName } = input

    if (!items || items.length === 0) {
      return { success: false, error: 'No actions selected to log.' }
    }

    const rowsToInsert = items.map((item) => {
      const safeQty = Math.max(1, item.quantity || 1)
      const safeDistance = item.distanceKm !== undefined ? Math.max(0, item.distanceKm) : undefined
      const calculatedPoints = (item.points || 25) * safeQty

      let formattedNotes = item.notes || ''
      if (safeDistance !== undefined) {
        formattedNotes = formattedNotes 
          ? `${formattedNotes} | Distance: ${safeDistance} km` 
          : `Distance: ${safeDistance} km`
      }

      return {
        user_id: user.id,
        action_id: item.actionId,
        action_name: item.actionTitle || item.actionId,
        points: calculatedPoints,
        points_earned: calculatedPoints,
        sector: sector,
        affiliation_type: affiliationType,
        affiliation_name: affiliationName,
        quantity: safeQty,
        notes: formattedNotes,
        created_at: new Date().toISOString(),
      }
    })

    const { error } = await supabase.from('logged_actions').insert(rowsToInsert)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/log-action')
    revalidatePath('/competition')
    revalidatePath('/profile')

    return { success: true, count: items.length }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' }
  }
}
