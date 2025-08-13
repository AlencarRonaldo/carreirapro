"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User, 
  Settings, 
  LogOut, 
  FileText, 
  Briefcase, 
  User2, 
  Bell,
  Search
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface NavigationItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  isActive?: (pathname: string) => boolean
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

export default function ModernHeader() {
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [userEmail, setUserEmail] = useState<string>("")

  useEffect(() => {
    try {
      const hasToken = !!localStorage.getItem("cp_token")
      setAuthed(hasToken)
      if (hasToken) {
        // In a real app, you'd decode the token or fetch user info
        setUserEmail("usuario@exemplo.com")
      }
    } catch { 
      setAuthed(false) 
    }
  }, [pathname])

  const navigationSections: NavigationSection[] = [
    {
      title: "Documentos",
      items: [
        {
          title: "Currículos Gerados",
          href: "/documents",
          icon: FileText,
          description: "Visualize e gerencie seus currículos",
          isActive: (path) => path.startsWith("/documents") && !path.includes("/templates")
        },
        {
          title: "Templates",
          href: "/documents/templates",
          icon: User2,
          description: "Escolha entre templates profissionais",
          isActive: (path) => path.includes("/templates")
        },
        {
          title: "Carta de Apresentação",
          href: "/cover-letters",
          icon: FileText,
          description: "Crie cartas personalizadas com IA",
          isActive: (path) => path.startsWith("/cover-letters")
        }
      ]
    },
    {
      title: "Carrreira",
      items: [
        {
          title: "Vagas",
          href: "/jobs",
          icon: Briefcase,
          description: "Encontre oportunidades",
          isActive: (path) => path.startsWith("/jobs")
        },
        {
          title: "Aplicações",
          href: "/applications",
          icon: User,
          description: "Acompanhe suas candidaturas",
          isActive: (path) => path.startsWith("/applications")
        }
      ]
    }
  ]

  const mainNavItems = navigationSections.flatMap(section => section.items)

  function onLogout() {
    try {
      localStorage.removeItem("cp_token")
      localStorage.removeItem("cp_refresh")
      window.location.href = "/"
    } catch {}
  }

  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase()
  }

  const onLoginPage = pathname === "/login"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl flex h-16 items-center px-4">
        {/* Logo */}
        <div className="mr-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              Carreira Pro
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {authed && (
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Documentos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {navigationSections[0].items.map((item) => (
                      <ListItem
                        key={item.href}
                        title={item.title}
                        href={item.href}
                        className={item.isActive?.(pathname) ? "bg-accent" : ""}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Carreira</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {navigationSections[1].items.map((item) => (
                      <ListItem
                        key={item.href}
                        title={item.title}
                        href={item.href}
                        className={item.isActive?.(pathname) ? "bg-accent" : ""}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/profile" legacyBehavior passHref>
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === "/profile" && "bg-accent"
                    )}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Search */}
        {authed && (
          <div className="flex-1 max-w-sm mx-4 hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Buscar templates, vagas..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-8 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        )}

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {authed ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="User avatar" />
                      <AvatarFallback className="bg-violet-100 text-violet-600">
                        {getUserInitials(userEmail)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Minha Conta</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/subscription">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Assinatura</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            !onLoginPage && (
              <Link href="/login" className="inline-flex">
                <Button variant="depth">Entrar</Button>
              </Link>
            )
          )}

          {/* Mobile Menu */}
          {authed && (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navegue pelas funcionalidades do Carreira Pro
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  {navigationSections.map((section) => (
                    <div key={section.title} className="mb-6">
                      <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                        {section.title}
                      </h4>
                      <nav className="space-y-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                              item.isActive?.(pathname) && "bg-accent"
                            )}
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.title}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"