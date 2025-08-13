"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Github,
  ArrowRight,
  Heart,
  Shield,
  Zap,
  Users
} from "lucide-react"

const footerLinks = {
  product: {
    title: "Produto",
    links: [
      { label: "Recursos", href: "#recursos" },
      { label: "Templates", href: "/documents/templates" },
      { label: "Preços", href: "#plans" },
      { label: "Demonstração", href: "/demo" },
      { label: "API", href: "/api/docs" }
    ]
  },
  solutions: {
    title: "Soluções",
    links: [
      { label: "Para Candidatos", href: "/solutions/candidates" },
      { label: "Para Empresas", href: "/solutions/companies" },
      { label: "Para Recrutadores", href: "/solutions/recruiters" },
      { label: "Para Universidades", href: "/solutions/universities" }
    ]
  },
  resources: {
    title: "Recursos",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Guias", href: "/guides" },
      { label: "Centro de Ajuda", href: "/help" },
      { label: "Comunidade", href: "/community" },
      { label: "Webinars", href: "/webinars" }
    ]
  },
  company: {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "/about" },
      { label: "Carreiras", href: "/careers" },
      { label: "Imprensa", href: "/press" },
      { label: "Contato", href: "/contact" },
      { label: "Parceiros", href: "/partners" }
    ]
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacidade", href: "/privacy" },
      { label: "Termos de Uso", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
      { label: "LGPD", href: "/lgpd" },
      { label: "Segurança", href: "/security" }
    ]
  }
}

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/carreirapro", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/carreirapro", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/carreirapro", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/carreirapro", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/carreirapro", label: "GitHub" }
]

const stats = [
  { icon: Users, value: "10K+", label: "Usuários ativos" },
  { icon: Zap, value: "95%", label: "Taxa aprovação ATS" },
  { icon: Shield, value: "100%", label: "Dados seguros" },
  { icon: Heart, value: "4.9/5", label: "Satisfação" }
]

const badges = [
  { text: "SOC 2 Compliant", variant: "secondary" as const },
  { text: "LGPD Certificado", variant: "secondary" as const },
  { text: "ISO 27001", variant: "secondary" as const }
]

export function ModernFooter() {
  return (
    <footer className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 border-t">
      {/* Newsletter Section */}
      <div className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">
                Fique por dentro das novidades
              </h3>
              <p className="text-muted-foreground">
                Receba dicas de carreira, novas funcionalidades e conteúdo exclusivo 
                direto no seu email. Sem spam, apenas valor.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                          <IconComponent className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                      </div>
                      <div className="text-sm font-semibold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="seu@email.com"
                  className="bg-background/50 border-border/50"
                />
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white group">
                  <Mail className="h-4 w-4" />
                  Assinar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Ao assinar, você concorda com nossa{" "}
                <Link href="/privacy" className="underline hover:text-foreground">
                  Política de Privacidade
                </Link>
                . Cancele a qualquer momento.
              </p>

              {/* Security Badges */}
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <Badge key={index} variant={badge.variant} className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {badge.text}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Link href="/" className="font-bold text-2xl">
                Carreira Pro
              </Link>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                A plataforma completa para criar currículos profissionais com IA, 
                analisar vagas e gerenciar candidaturas.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:contato@carreirapro.com" className="hover:text-primary">
                  contato@carreirapro.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href="tel:+5511999999999" className="hover:text-primary">
                  (11) 9 9999-9999
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-background/50 hover:bg-accent flex items-center justify-center transition-colors group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h4 className="font-semibold text-sm">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Carreira Pro. Todos os direitos reservados.
              <br className="md:hidden" />
              <span className="hidden md:inline"> • </span>
              Feito com <Heart className="h-3 w-3 inline text-red-500 mx-1" /> no Brasil
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacidade
              </Link>
              <Link 
                href="/terms" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Termos
              </Link>
              <Link 
                href="/cookies" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookies
              </Link>
              <div className="text-muted-foreground">
                v2.1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}