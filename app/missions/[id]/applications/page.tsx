"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  Mail,
  MessageCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface ApplicationsPageProps {
  params: { id: string }
}

export default function ApplicationsPage() {
  const params = useParams()
  const missionId = params?.id as string  // ✅ récupération directe

  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


  // 🔹 Charger les candidatures depuis l’API (à brancher après avec Prisma)
  useEffect(() => {
    // Temporaire : données fictives
    setApplications([
      {
        id: "1",
        freelancer: {
          name: "Sophie Martin",
          avatar: "/placeholder.svg?height=50&width=50",
          profession: "Développeuse Full Stack React",
          location: "Lyon, France",
          experience: "5 ans",
          rating: 4.9,
          completedProjects: 23,
        },
        appliedAt: "05/04/2024",
        status: "Nouveau",
        dailyRate: "550€",
        availability: "Immédiatement",
        matchScore: 95,
        motivation: "Je suis très intéressée par cette mission car elle correspond parfaitement à mon expertise...",
        experience: "5 ans d'expérience en développement React...",
        portfolioLinks: ["https://github.com/sophie-martin"],
        skills: ["React", "TypeScript", "Redux", "Node.js", "AWS"],
      },
    ])
    setLoading(false)
  }, [])

const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
  try {
    const res = await fetch(
      `/api/missions/${missionId}/applications/${applicationId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      throw new Error("Erreur mise à jour: " + err)
    }

    const updated = await res.json()
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? updated : app))
    )
  } catch (err) {
    console.error(err)
  }
}


  // 🔹 Helpers couleurs
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nouveau":
        return "bg-violet-600"
      case "Contacté":
        return "bg-blue-600"
      case "Accepté":
        return "bg-green-600"
      case "Refusé":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-orange-600"
    return "text-gray-600"
  }

  if (loading) return <p className="p-6">Chargement...</p>

  const newApplications = applications.filter((a) => a.status === "Nouveau")
  const contactedApplications = applications.filter((a) => a.status === "Contacté")
  const acceptedApplications = applications.filter((a) => a.status === "Accepté")
  const rejectedApplications = applications.filter((a) => a.status === "Refusé")

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Retour */}
        <div className="flex items-center space-x-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/entreprise">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-md mb-6">
            <TabsTrigger value="all">Toutes ({applications.length})</TabsTrigger>
            <TabsTrigger value="new">Nouvelles ({newApplications.length})</TabsTrigger>
            <TabsTrigger value="contacted">Contactées ({contactedApplications.length})</TabsTrigger>
            <TabsTrigger value="rejected">Refusées ({rejectedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={application.freelancer.avatar} alt={application.freelancer.name} />
                          <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{application.freelancer.name}</CardTitle>
                          <CardDescription>{application.freelancer.profession}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{application.motivation}</p>
                    <Separator className="my-2" />
                    <div className="flex justify-end gap-2">
                      <Button
  size="sm"
  className="bg-green-600 hover:bg-green-700"
  onClick={() => handleUpdateStatus(application.id, "ACCEPTED")}
>
  Accepter
</Button>

<Button
  variant="outline"
  size="sm"
  className="text-red-600 hover:text-red-700"
  onClick={() => handleUpdateStatus(application.id, "REJECTED")}
>
  Refuser
</Button>

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
