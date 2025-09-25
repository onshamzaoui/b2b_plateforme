import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-2xl text-orange-600">Paiement annulé</CardTitle>
          <CardDescription>
            Votre paiement a été annulé. Aucun montant n'a été débité.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Que s'est-il passé ?</h3>
            <p className="text-sm text-muted-foreground">
              Vous avez annulé le processus de paiement ou une erreur s'est produite. 
              Votre compte reste inchangé et vous pouvez réessayer à tout moment.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Options disponibles :</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Réessayer avec un autre plan</li>
              <li>• Choisir un plan différent</li>
              <li>• Continuer avec le plan gratuit</li>
              <li>• Contacter notre support</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link href="/tarifs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux tarifs
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/dashboard">
                Tableau de bord
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Besoin d'aide ? Contactez notre équipe support.
            </p>
            <Button variant="link" asChild>
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
