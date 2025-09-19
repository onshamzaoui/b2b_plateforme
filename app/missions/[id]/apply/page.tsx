"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ArrowLeft, Send, AlertTriangle, CreditCard } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface ApplyPageProps {
  params: {
    id: string
  }
}

export default function ApplyPage({ params }: ApplyPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    currentPlan: string
    planExpiresAt: string | null
    isExpired: boolean
  } | null>(null)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true)
  const [mission, setMission] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userCvs, setUserCvs] = useState<any[]>([])
  const [selectedCvId, setSelectedCvId] = useState<string>("")
  const [hasApplied, setHasApplied] = useState(false)
  const missionId = params.id

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  // Fetch mission details
  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await fetch(`/api/missions/${missionId}`)
        if (response.ok) {
          const missionData = await response.json()
          setMission(missionData)
        } else {
          toast({
            title: "Erreur",
            description: "Mission non trouvée",
            variant: "destructive",
          })
          router.push("/missions")
        }
      } catch (error) {
        console.error("Error fetching mission:", error)
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement de la mission",
          variant: "destructive",
        })
      }
    }

    if (missionId) {
      fetchMission()
    }
  }, [missionId, router, toast])

  // Fetch user profile and CVs
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated") {
        try {
          const [profileResponse, cvsResponse, dashboardResponse, subscriptionResponse] = await Promise.all([
            fetch("/api/user/profile"),
            fetch("/api/user/cv"),
            fetch("/api/dashboard/freelance"),
            fetch("/api/user/current-plan")
          ])

          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            setUserProfile(profileData)
          }

          if (cvsResponse.ok) {
            const cvsData = await cvsResponse.json()
            setUserCvs(cvsData)
          }

          if (dashboardResponse.ok) {
            const dashboardData = await dashboardResponse.json()
            const applications = dashboardData.applications || []
            
            // Check if user has already applied to this mission
            const applied = applications.some((app: any) => app.missionId === missionId)
            setHasApplied(applied)
            
            if (applied) {
              toast({
                title: "Candidature déjà envoyée",
                description: "Vous avez déjà postulé à cette mission.",
                variant: "default",
              })
              router.push(`/missions/${missionId}`)
            }
          }

          if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json()
            setSubscriptionInfo(subscriptionData)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setIsLoading(false)
          setIsLoadingSubscription(false)
        }
      }
    }

    fetchUserData()
  }, [status, missionId, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const applicationData = {
      dailyRate: formData.get("dailyRate"),
      availability: formData.get("availability"),
      motivation: formData.get("motivation"),
      experience: formData.get("experience"),
      portfolio: formData.get("portfolioLinks") ? 
        (formData.get("portfolioLinks") as string).split(',').map(link => link.trim()).filter(link => link) : [],
      skills: userProfile?.skills || [],
      questions: formData.get("questions"),
      selectedCvId: selectedCvId
    }

    try {
      const response = await fetch(`/api/missions/${missionId}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Candidature envoyée !",
          description: "Votre candidature a été transmise à l'entreprise. Vous recevrez une réponse sous 48h.",
        })
        router.push("/dashboard/freelance")
      } else {
        // Handle payment required error
        if (response.status === 402 && result.code === "PAYMENT_REQUIRED") {
          toast({
            title: "Abonnement requis",
            description: result.error || "Vous devez avoir un abonnement actif pour postuler aux missions.",
            variant: "destructive",
          })
          // Redirect to pricing page
          setTimeout(() => {
            router.push("/tarifs")
          }, 2000)
          return
        }
        
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de l'envoi de la candidature",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi de la candidature",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || status === "loading" || isLoadingSubscription) {
    return <div className="container py-8 text-center">Chargement...</div>
  }

  if (!mission) {
    return <div className="container py-8 text-center">Mission non trouvée</div>
  }

  // Check subscription status
  if (subscriptionInfo && (subscriptionInfo.currentPlan === 'FREE' || subscriptionInfo.isExpired)) {
    return (
      <div className="container mx-auto w-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href={`/missions/${missionId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la mission
              </Link>
            </Button>
          </div>

          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <AlertTriangle className="h-16 w-16 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-200 mb-2">
                    Abonnement requis
                  </h2>
                  <p className="text-orange-700 dark:text-orange-300 mb-4">
                    Vous devez avoir un abonnement actif pour postuler aux missions.
                    {subscriptionInfo.currentPlan === 'FREE' 
                      ? ' Passez à un plan payant pour postuler sans limite.'
                      : ' Votre abonnement a expiré. Renouvelez-le pour continuer à postuler.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-orange-600 hover:bg-orange-700">
                      <a href="/tarifs" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Voir les plans disponibles
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/missions/${missionId}`}>
                        Retour à la mission
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto w-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
              <CardDescription>{mission.company?.companyName || mission.company?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">Durée</span>
                  <p className="font-medium">{mission.duration || "Non spécifiée"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Lieu</span>
                  <p className="font-medium">{mission.location || "Non spécifié"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Budget</span>
                  <p className="font-medium">{mission.pricing || `${mission.budget}€`}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Compétences</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mission.skills?.slice(0, 2).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mission.skills?.length > 2 && (
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
                    <Input 
                      id="dailyRate" 
                      name="dailyRate"
                      type="number" 
                      placeholder="550" 
                      defaultValue={userProfile?.dailyRate || ""}
                      min="0" 
                      required 
                      className="w-full" 
                    />
                    <p className="text-xs text-muted-foreground">Indiquez votre tarif pour cette mission</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="availability">Disponibilité</Label>
                    <Input 
                      id="availability" 
                      name="availability"
                      placeholder="Immédiatement / À partir du..." 
                      defaultValue={userProfile?.availability || ""}
                      required 
                      className="w-full" 
                    />
                    <p className="text-xs text-muted-foreground">Quand pouvez-vous commencer ?</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="motivation">Lettre de motivation</Label>
                  <Textarea
                    id="motivation"
                    name="motivation"
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
                    name="experience"
                    placeholder="Décrivez vos projets similaires, vos réalisations et votre expertise dans les technologies demandées..."
                    defaultValue={userProfile?.experience || ""}
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
                  {userCvs.length > 0 ? (
                    <div className="space-y-2">
                      <Select value={selectedCvId} onValueChange={setSelectedCvId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un CV" />
                        </SelectTrigger>
                        <SelectContent>
                          {userCvs.map((cv) => (
                            <SelectItem key={cv.id} value={cv.id}>
                              {cv.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Choisissez parmi vos CVs uploadés
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Aucun CV uploadé. Veuillez d'abord uploader un CV depuis votre profil.
                      </p>
                      <Button type="button" variant="outline" asChild>
                        <Link href="/profile">
                          <Upload className="mr-2 h-4 w-4" />
                          Uploader un CV
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>


                <div className="grid gap-2">
                  <Label htmlFor="portfolioLinks">Liens vers vos réalisations</Label>
                  <Input
                    id="portfolioLinks"
                    name="portfolioLinks"
                    placeholder="https://github.com/votre-profil, https://votre-portfolio.com"
                    defaultValue={userProfile?.portfolio?.join(', ') || ""}
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
                    name="questions"
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
