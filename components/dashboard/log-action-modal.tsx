import React from "react"

export interface LoggedAction {
  categoryId: string
  note?: string
}

interface LogActionModalProps {
  open?: boolean
  isOpen?: boolean
  onClose?: () => void
  onSubmit?: (action: LoggedAction) => Promise<void> | void
}

export function LogActionModal({ open, isOpen, onClose }: LogActionModalProps) {
  if (!open && !isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-xl p-6 max-w-md w-full space-y-4 border shadow-lg">
        <h3 className="font-semibold text-lg">Log Sustainable Action</h3>
        <p className="text-sm text-muted-foreground">Record your habit or local purchase here.</p>
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogActionModal
