"use client"

import dynamic from 'next/dynamic'

const ModernLayoutExample = dynamic(
  () => import("@/components/modern-layout-example"),
  { ssr: false }
)

export default function DemoPage() {
  return <ModernLayoutExample />
}