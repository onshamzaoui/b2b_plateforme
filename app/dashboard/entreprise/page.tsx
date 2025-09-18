"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BriefcaseBusiness, Eye, FileText, PlusCircle, Users } from "lucide-react"
import Link from "next/link"

export default function EntrepriseDashboard() {
  const [publishedMissions, setPublishedMissions] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 🔹 Charger les missions et candidatures depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch missions
        const missionsResponse = await fetch("/api/missions")
        if (missionsResponse.ok) {
          const missionsData = await missionsResponse.json()
          setPublishedMissions(missionsData)
        }

        // Fetch applications
        const applicationsResponse = await fetch("/api/dashboard/entreprise")
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json()
          setApplications(applicationsData)
        }
      } catch (err) {
        console.error("Erreur chargement données :", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 🔹 Factures (placeholder pour l'instant)
  const invoices = [
    {
      id: 2001,
      missionTitle: "Refonte site corporate",
      freelanceName: "Marie Dupont",
      amount: "9600€",
      issueDate: "31/03/2024",
      status: "En attente",
    },
  ]

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord Entreprise</h1>
        <p className="text-muted-foreground">Gérez vos missions et trouvez des talents</p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 📌 Missions publiées */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Missions publiées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                {publishedMissions.length}
              </div>
              <p className="text-sm text-muted-foreground">
                {publishedMissions.filter((m) => m.status === "PUBLISHED").length} missions actives
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="ghost" className="w-full">
                <Link href="#published-missions">
                  <BriefcaseBusiness className="mr-2 h-4 w-4" />
                  Voir les missions
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* 📌 Candidatures */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Candidatures reçues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{applications.length}</div>
              <p className="text-sm text-muted-foreground">
                {applications.filter((a) => a.status === "Nouveau").length} nouvelles candidatures
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="ghost" className="w-full">
                <Link href="#applications">
                  <Users className="mr-2 h-4 w-4" />
                  Voir les candidatures
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* 📌 Facturation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Facturation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{invoices.length}</div>
              <p className="text-sm text-muted-foreground">
                {invoices.filter((i) => i.status === "En attente").length} factures en attente
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="ghost" className="w-full">
                <Link href="#invoices">
                  <FileText className="mr-2 h-4 w-4" />
                  Voir les factures
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Bouton publier mission */}
        <div className="flex justify-end mb-2">
          <Button asChild className="bg-violet-600 hover:bg-violet-700">
            <Link href="/missions/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Publier une mission
            </Link>
          </Button>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="missions" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="missions">Mes missions</TabsTrigger>
              <TabsTrigger value="applications">Candidatures</TabsTrigger>
              <TabsTrigger value="invoices">Factures</TabsTrigger>
            </TabsList>
          </div>

          {/* 📌 Mes missions */}
          <TabsContent value="missions" id="published-missions">
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Missions publiées</h2>
              <div className="grid gap-4">
                {publishedMissions.length === 0 ? (
                  <p>Aucune mission publiée pour l’instant.</p>
                ) : (
                  publishedMissions.map((mission) => (
                    <Card key={mission.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{mission.title}</CardTitle>
                            <CardDescription>
                              Publiée le {new Date(mission.createdAt).toLocaleDateString("fr-FR")}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={mission.status === "PUBLISHED" ? "default" : "secondary"}
                            className={mission.status === "PUBLISHED" ? "bg-green-600" : ""}
                          >
                            {mission.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{mission.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Budget :</span> {mission.budget} €
                          </div>
                        </div>
                      </CardContent>
                   <CardFooter className="flex justify-between">
  <Button asChild variant="outline">
    <Link href={`/missions/${mission.id}/edit`}>Modifier</Link>
  </Button>
  <Button asChild className="bg-violet-600 hover:bg-violet-700">
<Link href={`/missions/${mission.id}/applications`}>
      Voir les applications
    </Link>
  </Button>
</CardFooter>

                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* 📌 Candidatures */}
          <TabsContent value="applications" id="applications">
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Candidatures reçues</h2>
              {applications.length === 0 ? (
                <p>Aucune candidature reçue pour l'instant.</p>
              ) : (
                applications.map((app) => (
                  <Card key={app.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{app.freelancer?.name || "Freelance"}</CardTitle>
                          <CardDescription>Pour : {app.mission?.title || "Mission"}</CardDescription>
                        </div>
                        <Badge variant={app.status === "Nouveau" ? "default" : "secondary"}>{app.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Candidature le {new Date(app.appliedAt).toLocaleDateString("fr-FR")}</p>
                      <p className="text-sm">Taux journalier : {app.dailyRate}€</p>
                      <p className="text-sm">Compatibilité : {app.matchScore}%</p>
                      {app.freelancer?.location && (
                        <p className="text-sm">📍 {app.freelancer.location}</p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline">
                        <Link href={`/missions/${app.mission?.id}/applications`}>Voir candidature</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* 📌 Factures */}
          <TabsContent value="invoices" id="invoices">
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Factures</h2>
              {invoices.length === 0 ? (
                <p>Aucune facture pour l’instant.</p>
              ) : (
                invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Facture #{invoice.id}</CardTitle>
                          <CardDescription>
                            {invoice.missionTitle} - {invoice.freelanceName}
                          </CardDescription>
                        </div>
                        <Badge>{invoice.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Montant : {invoice.amount}</p>
                      <p className="text-sm">Émise le : {invoice.issueDate}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline">
                        <Link href={`/invoices/${invoice.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> Détails
                        </Link>
                      </Button>
                      <Button asChild className="bg-violet-600 hover:bg-violet-700">
                        <Link href={`/invoices/${invoice.id}/pay`}>
                          {invoice.status === "En attente" ? "Payer" : "Télécharger"}
                        </Link>
                      </Button>
                    </CardFooter>
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
