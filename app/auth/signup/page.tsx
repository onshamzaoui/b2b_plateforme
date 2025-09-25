"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

function SignupContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [userType, setUserType] = useState<"freelance" | "entreprise" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "freelance" || type === "entreprise") {
      setUserType(type)
    }
  }, [searchParams])

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const form = e.target as HTMLFormElement
  const formData = new FormData(form)

  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    userType,
    company: formData.get("company"),
  }

  if (data.password !== data.confirmPassword) {
    toast({
      title: "Erreur",
      description: "Les mots de passe ne correspondent pas",
      variant: "destructive",
    })
    setIsLoading(false)
    return
  }

  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (res.ok) {
    setIsSigningIn(true)
    try {
      // Automatically sign in the user after successful registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        // Show success message and redirect to dashboard
        toast({
          title: "Succès",
          description: "Compte créé et connexion réussie !",
        })
        router.push(`/dashboard/${userType}`)
      } else {
        // If auto-signin fails, redirect to login page
        toast({
          title: "Compte créé",
          description: "Votre compte a été créé avec succès. Veuillez vous connecter.",
        })
        router.push("/auth/login")
      }
    } catch (signInError) {
      console.error("Erreur lors de la connexion automatique:", signInError)
      // If auto-signin fails due to error, redirect to login page
      toast({
        title: "Compte créé",
        description: "Votre compte a été créé avec succès. Veuillez vous connecter.",
      })
      router.push("/auth/login")
    }
    setIsSigningIn(false)
  } else {
    const error = await res.json()
    toast({
      title: "Erreur",
      description: error.error || "Erreur lors de l'inscription",
      variant: "destructive",
    })
  }

  setIsLoading(false)
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
              <Input id="company" name="company"type="text" placeholder="Votre entreprise" required />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" name="firstName" type="text" placeholder="Prénom" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" type="text" placeholder="Nom" required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="exemple@domaine.com" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
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

          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={isLoading || isSigningIn || !userType}>
            {isLoading ? "Création en cours..." : isSigningIn ? "Connexion en cours..." : "Créer mon compte"}
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

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-md mx-auto py-10">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Créer un compte</h1>
            <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}
