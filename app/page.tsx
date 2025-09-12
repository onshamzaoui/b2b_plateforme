"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Globe, Users } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col w-full mx-auto max-w-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-16 md:py-24 ">
        <div className="container mx-auto px-4 md:px-6">
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
        <div className="container mx-auto px-4 md:px-6">
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
        <div className="container mx-auto px-4 md:px-6">
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
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-gray-500 dark:text-gray-400 md:text-lg max-w-2xl mx-auto">
              Découvrez les témoignages de nos utilisateurs satisfaits
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-700 dark:to-violet-800 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-violet-600 dark:text-violet-200 text-lg font-semibold">ML</span>
                </div>
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
                <div className="w-12 h-12 bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-700 dark:to-violet-800 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-violet-600 dark:text-violet-200 text-lg font-semibold">TD</span>
                </div>
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
                <div className="w-12 h-12 bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-700 dark:to-violet-800 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-violet-600 dark:text-violet-200 text-lg font-semibold">SM</span>
                </div>
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

      {/* Interactive Testimonials Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-block rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
              Témoignages
            </div>
            <h2 className="text-3xl font-bold mb-4">Témoignages d'utilisateurs</h2>
            <p className="text-gray-500 dark:text-gray-400 md:text-lg max-w-2xl mx-auto">
              Découvrez comment nos membres ont transformé leur carrière grâce à notre plateforme. Lisez leurs histoires de réussite.
            </p>
          </div>

          {/* Background curved element */}
          <div className="absolute w-screen inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 rounded-full opacity-60 transform rotate-12"></div>
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/20 dark:to-violet-800/20 rounded-full opacity-60 transform -rotate-12"></div>
            
            {/* Snake/Curved Line Design */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Main curved path */}
              <path 
                d="M 50 150 Q 200 50 400 120 T 800 100 T 1150 180" 
                stroke="url(#snakeGradient)" 
                strokeWidth="4" 
                fill="none"
                filter="url(#glow)"
                className="animate-pulse"
              />
              
              {/* Secondary curved path */}
              <path 
                d="M 100 300 Q 300 250 500 280 T 900 260 T 1100 320" 
                stroke="url(#snakeGradient)" 
                strokeWidth="3" 
                fill="none"
                filter="url(#glow)"
                className="animate-pulse"
                style={{animationDelay: '1s'}}
              />
              

            </svg>
          </div>

          <div className="relative z-10">
            {/* Profile Pictures Grid */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4 mb-12 grid-items-center justify-items-center">
              {/* Profile pictures - some will be clickable */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                  alt="Utilisateur 1"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Utilisateur 2"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  alt="Utilisateur 3"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                  alt="Utilisateur 4"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                  alt="Utilisateur 5"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
                  alt="Utilisateur 6"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              
              
            </div>

            {/* Featured Testimonial */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Featured Profile Image */}
                <div className="relative">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face"
                      alt="Emily Rodriguez"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                </div>

                {/* Testimonial Card */}
                <div className="flex-1">
                  <div className="bg-violet-800 dark:bg-violet-900 p-8 rounded-2xl shadow-xl">
                    <div className="text-violet-200 mb-6">
                      <svg className="w-8 h-8 text-violet-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                      <blockquote className="text-lg md:text-xl leading-relaxed">
                        "Rejoindre FreelanceConnect a été un tournant dans ma carrière. Les entreprises sont incroyablement professionnelles, et la plateforme m'a aidée à trouver la paix intérieure et à améliorer ma flexibilité professionnelle."
                      </blockquote>
                    </div>
                    <div className="text-violet-200">
                      <p className="font-semibold text-lg">Emily Rodriguez</p>
                      <p className="text-violet-300">Développeuse Full Stack</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-violet-600 dark:bg-violet-800 text-white py-12 md:py-20 w-full max-w-screen mx-auto">
        <div className="container mx-auto px-4 md:px-6 text-center">
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
