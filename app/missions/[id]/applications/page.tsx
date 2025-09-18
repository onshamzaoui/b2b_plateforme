"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  Mail,
  MessageCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface ApplicationsPageProps {
  params: { id: string }
}

export default function ApplicationsPage() {
  const params = useParams()
  const missionId = params?.id as string  // ✅ récupération directe

  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


  // 🔹 Charger les candidatures depuis l'API
  useEffect(() => {
    if (!missionId) return

    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/missions/${missionId}/applications`)
        
        if (!response.ok) {
          if (response.status === 403) {
            console.error("Accès non autorisé à cette mission")
            return
          }
          throw new Error("Erreur lors du chargement des candidatures")
        }

        const data = await response.json()
        console.log("Applications data:", data) // Debug log
        setApplications(data)
      } catch (error) {
        console.error("Erreur chargement candidatures:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [missionId])

const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
  try {
    const res = await fetch(
      `/api/missions/${missionId}/applications/${applicationId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      throw new Error("Erreur mise à jour: " + err)
    }

    const updated = await res.json()
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? updated : app))
    )
  } catch (err) {
    console.error(err)
  }
}


  // 🔹 Helpers couleurs
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nouveau":
        return "bg-violet-600"
      case "Contacté":
        return "bg-blue-600"
      case "Accepté":
        return "bg-green-600"
      case "Refusé":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-orange-600"
    return "text-gray-600"
  }

  if (loading) return <p className="p-6">Chargement...</p>

  const newApplications = applications.filter((a) => a.status === "Nouveau")
  const contactedApplications = applications.filter((a) => a.status === "Contacté")
  const acceptedApplications = applications.filter((a) => a.status === "Accepté")
  const rejectedApplications = applications.filter((a) => a.status === "Refusé")

  return (
    <div className="container mx-auto w-screen py-8">
      <div className="max-w-7xl mx-auto">
        {/* Retour */}
        <div className="flex items-center space-x-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/entreprise">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-md mb-6">
            <TabsTrigger value="all">Toutes ({applications.length})</TabsTrigger>
            <TabsTrigger value="new">Nouvelles ({newApplications.length})</TabsTrigger>
            <TabsTrigger value="contacted">Contactées ({contactedApplications.length})</TabsTrigger>
            <TabsTrigger value="rejected">Refusées ({rejectedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {applications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune candidature reçue pour cette mission.
                </p>
              ) : (
                applications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage 
                              src={application.freelancer?.profileImage || "/placeholder-user.jpg"} 
                              alt={application.freelancer?.name || "Freelance"} 
                            />
                            <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle>{application.freelancer?.name || "Freelance"}</CardTitle>
                            <CardDescription>{application.freelancer?.profession || "Freelance"}</CardDescription>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>📍 {application.freelancer?.location || "Non spécifié"}</span>
                              <span>💰 {application.dailyRate}€/jour</span>
                              <span className={getMatchScoreColor(application.matchScore)}>
                                🎯 {application.matchScore}% de compatibilité
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Motivation</h4>
                          <p className="text-sm text-muted-foreground">{application.motivation}</p>
                        </div>
                        
                        {application.experience && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Expérience</h4>
                            <p className="text-sm text-muted-foreground">{application.experience}</p>
                          </div>
                        )}

                        {application.availability && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Disponibilité</h4>
                            <p className="text-sm text-muted-foreground">{application.availability}</p>
                          </div>
                        )}

                        {application.skills && application.skills.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Compétences</h4>
                            <div className="flex flex-wrap gap-1">
                              {application.skills.map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          Candidature envoyée le {new Date(application.appliedAt).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleUpdateStatus(application.id, "Accepté")}
                        >
                          Accepter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleUpdateStatus(application.id, "Refusé")}
                        >
                          Refuser
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
