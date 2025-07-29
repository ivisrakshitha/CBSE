// src/services/AIService.js

import { subjectPrompts } from "../prompts/exercisePrompts.js";

class AIService {
  constructor() {
    this.apiUrl =
      process.env.VUE_APP_OPENWEBUI_URL ||
      "https://chat.ivislabs.in/api/chat/completions";
    this.apiKey = process.env.VUE_APP_OPENWEBUI_API_KEY || "sk-bf725748416143d88b7ea444d68f0c90"; //Api Key
    this.model = process.env.VUE_APP_OPENWEBUI_MODEL || "llama3.2-vision:latest";
  }

  async generateExercises(sectionData, chapterMetadata) {
    if (!this.apiKey) {
      throw new Error("OpenWebUI API key not configured");
    }

    try {
      // Determine subject type from metadata
      const subject = this.getSubjectType(chapterMetadata.subject);
      const prompt = subjectPrompts[subject];

      if (!prompt) {
        throw new Error(
          `No prompt configuration found for subject: ${chapterMetadata.subject}`
        );
      }

      // Build context using the subject-specific context builder
      const context = prompt.contextBuilder(sectionData, chapterMetadata);

      // Modified request body to match OpenWebUI expected format
      const requestBody = {
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              prompt.systemPrompt +
              "\n\nIMPORTANT: Return ONLY a valid JSON array. Do not include any explanatory text, markdown formatting, or code blocks. Start directly with [ and end with ].",
          },
          {
            role: "user",
            content: context,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false,
      };

      console.log("Making request to:", this.apiUrl);
      console.log("Request body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: { message: await response.text() } };
        }

        console.error("Error response:", errorData);
        throw new Error(
          `OpenWebUI API error: ${response.status} - ${
            errorData.error?.message || errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Handle different response formats from OpenWebUI
      let content;
      if (data.choices && data.choices[0] && data.choices[0].message) {
        content = data.choices[0].message.content;
      } else if (data.response) {
        content = data.response;
      } else if (data.content) {
        content = data.content;
      } else {
        throw new Error("Invalid response format from OpenWebUI API");
      }

      console.log("Raw content:", content);

      // Enhanced JSON parsing with multiple fallback strategies
      let exercises;
      try {
        exercises = this.parseExercisesFromContent(content);
      } catch (parseError) {
        console.error("Failed to parse exercises:", parseError);
        throw new Error("Failed to parse exercises from AI response");
      }

      // Validate exercises structure
      if (!Array.isArray(exercises)) {
        throw new Error("AI response is not a valid array of exercises");
      }

      // Ensure each exercise has required fields
      const validatedExercises = exercises.map((exercise, index) => {
        return this.validateExercise(exercise, index);
      });

      return {
        content: JSON.stringify(validatedExercises),
        usage: data.usage || null,
      };
    } catch (error) {
      console.error("Error generating exercises:", error);
      throw error;
    }
  }

  parseExercisesFromContent(content) {
    // Strategy 1: Try direct JSON parsing
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.log("Direct JSON parsing failed, trying alternative methods");
    }

    // Strategy 2: Clean and try again
    try {
      const cleaned = this.cleanContent(content);
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.log("Cleaned JSON parsing failed, trying extraction methods");
    }

    // Strategy 3: Extract JSON array from text
    try {
      const extracted = this.extractJsonArray(content);
      if (extracted) {
        return extracted;
      }
    } catch (e) {
      console.log("JSON array extraction failed, trying object extraction");
    }

    // Strategy 4: Extract individual JSON objects
    try {
      const objects = this.extractJsonObjects(content);
      if (objects && objects.length > 0) {
        return objects;
      }
    } catch (e) {
      console.log("JSON object extraction failed");
    }

    // Strategy 5: Create fallback exercises
    console.log("All parsing strategies failed, creating fallback exercises");
    return this.createFallbackExercises();
  }

  cleanContent(content) {
    return content
      .replace(/```json\s*/g, "") // Remove markdown code blocks
      .replace(/```\s*/g, "")
      .replace(/\bNone\b/g, "null") // Python None to null
      .replace(/\bTrue\b/g, "true") // Python True to true
      .replace(/\bFalse\b/g, "false") // Python False to false
      .replace(/'/g, '"') // Single quotes to double quotes
      .replace(/,\s*}/g, "}") // Remove trailing commas in objects
      .replace(/,\s*]/g, "]") // Remove trailing commas in arrays
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  }

  extractJsonArray(content) {
    const cleaned = this.cleanContent(content);

    // Look for array patterns
    const arrayMatches = cleaned.match(/\[[\s\S]*?\]/g);
    if (arrayMatches) {
      for (const match of arrayMatches) {
        try {
          const parsed = JSON.parse(match);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          continue;
        }
      }
    }

    return null;
  }

  extractJsonObjects(content) {
    const cleaned = this.cleanContent(content);

    // Enhanced regex to match JSON objects
    const objectRegex = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
    const matches = cleaned.match(objectRegex);

    if (!matches) return null;

    const objects = [];
    for (const match of matches) {
      try {
        // Additional cleaning for each object
        const cleanedMatch = match
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]")
          .replace(/:\s*,/g, ": null,")
          .replace(/:\s*}/g, ": null}");

        const parsed = JSON.parse(cleanedMatch);

        // Validate that it looks like an exercise object
        if (parsed.type || parsed.problem || parsed.difficulty) {
          objects.push(parsed);
        }
      } catch (e) {
        console.log("Failed to parse object:", match, e);
        continue;
      }
    }

    return objects.length > 0 ? objects : null;
  }

  validateExercise(exercise, index) {
    const defaultExercise = {
      type: "Application",
      problem: "Problem not specified",
      difficulty: "Intermediate",
      skillTargeted: "General understanding",
      hint: null,
      solution: null,
    };

    if (!exercise || typeof exercise !== "object") {
      console.warn(`Exercise ${index} is invalid:`, exercise);
      return defaultExercise;
    }

    return {
      type: exercise.type || defaultExercise.type,
      problem: exercise.problem || defaultExercise.problem,
      difficulty: exercise.difficulty || defaultExercise.difficulty,
      skillTargeted: exercise.skillTargeted || defaultExercise.skillTargeted,
      hint:
        exercise.hint === null || exercise.hint === undefined
          ? null
          : String(exercise.hint),
      solution:
        exercise.solution === null || exercise.solution === undefined
          ? null
          : String(exercise.solution),
    };
  }

  createFallbackExercises() {
    return [
      {
        type: "Numerical",
        problem:
          "Solve the given problem using the concepts from this section.",
        difficulty: "Basic",
        skillTargeted: "Basic concept application",
        hint: "Review the key concepts and definitions from this section.",
        solution: "Apply the fundamental principles step by step.",
      },
      {
        type: "Application",
        problem:
          "Apply the concepts learned in this section to solve a real-world problem.",
        difficulty: "Intermediate",
        skillTargeted: "Concept application",
        hint: "Think about how the mathematical concepts relate to practical situations.",
        solution:
          "Break down the problem into smaller parts and apply the relevant formulas.",
      },
      {
        type: "Proof",
        problem:
          "Prove the relationships and properties discussed in this section.",
        difficulty: "Advanced",
        skillTargeted: "Logical reasoning and proof construction",
        hint: "Use the definitions and theorems from this section to build your proof.",
        solution:
          "Structure your proof with clear logical steps and justifications.",
      },
    ];
  }

  getSubjectType(subject) {
    const subjectLower = subject.toLowerCase();

    if (
      subjectLower.includes("math") ||
      subjectLower.includes("algebra") ||
      subjectLower.includes("geometry") ||
      subjectLower.includes("calculus")
    ) {
      return "mathematics";
    } else if (
      subjectLower.includes("science") ||
      subjectLower.includes("physics") ||
      subjectLower.includes("chemistry") ||
      subjectLower.includes("biology")
    ) {
      return "science";
    } else if (
      subjectLower.includes("social") ||
      subjectLower.includes("history") ||
      subjectLower.includes("geography") ||
      subjectLower.includes("civics")
    ) {
      return "socialScience";
    }

    // Default to mathematics if subject type cannot be determined
    return "mathematics";
  }

  // Enhanced test method with better error handling
  async testConnection() {
    try {
      console.log("Testing connection to:", this.apiUrl);
      console.log("Using model:", this.model);

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "user",
              content: "Hello, this is a test message.",
            },
          ],
          max_tokens: 50,
          stream: false,
        }),
      });

      console.log("Test response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Test connection failed:", errorText);
        return false;
      }

      const data = await response.json();
      console.log("Test response data:", data);
      return true;
    } catch (error) {
      console.error("API connection test failed:", error);
      return false;
    }
  }
}

export default AIService;
