"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface LogActionModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function LogActionModal({ open, isOpen, onClose }: LogActionModalProps) {
  const router = useRouter();
  const visible = open ?? isOpen ?? false;

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-6 border shadow-2xl relative z-10 text-[#102f26]">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#39705d]">Green Collective</span>
            <h3 className="font-bold text-xl">Log Verified Eco Actions</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-[#526760] leading-relaxed">
          Ready to log precise commute distances, choose dual community-faculty attribution, and batch multiple sustainability actions? Head over to our full Action Registry.
        </p>

        <div className="flex gap-3 pt-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="w-1/2 py-3 border border-gray-300 rounded-full text-xs font-bold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => {
              onClose?.();
              router.push('/[log-action](https://github.com/gcameron2989-cyber/green-collective/tree/main)');
            }}
            className="w-1/2 py-3 bg-[#102f26] text-white rounded-full text-xs font-bold hover:bg-[#39705d] transition shadow"
          >
            Open Action Registry →
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogActionModal;
