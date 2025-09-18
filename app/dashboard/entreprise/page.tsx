"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BriefcaseBusiness, Eye, FileText, PlusCircle, Users } from "lucide-react"
import Link from "next/link"

export default function EntrepriseDashboard() {
  const [publishedMissions, setPublishedMissions] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
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

        // Fetch invoices
        const invoicesResponse = await fetch("/api/invoices")
        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json()
          setInvoices(invoicesData)
        }
      } catch (err) {
        console.error("Erreur chargement données :", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord Entreprise</h1>
        <p className="text-muted-foreground">Gérez vos missions et suivez vos collaborations</p>
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
              <div className="text-3xl font-bold text-violet-600">{publishedMissions.length}</div>
              <p className="text-sm text-muted-foreground">
                {publishedMissions.filter((m) => m.status === "PUBLISHED").length} missions actives
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="ghost" className="w-full">
                <Link href="/missions">
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
              <div className="text-3xl font-bold text-violet-600">{applications.length}</div>
              <p className="text-sm text-muted-foreground">
                {applications.filter((app) => app.status === "Nouveau").length} candidatures en attente
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
              <div className="text-3xl font-bold text-violet-600">{invoices.length}</div>
              <p className="text-sm text-muted-foreground">
                {invoices.filter((i) => i.status === "PENDING").length} factures en attente
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

        {/* 📌 Onglets */}
        <Tabs defaultValue="missions" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="missions">Mes missions</TabsTrigger>
              <TabsTrigger value="applications">Candidatures</TabsTrigger>
              <TabsTrigger value="invoices">Factures</TabsTrigger>
            </TabsList>
          </div>

   {/* Missions */}
  <TabsContent value="missions" id="missions">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Missions publiées</h2>
      <Button asChild className="bg-violet-600 hover:bg-violet-700">
        <Link href="/missions/create">
          <PlusCircle className="mr-2 h-4 w-4" /> Publier une mission
        </Link>
      </Button>
    </div>

    {publishedMissions.length === 0 ? (
      <p>Aucune mission publiée.</p>
    ) : (
      publishedMissions.map((mission) => (
        <Card key={mission.id}>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>{mission.title}</CardTitle>
                <CardDescription>
                  Publiée le {new Date(mission.createdAt).toLocaleDateString("fr-FR")}
                </CardDescription>
              </div>
              <Badge>{mission.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p>{mission.description}</p>
            <p className="text-sm">Budget : {mission.budget} €</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href={`/missions/${mission.id}/edit`}>Modifier</Link>
            </Button>
            <Button asChild className="bg-violet-600 hover:bg-violet-700">
              <Link href={`/missions/${mission.id}/applications`}>Voir candidatures</Link>
            </Button>
          </CardFooter>
        </Card>
      ))
    )}
  </TabsContent>
          {/* Candidatures */}
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

          {/* Factures */}
          <TabsContent value="invoices" id="invoices">
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Factures reçues</h2>
              {invoices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucune facture reçue pour le moment</p>
                </div>
              ) : (
                invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Facture #{invoice.invoiceNumber}</CardTitle>
                          <CardDescription>De: {invoice.freelancer?.name || "Freelance"}</CardDescription>
                        </div>
                        <Badge variant={invoice.status === "PAID" ? "default" : invoice.status === "PENDING" ? "secondary" : "destructive"}>
                          {invoice.status === "PAID" ? "Payée" : invoice.status === "PENDING" ? "En attente" : "Annulée"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Montant HT :</span> {invoice.amount}€
                        </div>
                        <div>
                          <span className="font-medium">TVA :</span> {invoice.taxAmount}€
                        </div>
                        <div>
                          <span className="font-medium">Total TTC :</span> {invoice.totalAmount}€
                        </div>
                        <div>
                          <span className="font-medium">Échéance :</span> {new Date(invoice.dueDate).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{invoice.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button asChild variant="outline">
                        <Link href={`/invoices/${invoice.id}`}>Voir détails</Link>
                      </Button>
                      {invoice.status === "PENDING" && (
                        <Button className="bg-green-600 hover:bg-green-700">
                          Marquer comme payée
                        </Button>
                      )}
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
