import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateNoteData } from '@/lib/types'
import { isEditorContent, normalizeContent } from '@/lib/editor-utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const noteId = searchParams.get('id')
    const classId = searchParams.get('classId')
    
    // Case 1: Get a specific note by ID
    if (noteId) {
      const id = parseInt(noteId)
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid note ID' },
          { status: 400 }
        )
      }
      
      const note = await prisma.note.findUnique({
        where: { id }
      })
      
      if (!note) {
        return NextResponse.json(
          { error: 'Note not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(note)
    }
    
    // Case 2: Get notes for a specific class
    if (classId) {
      const id = parseInt(classId)
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid class ID' },
          { status: 400 }
        )
      }
      
      const notes = await prisma.note.findMany({
        where: { classId: id },
        orderBy: { createdAt: 'desc' }
      })
      
      return NextResponse.json(notes)
    }
    
    // Case 3: Get all notes
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' }
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

    // Make sure the date is valid
    if (isNaN(parsedClassDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid class date format' },
        { status: 400 }
      )
    }

    // Process the content - ensure it's in the proper JSON format for Tiptap
    const processedContent = typeof content === 'string' 
      ? normalizeContent(content)  // Convert legacy string content to JSON
      : content                  // Already in JSON format

    // Create the note
    const result = await prisma.note.create({
      data: {
        classId,
        classTitle,
        classDate: parsedClassDate,
        content: JSON.parse(JSON.stringify(processedContent)),
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

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const noteId = searchParams.get('id')
    
    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      )
    }
    
    const id = parseInt(noteId)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      )
    }
    
    // Check if the note exists
    const existingNote = await prisma.note.findUnique({
      where: { id }
    })
    
    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }
    
    // Delete the note
    await prisma.note.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true, message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json(
      { error: 'Error deleting note' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, content, classId, classTitle, classDate } = data

    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      )
    }

    // Ensure ID is a number
    const noteId = typeof id === 'string' ? parseInt(id) : id
    
    if (isNaN(noteId)) {
      return NextResponse.json(
        { error: 'Invalid note ID format' },
        { status: 400 }
      )
    }

    // Check if the note exists
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId }
    })
    
    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    // Ensure we have a valid content object
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Normalize the content if needed
    const normalizedContent = isEditorContent(content) ? content : normalizeContent(content)

    // Process date if provided
    let parsedDate = existingNote.classDate
    if (classDate) {
      parsedDate = typeof classDate === 'string' ? new Date(classDate) : classDate
      
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid class date format' },
          { status: 400 }
        )
      }
    }

    // Build update data - only include fields that are provided
    const updateData: any = {
      content: JSON.parse(JSON.stringify(normalizedContent)),
      updatedAt: new Date()
    }
    
    if (classId !== undefined) updateData.classId = classId
    if (classTitle !== undefined) updateData.classTitle = classTitle
    if (classDate !== undefined) updateData.classDate = parsedDate

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: updateData
    })

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json(
      { error: 'Error updating note' },
      { status: 500 }
    )
  }
} 