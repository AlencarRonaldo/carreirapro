"use client"

import { usePathname } from "next/navigation"
import HeaderClient from "./header-client"

export function ConditionalHeader() {
  const pathname = usePathname()
  
  // Oculta header na landing (HTML próprio) para não sobrepor o tema/menu custom
  if (pathname === "/" || pathname === "/landing") {
    return null
  }
  
  return <HeaderClient />
}