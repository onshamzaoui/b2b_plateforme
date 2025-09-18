"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, Check, X, Calendar, Euro, User, Building, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function InvoicePage() {
  const params = useParams()
  const { data: session } = useSession()
  const { toast } = useToast()
  const invoiceId = params?.id as string

  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [markingAsPaid, setMarkingAsPaid] = useState(false)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${invoiceId}`)
        if (response.ok) {
          const data = await response.json()
          setInvoice(data)
        } else {
          toast({
            title: "Erreur",
            description: "Facture non trouvée",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Erreur chargement facture:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger la facture",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (invoiceId) {
      fetchInvoice()
    }
  }, [invoiceId, toast])

  const handleMarkAsPaid = async () => {
    setMarkingAsPaid(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "mark_paid",
          paymentMethod: "Bank Transfer"
        })
      })

      if (response.ok) {
        const updatedInvoice = await response.json()
        setInvoice(updatedInvoice)
        toast({
          title: "Succès",
          description: "Facture marquée comme payée"
        })
      } else {
        throw new Error("Erreur lors du marquage")
      }
    } catch (error) {
      console.error("Erreur marquage facture:", error)
      toast({
        title: "Erreur",
        description: "Impossible de marquer la facture comme payée",
        variant: "destructive"
      })
    } finally {
      setMarkingAsPaid(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-600"
      case "PAID":
        return "bg-green-600"
      case "CANCELLED":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente"
      case "PAID":
        return "Payée"
      case "CANCELLED":
        return "Annulée"
      default:
        return status
    }
  }

  if (loading) {
    return <div className="container py-8 text-center">Chargement...</div>
  }

  if (!invoice) {
    return <div className="container py-8 text-center">Facture non trouvée</div>
  }

  return (
    <div className="container mx-auto w-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/invoices">
              ← Retour aux factures
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm text-muted-foreground">
            Émise le {new Date(invoice.issuedAt).toLocaleDateString("fr-FR")}
          </div>
        </div>

        <div className="grid gap-8">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Facture {invoice.invoiceNumber}</CardTitle>
                  <CardDescription className="mt-2">
                    {invoice.description}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(invoice.status)}>
                  {getStatusText(invoice.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Freelance</p>
                    <p className="text-sm text-muted-foreground">{invoice.freelancer?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Entreprise</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.company?.name || invoice.company?.companyName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total TTC</p>
                    <p className="text-sm text-muted-foreground font-bold">{invoice.totalAmount.toFixed(2)}€</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Details */}
              {invoice.contract && (
                <Card>
                  <CardHeader>
                    <CardTitle>Détails du contrat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Contrat</h4>
                      <p className="text-muted-foreground">{invoice.contract.title}</p>
                    </div>
                    {invoice.contract.description && (
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-muted-foreground">{invoice.contract.description}</p>
                      </div>
                    )}
                    {invoice.contract.dailyRate && (
                      <div>
                        <h4 className="font-medium mb-2">Taux journalier</h4>
                        <p className="text-muted-foreground">{invoice.contract.dailyRate}€/jour</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {invoice.mission && (
                <Card>
                  <CardHeader>
                    <CardTitle>Détails de la mission</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Mission</h4>
                      <p className="text-muted-foreground">{invoice.mission.title}</p>
                    </div>
                    {invoice.mission.description && (
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-muted-foreground">{invoice.mission.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {invoice.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{invoice.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Financial Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails financiers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Montant HT:</span>
                    <span className="font-medium">{invoice.amount.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TVA ({(invoice.taxRate * 100).toFixed(0)}%):</span>
                    <span className="font-medium">{invoice.taxAmount.toFixed(2)}€</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Total TTC:</span>
                    <span className="font-bold text-lg">{invoice.totalAmount.toFixed(2)}€</span>
                  </div>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card>
                <CardHeader>
                  <CardTitle>Dates importantes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Date d'émission</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.issuedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Date d'échéance</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.dueDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  {invoice.paidAt && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Date de paiement</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(invoice.paidAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de paiement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">IBAN</p>
                    <p className="text-sm text-muted-foreground font-mono">FR76 1234 5678 9012 3456 7890 123</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">BIC</p>
                    <p className="text-sm text-muted-foreground font-mono">ABCD FR PP</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Référence</p>
                    <p className="text-sm text-muted-foreground font-mono">{invoice.invoiceNumber}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href={`/api/invoices/${invoice.id}/pdf`} target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger PDF
                    </Link>
                  </Button>
                  
                  {session?.user?.role === "ENTREPRISE" && invoice.status === "PENDING" && (
                    <Button 
                      onClick={handleMarkAsPaid}
                      disabled={markingAsPaid}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {markingAsPaid ? "Marquage..." : "Marquer comme payée"}
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
