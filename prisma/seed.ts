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
      },
      {
        title: "Intégration Stripe",
        description: "Intégrer l'API Stripe pour les paiements.",
        budget: 2500,
        status: "PUBLISHED",
        companyId: entreprise.id,
      },
    ],
  })

  console.log("✅ Base de données remplie avec succès.")
}

main()
  .catch((e) => {
    console.error("❌ Erreur :", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
