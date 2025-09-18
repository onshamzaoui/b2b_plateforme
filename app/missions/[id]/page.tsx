"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Share, CheckCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react"

export default function MissionDetailsPage() {
  const params = useParams()
  const id = params?.id as string
  const { data: session } = useSession()

  const [mission, setMission] = useState<any>(null)
  const [userApplications, setUserApplications] = useState<any[]>([])
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch mission details
        const missionResponse = await fetch(`/api/missions/${id}`)
        const missionData = await missionResponse.json()
        
        if (!missionResponse.ok) {
          throw new Error(missionData.error || "Erreur inconnue")
        }
        
        setMission(missionData)

        // Fetch user applications if authenticated and is a freelance
        if (session?.user?.id && session?.user?.role === "FREELANCE") {
          const applicationsResponse = await fetch("/api/dashboard/freelance")
          if (applicationsResponse.ok) {
            const dashboardData = await applicationsResponse.json()
            const applications = dashboardData.applications || []
            setUserApplications(applications)
            
            // Check if user has applied to this specific mission
            const applied = applications.some((app: any) => app.missionId === id)
            setHasApplied(applied)
          }
        }
      } catch (error) {
        console.error("Erreur de chargement :", error)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, session])


  if (!mission) {
     return <div className="container py-8 text-center">Chargement...</div>
 }

  return (
    <div className="container mx-auto w-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/missions">Retour aux missions</Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm text-muted-foreground">
            Publiée le {new Date(mission.publishedAt || mission.createdAt).toLocaleDateString("fr-FR")}
          </div>
        </div>

        <div className="grid gap-8">
          {/* Header Section */}
          <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{mission.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{mission.company?.name || mission.company?.companyName}</span>
                </div>
                {mission.location && (
                  <>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{mission.location}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {mission.skills?.map((skill: string) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {session?.user?.role === "FREELANCE" ? (
              hasApplied ? (
                <Button disabled className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Candidature envoyée
                </Button>
              ) : (
                <Button asChild className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700">
                  <Link href={`/missions/${mission.id}/apply`}>Postuler à cette mission</Link>
                </Button>
              )
            ) : session?.user?.role === "ENTREPRISE" ? (
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href={`/missions/${mission.id}/edit`}>Modifier</Link>
                </Button>
                <Button asChild className="bg-violet-600 hover:bg-violet-700">
                  <Link href={`/missions/${mission.id}/applications`}>Voir candidatures</Link>
                </Button>
              </div>
            ) : (
              <Button asChild className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700">
                <Link href={`/missions/${mission.id}`}>Voir les détails</Link>
              </Button>
            )}
          </div>

          {/* Mission Details Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Description de la mission</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{mission.description}</p>
                </CardContent>
              </Card>

              {/* Requirements */}
              {mission.requirements && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Prérequis</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{mission.requirements}</p>
                  </CardContent>
                </Card>
              )}

              {/* Project Context */}
              {mission.projectContext && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Contexte du projet</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{mission.projectContext}</p>
                  </CardContent>
                </Card>
              )}

              {/* Company Information */}
              {mission.companyDescription && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">À propos de l'entreprise</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{mission.companyDescription}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mission Details */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Détails de la mission</h3>
                  <div className="space-y-3">
                    {mission.budget && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget :</span>
                        <span className="font-medium">{mission.budget}€</span>
                      </div>
                    )}
                    {mission.pricing && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tarification :</span>
                        <span className="font-medium">{mission.pricing}</span>
                      </div>
                    )}
                    {mission.duration && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Durée :</span>
                        <span className="font-medium">{mission.duration}</span>
                      </div>
                    )}
                    {mission.startDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date de début :</span>
                        <span className="font-medium">{new Date(mission.startDate).toLocaleDateString("fr-FR")}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Statut :</span>
                      <Badge variant={mission.status === "PUBLISHED" ? "default" : "secondary"}>
                        {mission.status === "PUBLISHED" ? "Publiée" : 
                         mission.status === "IN_PROGRESS" ? "En cours" :
                         mission.status === "COMPLETED" ? "Terminée" : "Annulée"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">{mission.company?.name || mission.company?.companyName}</span>
                    </div>
                    {mission.company?.companyWebsite && (
                      <div>
                        <a 
                          href={mission.company.companyWebsite} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-violet-600 hover:text-violet-700 text-sm"
                        >
                          {mission.company.companyWebsite}
                        </a>
                      </div>
                    )}
                    {mission.companyLogo && (
                      <div className="mt-3">
                        <img 
                          src={mission.companyLogo} 
                          alt="Logo entreprise" 
                          className="h-16 w-auto object-contain"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Compétences recherchées</h3>
                  <div className="flex flex-wrap gap-2">
                    {mission.skills?.map((skill: string) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
