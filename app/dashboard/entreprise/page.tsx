import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BriefcaseBusiness, Eye, FileText, PlusCircle, Users } from "lucide-react"
import Link from "next/link"

export default function EntrepriseDashboard() {
  // Données fictives pour la démonstration
  const publishedMissions = [
    {
      id: 1,
      title: "Développement application web React",
      description:
        "Développement d'une application web avec React et Node.js pour un client dans le secteur financier.",
      publishedAt: "01/04/2024",
      status: "Active",
      duration: "3 mois",
      applicants: 5,
      skills: ["React", "Node.js", "TypeScript", "API REST"],
    },
    {
      id: 2,
      title: "Refonte UX/UI site e-commerce",
      description:
        "Refonte complète de l'interface utilisateur d'un site e-commerce pour améliorer l'expérience client et le taux de conversion.",
      publishedAt: "05/04/2024",
      status: "Active",
      duration: "2 mois",
      applicants: 3,
      skills: ["Figma", "UX Design", "UI Design", "Adobe XD"],
    },
    {
      id: 3,
      title: "Développement API microservices",
      description: "Création d'une architecture microservices pour une application financière à haute disponibilité.",
      publishedAt: "28/03/2024",
      status: "Clôturée",
      duration: "4 mois",
      applicants: 8,
      skills: ["Java", "Spring Boot", "Kubernetes", "Docker"],
    },
  ]

  const applications = [
    {
      id: 101,
      missionId: 1,
      missionTitle: "Développement application web React",
      freelanceName: "Sophie Martin",
      appliedAt: "05/04/2024",
      status: "Nouveau",
      matchRate: 95,
      dailyRate: "550€",
    },
    {
      id: 102,
      missionId: 1,
      missionTitle: "Développement application web React",
      freelanceName: "Thomas Durand",
      appliedAt: "03/04/2024",
      status: "Contacté",
      matchRate: 87,
      dailyRate: "580€",
    },
    {
      id: 103,
      missionId: 2,
      missionTitle: "Refonte UX/UI site e-commerce",
      freelanceName: "Julie Rousseau",
      appliedAt: "06/04/2024",
      status: "Nouveau",
      matchRate: 92,
      dailyRate: "510€",
    },
  ]

  const invoices = [
    {
      id: 2001,
      missionTitle: "Refonte site corporate",
      freelanceName: "Marie Dupont",
      amount: "9600€",
      issueDate: "31/03/2024",
      status: "En attente",
    },
    {
      id: 2002,
      missionTitle: "Intégration CRM",
      freelanceName: "Paul Lefort",
      amount: "7200€",
      issueDate: "15/03/2024",
      status: "Payée",
    },
  ]

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
                {publishedMissions.filter((m) => m.status === "Active").length} missions actives
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
                {publishedMissions.map((mission) => (
                  <Card key={mission.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{mission.title}</CardTitle>
                          <CardDescription>Publiée le {mission.publishedAt}</CardDescription>
                        </div>
                        <Badge
                          variant={mission.status === "Active" ? "default" : "secondary"}
                          className={`${mission.status === "Active" ? "bg-green-600" : ""}`}
                        >
                          {mission.status}
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
                          <span className="font-medium">Durée :</span> {mission.duration}
                        </div>
                        <div>
                          <span className="font-medium">Candidatures :</span> {mission.applicants}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button asChild variant="outline">
                        <Link href={`/missions/${mission.id}/edit`}>Modifier</Link>
                      </Button>
                      <Button asChild className="bg-violet-600 hover:bg-violet-700">
                        <Link href={`/missions/${mission.id}/applications`}>
                          Voir les candidatures ({mission.applicants})
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications" id="applications">
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Candidatures reçues</h2>

              <div className="grid gap-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{application.freelanceName}</CardTitle>
                          <CardDescription>Pour : {application.missionTitle}</CardDescription>
                        </div>
                        <Badge
                          variant={application.status === "Nouveau" ? "default" : "secondary"}
                          className={`${application.status === "Nouveau" ? "bg-violet-600" : ""}`}
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Candidature le :</span> {application.appliedAt}
                        </div>
                        <div>
                          <span className="font-medium">Taux journalier :</span> {application.dailyRate}
                        </div>
                        <div>
                          <span className="font-medium">Compatibilité :</span>
                          <Badge variant="outline" className="ml-1">
                            {application.matchRate}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button asChild variant="outline">
                        <Link href={`/freelancers/${application.id}`}>Profil du freelance</Link>
                      </Button>
                      <Button asChild className="bg-violet-600 hover:bg-violet-700">
                        <Link href={`/applications/${application.id}`}>Voir candidature</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoices" id="invoices">
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Factures</h2>

              <div className="grid gap-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Facture #{invoice.id}</CardTitle>
                          <CardDescription>
                            {invoice.missionTitle} - {invoice.freelanceName}
                          </CardDescription>
                        </div>
                        <Badge variant={invoice.status === "Payée" ? "secondary" : "outline"}>{invoice.status}</Badge>
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
                        <Link href={`/invoices/${invoice.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Détails
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className={invoice.status === "En attente" ? "bg-violet-600 hover:bg-violet-700" : ""}
                      >
                        <Link href={`/invoices/${invoice.id}/pay`}>
                          {invoice.status === "En attente" ? "Payer" : "Télécharger"}
                        </Link>
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
