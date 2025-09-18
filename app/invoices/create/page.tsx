"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function CreateInvoicePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [contracts, setContracts] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    contractId: "",
    companyId: "",
    amount: "",
    description: "",
    dueDate: "",
    notes: ""
  })

  useEffect(() => {
    if (session?.user?.role !== "FREELANCE") {
      router.push("/invoices")
      return
    }

    const fetchData = async () => {
      try {
        // Fetch active contracts
        const contractsResponse = await fetch("/api/contracts")
        if (contractsResponse.ok) {
          const contractsData = await contractsResponse.json()
          const activeContracts = contractsData.filter((c: any) => c.status === "ACTIVE")
          setContracts(activeContracts)
        }

        // Fetch companies (from contracts)
        const companiesResponse = await fetch("/api/contracts")
        if (companiesResponse.ok) {
          const contractsData = await companiesResponse.json()
          const uniqueCompanies = contractsData.reduce((acc: any[], contract: any) => {
            const existing = acc.find(c => c.id === contract.company.id)
            if (!existing) {
              acc.push(contract.company)
            }
            return acc
          }, [])
          setCompanies(uniqueCompanies)
        }
      } catch (error) {
        console.error("Erreur chargement données:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const invoice = await response.json()
        toast({
          title: "Succès",
          description: "Facture créée avec succès"
        })
        router.push(`/invoices/${invoice.id}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la création")
      }
    } catch (error) {
      console.error("Erreur création facture:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleContractChange = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId)
    if (contract) {
      setFormData(prev => ({
        ...prev,
        contractId,
        companyId: contract.companyId,
        amount: contract.dailyRate?.toString() || "",
        description: `Facture pour le contrat: ${contract.title}`
      }))
    }
  }

  if (loading) {
    return <div className="container py-8 text-center">Chargement...</div>
  }

  if (session?.user?.role !== "FREELANCE") {
    return <div className="container py-8 text-center">Accès non autorisé</div>
  }

  return (
    <div className="container mx-auto w-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/invoices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux factures
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Créer une nouvelle facture</CardTitle>
            <CardDescription>
              Créez une facture pour vos services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contract Selection */}
              <div className="space-y-2">
                <Label htmlFor="contract">Contrat (optionnel)</Label>
                <Select onValueChange={handleContractChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    {contracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id}>
                        {contract.title} - {contract.company?.name || contract.company?.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Sélectionner un contrat remplira automatiquement les informations
                </p>
              </div>

              {/* Company Selection */}
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise *</Label>
                <Select 
                  value={formData.companyId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name || company.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Montant HT (€) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description des services facturés"
                  required
                />
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes additionnelles"
                />
              </div>

              {/* Preview */}
              {formData.amount && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Aperçu de la facture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Montant HT:</span>
                      <span>{parseFloat(formData.amount || "0").toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA (20%):</span>
                      <span>{(parseFloat(formData.amount || "0") * 0.20).toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total TTC:</span>
                      <span>{(parseFloat(formData.amount || "0") * 1.20).toFixed(2)}€</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {submitting ? "Création..." : "Créer la facture"}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/invoices">Annuler</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
