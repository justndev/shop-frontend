'use client'

import { useEffect } from 'react'
import { useAuthHook } from '@/src/modules/auth/useAuthHook'
import { useShopHook } from '@/src/hooks/useShopHook'

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const { initializeAuth } = useAuthHook()
  const { fetchProducts, fetchCategories } = useShopHook()

  // useEffect(() => {
  //   initializeAuth()
  //   fetchCategories()
  //   fetchProducts({})
  // }, [])

  return <>{children}</>
}
