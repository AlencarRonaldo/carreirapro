"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { getAuthStatus, clearAuthenticationState, validateAuthentication } from "@/lib/auth-utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

export default function HeaderClient() {
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const status = getAuthStatus()
        
        if (status === 'expired') {
          setIsValidating(true)
          const isValid = await validateAuthentication()
          setAuthed(isValid)
          setIsValidating(false)
        } else {
          setAuthed(status === 'authenticated')
        }
      } catch {
        setAuthed(false)
        setIsValidating(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const handleAuthChange = (event: CustomEvent) => {
      setAuthed(event.detail.authenticated)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-state-changed', handleAuthChange as EventListener)
      return () => {
        window.removeEventListener('auth-state-changed', handleAuthChange as EventListener)
      }
    }
  }, [pathname])

  function onLogout() {
    setAuthed(false)
    clearAuthenticationState("/")
  }

  const onLoginPage = pathname === "/login"

  const navItems = [
    { href: "/landing", label: "Início" },
    { href: "/profile", label: "Perfil" },
    { href: "/documents", label: "Currículos" },
    { href: "/documents/templates", label: "Templates" },
    { href: "/cover-letters", label: "Cartas" },
    { href: "/jobs", label: "Vagas" },
    { href: "/applications", label: "Aplicações" },
  ]
  // Após login, não exibe o item "Início"
  const visibleNavItems = authed ? navItems.filter(i => i.href !== "/") : []

  const NavLink = ({ href, label, mobile = false, onClick = () => {} }: { 
    href: string; 
    label: string; 
    mobile?: boolean;
    onClick?: () => void;
  }) => (
    <Link 
      href={href}
      onClick={onClick}
      className={mobile 
        ? "flex items-center justify-center min-h-[44px] px-4 py-3 rounded-md text-foreground hover:text-primary hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95 active:bg-accent/80"
        : "hidden md:flex items-center min-h-[44px] px-4 py-2 text-sm text-foreground hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
      }
    >
      {label}
    </Link>
  )

  return (
    <header className="w-full border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link href="/landing" className="font-bold text-lg text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm">
            Carreira Pro
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {authed && visibleNavItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {mounted && (
            <span
              className="hidden md:inline text-xs text-muted-foreground select-none"
              aria-live="polite"
              title={`Tema atual: ${resolvedTheme ?? ''}`}
            >
              Tema: {resolvedTheme ?? "-"}
            </span>
          )}
          
          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isValidating ? (
              <span className="text-sm text-muted-foreground">Validando...</span>
            ) : authed ? (
              <Button 
                onClick={onLogout} 
                variant="ghost"
                size="sm"
                className="min-h-[44px] px-4 active:scale-95"
              >
                Sair
              </Button>
            ) : (
              !onLoginPage && (
                <a href="/login" className="inline-flex">
                  <Button variant="outline" size="sm" className="min-h-[44px] px-6">Login</Button>
                </a>
              )
            )}
          </div>

          {/* Mobile Menu Trigger */}
          {authed && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden min-h-[44px] min-w-[44px] active:scale-95"
                  aria-label="Abrir menu de navegação"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  {visibleNavItems.map((item) => (
                    <NavLink 
                      key={item.href} 
                      href={item.href} 
                      label={item.label} 
                      mobile={true}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  ))}
                  
                  {/* Mobile Auth Actions */}
                  <div className="border-t mt-4 pt-4 space-y-2">
                    {isValidating ? (
                      <div className="text-center py-3 text-sm text-muted-foreground">
                        Validando...
                      </div>
                    ) : authed ? (
                      <Button 
                        onClick={() => {
                          onLogout()
                          setMobileMenuOpen(false)
                        }} 
                        variant="outline"
                        className="w-full min-h-[44px] active:scale-95"
                      >
                        Sair
                      </Button>
                    ) : (
                      !onLoginPage && (
                        <a href="/login" className="inline-flex w-full">
                          <Button variant="outline" className="w-full min-h-[44px]">Login</Button>
                        </a>
                      )
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}



