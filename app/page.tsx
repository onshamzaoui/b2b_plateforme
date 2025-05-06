import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Globe, Users } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-violet-100 dark:bg-violet-900/20 px-3 py-1 text-sm text-violet-600 dark:text-violet-300 mb-2">
                Plateforme B2B de freelancing
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Connectez <span className="text-violet-600 dark:text-violet-400">freelances</span> et{" "}
                <span className="text-violet-600 dark:text-violet-400">entreprises</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl">
                FreelanceConnect facilite la mise en relation entre talents indépendants et entreprises à la recherche
                de compétences spécifiques.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700"
                >
                  <Link href="/auth/signup">Rejoindre la plateforme</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/missions">Découvrir les missions</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                alt="Illustration de collaboration entre freelances et entreprises"
                width={500}
                height={400}
                className="rounded-lg object-cover shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ça fonctionne</h2>
            <p className="text-gray-500 dark:text-gray-400 md:text-lg max-w-2xl mx-auto">
              Une solution simple et efficace pour trouver des talents ou des opportunités
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <FileText className="h-10 w-10 text-violet-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Publiez des missions</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Les entreprises décrivent leurs besoins et publient des missions avec toutes les informations
                nécessaires.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <Users className="h-10 w-10 text-violet-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trouvez des talents</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Accédez à un réseau qualifié de freelances et trouvez les compétences dont votre entreprise a besoin.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <Globe className="h-10 w-10 text-violet-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Collaborez facilement</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Gérez vos missions, suivez leur avancement et facilitez la facturation en un seul endroit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400">1000+</p>
              <p className="text-gray-500 dark:text-gray-400">Freelances</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400">500+</p>
              <p className="text-gray-500 dark:text-gray-400">Entreprises</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400">2500+</p>
              <p className="text-gray-500 dark:text-gray-400">Missions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400">98%</p>
              <p className="text-gray-500 dark:text-gray-400">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-gray-500 dark:text-gray-400 md:text-lg max-w-2xl mx-auto">
              Découvrez les témoignages de nos utilisateurs satisfaits
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Marie Laurent</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Développeuse Web</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "FreelanceConnect m'a permis de trouver rapidement des missions correspondant exactement à mon profil.
                L'interface est intuitive et le processus de candidature très simple."
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Thomas Dubois</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Directeur Technique, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Nous avons pu constituer rapidement une équipe de freelances qualifiés pour notre projet digital. La
                qualité des profils est vraiment au rendez-vous."
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sophie Martin</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Designer UX/UI</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Je recommande FreelanceConnect à tous les freelances. La plateforme me permet de gérer mes missions et
                ma facturation facilement, tout en me connectant à des entreprises intéressantes."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-violet-600 dark:bg-violet-800 text-white py-12 md:py-20">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à démarrer ?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Rejoignez FreelanceConnect et accédez à un écosystème professionnel de freelances et d'entreprises.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/signup?type=freelance">Je suis freelance</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              <Link href="/auth/signup?type=entreprise">Je suis une entreprise</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
