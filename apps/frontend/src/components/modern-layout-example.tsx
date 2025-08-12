"use client"

import ModernResponsiveHeader from "@/components/modern-responsive-header"
import ModernHeroCarousel from "@/components/modern-hero-carousel"
import FeatureCards from "@/components/feature-cards"
import { Toaster } from "@/components/ui/sonner"

export default function ModernLayoutExample() {
  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <ModernResponsiveHeader />
      
      {/* Hero Section */}
      <ModernHeroCarousel />
      
      {/* Feature Cards Section */}
      <FeatureCards maxVisible={6} />
      
      {/* Footer could go here */}
      <footer className="mt-16 border-t bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 Carreira Pro. Todos os direitos reservados.
          </div>
        </div>
      </footer>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}