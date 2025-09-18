"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, User, LogOut, ChevronDown, Building } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"

export default function MainNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const { data: session, status } = useSession()

  const isLoggedIn = !!session
  const userType = session?.user?.role?.toLowerCase() as "freelance" | "entreprise" | null

  const routes = [
    { href: "/", label: "Accueil", public: true },
    { href: "/dashboard/freelance", label: "Tableau de bord", public: false, type: "freelance" },
    { href: "/dashboard/entreprise", label: "Tableau de bord", public: false, type: "entreprise" },
    { href: "/missions", label: "Missions", public: true },
    { href: "/applications", label: "Mes candidatures", public: false, type: "freelance" },
    { href: "/contracts", label: "Mes contrats", public: false },
    { href: "/invoices", label: "Mes factures", public: false },
    { href: "/tarifs", label: "Tarifs", public: true },
  ]

  const filteredRoutes = routes.filter(
    (route) => route.public || (isLoggedIn && (!route.type || route.type === userType)),
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="flex items-center font-bold text-xl" onClick={() => setIsOpen(false)}>
                FreelanceConnect
              </Link>
              <div className="mt-8 flex flex-col gap-4">
                {filteredRoutes.map((route) => (
                  <Button
                    key={route.href}
                    asChild
                    variant="ghost"
                    className={cn("justify-start", pathname === route.href && "bg-accent text-accent-foreground")}
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={route.href}>{route.label}</Link>
                  </Button>
                ))}
                {isLoggedIn ? (
                  <>
                    <div className="px-2 py-1.5 border-b">
                      <p className="text-sm font-medium">{session?.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                    </div>
                    <Button asChild variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Mon profil
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start text-red-600 hover:text-red-600"
                      onClick={() => {
                        setIsOpen(false)
                        signOut({ callbackUrl: "/" })
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                      <Link href="/auth/login">Connexion</Link>
                    </Button>
                    <Button asChild className="justify-start" onClick={() => setIsOpen(false)}>
                      <Link href="/auth/signup">Inscription</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center font-bold text-xl">
            Freelance<span className="text-violet-600 dark:text-violet-400 ml-1 font-light">Connect</span>
          </Link>
          <nav className="hidden lg:flex items-center space-x-6 ml-10">
            {filteredRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden lg:flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                      {session?.user?.role === "FREELANCE" ? <User className="h-4 w-4 text-violet-600 dark:text-violet-400" /> : <Building className="h-4 w-4 text-violet-600 dark:text-violet-400" />}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{session?.user?.name}</span>
                      <span className="text-xs text-muted-foreground">{session?.user?.role === "FREELANCE" ? "Freelance" : "Entreprise"}</span>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden lg:flex">
                <Link href="/auth/login">Connexion</Link>
              </Button>
              <Button asChild size="sm" className="hidden lg:flex">
                <Link href="/auth/signup">Inscription</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
