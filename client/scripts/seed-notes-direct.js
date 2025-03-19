// Direct seed script for notes with JSON content

// Base URL for API calls
const API_URL = 'http://localhost:3000/api/notes';

// Mock data for a biology class
const mockBiologyNotes = [
    {
      classTitle: "Biology 101 – Unit I: Cellular Life",
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
                text: "This unit introduces the scientific method, foundational chemistry principles, and the building blocks of life, culminating in a deeper understanding of cells and their essential processes like metabolism and photosynthesis."
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "1. Scientific Method and Basic Chemistry" }]
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
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Experimentation: " },
                      { type: "text", text: "Collect data methodically, track variables, confirm or refute hypothesis." }
                    ]
                  }
                ]
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Basic Chemistry: " },
                      { type: "text", text: "Atoms, molecules, bonds (covalent, ionic, hydrogen) crucial for cellular function." }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "2. Molecules and Macromolecules" }]
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Cells depend on four key macromolecules: carbohydrates, lipids, proteins, and nucleic acids. " },
              { type: "text", marks: [{ type: "highlight" }], text: "These are essential for structure, energy storage, and information transfer." }
            ]
          },
          {
            type: "columnBlock",
            attrs: { columns: 2 },
            content: [
              {
                type: "column",
                content: [
                  {
                    type: "heading",
                    attrs: { level: 3 },
                    content: [{ type: "text", text: "Carbs & Lipids" }]
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
                              { type: "text", marks: [{ type: "bold" }], text: "Carbohydrates: " },
                              { type: "text", text: "Main energy source (glucose), structural role (cellulose)." }
                            ]
                          }
                        ]
                      },
                      {
                        type: "listItem",
                        content: [
                          {
                            type: "paragraph",
                            content: [
                              { type: "text", marks: [{ type: "bold" }], text: "Lipids: " },
                              { type: "text", text: "Fats, phospholipids; crucial for cell membranes and energy storage." }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                type: "column",
                content: [
                  {
                    type: "heading",
                    attrs: { level: 3 },
                    content: [{ type: "text", text: "Proteins & Nucleic Acids" }]
                  },
                  {
                    type: "orderedList",
                    content: [
                      {
                        type: "listItem",
                        content: [
                          {
                            type: "paragraph",
                            content: [
                              { type: "text", marks: [{ type: "bold" }], text: "Proteins: " },
                              { type: "text", text: "Enzymes, structural molecules, transport carriers (diverse functions)." }
                            ]
                          }
                        ]
                      },
                      {
                        type: "listItem",
                        content: [
                          {
                            type: "paragraph",
                            content: [
                              { type: "text", marks: [{ type: "bold" }], text: "Nucleic Acids: " },
                              { type: "text", text: "DNA and RNA store and convey genetic information." }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "3. Cell Structure and Transport" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "All cells feature a membrane, cytoplasm, genetic material, and the ability to reproduce. Eukaryotic cells have membrane-bound organelles, such as the nucleus, mitochondria, and endoplasmic reticulum."
              }
            ]
          },
          {
            type: "table",
            content: [
              {
                type: "tableRow",
                content: [
                  {
                    type: "tableHeader",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Organelle" }] }]
                  },
                  {
                    type: "tableHeader",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Key Function" }] }]
                  },
                  {
                    type: "tableHeader",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Location" }] }]
                  }
                ]
              },
              {
                type: "tableRow",
                content: [
                  {
                    type: "tableCell",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Mitochondrion" }] }]
                  },
                  {
                    type: "tableCell",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "ATP production (cellular respiration)" }] }]
                  },
                  {
                    type: "tableCell",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Eukaryotes" }] }]
                  }
                ]
              },
              {
                type: "tableRow",
                content: [
                  {
                    type: "tableCell",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Chloroplast" }] }]
                  },
                  {
                    type: "tableCell",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Photosynthesis (in plants/algae)" }] }]
                  },
                  {
                    type: "tableCell",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Plants, Protists" }] }]
                  }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "4. Metabolism and Enzymes" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "bold" }],
                text: "Metabolism: "
              },
              {
                type: "text",
                text: "Sum of all chemical reactions within a cell. Enzymes lower the activation energy, making reactions proceed faster."
              }
            ]
          },
          {
            type: "codeBlock",
            attrs: { language: "text" },
            content: [
              {
                type: "text",
                text: "Enzyme Example:\n- Substrate binds at active site.\n- Reaction proceeds, forming product.\n- Enzyme remains unchanged."
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "5. Photosynthesis" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "Involves converting light energy into chemical energy"
              },
              {
                type: "text",
                text: ". Occurs in chloroplasts; vital for oxygen production and glucose synthesis in plant cells."
              }
            ]
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "For additional reading and diagrams, visit " },
              {
                type: "text",
                marks: [
                  {
                    type: "link",
                    attrs: {
                      href: "https://www.biointeractive.org/classroom-resources"
                    }
                  }
                ],
                text: "BioInteractive Resources"
              },
              { type: "text", text: "." }
            ]
          }
        ],
        version: 1
      }
    },
    {
      classTitle: "Biology 101 – Unit II: Genetics",
      classDate: "2024-06-26T11:30:00Z",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Unit II: Genetics – Mitosis, Meiosis, and Inheritance" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Genetics explores how traits are passed from one generation to the next through DNA, chromosomes, and various cellular processes. Core topics include mitosis, meiosis, and patterns of inheritance."
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "1. Mitosis & Meiosis" }]
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
                      { type: "text", marks: [{ type: "bold" }], text: "Mitosis: " },
                      {
                        type: "text",
                        text: "Somatic cell division resulting in two genetically identical daughter cells."
                      }
                    ]
                  }
                ]
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Meiosis: " },
                      {
                        type: "text",
                        text: "Gamete formation in sexually reproducing organisms, generating genetic diversity."
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "highlight" }], text: "Key Point: " },
              {
                type: "text",
                text: "Errors in meiosis (nondisjunction) can lead to chromosomal disorders like Down syndrome (Trisomy 21)."
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "2. Inheritance & Human Genetics" }]
          },
          {
            type: "orderedList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Mendelian Inheritance: " },
                      {
                        type: "text",
                        text: "Classical dominance, recessive alleles, segregation, and independent assortment."
                      }
                    ]
                  }
                ]
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Complex Inheritance: " },
                      {
                        type: "text",
                        text: "Incomplete dominance, codominance, polygenic traits, and environmental factors."
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "blockquote",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "italic" }],
                    text: "“Inheritable factors are distributed to offspring in predictable ratios.” – Gregor Mendel"
                  }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "3. Punnett Squares & Probability" }]
          },
          {
            type: "table",
            content: [
              {
                type: "tableRow",
                content: [
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Parent Genotype" }] }] },
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Possible Alleles" }] }] },
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Phenotypic Ratio" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Aa x Aa" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "A or a" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "3:1 (dominant:recessive)" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Aa x aa" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "A or a" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "1:1 (dominant:recessive)" }] }] }
                ]
              }
            ]
          },
          {
            type: "codeBlock",
            attrs: { language: "text" },
            content: [
              {
                type: "text",
                text: "Example:\nCross (Aa x Aa)\nPossible Offspring Genotypes: AA, Aa, aa\nPhenotypic Ratio: 3 dominant : 1 recessive"
              }
            ]
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "For more information on human genetic disorders, visit " },
              {
                type: "text",
                marks: [{ type: "link", attrs: { href: "https://ghr.nlm.nih.gov/" } }],
                text: "Genetics Home Reference"
              }
            ]
          }
        ],
        version: 1
      }
    },
    {
      classTitle: "Biology 101 – Unit III: Evolution",
      classDate: "2024-07-03T11:30:00Z",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Unit III: Evolution – Principles and Patterns" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "This unit explores the theory of evolution, natural selection, and how species adapt to their environments over time. Darwin’s work and subsequent findings provide the foundation for understanding biodiversity."
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "1. Darwin and Natural Selection" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Charles Darwin proposed that individuals with favorable traits are more likely to survive and reproduce, passing those traits on to the next generation. Over many generations, this leads to evolutionary change."
              }
            ]
          },
          {
            type: "blockquote",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "italic" }],
                    text: "“Endless forms most beautiful and most wonderful have been, and are being, evolved.”"
                  },
                  { type: "text", text: " – Charles Darwin" }
                ]
              }
            ]
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
                      { type: "text", marks: [{ type: "bold" }], text: "Variation: " },
                      {
                        type: "text",
                        text: "Individuals differ within a population (genetic and phenotypic)."
                      }
                    ]
                  }
                ]
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Competition: " },
                      {
                        type: "text",
                        text: "Resources are limited, leading to survival challenges."
                      }
                    ]
                  }
                ]
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Adaptation: " },
                      {
                        type: "text",
                        text: "Beneficial traits become more common over time."
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "2. Evolutionary Patterns" }]
          },
          {
            type: "orderedList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Divergent Evolution: " },
                      {
                        type: "text",
                        text: "Closely related species develop differing traits (e.g., Galapagos finches)."
                      }
                    ]
                  }
                ]
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Convergent Evolution: " },
                      {
                        type: "text",
                        text: "Unrelated species develop similar traits (e.g., wings in bats and insects)."
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "3. Mechanisms of Evolution" }]
          },
          {
            type: "table",
            content: [
              {
                type: "tableRow",
                content: [
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Mechanism" }] }] },
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Definition" }] }] },
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Example" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Natural Selection" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Survival of the fittest" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Peppered moth coloration" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Genetic Drift" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Random changes in allele frequencies" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Founder effect in island birds" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Gene Flow" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Transfer of genes between populations" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Migration of individuals" }] }] }
                ]
              }
            ]
          },
          {
            type: "codeBlock",
            attrs: { language: "text" },
            content: [
              {
                type: "text",
                text: "Pseudocode for Natural Selection:\n1. Start with a population with varying traits.\n2. Environmental pressure favors certain traits.\n3. Individuals with advantageous traits reproduce more.\n4. Over generations, those traits increase in frequency."
              }
            ]
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "For deeper insights into evolutionary mechanisms, check out " },
              {
                type: "text",
                marks: [{ type: "link", attrs: { href: "https://evolution.berkeley.edu/" } }],
                text: "UC Berkeley's Evolution 101"
              }
            ]
          }
        ],
        version: 1
      }
    },
    {
      classTitle: "Biology 101 – Unit IV: Evolution and Biodiversity",
      classDate: "2024-07-10T11:30:00Z",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Unit IV: Evolution and Biodiversity – Invertebrates & Vertebrates" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Building on the principles of evolution, this unit covers the extensive diversity of life forms, from simple invertebrates to complex vertebrates, showcasing evolutionary paths and phylogenetic relationships."
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "1. Invertebrate Evolution" }]
          },
          {
            type: "columnBlock",
            attrs: { columns: 2 },
            content: [
              {
                type: "column",
                content: [
                  {
                    type: "heading",
                    attrs: { level: 3 },
                    content: [{ type: "text", text: "Key Groups" }]
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
                              { type: "text", marks: [{ type: "bold" }], text: "Sponges: " },
                              { type: "text", text: "Earliest multicellular animals, lack true tissues." }
                            ]
                          }
                        ]
                      },
                      {
                        type: "listItem",
                        content: [
                          {
                            type: "paragraph",
                            content: [
                              { type: "text", marks: [{ type: "bold" }], text: "Cnidarians: " },
                              { type: "text", text: "Jellyfish, corals, stinging cells for prey capture." }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                type: "column",
                content: [
                  {
                    type: "heading",
                    attrs: { level: 3 },
                    content: [{ type: "text", text: "Arthropods & Mollusks" }]
                  },
                  {
                    type: "orderedList",
                    content: [
                      {
                        type: "listItem",
                        content: [
                          {
                            type: "paragraph",
                            content: [
                              { type: "text", marks: [{ type: "bold" }], text: "Arthropods: " },
                              { type: "text", text: "Insects, crustaceans; exoskeleton and segmented bodies." }
                            ]
                          }
                        ]
                      },
                      {
                        type: "listItem",
                        content: [
                          {
                            type: "paragraph",
                            content: [
                              { type: "text", marks: [{ type: "bold" }], text: "Mollusks: " },
                              { type: "text", text: "Clams, snails, cephalopods; diverse body plans and shell types." }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "blockquote",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "italic" }], text: "Fun Fact: " },
                  {
                    type: "text",
                    text: "More than 80% of known animal species are arthropods (insects, spiders, crustaceans)."
                  }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "2. Vertebrate Evolution" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Vertebrates possess a backbone and are categorized into fish, amphibians, reptiles, birds, and mammals. They exhibit complex organ systems and diverse adaptations."
              }
            ]
          },
          {
            type: "table",
            content: [
              {
                type: "tableRow",
                content: [
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Class" }] }] },
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Key Adaptation" }] }] },
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Example Species" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Fish" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Gills for underwater respiration" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Salmon" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Amphibians" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Dual life (water & land)" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Frogs" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Mammals" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Hair/fur, mammary glands" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Humans" }] }] }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "3. Biodiversity Hotspots" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "bold" }],
                text: "Conservation note: "
              },
              {
                type: "text",
                text: "Areas like tropical rainforests and coral reefs harbor immense biodiversity but face threats from habitat loss and climate change."
              }
            ]
          },
          {
            type: "codeBlock",
            attrs: { language: "text" },
            content: [
              {
                type: "text",
                text: "Biodiversity Preservation Strategies:\n- Habitat protection\n- Sustainable resource use\n- Restoration ecology"
              }
            ]
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "For more on biodiversity, explore " },
              {
                type: "text",
                marks: [{ type: "link", attrs: { href: "https://www.worldwildlife.org/initiatives" } }],
                text: "WWF Initiatives"
              }
            ]
          }
        ],
        version: 1
      }
    },
    {
      classTitle: "Biology 101 – Unit V: Plant Structure and Function",
      classDate: "2024-07-17T11:30:00Z",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Unit V: Plant Structure and Function – Tissues, Nutrition, Support" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Plants are essential to life on Earth, providing oxygen, food, and ecological balance. This unit addresses plant tissues, growth, transport systems, and overall physiological processes."
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "1. Plant Tissues" }]
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
                      { type: "text", marks: [{ type: "bold" }], text: "Dermal Tissue: " },
                      {
                        type: "text",
                        text: "Protective outer covering, includes guard cells for gas exchange."
                      }
                    ]
                  }
                ]
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Vascular Tissue: " },
                      {
                        type: "text",
                        text: "Xylem (water transport) and Phloem (sugar transport)."
                      }
                    ]
                  }
                ]
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Ground Tissue: " },
                      {
                        type: "text",
                        text: "Photosynthesis, storage, and structural support."
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "2. Plant Nutrition and Transport" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Water and minerals move from roots to leaves via xylem, driven by transpiration pull. Sugars produced in leaves travel through phloem to supply energy to non-photosynthetic parts."
              }
            ]
          },
          {
            type: "table",
            content: [
              {
                type: "tableRow",
                content: [
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Mineral" }] }] },
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Function" }] }] },
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Deficiency Symptom" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Nitrogen" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Leaf growth, chlorophyll" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Yellowing leaves" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Phosphorus" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Energy transfer, root growth" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Stunted growth" }] }] }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "3. Plant Growth & Development" }]
          },
          {
            type: "columnBlock",
            attrs: { columns: 2 },
            content: [
              {
                type: "column",
                content: [
                  {
                    type: "heading",
                    attrs: { level: 3 },
                    content: [{ type: "text", text: "Primary Growth" }]
                  },
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Occurs at apical meristems in roots and shoots, increasing plant length."
                      }
                    ]
                  }
                ]
              },
              {
                type: "column",
                content: [
                  {
                    type: "heading",
                    attrs: { level: 3 },
                    content: [{ type: "text", text: "Secondary Growth" }]
                  },
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "In woody plants, lateral meristems (vascular cambium) add girth, forming annual rings."
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "codeBlock",
            attrs: { language: "text" },
            content: [
              {
                type: "text",
                text: "Sample Transpiration Calculation:\n1. Measure water loss from potometer.\n2. Record time intervals.\n3. Rate = volume of water lost / time."
              }
            ]
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "For more detailed plant biology materials, see " },
              {
                type: "text",
                marks: [{ type: "link", attrs: { href: "https://plantscience.uoregon.edu/" } }],
                text: "UO Plant Science"
              }
            ]
          }
        ],
        version: 1
      }
    },
    {
      classTitle: "Biology 101 – Unit VI: Animal Structure and Function",
      classDate: "2024-07-18T11:30:00Z",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Unit VI: Animal Structure and Function – Organ Systems, Endocrine Control" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "This final unit focuses on the anatomy and physiology of animals, detailing organ systems, endocrine signaling, and processes like reproduction and development."
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "1. Major Organ Systems" }]
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
                      { type: "text", marks: [{ type: "bold" }], text: "Digestive System: " },
                      {
                        type: "text",
                        text: "Breaks down food, absorbs nutrients, expels waste."
                      }
                    ]
                  }
                ]
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Circulatory System: " },
                      {
                        type: "text",
                        text: "Transports oxygen, nutrients, hormones via blood."
                      }
                    ]
                  }
                ]
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Nervous System: " },
                      {
                        type: "text",
                        text: "Coordinates responses, processes sensory input, regulates activities."
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "2. Endocrine System" }]
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Hormones are chemical messengers secreted by glands that regulate growth, metabolism, reproduction, and homeostasis." }
            ]
          },
          {
            type: "table",
            content: [
              {
                type: "tableRow",
                content: [
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Hormone" }] }] },
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Function" }] }] },
                  { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Secreted By" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Insulin" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Lowers blood glucose" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Pancreas" }] }] }
                ]
              },
              {
                type: "tableRow",
                content: [
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Thyroxine" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Regulates metabolism" }] }] },
                  { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Thyroid gland" }] }] }
                ]
              }
            ]
          },
          {
            type: "blockquote",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "italic" }], text: "Remember: " },
                  {
                    type: "text",
                    text: "Hormones circulate widely but only affect target cells with the correct receptors."
                  }
                ]
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "3. Reproduction and Development" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Animal reproduction can be sexual or asexual. In sexual reproduction, fertilization merges gametes (sperm and egg), creating genetic diversity. Development involves stages such as zygote, embryo, and fetus (in mammals)."
              }
            ]
          },
          {
            type: "codeBlock",
            attrs: { language: "text" },
            content: [
              {
                type: "text",
                text: "Basic Mammalian Development:\n1. Fertilization forms zygote.\n2. Zygote divides by mitosis (cleavage).\n3. Formation of blastocyst.\n4. Gastrulation forms germ layers.\n5. Organogenesis creates specialized tissues."
              }
            ]
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "For more in-depth resources on animal physiology, visit " },
              {
                type: "text",
                marks: [{ type: "link", attrs: { href: "https://www.physiology.org/" } }],
                text: "American Physiological Society"
              }
            ]
          }
        ],
        version: 1
      }
    }
  ];
  

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