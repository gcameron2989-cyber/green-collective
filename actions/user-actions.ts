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

const MAX_DAILY_POINTS = 250
const MAX_DAILY_ROWS = 20

export async function logBatchUserActions(input: LogBatchActionsInput) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to record actions.' }
    }

    const { items, sector, affiliationType, affiliationName } = input

    if (!items || items.length === 0) {
      return { success: false, error: 'No actions selected to log.' }
    }

    // Check rolling 24h activity for daily limit enforcement
    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: recentLogs, error: recentError } = await supabase
      .from('logged_actions')
      .select('points, points_earned')
      .eq('user_id', user.id)
      .gte('created_at', sinceIso)

    if (recentError) {
      return { success: false, error: recentError.message }
    }

    const currentDailyCount = recentLogs?.length || 0
    const currentDailyPoints = (recentLogs || []).reduce(
      (sum, row) => sum + Number(row.points_earned ?? row.points ?? 0),
      0
    )

    if (currentDailyCount + items.length > MAX_DAILY_ROWS) {
      return {
        success: false,
        error: `Daily action log limit reached (${MAX_DAILY_ROWS} entries per 24h). Try again tomorrow.`,
      }
    }

    const rowsToInsert = items.map((item) => {
      const safeQty = Math.max(1, Math.min(Number(item.quantity || 1), 5))
      const safeDistance =
        item.distanceKm !== undefined ? Math.max(1, Math.min(Number(item.distanceKm), 50)) : undefined

      // item.points is already calculated per line item on the client; cap per-row points for safety
      const rawPoints = Math.max(0, Number(item.points ?? 25))
      const calculatedPoints = Math.min(Math.round(rawPoints), 750)

      let formattedNotes = item.notes || ''
      if (safeDistance !== undefined && !formattedNotes.includes('Distance:')) {
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
        sector,
        affiliation_type: affiliationType,
        affiliation_name: affiliationName,
        quantity: safeQty,
        notes: formattedNotes,
        created_at: new Date().toISOString(),
      }
    })

    const batchPoints = rowsToInsert.reduce((sum, r) => sum + r.points, 0)
    if (currentDailyPoints + batchPoints > MAX_DAILY_POINTS) {
      return {
        success: false,
        error: `Daily point limit exceeded (${currentDailyPoints}/${MAX_DAILY_POINTS} pts used in the last 24h).`,
      }
    }

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
