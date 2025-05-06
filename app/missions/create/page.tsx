"use client"

import type React from "react"

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
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateMissionPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date>()
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

    // Simulation de création de mission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Mission publiée",
        description: "Votre mission a été publiée avec succès.",
      })
      router.push("/dashboard/entreprise")
    }, 1500)
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Publier une mission</h1>
          <p className="text-muted-foreground">
            Décrivez précisément votre besoin pour attirer les meilleurs freelances.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
              <CardDescription>Les informations essentielles de votre mission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre de la mission</Label>
                <Input id="title" placeholder="Ex: Développement d'une application mobile React Native" required />
                <p className="text-xs text-muted-foreground">
                  Choisissez un titre clair qui décrit précisément la mission
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez précisément la mission, les tâches à réaliser et les livrables attendus..."
                  className="min-h-32"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="requirements">Compétences requises et prérequis</Label>
                <Textarea
                  id="requirements"
                  placeholder="Listez les compétences techniques, l'expérience requise, et autres prérequis..."
                  className="min-h-24"
                  required
                />
              </div>

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
                          <span className="sr-only">Supprimer {skill}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conditions de la mission</CardTitle>
              <CardDescription>Précisez les modalités pratiques de la mission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Lieu de travail</Label>
                  <Select defaultValue="remote">
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Sélectionnez un type de travail" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Télétravail (100% remote)</SelectItem>
                      <SelectItem value="onsite">Sur site</SelectItem>
                      <SelectItem value="hybrid">Hybride</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="city">Ville (si sur site/hybride)</Label>
                  <Input id="city" placeholder="Ex: Paris" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Durée estimée</Label>
                  <Select defaultValue="3months">
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Sélectionnez une durée" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">1 mois</SelectItem>
                      <SelectItem value="3months">3 mois</SelectItem>
                      <SelectItem value="6months">6 mois</SelectItem>
                      <SelectItem value="longterm">Long terme (6+ mois)</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="workload">Charge de travail</Label>
                  <Select defaultValue="fulltime">
                    <SelectTrigger id="workload">
                      <SelectValue placeholder="Sélectionnez une charge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">Temps plein (5j/semaine)</SelectItem>
                      <SelectItem value="parttime">Temps partiel (2-3j/semaine)</SelectItem>
                      <SelectItem value="punctual">Ponctuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="budget-range">Budget / TJM</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input id="budget-min" type="number" placeholder="Min €" min="0" />
                    <Input id="budget-max" type="number" placeholder="Max €" min="0" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
