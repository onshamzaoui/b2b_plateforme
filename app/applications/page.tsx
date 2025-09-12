"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  Calendar,
  MapPin,
  DollarSign,
  User,
  Building,
  FileText,
  ArrowLeft
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MyApplicationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not authenticated or not a freelance
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated" && session?.user?.role !== "FREELANCE") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  // Fetch user applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (status === "authenticated" && session?.user?.role === "FREELANCE") {
        try {
          const response = await fetch("/api/dashboard/freelance")
          if (response.ok) {
            const data = await response.json()
            setApplications(data.applications || [])
          } else {
            toast({
              title: "Erreur",
              description: "Erreur lors du chargement de vos candidatures",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error fetching applications:", error)
          toast({
            title: "Erreur",
            description: "Erreur lors du chargement de vos candidatures",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchApplications()
  }, [status, session, toast])

  // Get status badge variant and icon
  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case "nouveau":
        return {
          variant: "outline" as const,
          icon: <Clock className="h-3 w-3" />,
          color: "text-blue-600"
        }
      case "accepté":
      case "accepted":
        return {
          variant: "default" as const,
          icon: <CheckCircle className="h-3 w-3" />,
          color: "text-green-600"
        }
      case "refusé":
      case "rejected":
        return {
          variant: "destructive" as const,
          icon: <XCircle className="h-3 w-3" />,
          color: "text-red-600"
        }
      case "en cours":
      case "in_progress":
        return {
          variant: "secondary" as const,
          icon: <Clock className="h-3 w-3" />,
          color: "text-yellow-600"
        }
      default:
        return {
          variant: "outline" as const,
          icon: <Clock className="h-3 w-3" />,
          color: "text-gray-600"
        }
    }
  }

  // Group applications by status
  const groupedApplications = {
    all: applications,
    pending: applications.filter(app => app.status === "Nouveau"),
    accepted: applications.filter(app => app.status === "Accepté" || app.status === "Accepted"),
    rejected: applications.filter(app => app.status === "Refusé" || app.status === "Rejected"),
    inProgress: applications.filter(app => app.status === "En cours" || app.status === "In Progress")
  }

  if (isLoading || status === "loading") {
    return (
      <div className="container py-8 mx-auto w-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement de vos candidatures...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 mx-auto w-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            
            <div>
              <h1 className="text-3xl font-bold">Mes Candidatures</h1>
              <p className="text-muted-foreground">
                Suivez l'état de vos candidatures et gérez vos applications
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-blue-600">{groupedApplications.pending.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Acceptées</p>
                  <p className="text-2xl font-bold text-green-600">{groupedApplications.accepted.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Refusées</p>
                  <p className="text-2xl font-bold text-red-600">{groupedApplications.rejected.length}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">Toutes ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">En attente ({groupedApplications.pending.length})</TabsTrigger>
            <TabsTrigger value="accepted">Acceptées ({groupedApplications.accepted.length})</TabsTrigger>
            <TabsTrigger value="rejected">Refusées ({groupedApplications.rejected.length})</TabsTrigger>
            <TabsTrigger value="inProgress">En cours ({groupedApplications.inProgress.length})</TabsTrigger>
          </TabsList>

          {Object.entries(groupedApplications).map(([key, apps]) => (
            <TabsContent key={key} value={key} className="mt-6">
              {apps.length > 0 ? (
                <div className="grid gap-6">
                  {apps.map((application: any) => {
                    const statusDisplay = getStatusDisplay(application.status)
                    
                    return (
                      <Card key={application.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">
                                {application.mission?.title}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2 mb-3">
                                <Building className="h-4 w-4" />
                                {application.mission?.company?.companyName || application.mission?.company?.name}
                              </CardDescription>
                            </div>
                            <Badge  

                              className={`flex items-center gap-1 bg-white ${statusDisplay.color}`}
                            >
                              {statusDisplay.icon}
                              {application.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Mission Details */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-muted-foreground">Mission</h4>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-3 w-3" />
                                  <span>{application.mission?.duration || "Non spécifiée"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-3 w-3" />
                                  <span>{application.mission?.location || "Non spécifié"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="h-3 w-3" />
                                  <span>{application.mission?.pricing || `${application.mission?.budget}€`}</span>
                                </div>
                              </div>
                            </div>

                            {/* Your Application Details */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-muted-foreground">Votre candidature</h4>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="h-3 w-3" />
                                  <span>{application.dailyRate}€/jour</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-3 w-3" />
                                  <span>{application.availability || "Non spécifiée"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <FileText className="h-3 w-3" />
                                  <span>Score: {application.matchScore}%</span>
                                </div>
                              </div>
                            </div>

                            {/* Application Info */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-muted-foreground">Informations</h4>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-3 w-3" />
                                  <span>Candidature le {new Date(application.appliedAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="h-3 w-3" />
                                  <span>ID: {application.id.slice(-8)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Skills Match */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-muted-foreground">Compétences</h4>
                              <div className="flex flex-wrap gap-1">
                                {application.skills?.slice(0, 3).map((skill: string) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {application.skills?.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{application.skills.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Motivation Preview */}
                          {application.motivation && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Lettre de motivation</h4>
                              <p className="text-sm bg-muted/50 p-3 rounded-md line-clamp-3">
                                {application.motivation}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 border-t">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/missions/${application.mission?.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir la mission
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/missions/${application.mission?.id}/applications`}>
                                <FileText className="mr-2 h-4 w-4" />
                                Détails candidature
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {key === "all" ? "Aucune candidature" : `Aucune candidature ${key === "pending" ? "en attente" : key === "accepted" ? "acceptée" : key === "rejected" ? "refusée" : "en cours"}`}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {key === "all" 
                      ? "Vous n'avez pas encore postulé à des missions."
                      : `Vous n'avez pas de candidatures ${key === "pending" ? "en attente" : key === "accepted" ? "acceptées" : key === "rejected" ? "refusées" : "en cours"}.`
                    }
                  </p>
                  <Button asChild>
                    <Link href="/missions">Découvrir les missions</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
