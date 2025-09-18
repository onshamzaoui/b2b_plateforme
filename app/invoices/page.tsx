"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Eye, Calendar, Euro, User, Building, Plus } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function InvoicesPage() {
  const { data: session } = useSession()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/invoices")
        if (response.ok) {
          const data = await response.json()
          setInvoices(data)
        }
      } catch (error) {
        console.error("Erreur chargement factures:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

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

  const pendingInvoices = invoices.filter(i => i.status === "PENDING")
  const paidInvoices = invoices.filter(i => i.status === "PAID")
  const cancelledInvoices = invoices.filter(i => i.status === "CANCELLED")

  return (
    <div className="container mx-auto w-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes Factures</h1>
              <p className="text-muted-foreground">Gérez vos factures et paiements</p>
            </div>
            {session?.user?.role === "FREELANCE" && (
              <Button asChild className="bg-violet-600 hover:bg-violet-700">
                <Link href="/invoices/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une facture
                </Link>
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-md mb-6">
            <TabsTrigger value="all">Toutes ({invoices.length})</TabsTrigger>
            <TabsTrigger value="pending">En attente ({pendingInvoices.length})</TabsTrigger>
            <TabsTrigger value="paid">Payées ({paidInvoices.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Annulées ({cancelledInvoices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-4">
              {invoices.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucune facture pour le moment.</p>
                    {session?.user?.role === "FREELANCE" && (
                      <Button asChild className="mt-4">
                        <Link href="/invoices/create">Créer votre première facture</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{invoice.invoiceNumber}</CardTitle>
                          <CardDescription>
                            {invoice.description}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusText(invoice.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {session?.user?.role === "FREELANCE" 
                              ? invoice.company?.name || invoice.company?.companyName
                              : invoice.freelancer?.name
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{invoice.totalAmount.toFixed(2)}€</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Échéance: {new Date(invoice.dueDate).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/invoices/${invoice.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir la facture
                          </Link>
                        </Button>
                        {/* <Button asChild size="sm">
                          <Link href={`/invoices/${invoice.id}/pdf`}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger PDF
                          </Link>
                        </Button> */}
                        {session?.user?.role === "ENTREPRISE" && invoice.status === "PENDING" && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleMarkAsPaid(invoice.id)}
                          >
                            Marquer comme payée
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid gap-4">
              {pendingInvoices.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucune facture en attente.</p>
                  </CardContent>
                </Card>
              ) : (
                pendingInvoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{invoice.invoiceNumber}</CardTitle>
                          <CardDescription>
                            {invoice.description}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusText(invoice.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/invoices/${invoice.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir la facture
                          </Link>
                        </Button>
                        {session?.user?.role === "ENTREPRISE" && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleMarkAsPaid(invoice.id)}
                          >
                            Marquer comme payée
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="paid">
            <div className="grid gap-4">
              {paidInvoices.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucune facture payée.</p>
                  </CardContent>
                </Card>
              ) : (
                paidInvoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{invoice.invoiceNumber}</CardTitle>
                          <CardDescription>
                            {invoice.description}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusText(invoice.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/invoices/${invoice.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir la facture
                          </Link>
                        </Button>
                        {/* <Button asChild size="sm">
                          <Link href={`/invoices/${invoice.id}/pdf`}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger PDF
                          </Link>
                        </Button> */}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="cancelled">
            <div className="grid gap-4">
              {cancelledInvoices.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucune facture annulée.</p>
                  </CardContent>
                </Card>
              ) : (
                cancelledInvoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{invoice.invoiceNumber}</CardTitle>
                          <CardDescription>
                            {invoice.description}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusText(invoice.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/invoices/${invoice.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir la facture
                          </Link>
                        </Button>
                        {/* <Button asChild variant="outline" size="sm">
                          <Link href={`/api/invoices/${invoice.id}/pdf`} target="_blank">
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger PDF
                          </Link>
                        </Button> */}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  async function handleMarkAsPaid(invoiceId: string) {
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
        // Refresh the invoices list
        const updatedResponse = await fetch("/api/invoices")
        if (updatedResponse.ok) {
          const data = await updatedResponse.json()
          setInvoices(data)
        }
      }
    } catch (error) {
      console.error("Erreur marquage facture comme payée:", error)
    }
  }
}
