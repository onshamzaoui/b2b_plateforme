"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function MainNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false) // Simulation de login
  const [userType, setUserType] = React.useState<"freelance" | "entreprise" | null>(null) // Simulation de type

  // Démonstration: Vous souhaiterez remplacer ceci par une vérification d'authentification réelle
  React.useEffect(() => {
    // Simulation de détection d'authentification
    const checkAuth = () => {
      if (pathname.includes("/dashboard")) {
        setIsLoggedIn(true)
        setUserType(pathname.includes("freelance") ? "freelance" : "entreprise")
      }
    }
    checkAuth()
  }, [pathname])

  const routes = [
    { href: "/", label: "Accueil", public: true },
    { href: "/missions", label: "Missions", public: true },
    { href: "/tarifs", label: "Tarifs", public: true },
    { href: "/dashboard/freelance", label: "Tableau de bord", public: false, type: "freelance" },
    { href: "/dashboard/entreprise", label: "Tableau de bord", public: false, type: "entreprise" },
  ]

  const filteredRoutes = routes.filter(
    (route) => route.public || (isLoggedIn && (!route.type || route.type === userType)),
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
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
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center font-bold text-xl">
            FreelanceConnect
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
            <Button asChild variant="ghost" size="sm" className="hidden lg:flex">
              <Link href="/profile">Mon profil</Link>
            </Button>
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
