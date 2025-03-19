import { Note, EditorContent } from '../lib/types';

/**
 * Helper function to create Tiptap JSON document structure
 */
function createTiptapContent(markdown: string): EditorContent {
  // Split the markdown by double newlines to separate sections
  const sections = markdown.split('\n\n').filter(Boolean);
  const content = [];

  for (const section of sections) {
    if (section.startsWith('# ')) {
      // h1 heading
      content.push({
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: section.substring(2).trim() }]
      });
    } else if (section.startsWith('## ')) {
      // h2 heading
      content.push({
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: section.substring(3).trim() }]
      });
    } else if (section.startsWith('### ')) {
      // h3 heading
      content.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: section.substring(4).trim() }]
      });
    } else if (section.startsWith('- ')) {
      // unordered list
      const items = section.split('\n').filter(line => line.startsWith('- '));
      const listItems = items.map(item => ({
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: item.substring(2).trim() }]
          }
        ]
      }));
      
      content.push({
        type: 'bulletList',
        content: listItems
      });
    } else if (section.startsWith('1. ') || section.startsWith('2. ') || section.startsWith('3. ')) {
      // ordered list
      const items = section.split('\n').filter(line => /^\d+\.\s/.test(line));
      const listItems = items.map(item => ({
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: item.replace(/^\d+\.\s/, '').trim() }]
          }
        ]
      }));
      
      content.push({
        type: 'orderedList',
        content: listItems
      });
    } else if (section.startsWith('|') && section.includes('|')) {
      // Table (simplified handling - would need more work for a real implementation)
      content.push({
        type: 'paragraph',
        content: [{ type: 'text', text: section }]
      });
    } else if (section.startsWith('*') && section.endsWith('*')) {
      // Italic text note
      content.push({
        type: 'paragraph',
        content: [{ type: 'text', marks: [{ type: 'italic' }], text: section.substring(1, section.length - 1).trim() }]
      });
    } else {
      // Regular paragraph
      content.push({
        type: 'paragraph',
        content: [{ type: 'text', text: section }]
      });
    }
  }

  return {
    type: 'doc',
    content,
    version: 1
  };
}

/**
 * Mock data for notes related to a biology class
 */
export const mockBiologyNotes: Note[] = [
  {
    id: 101,
    classId: 1,
    classTitle: "Cell Components",
    classDate: "2023-09-15T10:00:00Z", // Class date - a previous lecture
    content: createTiptapContent(`# Cell Structure and Function

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
1. Diffusion: Movement of substances from high to low concentration
2. Osmosis: Diffusion of water through a semipermeable membrane
3. Active Transport: Movement of substances against concentration gradient (requires energy)

*Next class: We will look at cell division and reproduction.*`),
    createdAt: "2023-09-15T13:30:00Z", // When the note was created
    updatedAt: "2023-09-15T14:15:00Z", // Last modified
  },
  {
    id: 102,
    classId: 1,
    classTitle: "Cell Division and Reproduction",
    classDate: "2023-09-22T10:00:00Z", // A week later
    content: createTiptapContent(`# Cell Division and Reproduction

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

*Note to self: Review DNA replication before next class*`),
    createdAt: "2023-09-22T11:15:00Z",
    updatedAt: "2023-09-22T15:20:00Z",
  },
  {
    id: 103,
    classId: 1,
    classTitle: "Cell Reproduction Models",
    classDate: "2023-09-29T10:00:00Z", // Another week later
    content: createTiptapContent(`# Genetics and Heredity

## Mendel's Laws
1. Law of Segregation: Each individual has two alleles for each trait, and these separate during gamete formation
2. Law of Independent Assortment: Genes for different traits are inherited independently
3. Law of Dominance: Some alleles are dominant while others are recessive

## Punnett Squares
Used to predict the probability of specific traits in offspring.

Example: 
- Tt × Tt cross (T=tall, t=short)
- Possible outcomes: TT, Tt, tT, tt
- Phenotype ratio: 3:1 (tall:short)

## Human Genetic Disorders
- Down Syndrome: Trisomy of chromosome 21
- Cystic Fibrosis: Recessive disorder affecting mucus production
- Huntington's Disease: Dominant disorder affecting nervous system

### Modern Applications
- Genetic counseling
- Gene therapy
- CRISPR technology

*Questions for next class: How do environmental factors influence gene expression?*`),
    createdAt: "2023-09-29T11:30:00Z",
    updatedAt: "2023-10-01T09:45:00Z", // Updated a couple days later
  }
];

// Helper function to create notes for any class ID (for testing)
export const getNotesForClass = (classId: number): Note[] => {
  return mockBiologyNotes.map(note => ({
    ...note,
    classId
  }));
};

export default mockBiologyNotes; 