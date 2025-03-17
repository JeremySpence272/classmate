// We'll create mock data directly in the script
const mockBiologyNotes = [
  {
    classTitle: "Cell Components",
    classDate: "2023-09-15T10:00:00Z", 
    content: `# Cell Structure and Function

## Main Components of a Cell
- Cell membrane: Controls what enters and leaves the cell
- Cytoplasm: Gel-like substance where chemical reactions occur
- Nucleus: Contains genetic material and controls cell activities

## Plant vs Animal Cells
| Feature | Plant Cells | Animal Cells |
|---------|------------|--------------|
| Cell Wall | Present | Absent |
| Chloroplasts | Present | Absent |
| Vacuoles | Large, central | Small, multiple |
| Shape | Regular, rectangular | Irregular |

### Key Processes
1. **Diffusion**: Movement of substances from high to low concentration
2. **Osmosis**: Diffusion of water through a semipermeable membrane
3. **Active Transport**: Movement of substances against concentration gradient (requires energy)

*Next class: We will look at cell division and reproduction.*`
  },
  {
    classTitle: "Cell Division and Reproduction",
    classDate: "2023-09-22T10:00:00Z",
    content: `# Cell Division and Reproduction

## Mitosis
Cell division process that results in two identical daughter cells
- Important for growth and tissue repair
- Steps: Prophase, Metaphase, Anaphase, Telophase, Cytokinesis

## Meiosis
- Specialized cell division that creates gametes (sperm and egg cells)
- Reduces chromosome number by half
- Introduces genetic variation through crossing over
- Results in four haploid daughter cells

## Comparison
Mitosis: 
- 1 division
- 2 identical diploid cells
- Body cells (somatic)

Meiosis:
- 2 divisions
- 4 different haploid cells
- Reproductive cells

### Practical Examples
- Skin regeneration (mitosis)
- Sperm production (meiosis)
- Plant propagation (mitosis)

*Note to self: Review DNA replication before next class*`
  },
  {
    classTitle: "Cell Reproduction Models",
    classDate: "2023-09-29T10:00:00Z",
    content: `# Genetics and Heredity

## Mendel's Laws
1. **Law of Segregation**: Each individual has two alleles for each trait, and these separate during gamete formation
2. **Law of Independent Assortment**: Genes for different traits are inherited independently
3. **Law of Dominance**: Some alleles are dominant while others are recessive

## Punnett Squares
Used to predict the probability of specific traits in offspring.

Example: 
- Tt × Tt cross (T=tall, t=short)
- Possible outcomes: TT, Tt, tT, tt
- Phenotype ratio: 3:1 (tall:short)

## Human Genetic Disorders
- **Down Syndrome**: Trisomy of chromosome 21
- **Cystic Fibrosis**: Recessive disorder affecting mucus production
- **Huntington's Disease**: Dominant disorder affecting nervous system

### Modern Applications
- Genetic counseling
- Gene therapy
- CRISPR technology

*Questions for next class: How do environmental factors influence gene expression?*`
  }
];

const API_URL = 'http://localhost:3000/api/notes';

async function seedNotes() {
  console.log('Seeding mock notes to the database...');
  
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
    
    // Create each note from our mock data
    for (const note of mockBiologyNotes) {
      // Prepare the data for the API
      const noteData = {
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