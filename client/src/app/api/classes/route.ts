import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateClassData } from '@/lib/types'

export async function GET() {
  try {
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