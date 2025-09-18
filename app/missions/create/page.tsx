"use client"

import { useState } from "react"
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
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function CreateMissionPage() {
  const { toast } = useToast()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Champs principaux
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [projectContext, setProjectContext] = useState("")

  // Infos conditions
  const [location, setLocation] = useState("")
  const [duration, setDuration] = useState("")
  const [date, setDate] = useState<Date>()
  const [budget, setBudget] = useState<number>(0)
  const [pricing, setPricing] = useState("")

  // Informations entreprise
  const [companyDescription, setCompanyDescription] = useState("")
  const [companyLogo, setCompanyLogo] = useState("")

  // Skills
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          requirements,
          projectContext,
          location,
          duration,
          startDate: date ? date.toISOString() : null,
          budget: budget,
          pricing,
          skills,
          companyDescription,
          companyLogo,
        }),
      })
      if (!res.ok) {
        const errorText = await res.text()
        console.error("Réponse API:", res.status, errorText)
        throw new Error("Erreur lors de la création")
      }


      toast({
        title: "Mission publiée",
        description: "Votre mission a été publiée avec succès.",
      })

      router.push("/dashboard/entreprise")
    } catch (err) {
      console.error("Erreur création mission :", err)
      toast({
        title: "Erreur",
        description: "Impossible de publier la mission.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto w-screen py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Publier une mission</h1>
          <p className="text-muted-foreground">
            Décrivez précisément votre besoin pour attirer les meilleurs freelances.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- Infos principales --- */}
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
              <CardDescription>Les informations essentielles de votre mission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre de la mission</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Développement d'une application mobile React Native"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez précisément la mission, les tâches à réaliser et les livrables attendus..."
                  className="min-h-32"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="requirements">Compétences requises et prérequis</Label>
                <Textarea
                  id="requirements"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Listez les compétences techniques, l'expérience requise, et autres prérequis..."
                  className="min-h-24"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="projectContext">Contexte du projet</Label>
                <Textarea
                  id="projectContext"
                  value={projectContext}
                  onChange={(e) => setProjectContext(e.target.value)}
                  placeholder="Décrivez le contexte, les objectifs et l'environnement de travail..."
                  className="min-h-24"
                />
              </div>

              {/* Skills */}
              <div className="grid gap-2">
                <Label>Compétences clés</Label>
                <div className="flex gap-2">
                  <Input
                    id="skill"
                    placeholder="Ajouter une compétence"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddSkill()
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                      >
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
                )}
              </div>
            </CardContent>
          </Card>

          {/* --- Conditions mission --- */}
          <Card>
            <CardHeader>
              <CardTitle>Conditions de la mission</CardTitle>
              <CardDescription>Précisez les modalités pratiques de la mission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Lieu</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Paris, Remote, Lyon..."
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Durée estimée</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ex: 3 mois, 6 mois, Long terme..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="start-date">Date de début souhaitée</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="budget">Budget (€)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Budget total du projet"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="pricing">Tarification</Label>
                  <Input
                    id="pricing"
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                    placeholder="Ex: Forfait, Journalier, Mensuel..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- Informations entreprise --- */}
          <Card>
            <CardHeader>
              <CardTitle>Informations entreprise</CardTitle>
              <CardDescription>Informations sur votre entreprise pour cette mission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="companyDescription">Description de l'entreprise</Label>
                <Textarea
                  id="companyDescription"
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className="min-h-24"
                  placeholder="Présentez votre entreprise, sa culture, ses valeurs..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="companyLogo">Logo de l'entreprise (URL)</Label>
                <Input
                  id="companyLogo"
                  value={companyLogo}
                  onChange={(e) => setCompanyLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </CardContent>
          </Card>

          {/* --- Submit --- */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Enregistrer en brouillon
            </Button>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
              {isSubmitting ? "Publication en cours..." : "Publier la mission"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
