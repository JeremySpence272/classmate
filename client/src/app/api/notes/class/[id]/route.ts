import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params
    const classId = parseInt(idString)

    if (isNaN(classId)) {
      return NextResponse.json(
        { error: 'Invalid class ID' },
        { status: 400 }
      )
    }

    const notes = await prisma.note.findMany({
      where: {
        classId: classId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes for class:', error)
    return NextResponse.json(
      { error: 'Error fetching notes for class' },
      { status: 500 }
    )
  }
} 