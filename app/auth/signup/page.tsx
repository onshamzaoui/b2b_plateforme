"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [userType, setUserType] = useState<"freelance" | "entreprise" | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "freelance" || type === "entreprise") {
      setUserType(type)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation d'inscription
    setTimeout(() => {
      setIsLoading(false)
      if (userType) {
        router.push(`/dashboard/${userType}`)
      }
    }, 1500)
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Créer un compte</h1>
          <p className="text-gray-500 dark:text-gray-400">Inscrivez-vous pour accéder à la plateforme</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <p className="text-sm text-center">Je m&apos;inscris en tant que :</p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={userType === "freelance" ? "default" : "outline"}
                className={userType === "freelance" ? "bg-violet-600 hover:bg-violet-700" : ""}
                onClick={() => setUserType("freelance")}
              >
                Freelance
              </Button>
              <Button
                type="button"
                variant={userType === "entreprise" ? "default" : "outline"}
                className={userType === "entreprise" ? "bg-violet-600 hover:bg-violet-700" : ""}
                onClick={() => setUserType("entreprise")}
              >
                Entreprise
              </Button>
            </div>
          </div>

          {userType === "entreprise" && (
            <div className="grid gap-2">
              <Label htmlFor="company">Nom de l&apos;entreprise</Label>
              <Input id="company" type="text" placeholder="Votre entreprise" required />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" type="text" placeholder="Prénom" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" type="text" placeholder="Nom" required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="exemple@domaine.com" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input id="confirmPassword" type="password" required />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm font-normal">
              J&apos;accepte les{" "}
              <Link href="/terms" className="text-violet-600 hover:underline dark:text-violet-400">
                conditions d&apos;utilisation
              </Link>{" "}
              et la{" "}
              <Link href="/privacy" className="text-violet-600 hover:underline dark:text-violet-400">
                politique de confidentialité
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={isLoading || !userType}>
            {isLoading ? "Création en cours..." : "Créer mon compte"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vous avez déjà un compte?{" "}
            <Link href="/auth/login" className="text-violet-600 hover:underline dark:text-violet-400">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
