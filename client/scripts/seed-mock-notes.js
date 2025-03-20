// Direct seed script for notes with JSON content
import { mockBiologyNotes } from '../src/lib/mock-notes';
// Base URL for API calls
const API_URL = 'http://localhost:3000/api/notes';


  

// Function to seed the notes
async function seedNotes() {
  try {
    // Get available classes first
    const classesResponse = await fetch('http://localhost:3000/api/classes');
    if (!classesResponse.ok) {
      throw new Error('Failed to fetch classes');
    }

    const classes = await classesResponse.json();
    if (classes.length === 0) {
      throw new Error('No classes found. Please create a class first.');
    }

    // Use the first class ID for our notes
    const targetClassId = classes[0].id;
    console.log(`Using class ID: ${targetClassId}`);

    // Get existing notes
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch existing notes');
    }

    const existingNotes = await response.json();
    console.log(`Found ${existingNotes.length} existing notes.`);

    // Delete existing notes one by one
    for (const note of existingNotes) {
      const deleteResponse = await fetch(`${API_URL}?id=${note.id}`, {
        method: 'DELETE'
      });

      if (!deleteResponse.ok) {
        console.warn(`Failed to delete note ID: ${note.id}`);
      } else {
        console.log(`Deleted note ID: ${note.id}`);
      }
    }

    // Create new notes
    for (const note of mockBiologyNotes) {
      const noteData = {
        ...note,
        classId: targetClassId
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      console.log(`Created note: ${note.classTitle}`);
    }

    console.log('Successfully seeded all notes!');
  } catch (error) {
    console.error('Error seeding notes:', error);
  }
}

// Run the seed function
seedNotes(); 