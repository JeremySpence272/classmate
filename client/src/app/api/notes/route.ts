import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateNoteData } from '@/lib/types'

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Error fetching notes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateNoteData
    const { classId, classTitle, classDate, content } = body

    if (!classId || !classTitle || !classDate || !content) {
      return NextResponse.json(
        { error: 'Class ID, class title, class date, and content are required' },
        { status: 400 }
      )
    }

    // Parse the date if it's a string
    const parsedClassDate = typeof classDate === 'string' 
      ? new Date(classDate) 
      : classDate

    // Create the note
    const result = await prisma.note.create({
      data: {
        classId,
        classTitle,
        classDate: parsedClassDate,
        content,
      },
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Error creating note' },
      { status: 500 }
    )
  }
} 