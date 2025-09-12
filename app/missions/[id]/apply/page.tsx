"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ApplyPageProps {
  params: {
    id: string
  }
}

export default function ApplyPage({ params }: ApplyPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const missionId = params.id

  // Données fictives de la mission
  const mission = {
    id: missionId,
    title: "Développement d'une application web React",
    company: "TechSolutions SA",
    duration: "3 mois",
    location: "Remote",
    pricing: "550€ - 600€ / jour",
    skills: ["React", "TypeScript", "API REST", "Redux"],
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulation d'envoi de candidature
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Candidature envoyée !",
        description: "Votre candidature a été transmise à l'entreprise. Vous recevrez une réponse sous 48h.",
      })
      router.push("/dashboard/freelance")
    }, 2000)
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/missions/${missionId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la mission
            </Link>
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Résumé de la mission */}
          <Card>
            <CardHeader>
              <CardTitle>Candidature pour : {mission.title}</CardTitle>
              <CardDescription>{mission.company}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">Durée</span>
                  <p className="font-medium">{mission.duration}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Lieu</span>
                  <p className="font-medium">{mission.location}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Tarif</span>
                  <p className="font-medium">{mission.pricing}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Compétences</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mission.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mission.skills.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{mission.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de candidature */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de candidature</CardTitle>
                <CardDescription>
                  Présentez-vous et expliquez pourquoi vous êtes le candidat idéal pour cette mission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dailyRate">Votre taux journalier (€)</Label>
                    <Input id="dailyRate" type="number" placeholder="550" min="0" required className="w-full" />
                    <p className="text-xs text-muted-foreground">Indiquez votre tarif pour cette mission</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="availability">Disponibilité</Label>
                    <Input id="availability" placeholder="Immédiatement / À partir du..." required className="w-full" />
                    <p className="text-xs text-muted-foreground">Quand pouvez-vous commencer ?</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="motivation">Lettre de motivation</Label>
                  <Textarea
                    id="motivation"
                    placeholder="Expliquez pourquoi vous êtes intéressé par cette mission et en quoi votre profil correspond aux besoins..."
                    className="min-h-32"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Décrivez votre expérience pertinente et votre motivation (minimum 100 caractères)
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="experience">Expérience pertinente</Label>
                  <Textarea
                    id="experience"
                    placeholder="Décrivez vos projets similaires, vos réalisations et votre expertise dans les technologies demandées..."
                    className="min-h-24"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  Ajoutez votre CV et tout document pertinent pour appuyer votre candidature
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="cv">CV (obligatoire)</Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" className="w-full sm:w-auto bg-transparent">
                      <Upload className="mr-2 h-4 w-4" />
                      Télécharger mon CV
                    </Button>
                    <span className="text-sm text-muted-foreground">PDF, DOC, DOCX - 5MB max</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="portfolio">Portfolio / Exemples de travaux (optionnel)</Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" className="w-full sm:w-auto bg-transparent">
                      <Upload className="mr-2 h-4 w-4" />
                      Ajouter des fichiers
                    </Button>
                    <span className="text-sm text-muted-foreground">Images, PDF - 10MB max par fichier</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="portfolioLinks">Liens vers vos réalisations</Label>
                  <Input
                    id="portfolioLinks"
                    placeholder="https://github.com/votre-profil, https://votre-portfolio.com"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    GitHub, portfolio en ligne, projets déployés... (séparez par des virgules)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations complémentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="questions">Questions ou commentaires</Label>
                  <Textarea
                    id="questions"
                    placeholder="Avez-vous des questions sur la mission ? Des points à clarifier ?"
                    className="min-h-20"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="terms" required className="rounded" />
                  <Label htmlFor="terms" className="text-sm">
                    Je confirme que les informations fournies sont exactes et j'accepte les{" "}
                    <Link href="/terms" className="text-violet-600 hover:underline">
                      conditions d'utilisation
                    </Link>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button type="button" variant="outline" asChild>
                <Link href={`/missions/${missionId}`}>Annuler</Link>
              </Button>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer ma candidature
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
