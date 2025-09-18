import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

// GET /api/contracts/[id]/pdf - Generate PDF for contract
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { id } = await params

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
            phone: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            location: true,
            phone: true
          }
        },
        mission: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true
          }
        }
      }
    })

    if (!contract) {
      return NextResponse.json({ error: "Contrat non trouvé" }, { status: 404 })
    }

    // Check if user has access to this contract
    if (contract.freelancerId !== session.user.id && contract.companyId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // For now, return HTML that can be printed as PDF
    // In a real implementation, you would use a library like puppeteer or jsPDF
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrat - ${contract.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            color: #333;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .info-item {
            margin-bottom: 10px;
        }
        .info-item strong {
            display: block;
            margin-bottom: 5px;
        }
        .terms {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            white-space: pre-wrap;
        }
        .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 40px;
        }
        .signature-box {
            border-top: 1px solid #333;
            padding-top: 10px;
            text-align: center;
        }
        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status.active { background-color: #4CAF50; color: white; }
        .status.pending { background-color: #FF9800; color: white; }
        .status.draft { background-color: #9E9E9E; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CONTRAT DE PRESTATION DE SERVICES</h1>
        <h2>${contract.title}</h2>
        <p>Date de création: ${new Date(contract.createdAt).toLocaleDateString("fr-FR")}</p>
    </div>

    <div class="section">
        <h2>Informations générales</h2>
        <div class="info-grid">
            <div>
                <div class="info-item">
                    <strong>Freelance:</strong>
                    ${contract.freelancer.name}
                </div>
                <div class="info-item">
                    <strong>Email:</strong>
                    ${contract.freelancer.email}
                </div>
                ${contract.freelancer.location ? `<div class="info-item"><strong>Localisation:</strong> ${contract.freelancer.location}</div>` : ''}
            </div>
            <div>
                <div class="info-item">
                    <strong>Entreprise:</strong>
                    ${contract.company.name || contract.company.companyName}
                </div>
                <div class="info-item">
                    <strong>Email:</strong>
                    ${contract.company.email}
                </div>
                ${contract.company.location ? `<div class="info-item"><strong>Localisation:</strong> ${contract.company.location}</div>` : ''}
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Détails de la mission</h2>
        <div class="info-item">
            <strong>Mission:</strong>
            ${contract.mission.title}
        </div>
        ${contract.mission.description ? `<div class="info-item"><strong>Description:</strong> ${contract.mission.description}</div>` : ''}
        ${contract.mission.location ? `<div class="info-item"><strong>Lieu:</strong> ${contract.mission.location}</div>` : ''}
    </div>

    <div class="section">
        <h2>Conditions financières</h2>
        <div class="info-item">
            <strong>Taux journalier:</strong>
            ${contract.dailyRate}€
        </div>
        ${contract.totalAmount ? `<div class="info-item"><strong>Montant total:</strong> ${contract.totalAmount}€</div>` : ''}
        <div class="info-item">
            <strong>Date de début:</strong>
            ${new Date(contract.startDate).toLocaleDateString("fr-FR")}
        </div>
        ${contract.endDate ? `<div class="info-item"><strong>Date de fin:</strong> ${new Date(contract.endDate).toLocaleDateString("fr-FR")}</div>` : ''}
    </div>

    <div class="section">
        <h2>Conditions générales</h2>
        <div class="terms">${contract.terms}</div>
    </div>

    <div class="section">
        <h2>Statut du contrat</h2>
        <span class="status ${contract.status.toLowerCase().replace('_', '')}">${contract.status}</span>
        ${contract.signedAt ? `<p>Signé le: ${new Date(contract.signedAt).toLocaleDateString("fr-FR")}</p>` : ''}
    </div>

    <div class="signatures">
        <div class="signature-box">
            <p><strong>Signature Freelance</strong></p>
            <p>${contract.signedByFreelancer ? '✓ Signé' : 'En attente'}</p>
            <br><br>
            <p>_________________________</p>
            <p>${contract.freelancer.name}</p>
        </div>
        <div class="signature-box">
            <p><strong>Signature Entreprise</strong></p>
            <p>${contract.signedByCompany ? '✓ Signé' : 'En attente'}</p>
            <br><br>
            <p>_________________________</p>
            <p>${contract.company.name || contract.company.companyName}</p>
        </div>
    </div>
</body>
</html>
    `

    // Return HTML that can be printed as PDF
    // The client-side PDF generator will handle the actual PDF creation
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="contrat-${contract.id}.html"`
      }
    })

  } catch (error) {
    console.error("Erreur génération PDF:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
