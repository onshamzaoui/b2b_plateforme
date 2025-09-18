"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Eye, Calendar, Euro, User, Building } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ContractPDFGenerator } from "@/components/contract-pdf-generator"

export default function ContractsPage() {
  const { data: session } = useSession()
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch("/api/contracts")
        if (response.ok) {
          const data = await response.json()
          setContracts(data)
        }
      } catch (error) {
        console.error("Erreur chargement contrats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [])

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

  if (loading) {
    return <div className="container py-8 text-center">Chargement...</div>
  }

  const pendingContracts = contracts.filter(c => c.status === "PENDING_SIGNATURE")
  const activeContracts = contracts.filter(c => c.status === "ACTIVE")
  const completedContracts = contracts.filter(c => c.status === "COMPLETED")

  return (
    <div className="container mx-auto w-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Mes Contrats</h1>
          <p className="text-muted-foreground">Gérez vos contrats de prestation</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-md mb-6">
            <TabsTrigger value="all">Tous ({contracts.length})</TabsTrigger>
            <TabsTrigger value="pending">En attente ({pendingContracts.length})</TabsTrigger>
            <TabsTrigger value="active">Actifs ({activeContracts.length})</TabsTrigger>
            <TabsTrigger value="completed">Terminés ({completedContracts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-4">
              {contracts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucun contrat pour le moment.</p>
                  </CardContent>
                </Card>
              ) : (
                contracts.map((contract) => (
                  <Card key={contract.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{contract.title}</CardTitle>
                          <CardDescription>
                            {contract.mission?.title}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>
                          {getStatusText(contract.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {session?.user?.role === "FREELANCE" 
                              ? contract.company?.name || contract.company?.companyName
                              : contract.freelancer?.name
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{contract.dailyRate}€/jour</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(contract.startDate).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/contracts/${contract.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir le contrat
                          </Link>
                        </Button>
                        {/* <ContractPDFGenerator contract={contract} /> */}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid gap-4">
              {pendingContracts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucun contrat en attente de signature.</p>
                  </CardContent>
                </Card>
              ) : (
                pendingContracts.map((contract) => (
                  <Card key={contract.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{contract.title}</CardTitle>
                          <CardDescription>
                            {contract.mission?.title}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>
                          {getStatusText(contract.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/contracts/${contract.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir et signer
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid gap-4">
              {activeContracts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucun contrat actif.</p>
                  </CardContent>
                </Card>
              ) : (
                activeContracts.map((contract) => (
                  <Card key={contract.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{contract.title}</CardTitle>
                          <CardDescription>
                            {contract.mission?.title}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>
                          {getStatusText(contract.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/contracts/${contract.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir le contrat
                          </Link>
                        </Button>
                        {/* <ContractPDFGenerator contract={contract} /> */}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-4">
              {completedContracts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucun contrat terminé.</p>
                  </CardContent>
                </Card>
              ) : (
                completedContracts.map((contract) => (
                  <Card key={contract.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{contract.title}</CardTitle>
                          <CardDescription>
                            {contract.mission?.title}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>
                          {getStatusText(contract.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/contracts/${contract.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir le contrat
                          </Link>
                        </Button>
                        {/* <ContractPDFGenerator contract={contract} /> */}
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
}
