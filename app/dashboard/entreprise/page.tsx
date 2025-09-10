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
  const [loading, setLoading] = useState(true)

  // 🔹 Charger les missions depuis l'API
  useEffect(() => {
    fetch("/api/missions")
      .then((res) => res.json())
      .then((data) => setPublishedMissions(data))
      .catch((err) => console.error("Erreur chargement missions :", err))
      .finally(() => setLoading(false))
  }, [])

  // 🔹 Simuler les applications et factures (on pourra brancher après)
  const applications: any[] = []
  const invoices: any[] = []

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord Entreprise</h1>
        <p className="text-muted-foreground">Gérez vos missions et trouvez des talents</p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Missions publiées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{publishedMissions.length}</div>
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

        <div className="flex justify-end mb-2">
          <Button asChild className="bg-violet-600 hover:bg-violet-700">
            <Link href="/missions/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Publier une mission
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="missions" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mb-4">
            <TabsTrigger value="missions">Mes missions</TabsTrigger>
            <TabsTrigger value="applications">Candidatures</TabsTrigger>
            <TabsTrigger value="invoices">Factures</TabsTrigger>
          </TabsList>

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
                            className={`${mission.status === "PUBLISHED" ? "bg-green-600" : ""}`}
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
                          <Link href={`/missions/${mission.id}`}>Voir la mission</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications" id="applications">
            <p>Ici tu affiches les candidatures reçues (à brancher plus tard).</p>
          </TabsContent>

          <TabsContent value="invoices" id="invoices">
            <p>Ici tu affiches les factures (à brancher plus tard).</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
