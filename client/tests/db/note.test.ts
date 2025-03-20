import { describe, test, expect, beforeEach } from '@jest/globals';
import { prisma } from '../setup';
import { Note, EditorContent, Class } from '@/lib/types';

// Define a simple JSON object type that works with Prisma
type JsonObject = { [key: string]: any };

describe('Note Database Operations', () => {
  // Test variables
  let testClass: any;
  
  // Create content as a plain object with string indexing
  const testNoteContent: JsonObject = {
    type: 'doc',
    content: {
      type: 'paragraph',
      content: [{ type: 'text', text: 'This is a test note' }]
    },
  };

  // Setup test class before each test
  beforeEach(async () => {
    // Create a test class for reference
    testClass = await prisma.class.create({
      data: {
        title: 'Test Class for Notes',
        type: 'lecture',
        meetings: {
          create: [{ day: 'monday', startTime: '10:00', endTime: '11:30' }],
        },
      },
    });
  });

  test('should create a note', async () => {
    const noteData = {
      classId: testClass.id,
      classTitle: testClass.title,
      classDate: new Date(),
      content: testNoteContent,
    };

    // Create a note
    const createdNote = await prisma.note.create({
      data: noteData,
    });

    // Assertions
    expect(createdNote).toBeDefined();
    expect(createdNote.id).toBeDefined();
    expect(createdNote.classId).toBe(testClass.id);
    expect(createdNote.classTitle).toBe(testClass.title);
    expect(createdNote.content).toEqual(testNoteContent);
  });

  test('should find a note by ID', async () => {
    // Create a note first
    const createdNote = await prisma.note.create({
      data: {
        classId: testClass.id,
        classTitle: testClass.title,
        classDate: new Date(),
        content: testNoteContent,
      },
    });

    // Find the note by ID
    const foundNote = await prisma.note.findUnique({
      where: { id: createdNote.id },
    });

    // Assertions
    expect(foundNote).toBeDefined();
    expect(foundNote?.id).toBe(createdNote.id);
    expect(foundNote?.classId).toBe(testClass.id);
    expect(foundNote?.content).toEqual(testNoteContent);
  });

  test('should find notes by class ID', async () => {
    // Create another class
    const anotherClass = await prisma.class.create({
      data: {
        title: 'Another Class',
        type: 'seminar',
        meetings: {
          create: [{ day: 'tuesday', startTime: '13:00', endTime: '14:30' }],
        },
      },
    });

    // Create notes for both classes
    await prisma.note.create({
      data: {
        classId: testClass.id,
        classTitle: testClass.title,
        classDate: new Date(),
        content: testNoteContent,
      },
    });

    await prisma.note.create({
      data: {
        classId: testClass.id,
        classTitle: testClass.title,
        classDate: new Date(),
        content: testNoteContent,
      },
    });

    await prisma.note.create({
      data: {
        classId: anotherClass.id,
        classTitle: anotherClass.title,
        classDate: new Date(),
        content: testNoteContent,
      },
    });

    // Find notes by class ID
    const classNotes = await prisma.note.findMany({
      where: { classId: testClass.id },
      orderBy: { createdAt: 'desc' },
    });

    // Assertions
    expect(classNotes).toBeDefined();
    expect(classNotes.length).toBe(2);
    expect(classNotes[0].classId).toBe(testClass.id);
    expect(classNotes[1].classId).toBe(testClass.id);
  });

  test('should find all notes', async () => {
    // Create multiple notes
    await prisma.note.create({
      data: {
        classId: testClass.id,
        classTitle: testClass.title,
        classDate: new Date(),
        content: testNoteContent,
      },
    });

    await prisma.note.create({
      data: {
        classId: testClass.id,
        classTitle: testClass.title,
        classDate: new Date(Date.now() - 86400000), // Yesterday
        content: testNoteContent,
      },
    });

    // Find all notes
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Assertions
    expect(notes).toBeDefined();
    expect(notes.length).toBeGreaterThanOrEqual(2);
    // Most recent first due to orderBy
    expect(new Date(notes[0].createdAt).getTime()).toBeGreaterThan(new Date(notes[1].createdAt).getTime());
  });

  test('should update a note', async () => {
    // Create a note first
    const createdNote = await prisma.note.create({
      data: {
        classId: testClass.id,
        classTitle: testClass.title,
        classDate: new Date(),
        content: testNoteContent,
      },
    });

    // Wait a moment to ensure timestamps differ
    await new Promise(resolve => setTimeout(resolve, 100));

    const updatedContent: JsonObject = {
      type: 'doc',
      content: {
        type: 'paragraph',
        content: [{ type: 'text', text: 'This is an updated note' }]
      },
    };

    // Update the note
    const updatedNote = await prisma.note.update({
      where: { id: createdNote.id },
      data: {
        content: updatedContent,
        // Force updatedAt to a new date
        updatedAt: new Date(Date.now() + 1000),
      },
    });

    // Assertions
    expect(updatedNote).toBeDefined();
    expect(updatedNote.id).toBe(createdNote.id);
    expect(updatedNote.content).toEqual(updatedContent);
    expect(updatedNote.updatedAt.getTime()).toBeGreaterThan(createdNote.updatedAt.getTime());
  });

  test('should delete a note', async () => {
    // Create a note first
    const createdNote = await prisma.note.create({
      data: {
        classId: testClass.id,
        classTitle: testClass.title,
        classDate: new Date(),
        content: testNoteContent,
      },
    });

    // Delete the note
    await prisma.note.delete({
      where: { id: createdNote.id },
    });

    // Try to find the deleted note
    const deletedNote = await prisma.note.findUnique({
      where: { id: createdNote.id },
    });

    // Assertions
    expect(deletedNote).toBeNull();
  });
}); 