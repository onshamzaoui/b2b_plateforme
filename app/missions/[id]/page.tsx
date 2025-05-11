"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Calendar, Clock, CreditCard, Globe, MapPin, Share } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useEffect, useState } from "react"

interface MissionDetailsPageProps {
  params: {
    id: string
  }
}

export default function MissionDetailsPage({ params }: MissionDetailsPageProps) {
  // Démonstration : Normalement, vous chargeriez les données depuis une API en utilisant l'ID dans les params
  const missionId = params.id

  // Données fictives d'une mission pour la démonstration
  const [mission, setMission] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/missions/${params.id}`)
      .then((res) => res.json())
      .then((data) => setMission(data))
      .catch((err) => console.error("Erreur de chargement :", err))
  }, [params.id])
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/missions">Retour aux missions</Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm text-muted-foreground">Publiée le {mission?.publishedAt}</div>
        </div>

        <div className="grid gap-8">
          {/* En-tête de la mission */}
          <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{mission?.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{mission?.company}</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{mission?.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {mission?.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <Button asChild className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700">
              <Link href={`/missions/${mission?.id}/apply`}>Postuler à cette mission</Link>
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
                  <span>{mission?.startDate}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Durée</span>
                  </div>
                  <span>{mission?.duration}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <Globe className="h-4 w-4 mr-2" />
                    <span className="text-sm">Localisation</span>
                  </div>
                  <span>{mission?.location}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span className="text-sm">Tarif</span>
                  </div>
                  <span>{mission?.pricing}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description de la mission */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Description de la mission</h2>
              <div className="text-muted-foreground space-y-4 whitespace-pre-line">{mission?.description}</div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Compétences requises</h2>
              <div className="text-muted-foreground whitespace-pre-line">{mission?.requirements}</div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Contexte du projet</h2>
              <div className="text-muted-foreground">{mission?.projectContext}</div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">À propos de {mission?.company}</h2>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={mission?.companyLogo || "/placeholder.svg"}
                  alt={mission?.company}
                  className="h-12 w-12 rounded-md object-contain bg-gray-100 p-1"
                />
                <h3 className="font-medium">{mission?.company}</h3>
              </div>
              <div className="text-muted-foreground">{mission?.companyDescription}</div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild className="bg-violet-600 hover:bg-violet-700">
              <Link href={`/missions/${mission?.id}/apply`}>Postuler à cette mission</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/missions/${mission?.id}/share`}>
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
