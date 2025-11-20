import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateQRToken } from '@/lib/qr'

// GET /api/participants - List all participants
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('eventId')

    const participants = await prisma.participant.findMany({
      where: eventId ? { eventId } : undefined,
      include: {
        event: true,
        checkInLogs: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(participants)
  } catch (error) {
    console.error('Error fetching participants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    )
  }
}

// POST /api/participants - Create new participant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, name, email, company } = body

    if (!eventId || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, name, email' },
        { status: 400 }
      )
    }

    // Check if participant already exists for this event
    const existing = await prisma.participant.findFirst({
      where: {
        eventId,
        email,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Participant with this email already exists for this event' },
        { status: 409 }
      )
    }

    // Generate QR token
    const qrToken = generateQRToken(eventId, email)

    // Create participant
    const participant = await prisma.participant.create({
      data: {
        eventId,
        name,
        email,
        company,
        qrToken,
      },
      include: {
        event: true,
      },
    })

    return NextResponse.json(participant, { status: 201 })
  } catch (error) {
    console.error('Error creating participant:', error)
    return NextResponse.json(
      { error: 'Failed to create participant' },
      { status: 500 }
    )
  }
}
