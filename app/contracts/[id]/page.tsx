"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, Check, X, Calendar, Euro, User, Building, MapPin, Receipt } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ContractPDFGenerator } from "@/components/contract-pdf-generator"

export default function ContractPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const contractId = params?.id as string

  const [contract, setContract] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [generatingInvoice, setGeneratingInvoice] = useState(false)

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch(`/api/contracts/${contractId}`)
        if (response.ok) {
          const data = await response.json()
          setContract(data)
        } else {
          toast({
            title: "Erreur",
            description: "Contrat non trouvé",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Erreur chargement contrat:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger le contrat",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (contractId) {
      fetchContract()
    }
  }, [contractId, toast])

  const handleSign = async () => {
    setSigning(true)
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sign" })
      })

      if (response.ok) {
        const updatedContract = await response.json()
        setContract(updatedContract)
        toast({
          title: "Succès",
          description: "Contrat signé avec succès"
        })
      } else {
        throw new Error("Erreur lors de la signature")
      }
    } catch (error) {
      console.error("Erreur signature:", error)
      toast({
        title: "Erreur",
        description: "Impossible de signer le contrat",
        variant: "destructive"
      })
    } finally {
      setSigning(false)
    }
  }

  const handleGenerateInvoice = async () => {
    setGeneratingInvoice(true)
    try {
      const response = await fetch("/api/invoices/generate-from-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: contract.id,
          amount: contract.dailyRate,
          description: `Facture pour le contrat: ${contract.title}`
        })
      })

      if (response.ok) {
        const invoice = await response.json()
        toast({
          title: "Succès",
          description: "Facture générée avec succès"
        })
        router.push(`/invoices/${invoice.id}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la génération")
      }
    } catch (error) {
      console.error("Erreur génération facture:", error)
      toast({
        title: "Erreur",
        description: "Impossible de générer la facture",
        variant: "destructive"
      })
    } finally {
      setGeneratingInvoice(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-600"
      case "PENDING_SIGNATURE":
        return "bg-yellow-600"
      case "ACTIVE":
        return "bg-green-600"
      case "COMPLETED":
        return "bg-blue-600"
      case "CANCELLED":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Brouillon"
      case "PENDING_SIGNATURE":
        return "En attente de signature"
      case "ACTIVE":
        return "Actif"
      case "COMPLETED":
        return "Terminé"
      case "CANCELLED":
        return "Annulé"
      default:
        return status
    }
  }

  const canSign = () => {
    if (!contract || !session) return false
    
    if (session.user.role === "FREELANCE") {
      return contract.freelancerId === session.user.id && !contract.signedByFreelancer
    } else if (session.user.role === "ENTREPRISE") {
      return contract.companyId === session.user.id && !contract.signedByCompany
    }
    
    return false
  }

  if (loading) {
    return <div className="container py-8 text-center">Chargement...</div>
  }

  if (!contract) {
    return <div className="container py-8 text-center">Contrat non trouvé</div>
  }

  return (
    <div className="container mx-auto w-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/contracts">
              ← Retour aux contrats
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm text-muted-foreground">
            Créé le {new Date(contract.createdAt).toLocaleDateString("fr-FR")}
          </div>
        </div>

        <div className="grid gap-8">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{contract.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {contract.description}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(contract.status)}>
                  {getStatusText(contract.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Freelance</p>
                    <p className="text-sm text-muted-foreground">{contract.freelancer?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Entreprise</p>
                    <p className="text-sm text-muted-foreground">
                      {contract.company?.name || contract.company?.companyName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Taux journalier</p>
                    <p className="text-sm text-muted-foreground">{contract.dailyRate}€</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Details */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mission Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails de la mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Mission</h4>
                    <p className="text-muted-foreground">{contract.mission?.title}</p>
                  </div>
                  {contract.mission?.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{contract.mission.description}</p>
                    </div>
                  )}
                  {contract.mission?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contract.mission.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contract Terms */}
              <Card>
                <CardHeader>
                  <CardTitle>Conditions du contrat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Date de début</h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(contract.startDate).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                      {contract.endDate && (
                        <div>
                          <h4 className="font-medium mb-1">Date de fin</h4>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(contract.endDate).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Conditions générales</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap font-sans">
                          {contract.terms}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Signatures */}
              <Card>
                <CardHeader>
                  <CardTitle>Signatures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Freelance</span>
                    {contract.signedByFreelancer ? (
                      <Badge className="bg-green-600">
                        <Check className="mr-1 h-3 w-3" />
                        Signé
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <X className="mr-1 h-3 w-3" />
                        En attente
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Entreprise</span>
                    {contract.signedByCompany ? (
                      <Badge className="bg-green-600">
                        <Check className="mr-1 h-3 w-3" />
                        Signé
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <X className="mr-1 h-3 w-3" />
                        En attente
                      </Badge>
                    )}
                  </div>
                  
                  {contract.signedAt && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Signé le {new Date(contract.signedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ContractPDFGenerator contract={contract} className="w-full" />
                  
                  {canSign() && (
                    <Button 
                      onClick={handleSign}
                      disabled={signing}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {signing ? "Signature..." : "Signer le contrat"}
                    </Button>
                  )}
                  
                  {session?.user?.role === "FREELANCE" && contract?.status === "ACTIVE" && (
                    <Button 
                      onClick={handleGenerateInvoice}
                      disabled={generatingInvoice}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      {generatingInvoice ? "Génération..." : "Générer une facture"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
