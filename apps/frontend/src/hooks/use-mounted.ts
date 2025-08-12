import { useEffect, useState } from "react"

/**
 * Hook to check if the component has mounted on the client side.
 * Useful for preventing hydration mismatches with SSR.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}