import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params
    const id = parseInt(idString)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      )
    }

    const note = await prisma.note.findUnique({
      where: {
        id: id,
      },
    })
    
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error fetching note:', error)
    return NextResponse.json(
      { error: 'Error fetching note' },
      { status: 500 }
    )
  }
} 