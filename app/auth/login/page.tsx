"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"freelance" | "entreprise" | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation de connexion
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
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="text-gray-500 dark:text-gray-400">Entrez vos identifiants pour accéder à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="exemple@domaine.com" required />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                href="/auth/reset-password"
                className="text-sm text-violet-600 hover:underline dark:text-violet-400"
              >
                Mot de passe oublié?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              Se souvenir de moi
            </Label>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-center">Je me connecte en tant que :</p>
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

          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={isLoading || !userType}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vous n&apos;avez pas de compte?{" "}
            <Link href="/auth/signup" className="text-violet-600 hover:underline dark:text-violet-400">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
