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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar, Plus, Trash2, Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
  companyName?: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  profileImage?: string
  profession?: string
  bio?: string
  experience?: string
  dailyRate?: number
  availability?: string
  skills?: string[]
  portfolio?: string[]
  companyDescription?: string
  companySize?: string
  companySector?: string
  companyWebsite?: string
  companyLogo?: string
  notificationsNewMissions?: boolean
  notificationsApplications?: boolean
  notificationsMarketing?: boolean
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [portfolio, setPortfolio] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [newPortfolioItem, setNewPortfolioItem] = useState("")
  const [cvs, setCvs] = useState<Array<{id: string, title: string, path: string, createdAt: string}>>([])
  const [isUploadingCV, setIsUploadingCV] = useState(false)
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false)
  
  // Form state for Select components
  const [availability, setAvailability] = useState("available")
  const [companySize, setCompanySize] = useState("small")
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    notificationsNewMissions: true,
    notificationsApplications: true,
    notificationsMarketing: false
  })

  const loadCVs = async () => {
    try {
      const response = await fetch("/api/user/cv")
      if (response.ok) {
        const cvsData = await response.json()
        setCvs(cvsData)
      }
    } catch (error) {
      console.error("Erreur chargement CVs:", error)
    }
  }

  // Charger les données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "loading") return
      
      if (!session) {
        router.push("/auth/login")
        return
      }

      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setSkills(userData.skills || [])
          setPortfolio(userData.portfolio || [])
          setAvailability(userData.availability || "available")
          setCompanySize(userData.companySize || "small")
          setNotifications({
            notificationsNewMissions: userData.notificationsNewMissions ?? true,
            notificationsApplications: userData.notificationsApplications ?? true,
            notificationsMarketing: userData.notificationsMarketing ?? false
          })
          
          // Load CVs - moved to separate try-catch to avoid initialization error
          try {
            await loadCVs()
          } catch (cvError) {
            console.error("Erreur chargement CVs:", cvError)
            // Don't show error toast for CV loading failure as it's not critical
          }
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les données du profil",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Erreur chargement profil:", error)
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement du profil",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [session, status, router, toast])

  // Redirection si non authentifié
  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du profil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profil non trouvé</h1>
          <p className="text-muted-foreground mb-4">Impossible de charger les informations du profil.</p>
          <Button onClick={() => router.push("/auth/login")}>
            Se connecter
          </Button>
        </div>
      </div>
    )
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

  const handlePortfolioAdd = () => {
    if (newPortfolioItem && !portfolio.includes(newPortfolioItem)) {
      setPortfolio([...portfolio, newPortfolioItem])
      setNewPortfolioItem("")
    }
  }

  const handlePortfolioRemove = (itemToRemove: string) => {
    setPortfolio(portfolio.filter((item) => item !== itemToRemove))
  }

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingCV(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", file.name.replace(/\.[^/.]+$/, "")) // Remove extension for title

      const response = await fetch("/api/user/cv", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const newCV = await response.json()
        setCvs([newCV, ...cvs])
        toast({
          title: "✅ CV téléchargé avec succès",
          description: "Votre CV a été sauvegardé.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Erreur lors du téléchargement du CV",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erreur upload CV:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement du CV",
        variant: "destructive"
      })
    } finally {
      setIsUploadingCV(false)
      // Reset file input
      e.target.value = ""
    }
  }

  const handleCVDelete = async (cvId: string) => {
    try {
      const response = await fetch(`/api/user/cv?id=${cvId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCvs(cvs.filter(cv => cv.id !== cvId))
        toast({
          title: "✅ CV supprimé",
          description: "Votre CV a été supprimé avec succès.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Erreur lors de la suppression du CV",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erreur suppression CV:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du CV",
        variant: "destructive"
      })
    }
  }

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide",
        variant: "destructive"
      })
      return
    }

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image doit faire moins de 1MB",
        variant: "destructive"
      })
      return
    }

    setIsUploadingProfileImage(true)
    try {
      const formData = new FormData()
      formData.append("profileImage", file)

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        toast({
          title: "✅ Photo de profil mise à jour",
          description: "Votre photo de profil a été mise à jour avec succès.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Erreur lors de la mise à jour de la photo",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erreur upload photo:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la photo",
        variant: "destructive"
      })
    } finally {
      setIsUploadingProfileImage(false)
      // Reset file input
      e.target.value = ""
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPasswordSubmitting(true)

    try {
      // Validation côté client
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast({
          title: "Erreur",
          description: "Les nouveaux mots de passe ne correspondent pas",
          variant: "destructive"
        })
        return
      }

      if (passwordForm.newPassword.length < 8) {
        toast({
          title: "Erreur",
          description: "Le nouveau mot de passe doit contenir au moins 8 caractères",
          variant: "destructive"
        })
        return
      }

      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordForm),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Mot de passe mis à jour avec succès",
        })
        // Reset form
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la mise à jour du mot de passe",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erreur mise à jour mot de passe:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du mot de passe",
        variant: "destructive"
      })
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const updateData = {
        name: (formData.get("name") as string) || "",
        email: (formData.get("email") as string) || "",
        companyName: (formData.get("companyName") as string) || "",
        phone: (formData.get("phone") as string) || "",
        location: (formData.get("location") as string) || "",
        website: (formData.get("website") as string) || "",
        linkedin: (formData.get("linkedin") as string) || "",
        github: (formData.get("github") as string) || "",
        profession: (formData.get("profession") as string) || "",
        bio: (formData.get("bio") as string) || "",
        experience: (formData.get("experience") as string) || "",
        dailyRate: formData.get("dailyRate") ? parseInt(formData.get("dailyRate") as string) : undefined,
        availability: availability,
        skills: skills,
        portfolio: portfolio,
        companyDescription: (formData.get("companyDescription") as string) || "",
        companySize: companySize,
        companySector: (formData.get("companySector") as string) || "",
        companyWebsite: (formData.get("companyWebsite") as string) || "",
        notificationsNewMissions: notifications.notificationsNewMissions,
        notificationsApplications: notifications.notificationsApplications,
        notificationsMarketing: notifications.notificationsMarketing,
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        toast({
          title: "✅ Profil mis à jour avec succès",
          description: "Toutes vos informations ont été sauvegardées dans la base de données.",
        })
      } else {
        throw new Error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Erreur mise à jour profil:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
          <p className="text-muted-foreground">
            {user.role === "FREELANCE" 
              ? "Complétez votre profil pour maximiser vos chances de trouver des missions"
              : "Gérez les informations de votre entreprise"
            }
          </p>
          <Badge variant="outline" className="mt-2">
            {user.role === "FREELANCE" ? "Freelance" : "Entreprise"}
          </Badge>
        </div>

        <Tabs defaultValue="information">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="information">Informations</TabsTrigger>
              <TabsTrigger value="professional">Professionnel</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>
          </div>

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
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          disabled={isUploadingProfileImage}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          id="profile-image-upload"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full sm:w-auto"
                          disabled={isUploadingProfileImage}
                        >
                          {isUploadingProfileImage ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-600 mr-2"></div>
                              Upload en cours...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Changer la photo
                            </>
                          )}
                        </Button>
                      </div>
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
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" name="name" defaultValue={user.name} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={user.email} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      defaultValue={user.phone || ""} 
                      placeholder="+33 6 12 34 56 78" 
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      defaultValue={user.location || ""} 
                      placeholder="Paris, France" 
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="website">Site web personnel</Label>
                    <Input 
                      id="website" 
                      name="website" 
                      type="url" 
                      defaultValue={user.website || ""} 
                      placeholder="https://monsite.com" 
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input 
                      id="linkedin" 
                      name="linkedin" 
                      type="url" 
                      defaultValue={user.linkedin || ""} 
                      placeholder="https://linkedin.com/in/votreprofil" 
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input 
                      id="github" 
                      name="github" 
                      type="url" 
                      defaultValue={user.github || ""} 
                      placeholder="https://github.com/votreprofil" 
                    />
                  </div>

                  {user.role === "ENTREPRISE" && (
                    <div className="grid gap-2">
                      <Label htmlFor="companyName">Nom de l'entreprise</Label>
                      <Input 
                        id="companyName" 
                        name="companyName" 
                        defaultValue={user.companyName || ""} 
                        placeholder="Nom de votre entreprise" 
                      />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="role">Type de compte</Label>
                    <Input 
                      id="role" 
                      value={user.role === "FREELANCE" ? "Freelance" : "Entreprise"} 
                      disabled 
                      className="bg-muted"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="createdAt">Membre depuis</Label>
                    <Input 
                      id="createdAt" 
                      value={new Date(user.createdAt).toLocaleDateString("fr-FR")} 
                      disabled 
                      className="bg-muted"
                    />
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
              {user.role === "FREELANCE" ? (
                <>
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
                          name="profession"
                          defaultValue={user.profession || ""}
                          placeholder="Ex: Développeur Full Stack React"
                        />
                        <p className="text-xs text-muted-foreground">
                          Votre titre principal qui apparaîtra en premier sur votre profil
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="bio">Présentation</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          defaultValue={user.bio || ""}
                          placeholder="Décrivez votre parcours, vos compétences et vos expériences..."
                          className="min-h-32"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="experience">Années d'expérience</Label>
                          <Input 
                            id="experience" 
                            name="experience"
                            defaultValue={user.experience || ""}
                            placeholder="Ex: 5 ans" 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dailyRate">Taux journalier (€)</Label>
                          <Input 
                            id="dailyRate" 
                            name="dailyRate"
                            type="number" 
                            defaultValue={user.dailyRate || ""}
                            placeholder="500" 
                            min="0" 
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="availability">Disponibilité</Label>
                        <Select value={availability} onValueChange={setAvailability}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner votre disponibilité" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Disponible immédiatement</SelectItem>
                            <SelectItem value="partial">Partiellement disponible</SelectItem>
                            <SelectItem value="unavailable">Indisponible actuellement</SelectItem>
                          </SelectContent>
                        </Select>
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

                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio</CardTitle>
                      <CardDescription>
                        Ajoutez des liens vers vos projets et réalisations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ajouter un lien (GitHub, site web, etc.)"
                            value={newPortfolioItem}
                            onChange={(e) => setNewPortfolioItem(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handlePortfolioAdd()
                              }
                            }}
                          />
                          <Button type="button" variant="outline" onClick={handlePortfolioAdd}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {portfolio.map((item, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              <a href={item} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {item}
                              </a>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => handlePortfolioRemove(item)}
                              >
                                <Trash2 className="h-3 w-3" />
                                <span className="sr-only">Supprimer {item}</span>
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>CVs</CardTitle>
                      <CardDescription>
                        Téléchargez vos CVs pour les partager avec les entreprises
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cv-upload">Télécharger un CV</Label>
                        <div className="flex gap-2">
                          <Input
                            id="cv-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleCVUpload}
                            disabled={isUploadingCV}
                            className="flex-1"
                          />
                          {isUploadingCV && (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-600"></div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Formats acceptés: PDF, DOC, DOCX. Taille maximale: 5MB
                        </p>
                      </div>

                      {cvs.length > 0 && (
                        <div className="space-y-2">
                          <Label>Vos CVs</Label>
                          <div className="space-y-2">
                            {cvs.map((cv) => (
                              <div key={cv.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/20 rounded flex items-center justify-center">
                                    <span className="text-violet-600 dark:text-violet-400 text-sm font-medium">CV</span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{cv.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Ajouté le {new Date(cv.createdAt).toLocaleDateString("fr-FR")}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                  >
                                    <a href={cv.path} target="_blank" rel="noopener noreferrer">
                                      Voir
                                    </a>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCVDelete(cv.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Informations entreprise</CardTitle>
                    <CardDescription>
                      Informations sur votre entreprise visibles par les freelances
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="companyDescription">Description de l'entreprise</Label>
                      <Textarea
                        id="companyDescription"
                        name="companyDescription"
                        defaultValue={user.companyDescription || ""}
                        placeholder="Décrivez votre entreprise, son secteur d'activité et ses valeurs..."
                        className="min-h-32"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="companySize">Taille de l'entreprise</Label>
                      <Select value={companySize} onValueChange={setCompanySize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner la taille" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="startup">Startup (1-10 employés)</SelectItem>
                          <SelectItem value="small">PME (11-50 employés)</SelectItem>
                          <SelectItem value="medium">Moyenne entreprise (51-250 employés)</SelectItem>
                          <SelectItem value="large">Grande entreprise (250+ employés)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="companySector">Secteur d'activité</Label>
                      <Input
                        id="companySector"
                        name="companySector"
                        defaultValue={user.companySector || ""}
                        placeholder="Ex: Technologies, Finance, E-commerce..."
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="companyWebsite">Site web de l'entreprise</Label>
                      <Input
                        id="companyWebsite"
                        name="companyWebsite"
                        type="url"
                        defaultValue={user.companyWebsite || ""}
                        placeholder="https://monentreprise.com"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end">
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres du compte</CardTitle>
                    <CardDescription>Gérez les paramètres de votre compte FreelanceConnect</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input 
                        id="current-password" 
                        name="currentPassword"
                        type="password" 
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input 
                        id="new-password" 
                        name="newPassword"
                        type="password" 
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        minLength={8}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Le mot de passe doit contenir au moins 8 caractères
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                      <Input 
                        id="confirm-password" 
                        name="confirmPassword"
                        type="password" 
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Button 
                      type="submit" 
                      className="bg-violet-600 hover:bg-violet-700" 
                      disabled={isPasswordSubmitting}
                    >
                      {isPasswordSubmitting ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                    </Button>
                  </div>
                </Card>
              </form>

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
                    <Switch 
                      id="new-missions" 
                      checked={notifications.notificationsNewMissions}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, notificationsNewMissions: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="application-updates">Mises à jour de candidatures</Label>
                      <p className="text-sm text-muted-foreground">Notifications sur l'état de vos candidatures</p>
                    </div>
                    <Switch 
                      id="application-updates" 
                      checked={notifications.notificationsApplications}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, notificationsApplications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing">Communications marketing</Label>
                      <p className="text-sm text-muted-foreground">Offres spéciales et mises à jour produit</p>
                    </div>
                    <Switch 
                      id="marketing" 
                      checked={notifications.notificationsMarketing}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, notificationsMarketing: checked }))
                      }
                    />
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button 
                    className="bg-violet-600 hover:bg-violet-700" 
                    disabled={isSubmitting}
                    onClick={async () => {
                      try {
                        const response = await fetch("/api/user/profile", {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            notificationsNewMissions: notifications.notificationsNewMissions,
                            notificationsApplications: notifications.notificationsApplications,
                            notificationsMarketing: notifications.notificationsMarketing,
                          }),
                        })

                         if (response.ok) {
                           toast({
                             title: "✅ Notifications mises à jour",
                             description: "Vos préférences de notifications ont été sauvegardées.",
                           })
                         } else {
                          throw new Error("Erreur lors de la mise à jour")
                        }
                      } catch (error) {
                        toast({
                          title: "Erreur",
                          description: "Impossible de mettre à jour les préférences",
                          variant: "destructive"
                        })
                      }
                    }}
                  >
                    {isSubmitting ? "Enregistrement..." : "Enregistrer les préférences"}
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}