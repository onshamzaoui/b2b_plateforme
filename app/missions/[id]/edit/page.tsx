"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2, ArrowLeft, Save, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EditMissionPageProps {
  params: { id: string }
}

export default function EditMissionPage({ params }: EditMissionPageProps) {
  const { toast } = useToast()
  const router = useRouter()
  const missionId = params.id

  const [mission, setMission] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [date, setDate] = useState<Date>()
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [hasApplications, setHasApplications] = useState(false)

  // ✅ Charger la mission depuis l’API
  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await fetch(`/api/missions/${missionId}`)
        if (!res.ok) throw new Error("Erreur chargement mission")
        const data = await res.json()
        setMission(data)
        setSkills(data.skills || [])
        if (data.startDate) setDate(new Date(data.startDate))
        setHasApplications((data.applicationsCount || 0) > 0)
      } catch (err) {
        console.error(err)
        toast({ title: "Erreur", description: "Impossible de charger la mission ❌", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchMission()
  }, [missionId, toast])

  // ✅ Ajouter / supprimer une skill
  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove))
  }

  // ✅ Mise à jour mission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/missions/${missionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...mission, skills, startDate: date ? date.toISOString() : null }),
      })
      if (!res.ok) throw new Error("Erreur mise à jour")
      toast({ title: "Succès", description: "Mission mise à jour avec succès ✅" })
      router.push("/dashboard/entreprise")
    } catch (err) {
      console.error(err)
      toast({ title: "Erreur", description: "Impossible de mettre à jour ❌", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ✅ Supprimer mission
  const handleDelete = async () => {
    if (!confirm("Supprimer cette mission ?")) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/missions/${missionId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erreur suppression")
      toast({ title: "Mission supprimée", description: "La mission a été supprimée ✅" })
      router.push("/dashboard/entreprise")
    } catch (err) {
      console.error(err)
      toast({ title: "Erreur", description: "Impossible de supprimer ❌", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="p-6">Chargement...</div>
  if (!mission) return <div className="p-6">Mission introuvable ❌</div>

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/entreprise">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm text-muted-foreground">
            Mission publiée le {new Date(mission.createdAt).toLocaleDateString("fr-FR")} •{" "}
            {mission.applicationsCount || 0} candidatures
          </div>
        </div>

        {hasApplications && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Cette mission a déjà reçu des candidatures. Les freelances seront notifiés des changements majeurs.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- Informations principales --- */}
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
              <CardDescription>Les informations essentielles de votre mission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={mission.title}
                  onChange={(e) => setMission({ ...mission, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={mission.description}
                  onChange={(e) => setMission({ ...mission, description: e.target.value })}
                  className="min-h-32"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="requirements">Prérequis</Label>
                <Textarea
                  id="requirements"
                  value={mission.requirements}
                  onChange={(e) => setMission({ ...mission, requirements: e.target.value })}
                  className="min-h-24"
                />
              </div>

              <div className="grid gap-2">
                <Label>Compétences clés</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter une compétence"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- Conditions mission --- */}
          <Card>
            <CardHeader>
              <CardTitle>Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Lieu</Label>
                  <Input
                    value={mission.location || ""}
                    onChange={(e) => setMission({ ...mission, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Ville</Label>
                  <Input
                    value={mission.city || ""}
                    onChange={(e) => setMission({ ...mission, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Durée</Label>
                  <Input
                    value={mission.duration || ""}
                    onChange={(e) => setMission({ ...mission, duration: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar selected={date} onSelect={setDate} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Budget min</Label>
                  <Input
                    type="number"
                    value={mission.budgetMin || ""}
                    onChange={(e) => setMission({ ...mission, budgetMin: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Budget max</Label>
                  <Input
                    type="number"
                    value={mission.budgetMax || ""}
                    onChange={(e) => setMission({ ...mission, budgetMax: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- Actions --- */}
          <div className="flex justify-between">
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </Button>
            <Button type="submit" className="bg-violet-600" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" /> Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
