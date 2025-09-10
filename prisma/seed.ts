import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const entreprise = await prisma.user.create({
    data: {
      name: "InnovTech",
      email: "contact@innovtech.com",
      password: "hashedpassword",
      role: "ENTREPRISE",
    },
  })

  await prisma.mission.createMany({
    data: [
      {
        title: "Développement d’un portail client",
        description: "Créer un portail web B2B sécurisé.",
        budget: 5000,
        status: "PUBLISHED",
        companyId: entreprise.id,
        location: "Remote (Europe)",
        startDate: "Dès que possible",
        duration: "3 mois",
        pricing: "550€ - 600€ / jour",
        publishedAt: new Date("2024-04-01"),
        requirements: "Maîtrise de React, Node.js, TypeScript.",
        projectContext: "Développement d’une plateforme pour les clients professionnels.",
        skills: ["React", "TypeScript", "API REST", "Redux", "Tests unitaires", "CSS/SASS"],
        companyLogo: "/logo-innovtech.svg",
        companyDescription: "InnovTech est une entreprise spécialisée dans les solutions SaaS."
      }
    ]
  })

  console.log("✅ Base de données remplie avec succès.")
}

main()
  .catch((e) => {
    console.error("❌ Erreur :", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
