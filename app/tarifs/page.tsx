import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Users, Building } from "lucide-react"
import Link from "next/link"

export default function TarifsPage() {
  const freelancePlans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "/mois",
      description: "Parfait pour commencer",
      icon: Users,
      popular: false,
      features: [
        "Accès aux missions publiques",
        "3 candidatures par mois",
        "Profil de base",
        "Support par email",
        "Commission de 8% sur les missions",
      ],
      limitations: ["Candidatures limitées", "Pas de mise en avant du profil", "Pas d'accès aux missions premium"],
      cta: "Commencer gratuitement",
      href: "/auth/signup?type=freelance&plan=free",
    },
    {
      name: "Pro",
      price: "29€",
      period: "/mois",
      description: "Pour les freelances actifs",
      icon: Star,
      popular: true,
      features: [
        "Candidatures illimitées",
        "Accès aux missions premium",
        "Profil mis en avant",
        "Statistiques détaillées",
        "Support prioritaire",
        "Commission réduite de 5%",
        "Badge professionnel",
        "Notifications en temps réel",
      ],
      limitations: [],
      cta: "Essayer 14 jours gratuits",
      href: "/auth/signup?type=freelance&plan=pro",
    },
    {
      name: "Expert",
      price: "59€",
      period: "/mois",
      description: "Pour les experts reconnus",
      icon: Crown,
      popular: false,
      features: [
        "Tout du plan Pro",
        "Profil premium avec portfolio",
        "Accès aux missions exclusives",
        "Commission de seulement 3%",
        "Manager de compte dédié",
        "Certification de compétences",
        "Accès prioritaire aux nouvelles missions",
        "Outils d'analyse avancés",
      ],
      limitations: [],
      cta: "Devenir Expert",
      href: "/auth/signup?type=freelance&plan=expert",
    },
  ]

  const companyPlans = [
    {
      name: "Starter",
      price: "49€",
      period: "/mois",
      description: "Pour les petites entreprises",
      icon: Building,
      popular: false,
      features: [
        "Jusqu'à 3 missions actives",
        "Accès à tous les freelances",
        "Gestion des candidatures",
        "Support par email",
        "Facturation intégrée",
        "Tableau de bord basique",
      ],
      limitations: ["Missions limitées", "Pas de fonctionnalités avancées"],
      cta: "Commencer",
      href: "/auth/signup?type=entreprise&plan=starter",
    },
    {
      name: "Business",
      price: "149€",
      period: "/mois",
      description: "Pour les entreprises en croissance",
      icon: Zap,
      popular: true,
      features: [
        "Missions illimitées",
        "Accès prioritaire aux freelances",
        "Outils de collaboration avancés",
        "Analytics et reporting",
        "Support prioritaire",
        "API d'intégration",
        "Gestion d'équipe",
        "Contrats personnalisés",
      ],
      limitations: [],
      cta: "Essayer 30 jours gratuits",
      href: "/auth/signup?type=entreprise&plan=business",
    },
    {
      name: "Enterprise",
      price: "Sur mesure",
      period: "",
      description: "Pour les grandes organisations",
      icon: Crown,
      popular: false,
      features: [
        "Tout du plan Business",
        "Solution sur mesure",
        "Intégration SSO",
        "Manager de compte dédié",
        "SLA garanti",
        "Formation personnalisée",
        "Sécurité renforcée",
        "Support 24/7",
      ],
      limitations: [],
      cta: "Nous contacter",
      href: "/contact?plan=enterprise",
    },
  ]

  const commissionRates = [
    {
      plan: "Gratuit",
      rate: "8%",
      description: "Commission standard sur toutes les missions",
    },
    {
      plan: "Pro",
      rate: "5%",
      description: "Commission réduite pour plus de rentabilité",
    },
    {
      plan: "Expert",
      rate: "3%",
      description: "Commission minimale pour les experts",
    },
  ]

  return (
    <div className="container py-12 mx-auto w-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tarifs transparents</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choisissez le plan qui correspond à vos besoins. Pas de frais cachés, pas d'engagement.
        </p>
      </div>

      {/* Plans Freelances */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Pour les Freelances</h2>
          <p className="text-muted-foreground">
            Trouvez des missions et développez votre activité avec nos outils professionnels
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {freelancePlans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card key={plan.name} className={`relative ${plan.popular ? "border-violet-500 shadow-lg" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-violet-600">
                    Le plus populaire
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-violet-100 dark:bg-violet-900/20 rounded-full">
                      <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="flex items-baseline justify-center mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    asChild
                    className={`w-full ${plan.popular ? "bg-violet-600 hover:bg-violet-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Commission rates */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Commissions sur les missions</CardTitle>
            <CardDescription className="text-center">
              Nos commissions sont prélevées uniquement sur les missions réussies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commissionRates.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{item.plan}</span>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Badge variant="outline" className="text-lg font-bold">
                    {item.rate}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Plans Entreprises */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Pour les Entreprises</h2>
          <p className="text-muted-foreground">Trouvez les meilleurs talents et gérez vos projets efficacement</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {companyPlans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card key={plan.name} className={`relative ${plan.popular ? "border-violet-500 shadow-lg" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-violet-600">
                    Recommandé
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-violet-100 dark:bg-violet-900/20 rounded-full">
                      <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="flex items-baseline justify-center mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    asChild
                    className={`w-full ${plan.popular ? "bg-violet-600 hover:bg-violet-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comment fonctionnent les commissions ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Les commissions sont prélevées uniquement sur les missions réussies. Elles sont automatiquement déduites
                du montant facturé et varient selon votre plan d'abonnement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Puis-je changer de plan à tout moment ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet
                immédiatement et la facturation est ajustée au prorata.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Y a-t-il des frais cachés ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Non, nos tarifs sont transparents. Seuls l'abonnement mensuel et les commissions sur les missions
                s'appliquent. Aucun frais d'inscription, de mise en relation ou de transaction supplémentaire.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Que se passe-t-il si j'annule mon abonnement ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Vous pouvez annuler à tout moment. Votre compte reste actif jusqu'à la fin de la période payée, puis
                bascule automatiquement vers le plan gratuit avec les limitations associées.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-violet-50 dark:bg-violet-950/20 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Rejoignez des milliers de freelances et d'entreprises qui font confiance à FreelanceConnect pour leurs
          projets.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-700">
            <Link href="/auth/signup?type=freelance">Je suis freelance</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/signup?type=entreprise">Je suis une entreprise</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
