<!-- src/components/AIExercises.vue -->
<template>
    <div class="ai-exercises">
        <div class="exercises-header">
            <h3>AI Generated Exercises</h3>
            <button @click="generateExercises" :disabled="isLoading" class="generate-btn">
                {{ isLoading ? 'Generating...' : 'Generate New Exercises' }}
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-exercises">
            <div class="spinner"></div>
            <p>AI is generating exercises for this section...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-exercises">
            <div class="error-icon">!</div>
            <p>{{ error }}</p>
            <button @click="generateExercises" class="retry-btn">Try Again</button>
        </div>

        <!-- Generated Exercises -->
        <div v-else-if="exercises.length > 0" class="exercises-list">
            <div v-for="(exercise, index) in exercises" :key="index" class="exercise-item">
                <div class="exercise-header">
                    <span class="exercise-type">{{ exercise.type }}</span>
                    <span class="exercise-difficulty" :class="'difficulty-' + exercise.difficulty.toLowerCase()">
                        {{ exercise.difficulty }}
                    </span>
                </div>

                <div class="exercise-problem">
                    <TypewriterText :text="exercise.problem"></TypewriterText>
                </div>

                <div v-if="exercise.skillTargeted" class="exercise-skill">
                    <strong>Skill Targeted:</strong> {{ exercise.skillTargeted }}
                </div>

                <div v-if="exercise.hint" class="exercise-hint">
                    <strong>Hint:</strong> {{ exercise.hint }}
                </div>
            </div>
        </div>

        <!-- No exercises generated yet -->
        <div v-else class="no-exercises">
            <p>Click "Generate New Exercises" to create AI-powered exercises for this section.</p>
        </div>
    </div>
</template>

<script>
import TypewriterText from './TypewriterText.vue'
import AIService from '../services/AIService.js'

export default {
    name: 'AIExercises',
    components: {
        TypewriterText
    },
    props: {
        sectionData: {
            type: Object,
            required: true
        },
        chapterMetadata: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            exercises: [],
            isLoading: false,
            error: null,
            aiService: new AIService()
        }
    },
    methods: {
        async generateExercises() {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await this.aiService.generateExercises(
                    this.sectionData,
                    this.chapterMetadata
                );

                if (response.content) {
                    const parsedExercises = JSON.parse(response.content);
                    this.exercises = parsedExercises;
                } else {
                    throw new Error('No exercises generated');
                }
            } catch (error) {
                console.error('Error generating exercises:', error);
                this.error = 'Failed to generate exercises. Please try again.';
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>