import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Calendar, Clock, CreditCard, Globe, MapPin, Share } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface MissionDetailsPageProps {
  params: {
    id: string
  }
}

export default function MissionDetailsPage({ params }: MissionDetailsPageProps) {
  // Démonstration : Normalement, vous chargeriez les données depuis une API en utilisant l'ID dans les params
  const missionId = params.id

  // Données fictives d'une mission pour la démonstration
  const mission = {
    id: missionId,
    title: "Développement d'une application web React",
    company: "TechSolutions SA",
    companyLogo: "/placeholder.svg?height=50&width=50",
    companyDescription:
      "TechSolutions est une entreprise de conseil en informatique spécialisée dans le développement de solutions numériques innovantes pour les entreprises du secteur financier.",
    description: `Nous recherchons un(e) développeur(se) React expérimenté(e) pour travailler sur une application web destinée à un client du secteur financier.

Vous serez en charge du développement des interfaces utilisateur en utilisant React et TypeScript, ainsi que l'intégration avec les API REST du backend.

Le projet nécessite une expertise dans les applications complexes avec de nombreuses interactivités et visualisations de données.`,
    requirements: `• Minimum de 3 ans d'expérience en développement React
• Excellente maîtrise de TypeScript
• Expérience avec les API REST
• Connaissance des bonnes pratiques en matière d'état d'application (Redux, Context API)
• Expérience avec les tests unitaires et fonctionnels
• Bonnes compétences en CSS et design responsive
• Capacité à travailler en équipe et à communiquer efficacement`,
    projectContext:
      "Ce projet s'inscrit dans une refonte complète du système d'information client. Le freelance rejoindra une équipe composée de développeurs backend, d'un designer UX/UI et d'un chef de projet.",
    location: "Remote (possibilité de réunions sur Paris)",
    duration: "3 mois (possibilité d'extension)",
    startDate: "Dès que possible",
    workload: "Temps plein (5j/semaine)",
    pricing: "550€ - 600€ / jour selon expérience",
    skills: ["React", "TypeScript", "API REST", "Redux", "Tests unitaires", "CSS/SASS"],
    publishedAt: "01/04/2024",
    applicants: 5,
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/missions">Retour aux missions</Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm text-muted-foreground">Publiée le {mission.publishedAt}</div>
        </div>

        <div className="grid gap-8">
          {/* En-tête de la mission */}
          <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{mission.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{mission.company}</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{mission.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {mission.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <Button asChild className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700">
              <Link href={`/missions/${mission.id}/apply`}>Postuler à cette mission</Link>
            </Button>
          </div>

          {/* Informations clés */}
          <Card>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Date de début</span>
                  </div>
                  <span>{mission.startDate}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Durée</span>
                  </div>
                  <span>{mission.duration}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <Globe className="h-4 w-4 mr-2" />
                    <span className="text-sm">Localisation</span>
                  </div>
                  <span>{mission.location}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span className="text-sm">Tarif</span>
                  </div>
                  <span>{mission.pricing}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description de la mission */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Description de la mission</h2>
              <div className="text-muted-foreground space-y-4 whitespace-pre-line">{mission.description}</div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Compétences requises</h2>
              <div className="text-muted-foreground whitespace-pre-line">{mission.requirements}</div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Contexte du projet</h2>
              <div className="text-muted-foreground">{mission.projectContext}</div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">À propos de {mission.company}</h2>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={mission.companyLogo || "/placeholder.svg"}
                  alt={mission.company}
                  className="h-12 w-12 rounded-md object-contain bg-gray-100 p-1"
                />
                <h3 className="font-medium">{mission.company}</h3>
              </div>
              <div className="text-muted-foreground">{mission.companyDescription}</div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild className="bg-violet-600 hover:bg-violet-700">
              <Link href={`/missions/${mission.id}/apply`}>Postuler à cette mission</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/missions/${mission.id}/share`}>
                <Share className="h-4 w-4 mr-2" />
                Partager cette mission
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
