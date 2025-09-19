'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, Mail, Phone, Users, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ContactPage() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    companySize: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      companySize: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Votre demande a été envoyée avec succès ! Notre équipe vous contactera dans les 24h.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        companySize: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12 mx-auto w-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/tarifs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux tarifs
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {plan === 'enterprise' 
                ? 'Découvrez notre solution Enterprise sur mesure pour votre organisation'
                : 'Nous sommes là pour vous accompagner dans votre projet'
              }
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Demande de contact
              </CardTitle>
              <CardDescription>
                Remplissez ce formulaire et notre équipe vous contactera dans les 24h
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jean Dupont"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email professionnel *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jean@entreprise.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Nom de l'entreprise *</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Mon Entreprise"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize">Taille de l'entreprise</Label>
                  <Select value={formData.companySize} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la taille de votre entreprise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employés</SelectItem>
                      <SelectItem value="11-50">11-50 employés</SelectItem>
                      <SelectItem value="51-200">51-200 employés</SelectItem>
                      <SelectItem value="201-500">201-500 employés</SelectItem>
                      <SelectItem value="500+">500+ employés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={
                      plan === 'enterprise' 
                        ? "Décrivez vos besoins spécifiques pour la solution Enterprise : intégrations, fonctionnalités personnalisées, nombre d'utilisateurs, etc."
                        : "Décrivez votre projet et vos besoins..."
                    }
                    rows={6}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-violet-600 hover:bg-violet-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer la demande
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {plan === 'enterprise' && (
              <Card className="border-violet-200 bg-violet-50 dark:bg-violet-950/20 dark:border-violet-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-violet-800 dark:text-violet-200">
                    <Building className="h-5 w-5" />
                    Solution Enterprise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-violet-800 dark:text-violet-200">Solution sur mesure</h4>
                        <p className="text-sm text-violet-700 dark:text-violet-300">
                          Développement de fonctionnalités spécifiques à vos besoins
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-violet-800 dark:text-violet-200">Intégration SSO</h4>
                        <p className="text-sm text-violet-700 dark:text-violet-300">
                          Connexion sécurisée avec vos systèmes existants
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-violet-800 dark:text-violet-200">Manager de compte dédié</h4>
                        <p className="text-sm text-violet-700 dark:text-violet-300">
                          Support personnalisé et accompagnement continu
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-violet-800 dark:text-violet-200">SLA garanti</h4>
                        <p className="text-sm text-violet-700 dark:text-violet-300">
                          Temps de réponse et disponibilité garantis
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
                <CardDescription>
                  Notre équipe est disponible pour répondre à vos questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg">
                    <Mail className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">contact@freelanceconnect.fr</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg">
                    <Phone className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg">
                    <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-sm text-muted-foreground">Lun-Ven: 9h-18h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pourquoi nous choisir ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm">Plus de 10 000 freelances qualifiés</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm">Sécurité et conformité garanties</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm">Support technique 24/7</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm">Intégration facile avec vos outils</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrapper component with Suspense boundary
function ContactPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading contact page...</div>}>
      <ContactPage />
    </Suspense>
  )
}

export default ContactPageWithSuspense
