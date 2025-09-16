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
  const { data: session } = useSession()
  const [missions, setMissions] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 🔹 Charger les missions / candidatures / factures
  useEffect(() => {
    if (!session?.user?.id) return

    const fetchData = async () => {
      try {
        // Récupérer les missions de l’entreprise connectée
        const resMissions = await fetch(`/api/missions?entrepriseId=${session.user.id}`)
        const missionsData = await resMissions.json()
        setMissions(missionsData)

        // Récupérer candidatures
        const resApps = await fetch(`/api/applications?entrepriseId=${session.user.id}`)
        const appsData = await resApps.json()
        setApplications(appsData)

        // Récupérer factures
        const resInvoices = await fetch(`/api/invoices?entrepriseId=${session.user.id}`)
        const invoicesData = await resInvoices.json()
        setInvoices(invoicesData)
      } catch (err) {
        console.error("Erreur chargement dashboard :", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.user?.id])

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
              <div className="text-3xl font-bold text-violet-600">{missions.length}</div>
              <p className="text-sm text-muted-foreground">
                {missions.filter((m) => m.status === "PUBLISHED").length} missions actives
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
                {applications.filter((app) => app.status === "PENDING").length} candidatures en attente
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

    {missions.length === 0 ? (
      <p>Aucune mission publiée.</p>
    ) : (
      missions.map((mission) => (
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
            {applications.length === 0 ? (
              <p>Aucune candidature reçue.</p>
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{app.user.name}</CardTitle>
                        <CardDescription>Mission : {app.mission.title}</CardDescription>
                      </div>
                      <Badge>{app.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>Candidature le {new Date(app.appliedAt).toLocaleDateString("fr-FR")}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Factures */}
          <TabsContent value="invoices" id="invoices">
            {invoices.length === 0 ? (
              <p>Aucune facture.</p>
            ) : (
              invoices.map((inv) => (
                <Card key={inv.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>Facture #{inv.id}</CardTitle>
                        <CardDescription>{inv.user.name}</CardDescription>
                      </div>
                      <Badge>{inv.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>Montant : {inv.amount} €</p>
                    <p>Émise le : {new Date(inv.issuedAt).toLocaleDateString("fr-FR")}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
        
      </div>
    </div>
    
  )
}
