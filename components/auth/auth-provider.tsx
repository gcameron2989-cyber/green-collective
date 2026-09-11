"use client"
import React, { createContext, useContext } from "react"

const AuthContext = createContext<any>({})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = {
    user: null,
    profile: null,
    activities: [],
    configured: false,
    schemaMissing: false,
    logHabit: async () => ({ error: null }),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
