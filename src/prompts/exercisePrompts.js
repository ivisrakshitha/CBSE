// src/prompts/exercisePrompts.js

export const subjectPrompts = {
  mathematics: {
    systemPrompt: `You are an expert mathematics teacher creating exercises for CBSE students based on specific chapter content.

Generate exercises that are:
1. Mathematically accurate and aligned with CBSE curriculum
2. Progressive in difficulty (Basic, Intermediate, Advanced) with DIFFERENT questions for each level
3. Based ONLY on the content provided in the JSON data
4. Include numerical problems, word problems, proof-based questions, and application problems
5. Focus on conceptual understanding and practical application
6. Include step-by-step solutions when appropriate
7. Use examples and concepts mentioned in the provided content

IMPORTANT: 
- Basic level: Simple application of concepts and direct calculations
- Intermediate level: Multi-step problems requiring combination of concepts
- Advanced level: Proof-based, analytical, or complex application problems
- Each difficulty level must have completely different questions
- Only use content, examples, and concepts from the provided JSON data

Format your response as a JSON array of exercise objects with the following structure:
{
  "type": "Numerical|Word Problem|Proof|Application|Conceptual",
  "problem": "string",
  "difficulty": "Basic|Intermediate|Advanced",
  "skillTargeted": "string",
  "hint": "string (optional)",
  "solution": "string (optional)"
}

Generate 6-8 exercises per section (2-3 for each difficulty level).`,

    contextBuilder: (sectionData, chapterMetadata) => {
      let context = `Chapter: ${chapterMetadata.title}
Grade: ${chapterMetadata.grade}
Subject: ${chapterMetadata.subject}
Section: ${sectionData.title}
Section Summary: ${sectionData.summary}

Learning Objectives:
${chapterMetadata.learningObjectives.map((obj) => `- ${obj}`).join("\n")}

`;

      // Add Key Concepts
      if (sectionData.keyConcepts && sectionData.keyConcepts.length > 0) {
        context += `Key Concepts to focus on:
${sectionData.keyConcepts
  .map((concept) => {
    let conceptText = `- ${concept.name}: ${concept.description}`;
    if (concept.properties && concept.properties.length > 0) {
      conceptText += `\n  Properties: ${concept.properties.join(", ")}`;
    }
    if (concept.examples && concept.examples.length > 0) {
      conceptText += `\n  Examples: ${concept.examples.join(", ")}`;
    }
    return conceptText;
  })
  .join("\n")}

`;
      }

      // Add Theorems
      if (sectionData.theorems && sectionData.theorems.length > 0) {
        context += `Theorems covered:
${sectionData.theorems.map((theorem) => `- ${theorem.statement}`).join("\n")}

`;
      }

      // Add Examples from the content
      if (sectionData.examples && sectionData.examples.length > 0) {
        context += `Examples from the content:
${sectionData.examples
  .map(
    (example) =>
      `- ${example.content}${
        example.context ? " (Context: " + example.context + ")" : ""
      }`
  )
  .join("\n")}

`;
      }

      // Add existing exercises as reference (if any)
      if (sectionData.exercises && sectionData.exercises.length > 0) {
        context += `Reference exercises (create similar but different questions):
${sectionData.exercises
  .map(
    (exercise) =>
      `- ${exercise.type}: ${exercise.problem} (${exercise.difficulty})`
  )
  .join("\n")}

`;
      }

      context += `EXERCISE GENERATION REQUIREMENTS:

Basic Level Questions (Generate 2-3):
- Direct application of definitions and basic concepts
- Simple calculations using given formulas
- Recognition and identification problems
- Single-step numerical problems

Intermediate Level Questions (Generate 2-3):
- Multi-step problems combining multiple concepts
- Word problems requiring mathematical modeling
- Problems requiring logical reasoning
- Application of theorems and properties

Advanced Level Questions (Generate 2-3):
- Proof-based questions
- Complex application problems
- Problems requiring deep conceptual understanding
- Analytical and reasoning-intensive problems

Use the specific content, examples, and concepts mentioned in this section. Do not create generic questions - base them on the actual mathematical content provided.`;

      return context;
    },
  },

  // For different subjects, you can add specific prompts
  science: {
    systemPrompt: `You are an expert science teacher creating exercises for CBSE students based on specific chapter content.

Generate exercises that are:
1. Scientifically accurate and aligned with CBSE curriculum
2. Progressive in difficulty (Basic, Intermediate, Advanced) with DIFFERENT questions for each level
3. Based ONLY on the content provided in the JSON data
4. Include conceptual questions, numerical problems, diagram-based questions, and application problems
5. Focus on scientific reasoning and practical application
6. Include explanations for complex concepts

Format your response as a JSON array of exercise objects with the following structure:
{
  "type": "Conceptual|Numerical|Diagram|Application|Experimental",
  "problem": "string",
  "difficulty": "Basic|Intermediate|Advanced",
  "skillTargeted": "string",
  "hint": "string (optional)",
  "solution": "string (optional)"
}

Generate 6-8 exercises per section (2-3 for each difficulty level).`,

    contextBuilder: (sectionData, chapterMetadata) => {
      let context = `Chapter: ${chapterMetadata.title}
Grade: ${chapterMetadata.grade}
Subject: ${chapterMetadata.subject}
Section: ${sectionData.title}
Section Summary: ${sectionData.summary}

Learning Objectives:
${chapterMetadata.learningObjectives.map((obj) => `- ${obj}`).join("\n")}

`;

      // Add Key Concepts for Science
      if (sectionData.keyConcepts && sectionData.keyConcepts.length > 0) {
        context += `Key Scientific Concepts:
${sectionData.keyConcepts
  .map((concept) => {
    let conceptText = `- ${concept.name}: ${concept.description}`;
    if (concept.properties && concept.properties.length > 0) {
      conceptText += `\n  Properties: ${concept.properties.join(", ")}`;
    }
    if (concept.examples && concept.examples.length > 0) {
      conceptText += `\n  Examples: ${concept.examples.join(", ")}`;
    }
    return conceptText;
  })
  .join("\n")}

`;
      }

      // Add Scientific Laws/Principles
      if (sectionData.laws && sectionData.laws.length > 0) {
        context += `Scientific Laws/Principles:
${sectionData.laws.map((law) => `- ${law.statement}`).join("\n")}

`;
      }

      // Add Experiments (if any)
      if (sectionData.experiments && sectionData.experiments.length > 0) {
        context += `Experiments covered:
${sectionData.experiments
  .map((exp) => `- ${exp.title}: ${exp.description}`)
  .join("\n")}

`;
      }

      context += `EXERCISE GENERATION REQUIREMENTS:

Basic Level Questions (Generate 2-3):
- Definition-based questions
- Simple recall of facts and concepts
- Basic diagram labeling
- Direct formula applications

Intermediate Level Questions (Generate 2-3):
- Explanation of processes and phenomena
- Numerical problems with multiple steps
- Comparison and contrast questions
- Application of scientific principles

Advanced Level Questions (Generate 2-3):
- Analysis of experimental data
- Complex problem-solving scenarios
- Critical thinking and reasoning questions
- Real-world application problems

Use the specific scientific content, examples, and concepts mentioned in this section.`;

      return context;
    },
  },

  // Add more subjects as needed
  socialScience: {
    systemPrompt: `You are an expert social science teacher creating exercises for CBSE students based on specific chapter content.

Generate exercises that are:
1. Factually accurate and aligned with CBSE curriculum
2. Progressive in difficulty (Basic, Intermediate, Advanced) with DIFFERENT questions for each level
3. Based ONLY on the content provided in the JSON data
4. Include factual questions, analytical questions, map-based questions, and application problems
5. Focus on critical thinking and understanding of social processes
6. Include questions that develop civic sense and historical understanding

Format your response as a JSON array of exercise objects with the following structure:
{
  "type": "Factual|Analytical|Map-based|Application|Source-based",
  "problem": "string",
  "difficulty": "Basic|Intermediate|Advanced",
  "skillTargeted": "string",
  "hint": "string (optional)",
  "solution": "string (optional)"
}

Generate 6-8 exercises per section (2-3 for each difficulty level).`,

    contextBuilder: (sectionData, chapterMetadata) => {
      let context = `Chapter: ${chapterMetadata.title}
Grade: ${chapterMetadata.grade}
Subject: ${chapterMetadata.subject}
Section: ${sectionData.title}
Section Summary: ${sectionData.summary}

Learning Objectives:
${chapterMetadata.learningObjectives.map((obj) => `- ${obj}`).join("\n")}

`;

      // Add Key Concepts for Social Science
      if (sectionData.keyConcepts && sectionData.keyConcepts.length > 0) {
        context += `Key Concepts:
${sectionData.keyConcepts
  .map((concept) => `- ${concept.name}: ${concept.description}`)
  .join("\n")}

`;
      }

      // Add Historical Events (if any)
      if (
        sectionData.historicalEvents &&
        sectionData.historicalEvents.length > 0
      ) {
        context += `Historical Events:
${sectionData.historicalEvents
  .map((event) => `- ${event.date}: ${event.description}`)
  .join("\n")}

`;
      }

      // Add Important Personalities (if any)
      if (sectionData.personalities && sectionData.personalities.length > 0) {
        context += `Important Personalities:
${sectionData.personalities
  .map((person) => `- ${person.name}: ${person.contribution}`)
  .join("\n")}

`;
      }

      context += `EXERCISE GENERATION REQUIREMENTS:

Basic Level Questions (Generate 2-3):
- Factual recall questions
- Simple definitions and explanations
- Date and event matching
- Basic geographical knowledge

Intermediate Level Questions (Generate 2-3):
- Cause and effect analysis
- Comparison of events/concepts
- Interpretation of information
- Application of knowledge to new situations

Advanced Level Questions (Generate 2-3):
- Critical analysis and evaluation
- Source-based questions
- Map and diagram interpretation
- Higher-order thinking skills

Use the specific content, examples, and concepts mentioned in this section.`;

      return context;
    },
  },
};
