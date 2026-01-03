'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/verify')
      const data = await res.json()
      setAuthenticated(data.authenticated)
    } catch (error) {
      setAuthenticated(false)
    }
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!authenticated) {
    return <LoginForm onSuccess={checkAuth} />
  }

  return <AdminDashboard />
}

