"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Share } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function MissionDetailsPage() {
  const params = useParams()
  const id = params?.id as string

  const [mission, setMission] = useState<any>(null)

  useEffect(() => {
  fetch(`/api/missions/${id}`)
    .then(async (res) => {
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue")
      }
      return data
    })
    .then((data) => setMission(data))
    // .catch((err) => console.error("Erreur de chargement :", err.message))
}, [id])


  if (!mission) {
    // return <div className="container py-8 text-center">Chargement...</div>
   return <div className="container py-8 text-center">Mission non trouvée</div>
 }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/missions">Retour aux missions</Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm text-muted-foreground">
            Publiée le {new Date(mission.publishedAt).toLocaleDateString("fr-FR")}
          </div>
        </div>

        <div className="grid gap-8">
          <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{mission.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{mission.company?.name}</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{mission.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {mission.skills?.map((skill: string) => (
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
        </div>
      </div>
    </div>
  )
}
