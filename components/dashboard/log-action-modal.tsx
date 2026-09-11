import React, { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'

export interface LoggedAction {
  categoryId: string
  note?: string
}

export interface LogActionModalProps {
  open?: boolean
  isOpen?: boolean
  onClose?: () => void
  onSubmit?: (action: LoggedAction) => Promise<void> | void
}

export function LogActionModal({ open, isOpen, onClose, onSubmit }: LogActionModalProps) {
  const [category, setCategory] = useState('transit')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const visible = open ?? isOpen ?? false
  if (!visible) return null

  const handleSave = async () => {
    try {
      setSubmitting(true)
      if (onSubmit) {
        await onSubmit({ categoryId: category, note })
      }
      onClose?.()
    } catch (err) {
      console.error('Failed to log action:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div className="bg-card text-card-foreground rounded-2xl p-6 max-w-md w-full space-y-4 border shadow-xl relative z-10 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" /> Log Eco Action
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1">
              Action Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border rounded-xl bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
            >
              <option value="transit">Public Transit / Biking</option>
              <option value="waste">Composting / Zero Waste Purchase</option>
              <option value="energy">Energy Efficiency Action</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Rode bike to Kits Beach"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            disabled={submitting}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Log Action'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogActionModal
