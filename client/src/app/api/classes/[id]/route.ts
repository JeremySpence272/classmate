import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { UpdateClassData } from '@/lib/types'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const result = await prisma.class.delete({
      where: { id },
    })

    if (!result) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Class deleted successfully', id })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Error deleting class' },
      { status: 500 }
    )
  }
} 