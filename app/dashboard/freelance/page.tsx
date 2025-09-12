"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, FileText, Search, Send } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function FreelanceDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    availableMissionsCount: 0,
    applicationsCount: 0,
    invoicesCount: 0,
    availableMissions: [],
    applications: [],
    invoices: []
  })

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status === "loading") return
      
      if (!session) {
        router.push("/auth/login")
        return
      }

      try {
        const response = await fetch("/api/dashboard/freelance")
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        } else {
          console.error("Erreur lors du chargement des données du dashboard")
        }
      } catch (error) {
        console.error("Erreur fetch dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [session, status, router])


  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord Freelance</h1>
        <p className="text-muted-foreground">I will cook... Gérez vos missions et trouvez de nouvelles opportunités</p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Missions disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                {isLoading ? "..." : dashboardData.availableMissionsCount}
              </div>
              <p className="text-sm text-muted-foreground">Missions correspondant à votre profil</p>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="ghost" className="w-full">
                <Link href="#available-missions">
                  <Search className="mr-2 h-4 w-4" />
                  Consulter les missions
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Candidatures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                {isLoading ? "..." : dashboardData.applicationsCount}
              </div>
              <p className="text-sm text-muted-foreground">Missions en cours de candidature</p>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="ghost" className="w-full">
                <Link href="/applications">
                  <Send className="mr-2 h-4 w-4" />
                  Voir mes candidatures
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Facturation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                {isLoading ? "..." : dashboardData.invoicesCount}
              </div>
              <p className="text-sm text-muted-foreground">Factures en attente et réglées</p>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="ghost" className="w-full">
                <Link href="#invoices">
                  <FileText className="mr-2 h-4 w-4" />
                  Voir mes factures
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="available">Missions disponibles</TabsTrigger>
              <TabsTrigger value="applications">Mes candidatures</TabsTrigger>
              <TabsTrigger value="invoices">Factures</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="available" id="available-missions">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Missions disponibles</h2>
                <Button asChild className="bg-violet-600 hover:bg-violet-700">
                  <Link href="/missions">Voir toutes les missions</Link>
                </Button>
              </div>

              <div className="grid gap-4">
                {dashboardData.availableMissions.length > 0 ? (
                  dashboardData.availableMissions.map((mission: any) => (
                    <Card key={mission.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{mission.title}</CardTitle>
                            <CardDescription>{mission.company?.companyName || mission.company?.name}</CardDescription>
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {mission.duration || "Non spécifiée"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{mission.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mission.skills?.map((skill: string) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Budget :</span> {mission.pricing || `${mission.budget}€`}
                          </div>
                          <div>
                            <span className="font-medium">Lieu :</span> {mission.location || "Non spécifié"}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button asChild variant="outline">
                          <Link href={`/missions/${mission.id}`}>Détails</Link>
                        </Button>
                        {dashboardData.applications.some((app: any) => app.missionId === mission.id) ? (
                          <Button disabled className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Candidature envoyée
                          </Button>
                        ) : (
                          <Button asChild className="bg-violet-600 hover:bg-violet-700">
                            <Link href={`/missions/${mission.id}/apply`}>Postuler</Link>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune mission disponible pour le moment</p>
                    <Button asChild className="mt-4 bg-violet-600 hover:bg-violet-700">
                      <Link href="/missions">Voir toutes les missions</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications" id="applications">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mes candidatures</h2>
                <Button asChild className="bg-violet-600 hover:bg-violet-700">
                  <Link href="/applications">Voir toutes mes candidatures</Link>
                </Button>
              </div>

              <div className="grid gap-4">
                {dashboardData.applications.length > 0 ? (
                  dashboardData.applications.map((application: any) => (
                    <Card key={application.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{application.mission?.title}</CardTitle>
                            <CardDescription>{application.mission?.company?.companyName || application.mission?.company?.name}</CardDescription>
                          </div>
                          <Badge
                            variant={application.status === "Nouveau" ? "outline" : "secondary"}
                            className="flex items-center gap-1"
                          >
                            {application.status === "Nouveau" ? (
                              <Clock className="h-3 w-3" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            {application.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Durée :</span> {application.mission?.duration || "Non spécifiée"}
                          </div>
                          <div>
                            <span className="font-medium">Votre tarif :</span> {application.dailyRate}€/jour
                          </div>
                          <div>
                            <span className="font-medium">Candidature le :</span> {new Date(application.appliedAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        {application.matchScore > 0 && (
                          <div className="mt-3">
                            <span className="text-sm font-medium">Score de correspondance : </span>
                            <Badge variant="secondary" className="ml-1">
                              {application.matchScore}%
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/missions/${application.mission?.id}`}>Voir la mission</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Vous n'avez pas encore postulé à des missions</p>
                    <Button asChild className="mt-4 bg-violet-600 hover:bg-violet-700">
                      <Link href="/missions">Découvrir les missions</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoices" id="invoices">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mes factures</h2>
                <Button asChild className="bg-violet-600 hover:bg-violet-700">
                  <Link href="/invoices/create">Créer une facture</Link>
                </Button>
              </div>

              <div className="grid gap-4">
                {dashboardData.invoices.length > 0 ? (
                  dashboardData.invoices.map((invoice: any) => (
                    <Card key={invoice.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Facture #{invoice.id.slice(-8)}</CardTitle>
                            <CardDescription>
                              Facture émise le {new Date(invoice.issuedAt).toLocaleDateString('fr-FR')}
                            </CardDescription>
                          </div>
                          <Badge variant={invoice.status === "PAID" ? "default" : "outline"}>
                            {invoice.status === "PAID" ? "Payée" : invoice.status === "PENDING" ? "En attente" : "Annulée"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Montant :</span> {invoice.amount}€
                          </div>
                          <div>
                            <span className="font-medium">Date d'émission :</span> {new Date(invoice.issuedAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button asChild variant="outline">
                          <Link href={`/invoices/${invoice.id}`}>Détails</Link>
                        </Button>
                        <Button asChild>
                          <Link href={`/invoices/${invoice.id}/download`}>Télécharger</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune facture pour le moment</p>
                    <Button asChild className="mt-4 bg-violet-600 hover:bg-violet-700">
                      <Link href="/invoices/create">Créer une facture</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
