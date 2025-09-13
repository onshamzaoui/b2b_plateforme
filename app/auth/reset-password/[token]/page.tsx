"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordConfirmPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const token = params.token as string

  useEffect(() => {
    // Verify token validity when component mounts
    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/reset-password/verify?token=${token}`)
        const data = await res.json()
        
        if (res.ok) {
          setIsValidToken(true)
        } else {
          setIsValidToken(false)
          toast({
            title: "Lien invalide",
            description: data.error || "Ce lien de réinitialisation est invalide ou a expiré",
            variant: "destructive",
          })
        }
      } catch (error) {
        setIsValidToken(false)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification du lien",
          variant: "destructive",
        })
      }
    }

    if (token) {
      verifyToken()
    }
  }, [token, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setIsSuccess(true)
        toast({
          title: "Succès",
          description: "Votre mot de passe a été réinitialisé avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Une erreur est survenue lors de la réinitialisation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réinitialisation",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  if (isValidToken === null) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Vérification...</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Vérification du lien de réinitialisation
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isValidToken === false) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Lien invalide</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Ce lien de réinitialisation est invalide ou a expiré
            </p>
          </div>

          <div className="text-center space-y-2">
            <Link href="/auth/reset-password">
              <Button className="w-full bg-violet-600 hover:bg-violet-700">
                Demander un nouveau lien
              </Button>
            </Link>
            
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Retour à la connexion
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Mot de passe réinitialisé</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>
          </div>

          <div className="text-center">
            <Link href="/auth/login">
              <Button className="w-full bg-violet-600 hover:bg-violet-700">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Nouveau mot de passe</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Entrez votre nouveau mot de passe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Votre nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirmez votre nouveau mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={isLoading}
          >
            {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
          </Button>
        </form>

        <div className="text-center">
          <Link href="/auth/login">
            <Button variant="ghost" className="w-full">
              Retour à la connexion
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
