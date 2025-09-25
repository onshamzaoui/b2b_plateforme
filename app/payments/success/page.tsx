'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      setError('Session ID manquant')
      setLoading(false)
      return
    }

    // Verify the payment was successful
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payments/verify-payment?session_id=${sessionId}`)
        const data = await response.json()

        if (response.ok) {
          setSessionData(data)
        } else {
          setError(data.error || 'Erreur lors de la vérification du paiement')
        }
      } catch (err) {
        setError('Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId])

  if (loading) {
    return (
      <div className="container mx-auto py-12 max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Vérification du paiement en cours...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Erreur de paiement</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/tarifs">Retour aux tarifs</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Tableau de bord</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">Paiement réussi !</CardTitle>
          <CardDescription>
            Votre abonnement a été activé avec succès
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sessionData && (
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Détails de votre abonnement :</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Plan :</strong> {sessionData.planName}</p>
                <p><strong>Montant :</strong> {sessionData.amount}€</p>
                <p><strong>Prochaine facturation :</strong> {sessionData.nextBillingDate}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold">Que pouvez-vous faire maintenant ?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Accédez à toutes les fonctionnalités de votre plan</li>
              <li>• Publiez des missions ou postulez sans limite</li>
              <li>• Profitez de votre commission réduite</li>
              <li>• Accédez aux fonctionnalités premium</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                Accéder au tableau de bord
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/missions">
                Voir les missions
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Vous recevrez un email de confirmation dans quelques minutes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-12 max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
