import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Import mock notes from the seed file
// We're only going to use the structure, not the entire seed script
const mockBiologyNotes = [
  {
    classTitle: "Unit I: Cellular Life",
    classDate: "2024-06-19T11:30:00Z",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Unit I: Cellular Life – Overview" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", marks: [{ type: "bold" }], text: "Summary: " },
            {
              type: "text",
              text: "This unit introduces the scientific method, foundational chemistry principles, and the building blocks of life."
            }
          ]
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Scientific Method and Basic Chemistry" }]
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", marks: [{ type: "bold" }], text: "Observation & Hypothesis: " },
                    { type: "text", text: "Identify a question, develop a testable hypothesis." }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    classTitle: "Unit II: Genetics",
    classDate: "2024-06-26T11:30:00Z",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Unit II: Genetics – DNA Structure and Function" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", marks: [{ type: "bold" }], text: "Overview: " },
            {
              type: "text",
              text: "This unit covers the molecular structure of DNA, replication, and the role in inheritance."
            }
          ]
        }
      ]
    }
  },
  {
    classTitle: "Unit III: Evolution",
    classDate: "2024-07-03T11:30:00Z",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Unit III: Evolution and Natural Selection" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "This unit explores Darwin's theory of evolution and its supporting evidence." }
          ]
        }
      ]
    }
  }
];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const classId = parseInt(params.id);
    
    if (isNaN(classId)) {
      return NextResponse.json(
        { error: 'Invalid class ID' },
        { status: 400 }
      );
    }
    
    // Check if the class exists
    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    });
    
    if (!classExists) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }
    
    // Create notes for this class
    const createdNotes = [];
    
    for (const note of mockBiologyNotes) {
      const result = await prisma.note.create({
        data: {
          classId,
          classTitle: note.classTitle,
          classDate: new Date(note.classDate),
          content: JSON.parse(JSON.stringify(note.content)),
        }
      });
      
      createdNotes.push(result);
    }
    
    return NextResponse.json({
      success: true,
      message: `Created ${createdNotes.length} sample notes for class ID: ${classId}`,
      notesCreated: createdNotes.length
    });
  } catch (error) {
    console.error('Error seeding notes for class:', error);
    return NextResponse.json(
      { error: 'Error seeding notes for class' },
      { status: 500 }
    );
  }
} 