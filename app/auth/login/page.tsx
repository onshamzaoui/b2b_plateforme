"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"freelance" | "entreprise" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      setError("Email ou mot de passe incorrect")
      setIsLoading(false)
      return
    }

    // Récupère la session pour savoir le rôle
    const sessionRes = await fetch("/api/auth/session")
    const session = await sessionRes.json()

    if (session?.user?.role === "ENTREPRISE") {
      router.push("/dashboard/entreprise")
    } else if (session?.user?.role === "FREELANCE") {
      router.push("/dashboard/freelance")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Entrez vos identifiants pour accéder à votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@domaine.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              Se souvenir de moi
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vous n&apos;avez pas de compte?{" "}
            <Link
              href="/auth/signup"
              className="text-violet-600 hover:underline dark:text-violet-400"
            >
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
