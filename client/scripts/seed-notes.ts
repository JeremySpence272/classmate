import { mockBiologyNotes } from '../src/mocks/notesMock.js';
import { CreateNoteData } from '../src/lib/types.js';

const API_URL = 'http://localhost:3000/api/notes';

async function seedNotes() {
  console.log('Seeding mock notes with JSON content to the database...');
  
  // Get existing classes to make sure we're using valid class IDs
  try {
    const classesResponse = await fetch('http://localhost:3000/api/classes');
    
    if (!classesResponse.ok) {
      throw new Error('Failed to fetch classes');
    }
    
    const classes = await classesResponse.json();
    
    if (classes.length === 0) {
      console.error('No classes found! Please create at least one class first.');
      process.exit(1);
    }
    
    // Use the first class ID for our mock data
    const targetClassId = classes[0].id;
    console.log(`Using class ID ${targetClassId} for seeding notes...`);
    
    // Delete existing notes for this class to avoid duplicates
    console.log(`Cleaning up existing notes for class ID ${targetClassId}...`);
    try {
      const existingNotesResponse = await fetch(`http://localhost:3000/api/notes?classId=${targetClassId}`);
      if (existingNotesResponse.ok) {
        const existingNotes = await existingNotesResponse.json();
        console.log(`Found ${existingNotes.length} existing notes for this class.`);
        
        // Delete them if there are any
        if (existingNotes.length > 0) {
          console.log('Deleting existing notes...');
          for (const note of existingNotes) {
            const deleteResponse = await fetch(`http://localhost:3000/api/notes?id=${note.id}`, {
              method: 'DELETE',
            });
            
            if (deleteResponse.ok) {
              console.log(`Deleted note ID: ${note.id}`);
            } else {
              console.warn(`Failed to delete note ID: ${note.id}`);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error cleaning up existing notes:', error);
      // Continue with the seeding process even if cleanup fails
    }
    
    // Create each note from our mock data
    for (const note of mockBiologyNotes) {
      // Prepare the data for the API
      const noteData: CreateNoteData = {
        classId: targetClassId, // Use a real class ID
        classTitle: note.classTitle,
        classDate: note.classDate,
        content: note.content
      };
      
      // Post to the API
      console.log(`Creating note: ${note.classTitle}`);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error(`Failed to create note: ${note.classTitle}`, error);
        continue;
      }
      
      const createdNote = await response.json();
      console.log(`Created note with ID: ${createdNote.id}`);
    }
    
    console.log('All notes have been seeded successfully!');
  } catch (error) {
    console.error('Error seeding notes:', error);
    process.exit(1);
  }
}

// Run the seed function
seedNotes(); 