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
  sector: 'public' | 'campus'
  affiliationType: AffiliationType
  affiliationName: string
}

export async function logBatchUserActions(input: LogBatchActionsInput) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('You must be logged in to record actions.')
  }

  const { items, sector, affiliationType, affiliationName } = input

  if (!items || items.length === 0) {
    throw new Error('No actions selected to log.')
  }

  // Anti-Spam Safeguards: Validate max quantity and cap distance inputs
  const rowsToInsert = items.map((item) => {
    const safeQty = Math.min(50, Math.max(1, item.quantity || 1))
    let safeDistance = item.distanceKm ? Math.min(200, Math.max(1, item.distanceKm)) : undefined

    let formattedNotes = item.notes || ''
    if (safeDistance) {
      formattedNotes = formattedNotes 
        ? `${formattedNotes} | Distance: ${safeDistance} km` 
        : `Distance: ${safeDistance} km`
    }

    let calculatedPoints = item.points || 25
    if (item.actionId === 'transit-commute' && safeDistance) {
      calculatedPoints = Math.round(15 + safeDistance * 1.8)
    } else if (item.actionId === 'ev-charging-shared' && safeDistance) {
      calculatedPoints = Math.round(30 + safeDistance * 2.0)
    }

    return {
      user_id: user.id,
      action_id: item.actionId,
      action_name: item.actionTitle || item.actionId,
      points: calculatedPoints * safeQty,
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
    throw new Error(error.message)
  }

  revalidatePath('/[log-action](https://github.com/gcameron2989-cyber/green-collective/tree/main/app/log-action)')
  revalidatePath('/[competition](https://app.revyl.ai/apps/60d263cb-98ec-486a-b8b9-a9924c9310b5/tests)')
  revalidatePath('/[profile](https://www.greencollective.ca/profile)')

  return { success: true, count: items.length }
}
