"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Trash2, Upload } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "Node.js", "Next.js"])
  const [newSkill, setNewSkill] = useState("")

  // Profil d'utilisateur fictif
  const user = {
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    role: "freelance",
    profileImage: "/placeholder.svg?height=150&width=150",
    profession: "Développeuse Web Full Stack",
    bio: "Développeuse web passionnée avec 5 ans d'expérience dans la création d'applications web modernes. Spécialisée dans React, Node.js et Next.js. Je recherche des projets stimulants où je peux apporter mon expertise technique et ma créativité.",
    location: "Lyon, France",
    dailyRate: "500",
    availability: "Disponible à partir du 15/05/2024",
    experience: "5 ans",
  }

  const handleSkillAdd = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill("")
    }
  }

  const handleSkillRemove = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulation de mise à jour
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été enregistrées avec succès.",
      })
    }, 1000)
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
          <p className="text-muted-foreground">
            Complétez votre profil pour maximiser vos chances de trouver des missions
          </p>
        </div>

        <Tabs defaultValue="information">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
            <TabsTrigger value="information">Informations</TabsTrigger>
            <TabsTrigger value="professional">Professionnel</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="information">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Photo de profil</CardTitle>
                  <CardDescription>
                    Une photo de profil professionnelle augmente vos chances d'être remarqué
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button type="button" variant="outline" className="w-full sm:w-auto">
                        <Upload className="mr-2 h-4 w-4" />
                        Changer la photo
                      </Button>
                      <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. 1MB max.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Vos informations sont visibles uniquement pour les entreprises intéressées par votre profil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" defaultValue={user.name.split(" ")[0]} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" defaultValue={user.name.split(" ")[1]} required />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input id="location" defaultValue={user.location} placeholder="Ville, Pays" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="professional">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profil professionnel</CardTitle>
                  <CardDescription>
                    Ces informations seront visibles par les entreprises cherchant des freelances
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="profession">Titre professionnel</Label>
                    <Input
                      id="profession"
                      defaultValue={user.profession}
                      placeholder="Ex: Développeur Full Stack React"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Votre titre principal qui apparaîtra en premier sur votre profil
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Présentation</Label>
                    <Textarea
                      id="bio"
                      defaultValue={user.bio}
                      placeholder="Décrivez votre parcours, vos compétences et vos expériences..."
                      className="min-h-32"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="experience">Années d'expérience</Label>
                      <Input id="experience" defaultValue={user.experience} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dailyRate">Taux journalier (€)</Label>
                      <Input id="dailyRate" type="number" defaultValue={user.dailyRate} min="0" required />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="availability">Disponibilité</Label>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-grow">
                        <Calendar className="mr-2 h-4 w-4" />
                        Sélectionner une date
                      </Button>
                      <Select
                        options={[
                          { value: "available", label: "Disponible immédiatement" },
                          { value: "partial", label: "Partiellement disponible" },
                          { value: "unavailable", label: "Indisponible actuellement" },
                        ]}
                        defaultValue="available"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compétences</CardTitle>
                  <CardDescription>
                    Ajoutez vos compétences techniques pour être visible sur les missions correspondantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter une compétence"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleSkillAdd()
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={handleSkillAdd}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => handleSkillRemove(skill)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Supprimer {skill}</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="settings">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres du compte</CardTitle>
                  <CardDescription>Gérez les paramètres de votre compte FreelanceConnect</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notifications</CardTitle>
                  <CardDescription>Contrôlez les notifications que vous recevez</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="new-missions">Nouvelles missions</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications pour les nouvelles missions correspondant à votre profil
                      </p>
                    </div>
                    <Switch id="new-missions" checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="application-updates">Mises à jour de candidatures</Label>
                      <p className="text-sm text-muted-foreground">Notifications sur l'état de vos candidatures</p>
                    </div>
                    <Switch id="application-updates" checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing">Communications marketing</Label>
                      <p className="text-sm text-muted-foreground">Offres spéciales et mises à jour produit</p>
                    </div>
                    <Switch id="marketing" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Ces composants simplifiés sont fournis pour que la page fonctionne
// Dans un projet réel, vous utiliseriez des composants plus complets
function Select({ options, defaultValue }: { options: { value: string; label: string }[]; defaultValue?: string }) {
  return (
    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
      {options.map((option) => (
        <option key={option.value} value={option.value} selected={option.value === defaultValue}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

function Switch({ id, checked }: { id: string; checked?: boolean }) {
  return (
    <div
      className="h-6 w-11 rounded-full bg-muted p-1 flex items-center data-[state=checked]:bg-violet-600 data-[state=checked]:justify-end"
      data-state={checked ? "checked" : "unchecked"}
    >
      <span className="block h-4 w-4 rounded-full bg-white transition-transform" />
    </div>
  )
}
