import { describe, test, expect } from '@jest/globals';
import { prisma } from '../setup';
import { Class, ClassType, Day } from '@/lib/types';

describe('Class Database Operations', () => {
  // Test data
  const testClass = {
    title: 'Test Class',
    type: 'lecture' as ClassType,
    meetings: [
      {
        day: 'monday' as Day,
        startTime: '10:00',
        endTime: '11:30',
      },
      {
        day: 'wednesday' as Day,
        startTime: '10:00',
        endTime: '11:30',
      },
    ],
  };

  test('should create a class with meetings', async () => {
    // Create a class using prisma
    const createdClass = await prisma.class.create({
      data: {
        title: testClass.title,
        type: testClass.type,
        meetings: {
          create: testClass.meetings.map((meeting) => ({
            day: meeting.day,
            startTime: meeting.startTime,
            endTime: meeting.endTime,
          })),
        },
      },
      include: {
        meetings: true,
      },
    });

    // Assertions
    expect(createdClass).toBeDefined();
    expect(createdClass.id).toBeDefined();
    expect(createdClass.title).toBe(testClass.title);
    expect(createdClass.type).toBe(testClass.type);
    expect(createdClass.meetings).toHaveLength(2);
    expect(createdClass.meetings[0].day).toBe('monday');
    expect(createdClass.meetings[1].day).toBe('wednesday');
  });

  test('should find a class by ID', async () => {
    // Create a class first
    const createdClass = await prisma.class.create({
      data: {
        title: testClass.title,
        type: testClass.type,
        meetings: {
          create: testClass.meetings.map((meeting) => ({
            day: meeting.day,
            startTime: meeting.startTime,
            endTime: meeting.endTime,
          })),
        },
      },
      include: {
        meetings: true,
      },
    });

    // Find the class by ID
    const foundClass = await prisma.class.findUnique({
      where: { id: createdClass.id },
      include: { meetings: true },
    });

    // Assertions
    expect(foundClass).toBeDefined();
    expect(foundClass?.id).toBe(createdClass.id);
    expect(foundClass?.title).toBe(testClass.title);
    expect(foundClass?.meetings).toHaveLength(2);
  });

  test('should find all classes', async () => {
    // Create multiple classes
    await prisma.class.create({
      data: {
        title: 'Class 1',
        type: 'lecture',
        meetings: {
          create: [{ day: 'monday', startTime: '09:00', endTime: '10:30' }],
        },
      },
    });

    await prisma.class.create({
      data: {
        title: 'Class 2',
        type: 'seminar',
        meetings: {
          create: [{ day: 'tuesday', startTime: '13:00', endTime: '14:30' }],
        },
      },
    });

    // Find all classes
    const classes = await prisma.class.findMany({
      include: { meetings: true },
      orderBy: { createdAt: 'desc' },
    });

    // Assertions
    expect(classes).toBeDefined();
    expect(classes.length).toBeGreaterThanOrEqual(2);
    expect(classes[0].title).toBe('Class 2'); // Most recent first
    expect(classes[1].title).toBe('Class 1');
  });

  test('should update a class and its meetings', async () => {
    // Create a class first
    const createdClass = await prisma.class.create({
      data: {
        title: testClass.title,
        type: testClass.type,
        meetings: {
          create: testClass.meetings.map((meeting) => ({
            day: meeting.day,
            startTime: meeting.startTime,
            endTime: meeting.endTime,
          })),
        },
      },
      include: {
        meetings: true,
      },
    });

    // Update the class
    const updatedClass = await prisma.class.update({
      where: { id: createdClass.id },
      data: {
        title: 'Updated Class',
        type: 'seminar',
        meetings: {
          deleteMany: {},
          create: [
            { day: 'thursday', startTime: '13:00', endTime: '14:30' },
            { day: 'friday', startTime: '13:00', endTime: '14:30' },
          ],
        },
      },
      include: {
        meetings: true,
      },
    });

    // Assertions
    expect(updatedClass).toBeDefined();
    expect(updatedClass.id).toBe(createdClass.id);
    expect(updatedClass.title).toBe('Updated Class');
    expect(updatedClass.type).toBe('seminar');
    expect(updatedClass.meetings).toHaveLength(2);
    expect(updatedClass.meetings[0].day).toBe('thursday');
    expect(updatedClass.meetings[1].day).toBe('friday');
  });

  test('should delete a class', async () => {
    // Create a class first
    const createdClass = await prisma.class.create({
      data: {
        title: testClass.title,
        type: testClass.type,
        meetings: {
          create: testClass.meetings.map((meeting) => ({
            day: meeting.day,
            startTime: meeting.startTime,
            endTime: meeting.endTime,
          })),
        },
      },
    });

    // Delete the class
    await prisma.class.delete({
      where: { id: createdClass.id },
    });

    // Try to find the deleted class
    const deletedClass = await prisma.class.findUnique({
      where: { id: createdClass.id },
    });

    // Assertions
    expect(deletedClass).toBeNull();

    // Check if meetings were also deleted (cascade)
    const meetings = await prisma.meeting.findMany({
      where: { classId: createdClass.id },
    });
    expect(meetings).toHaveLength(0);
  });
}); 