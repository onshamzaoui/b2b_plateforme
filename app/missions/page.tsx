"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MissionsPage() {
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/missions")
      .then((res) => res.json())
      .then((data) => {
        // Sécurité : si l’API ne renvoie pas un tableau
        if (Array.isArray(data)) {
          setMissions(data)
        } else {
          console.error("Réponse inattendue:", data)
          setMissions([])
        }
      })
      .catch((err) => console.error("Erreur de chargement :", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="container py-8 text-center">Chargement des missions...</div>
  }

  if (missions.length === 0) {
    return <div className="container py-8 text-center">Aucune mission disponible</div>
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Toutes les missions</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {missions.map((mission) => (
          <Card key={mission.id}>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">{mission.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{mission.description}</p>
              <Button asChild className="bg-violet-600 hover:bg-violet-700 w-full">
                <Link href={`/missions/${mission.id}`}>Voir les détails</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
