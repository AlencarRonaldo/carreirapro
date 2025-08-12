"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { 
  Menu, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  FolderOpen,
  Home,
  ChevronDown
} from "lucide-react"

import { getAuthStatus, clearAuthenticationState, validateAuthentication } from "@/lib/auth-utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Visão geral da sua conta"
  },
  {
    title: "Perfil",
    href: "/profile", 
    icon: User,
    description: "Gerencie suas informações pessoais"
  },
  {
    title: "Documentos",
    href: "/documents",
    icon: FileText,
    description: "Seus currículos e documentos gerados",
    submenu: [
      {
        title: "Currículos Gerados",
        href: "/documents",
        description: "Visualize e gerencie seus currículos"
      },
      {
        title: "Templates",
        href: "/documents/templates",
        description: "Explore modelos profissionais"
      }
    ]
  },
  {
    title: "Cartas",
    href: "/cover-letters",
    icon: MessageSquare,
    description: "Cartas de apresentação personalizadas"
  },
  {
    title: "Vagas",
    href: "/jobs",
    icon: Briefcase,
    description: "Analise vagas com IA"
  },
  {
    title: "Aplicações",
    href: "/applications",
    icon: FolderOpen,
    description: "Acompanhe suas candidaturas"
  }
]

const searchData = [
  { id: "profile", title: "Perfil", href: "/profile" },
  { id: "documents", title: "Currículos", href: "/documents" },
  { id: "templates", title: "Templates", href: "/documents/templates" },
  { id: "cover-letters", title: "Cartas de Apresentação", href: "/cover-letters" },
  { id: "jobs", title: "Vagas", href: "/jobs" },
  { id: "applications", title: "Aplicações", href: "/applications" },
  { id: "plans", title: "Planos", href: "/plans" },
  { id: "settings", title: "Configurações", href: "/settings" }
]

export default function ModernResponsiveHeader() {
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  // Search hotkey
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  function onLogout() {
    setAuthed(false)
    clearAuthenticationState("/")
  }

  const onLoginPage = pathname === "/login"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="hidden sm:block">Carreira Pro</span>
            </Link>

            {/* Desktop Navigation */}
            {authed && (
              <nav className="hidden lg:flex">
                <NavigationMenu>
                  <NavigationMenuList>
                    {navigation.map((item) => (
                      <NavigationMenuItem key={item.href}>
                        {item.submenu ? (
                          <>
                            <NavigationMenuTrigger className="h-9 bg-transparent">
                              <item.icon className="mr-2 h-4 w-4" />
                              {item.title}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                              <div className="grid gap-3 p-4 w-[400px]">
                                <div className="grid gap-1">
                                  <h4 className="text-sm font-medium leading-none">{item.title}</h4>
                                  <p className="text-xs text-muted-foreground">{item.description}</p>
                                </div>
                                <div className="grid gap-2">
                                  {item.submenu.map((subItem) => (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    >
                                      <div className="text-sm font-medium leading-none">{subItem.title}</div>
                                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                        {subItem.description}
                                      </p>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </NavigationMenuContent>
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              "h-9 bg-transparent",
                              pathname === item.href && "bg-accent text-accent-foreground"
                            )}
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.title}
                          </Link>
                        )}
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </nav>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {authed && (
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 p-0 lg:h-9 lg:w-64 lg:justify-start lg:px-3 lg:py-2"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline-flex">Buscar...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Section */}
            {isValidating ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                <span className="hidden sm:block">Validando...</span>
              </div>
            ) : authed ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/user.png" alt="User" />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">Usuário</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            user@example.com
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          Perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/plans">
                          <Settings className="mr-2 h-4 w-4" />
                          Planos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden">
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader>
                        <SheetTitle className="text-left">Menu</SheetTitle>
                      </SheetHeader>
                      
                      {/* User Info */}
                      <div className="flex items-center gap-3 py-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/avatars/user.png" alt="User" />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Usuário</p>
                          <p className="text-xs text-muted-foreground">user@example.com</p>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Mobile Navigation */}
                      <nav className="grid gap-2">
                        {navigation.map((item) => (
                          <div key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href && "bg-accent text-accent-foreground"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <item.icon className="h-4 w-4" />
                              {item.title}
                            </Link>
                            {item.submenu && (
                              <div className="ml-7 mt-2 grid gap-1">
                                {item.submenu.map((subItem) => (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={cn(
                                      "block rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                      pathname === subItem.href && "bg-accent text-accent-foreground"
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {subItem.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </nav>

                      <Separator className="my-4" />

                      {/* Mobile Actions */}
                      <div className="grid gap-2">
                        <Link href="/plans" className="inline-flex">
                          <Button variant="ghost" className="justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Planos
                          </Button>
                        </Link>
                        <Button variant="ghost" className="justify-start" onClick={onLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Sair
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              !onLoginPage && (
                <Link href="/login" className="inline-flex">
                  <Button size="sm">Entrar</Button>
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Digite um comando ou pesquise..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            {searchData.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  setSearchOpen(false)
                  window.location.href = item.href
                }}
              >
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  )
}