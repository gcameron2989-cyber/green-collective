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

  if (!open && !isOpen) return null

  const handleSave = async () => {
    if (onSubmit) {
      await onSubmit({ categoryId: category, note })
    }
    onClose?.()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl p-6 max-w-md w-full space-y-4 border shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" /> Log Eco Action
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-accent text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Action Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2.5 border rounded-xl bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-600"
          >
            <option value="transit">Public Transit / Biking</option>
            <option value="waste">Composting / Zero Waste Purchase</option>
            <option value="energy">Energy Efficiency Action</option>
          </select>

          <label className="text-xs font-semibold text-muted-foreground uppercase">Notes (Optional)</label>
          <input
            type="text"
            placeholder="e.g., Rode bike to Kits Beach"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2.5 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-accent">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">
            Log Action
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogActionModal
