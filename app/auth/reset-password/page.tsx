"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setIsSubmitted(true)
        toast({
          title: "Email envoyé",
          description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
        })
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Une erreur est survenue",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Email envoyé</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Si un compte existe avec l'email <strong>{email}</strong>, vous recevrez un lien de réinitialisation de mot de passe.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Vérifiez votre boîte de réception et votre dossier spam.
            </p>
            
            <div className="text-center space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail("")
                }}
                className="w-full"
              >
                Réessayer avec un autre email
              </Button>
              
              <Link href="/auth/login">
                <Button variant="ghost" className="w-full">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Mot de passe oublié</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={isLoading}
          >
            {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vous vous souvenez de votre mot de passe?{" "}
            <Link
              href="/auth/login"
              className="text-violet-600 hover:underline dark:text-violet-400"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
