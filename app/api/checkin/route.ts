import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyQRToken } from '@/lib/qr'

// POST /api/checkin - Check in a participant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, deviceInfo } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Verify token format
    if (!verifyQRToken(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
    }

    // Find participant by QR token
    const participant = await prisma.participant.findUnique({
      where: { qrToken: token },
      include: { event: true },
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      )
    }

    // Check if already checked in
    if (participant.checkedIn) {
      return NextResponse.json(
        {
          error: 'Already checked in',
          participant: {
            name: participant.name,
            email: participant.email,
            checkedInAt: participant.checkedInAt,
          },
        },
        { status: 409 }
      )
    }

    // Update participant and create check-in log
    const [updatedParticipant, checkInLog] = await prisma.$transaction([
      prisma.participant.update({
        where: { id: participant.id },
        data: {
          checkedIn: true,
          checkedInAt: new Date(),
        },
        include: { event: true },
      }),
      prisma.checkInLog.create({
        data: {
          participantId: participant.id,
          deviceInfo: deviceInfo || null,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      participant: {
        id: updatedParticipant.id,
        name: updatedParticipant.name,
        email: updatedParticipant.email,
        company: updatedParticipant.company,
        checkedInAt: updatedParticipant.checkedInAt,
        event: {
          name: updatedParticipant.event.name,
          date: updatedParticipant.event.date,
        },
      },
    })
  } catch (error) {
    console.error('Error checking in participant:', error)
    return NextResponse.json(
      { error: 'Failed to check in' },
      { status: 500 }
    )
  }
}

// GET /api/checkin/stats - Get check-in statistics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
        { status: 400 }
      )
    }

    const [total, checkedIn] = await Promise.all([
      prisma.participant.count({ where: { eventId } }),
      prisma.participant.count({ where: { eventId, checkedIn: true } }),
    ])

    const checkInRate = total > 0 ? Math.round((checkedIn / total) * 100) : 0

    return NextResponse.json({
      total,
      checkedIn,
      notCheckedIn: total - checkedIn,
      checkInRate,
    })
  } catch (error) {
    console.error('Error fetching check-in stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
