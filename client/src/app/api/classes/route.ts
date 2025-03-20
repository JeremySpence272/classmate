import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateClassData, UpdateClassData } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get('id')
    
    // Case 1: Get a specific class by ID
    if (classId) {
      const id = parseInt(classId)
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid class ID' },
          { status: 400 }
        )
      }
      
      const classItem = await prisma.class.findUnique({
        where: { id },
        include: {
          meetings: true,
        },
      })
      
      if (!classItem) {
        return NextResponse.json(
          { error: 'Class not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(classItem)
    }
    
    // Case 2: Get all classes
    const classes = await prisma.class.findMany({
      include: {
        meetings: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Error fetching classes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateClassData
    const { title, type, meetings } = body

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      )
    }

    // Create the class with meetings in a single operation
    const result = await prisma.class.create({
      data: {
        title,
        type: type.toLowerCase(),
        meetings: {
          create: meetings?.map((meeting) => ({
            day: meeting.day.toLowerCase(),
            startTime: meeting.startTime,
            endTime: meeting.endTime,
          })) || [],
        },
      },
      include: {
        meetings: true,
      },
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Error creating class' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get('id')
    
    if (!classId) {
      return NextResponse.json(
        { error: 'Class ID is required' },
        { status: 400 }
      )
    }
    
    const id = parseInt(classId)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid class ID' },
        { status: 400 }
      )
    }
    
    const body = await request.json() as UpdateClassData
    const { title, type, meetings } = body

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      )
    }

    // Update class and meetings in a single operation
    const result = await prisma.class.update({
      where: { id },
      data: {
        title,
        type: type.toLowerCase(),
        meetings: {
          deleteMany: {},
          create: meetings?.map((meeting) => ({
            day: meeting.day.toLowerCase(),
            startTime: meeting.startTime,
            endTime: meeting.endTime,
          })) || [],
        },
      },
      include: {
        meetings: true,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Error updating class' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get('id')
    
    if (!classId) {
      return NextResponse.json(
        { error: 'Class ID is required' },
        { status: 400 }
      )
    }
    
    const id = parseInt(classId)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid class ID' },
        { status: 400 }
      )
    }
    
    // Check if the class exists
    const existingClass = await prisma.class.findUnique({
      where: { id }
    })
    
    if (!existingClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    const result = await prisma.class.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Class deleted successfully', id })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Error deleting class' },
      { status: 500 }
    )
  }
} 