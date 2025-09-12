"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock } from "lucide-react"
import { useSession } from "next-auth/react"

export default function MissionsPage() {
  const { data: session, status } = useSession()
  const [missions, setMissions] = useState<any[]>([])
  const [userApplications, setUserApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch missions
        const missionsResponse = await fetch("/api/missions")
        const missionsData = await missionsResponse.json()
        
        if (Array.isArray(missionsData)) {
          setMissions(missionsData)
        } else {
          console.error("Réponse inattendue:", missionsData)
          setMissions([])
        }

        // Fetch user applications if authenticated
        if (session?.user?.id) {
          const applicationsResponse = await fetch("/api/dashboard/freelance")
          if (applicationsResponse.ok) {
            const dashboardData = await applicationsResponse.json()
            setUserApplications(dashboardData.applications || [])
          }
        }
      } catch (err) {
        console.error("Erreur de chargement :", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  if (loading) {
    return <div className="container py-8 text-center mx-auto w-screen">Chargement des missions...</div>
  }

  if (missions.length === 0) {
    return <div className="container py-8 text-center mx-auto w-screen">Aucune mission disponible</div>
  }

  return (
    <div className="container mx-auto w-screen py-8">
      <h1 className="text-3xl font-bold mb-6">Toutes les missions</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {missions.map((mission) => {
          const hasApplied = userApplications.some((app: any) => app.missionId === mission.id)
          
          return (
            <Card key={mission.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  {mission.createdAt && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(mission.createdAt).toLocaleDateString('fr-FR')}
                    </Badge>  
                  )}
                  {mission.duration && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {mission.duration}
                    </Badge>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold mb-2">{mission.title}</h2>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {mission.company?.companyName || mission.company?.name}
                </p>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {mission.description}
                </p>
                
                {mission.skills && mission.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mission.skills.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mission.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mission.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/missions/${mission.id}`}>Détails</Link>
                  </Button>
                  
                  {session?.user?.role === "FREELANCE" ? (
                    hasApplied ? (
                      <Button disabled className="bg-green-600 hover:bg-green-700 text-white flex-1">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Candidature envoyée
                      </Button>
                    ) : (
                      <Button asChild className="bg-violet-600 hover:bg-violet-700 flex-1">
                        <Link href={`/missions/${mission.id}/apply`}>Postuler</Link>
                      </Button>
                    )
                  ) : (
                    <Button asChild className="bg-violet-600 hover:bg-violet-700 flex-1">
                      <Link href={`/missions/${mission.id}`}>Voir les détails</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
