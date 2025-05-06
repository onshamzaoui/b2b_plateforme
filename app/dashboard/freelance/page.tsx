import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, FileText, Search, Send } from "lucide-react"
import Link from "next/link"

export default function FreelanceDashboard() {
  // Données fictives pour la démonstration
  const availableMissions = [
    {
      id: 1,
      title: "Développement application web React",
      company: "TechSolutions SA",
      description:
        "Développement d'une application web avec React et Node.js pour un client dans le secteur financier.",
      duration: "3 mois",
      pricing: "550€ / jour",
      location: "Remote",
      skills: ["React", "Node.js", "TypeScript", "API REST"],
    },
    {
      id: 2,
      title: "Refonte UX/UI site e-commerce",
      company: "DigitalShop",
      description:
        "Refonte complète de l'interface utilisateur d'un site e-commerce pour améliorer l'expérience client et le taux de conversion.",
      duration: "2 mois",
      pricing: "500€ / jour",
      location: "Paris, hybride",
      skills: ["Figma", "UX Design", "UI Design", "Adobe XD"],
    },
    {
      id: 3,
      title: "Développement API microservices",
      company: "FinTech Solutions",
      description: "Création d'une architecture microservices pour une application financière à haute disponibilité.",
      duration: "4 mois",
      pricing: "600€ / jour",
      location: "Lyon, sur site",
      skills: ["Java", "Spring Boot", "Kubernetes", "Docker"],
    },
  ]

  const appliedMissions = [
    {
      id: 101,
      title: "Application mobile de suivi sportif",
      company: "FitConnect",
      appliedAt: "15/04/2024",
      status: "En attente",
      description: "Développement d'une application mobile React Native pour le suivi d'activités sportives.",
      duration: "2 mois",
      pricing: "520€ / jour",
    },
    {
      id: 102,
      title: "Intégration CRM et ERP",
      company: "BusinessSoft",
      appliedAt: "10/04/2024",
      status: "Entretien programmé",
      description: "Intégration de systèmes CRM et ERP pour une PME de l'industrie manufacturière.",
      duration: "1 mois",
      pricing: "490€ / jour",
    },
  ]

  const invoices = [
    {
      id: 1001,
      missionTitle: "Développement backend API REST",
      company: "WebAgency Plus",
      amount: "8400€",
      issueDate: "31/03/2024",
      status: "Payée",
    },
    {
      id: 1002,
      missionTitle: "Audit sécurité web",
      company: "SecureBank",
      amount: "5200€",
      issueDate: "15/03/2024",
      status: "En attente",
    },
  ]

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord Freelance</h1>
        <p className="text-muted-foreground">Gérez vos missions et trouvez de nouvelles opportunités</p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Missions disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{availableMissions.length}</div>
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
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{appliedMissions.length}</div>
              <p className="text-sm text-muted-foreground">Missions en cours de candidature</p>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="ghost" className="w-full">
                <Link href="#applications">
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
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{invoices.length}</div>
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
          <TabsList className="grid grid-cols-3 max-w-md mb-4">
            <TabsTrigger value="available">Missions disponibles</TabsTrigger>
            <TabsTrigger value="applications">Mes candidatures</TabsTrigger>
            <TabsTrigger value="invoices">Factures</TabsTrigger>
          </TabsList>

          <TabsContent value="available" id="available-missions">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Missions disponibles</h2>
                <Button asChild className="bg-violet-600 hover:bg-violet-700">
                  <Link href="/missions">Voir toutes les missions</Link>
                </Button>
              </div>

              <div className="grid gap-4">
                {availableMissions.map((mission) => (
                  <Card key={mission.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{mission.title}</CardTitle>
                          <CardDescription>{mission.company}</CardDescription>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {mission.duration}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{mission.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {mission.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Tarif :</span> {mission.pricing}
                        </div>
                        <div>
                          <span className="font-medium">Lieu :</span> {mission.location}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button asChild variant="outline">
                        <Link href={`/missions/${mission.id}`}>Détails</Link>
                      </Button>
                      <Button asChild className="bg-violet-600 hover:bg-violet-700">
                        <Link href={`/missions/${mission.id}/apply`}>Postuler</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications" id="applications">
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Mes candidatures</h2>

              <div className="grid gap-4">
                {appliedMissions.map((mission) => (
                  <Card key={mission.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{mission.title}</CardTitle>
                          <CardDescription>{mission.company}</CardDescription>
                        </div>
                        <Badge
                          variant={mission.status === "En attente" ? "outline" : "secondary"}
                          className="flex items-center gap-1"
                        >
                          {mission.status === "En attente" ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          {mission.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{mission.description}</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Durée :</span> {mission.duration}
                        </div>
                        <div>
                          <span className="font-medium">Tarif :</span> {mission.pricing}
                        </div>
                        <div>
                          <span className="font-medium">Candidature le :</span> {mission.appliedAt}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/applications/${mission.id}`}>Voir ma candidature</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
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
                {invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Facture #{invoice.id}</CardTitle>
                          <CardDescription>
                            {invoice.missionTitle} - {invoice.company}
                          </CardDescription>
                        </div>
                        <Badge variant={invoice.status === "Payée" ? "default" : "outline"}>{invoice.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Montant :</span> {invoice.amount}
                        </div>
                        <div>
                          <span className="font-medium">Date d'émission :</span> {invoice.issueDate}
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
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
