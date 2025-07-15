<!-- src/views/ContentPage.vue -->
<template>
  <div class="content-page">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <router-link to="/" class="nav-logo">
        <IvisLabsLogo />
      </router-link>
      <div class="nav-pulse">PULSE</div>
      <div class="breadcrumbs">
        <router-link to="/cbse">CBSE</router-link> /
        <router-link :to="`/class/${classNum}/subjects`">Class {{ classNum }}</router-link> /
        <router-link :to="`/class/${classNum}/subject/${subjectParam}`">{{ subject }}</router-link> /
        <span>{{ chapterTitle }}</span>
      </div>
    </nav>

    <!-- Chapter Header -->
    <header>
      <h1>{{ chapterTitle.toUpperCase() }}</h1>
      <div class="chapter-meta">
        <span class="subject-tag">{{ subject }}</span>
        <span class="grade-tag">Class {{ classNum }}</span>
        <span v-if="chapterData.chapterMetadata && chapterData.chapterMetadata.strand" class="strand-tag">{{
          chapterData.chapterMetadata.strand }}</span>
      </div>
    </header>

    <!-- Loading State -->
    <div class="content-container" v-if="isLoading">
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Loading chapter content...</p>
      </div>
    </div>

    <!-- Error State -->
    <div class="content-container" v-else-if="error">
      <div class="error-message">
        <div class="error-icon">!</div>
        <h2>Failed to load chapter content</h2>
        <p>{{ error }}</p>
        <button @click="goBack" class="back-button">Go Back</button>
      </div>
    </div>

    <!-- Chapter Content -->
    <div class="content-container" v-else>
      <!-- Chapter Overview Card -->
      <CollapsibleCard v-if="chapterData.chapterMetadata" title="Chapter Overview" :initiallyExpanded="false">
        <template #preview>
          <div class="card-preview">
            <div class="preview-item"
              v-if="chapterData.chapterMetadata.learningObjectives && chapterData.chapterMetadata.learningObjectives.length">
              <span class="preview-label">Learning Objectives</span>
              <span class="preview-count">{{ chapterData.chapterMetadata.learningObjectives.length }}</span>
            </div>
            <div class="preview-item"
              v-if="chapterData.chapterMetadata.prerequisites && chapterData.chapterMetadata.prerequisites.length">
              <span class="preview-label">Prerequisites</span>
              <span class="preview-count">{{ chapterData.chapterMetadata.prerequisites.length }}</span>
            </div>
          </div>
        </template>

        <div class="content-block">
          <TypewriterText
            :text="'This chapter covers ' + chapterData.chapterMetadata.title + ' for Class ' + chapterData.chapterMetadata.grade + '.'">
          </TypewriterText>
        </div>

        <div class="content-block"
          v-if="chapterData.chapterMetadata.learningObjectives && chapterData.chapterMetadata.learningObjectives.length > 0">
          <h3>Learning Objectives</h3>
          <div class="objectives-list">
            <div v-for="(objective, index) in chapterData.chapterMetadata.learningObjectives" :key="index"
              class="objective-item">
              <TypewriterText :text="objective"></TypewriterText>
            </div>
          </div>
        </div>

        <div class="content-block"
          v-if="chapterData.chapterMetadata.prerequisites && chapterData.chapterMetadata.prerequisites.length > 0">
          <h3>Prerequisites</h3>
          <div class="prerequisites-list">
            <div v-for="(prerequisite, index) in chapterData.chapterMetadata.prerequisites" :key="index"
              class="prerequisite-item">
              <TypewriterText :text="prerequisite"></TypewriterText>
            </div>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Section Cards -->
      <CollapsibleCard v-for="(section, index) in chapterData.sections" :key="'section-' + index" :title="section.title"
        :initiallyExpanded="false" class="section-card">
        <template #preview>
          <div class="card-preview">
            <div class="preview-item" v-if="section.keyConcepts && section.keyConcepts.length">
              <span class="preview-label">Key Concepts</span>
              <span class="preview-count">{{ section.keyConcepts.length }}</span>
            </div>
            <div class="preview-item" v-if="section.theorems && section.theorems.length">
              <span class="preview-label">Theorems</span>
              <span class="preview-count">{{ section.theorems.length }}</span>
            </div>
            <div class="preview-item" v-if="section.examples && section.examples.length">
              <span class="preview-label">Examples</span>
              <span class="preview-count">{{ section.examples.length }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">AI Exercises</span>
              <span class="preview-icon">🤖</span>
            </div>
          </div>
        </template>

        <div class="content-block section-summary">
          <TypewriterText :text="section.summary"></TypewriterText>
        </div>

        <!-- Key Concepts -->
        <div v-if="section.keyConcepts && section.keyConcepts.length > 0" class="content-block key-concepts">
          <h3>Key Concepts</h3>
          <div class="concepts-container">
            <div v-for="(concept, cIndex) in section.keyConcepts" :key="cIndex" class="concept-item">
              <h4>{{ concept.name }}</h4>
              <div class="concept-description">
                <TypewriterText :text="concept.description"></TypewriterText>
              </div>

              <div v-if="concept.properties && concept.properties.length > 0" class="concept-properties">
                <h5>Properties:</h5>
                <div class="properties-list">
                  <div v-for="(property, pIndex) in concept.properties" :key="pIndex" class="property-item">
                    <TypewriterText :text="property"></TypewriterText>
                  </div>
                </div>
              </div>

              <div v-if="concept.examples && concept.examples.length > 0" class="concept-examples">
                <h5>Examples:</h5>
                <div class="examples-list">
                  <div v-for="(example, eIndex) in concept.examples" :key="eIndex" class="example-item">
                    <TypewriterText :text="example"></TypewriterText>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Theorems -->
        <div v-if="section.theorems && section.theorems.length > 0" class="content-block theorems">
          <h3>Theorems</h3>
          <div class="theorems-container">
            <div v-for="(theorem, tIndex) in section.theorems" :key="tIndex" class="theorem-item">
              <div class="theorem-statement">
                <TypewriterText :text="theorem.statement"></TypewriterText>
              </div>
              <div class="theorem-explanation" v-if="theorem.explanation">
                <h5>Explanation:</h5>
                <TypewriterText :text="theorem.explanation"></TypewriterText>
              </div>
              <div class="theorem-proof" v-if="theorem.proof">
                <h5>Proof:</h5>
                <TypewriterText :text="theorem.proof"></TypewriterText>
              </div>
            </div>
          </div>
        </div>

        <!-- Examples -->
        <div v-if="section.examples && section.examples.length > 0" class="content-block examples">
          <h3>Examples</h3>
          <div class="examples-container">
            <div v-for="(example, eIndex) in section.examples" :key="eIndex" class="example-item">
              <div class="example-content">
                <TypewriterText :text="example.content"></TypewriterText>
              </div>
              <div class="example-context" v-if="example.context">
                <TypewriterText :text="'Context: ' + example.context"></TypewriterText>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Generated Exercises (Replaces original exercises) -->
        <div class="content-block">
          <AIExercises :sectionData="section" :chapterMetadata="chapterData.chapterMetadata" />
        </div>
      </CollapsibleCard>

      <!-- Teaching Resources -->
      <CollapsibleCard v-if="chapterData.teachingResources" title="Teaching Resources" :initiallyExpanded="false"
        class="resources-card">
        <template #preview>
          <div class="card-preview">
            <div class="preview-item"
              v-if="chapterData.teachingResources.keyVocabulary && chapterData.teachingResources.keyVocabulary.length">
              <span class="preview-label">Key Vocabulary</span>
              <span class="preview-count">{{ chapterData.teachingResources.keyVocabulary.length }}</span>
            </div>
            <div class="preview-item"
              v-if="chapterData.teachingResources.commonMisconceptions && chapterData.teachingResources.commonMisconceptions.length">
              <span class="preview-label">Common Misconceptions</span>
              <span class="preview-count">{{ chapterData.teachingResources.commonMisconceptions.length }}</span>
            </div>
          </div>
        </template>

        <!-- Key Vocabulary -->
        <div
          v-if="chapterData.teachingResources.keyVocabulary && chapterData.teachingResources.keyVocabulary.length > 0"
          class="content-block key-vocabulary">
          <h3>Key Vocabulary</h3>
          <div class="vocabulary-container">
            <div v-for="(term, vIndex) in chapterData.teachingResources.keyVocabulary" :key="vIndex"
              class="vocabulary-item">
              <h4>{{ term.term }} <span v-if="term.symbol" class="term-symbol">{{ term.symbol }}</span></h4>
              <div class="vocabulary-definition">
                <TypewriterText :text="term.definition"></TypewriterText>
              </div>
            </div>
          </div>
        </div>

        <!-- Common Misconceptions -->
        <div
          v-if="chapterData.teachingResources.commonMisconceptions && chapterData.teachingResources.commonMisconceptions.length > 0"
          class="content-block misconceptions">
          <h3>Common Misconceptions</h3>
          <div class="misconceptions-container">
            <div v-for="(misconception, mIndex) in chapterData.teachingResources.commonMisconceptions" :key="mIndex"
              class="misconception-item">
              <div class="misconception-content">
                <h4 class="misconception-title">Misconception:</h4>
                <TypewriterText :text="misconception.misconception"></TypewriterText>
              </div>
              <div class="correction-content">
                <h4 class="correction-title">Correction:</h4>
                <TypewriterText :text="misconception.correction"></TypewriterText>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Practical Applications -->
      <CollapsibleCard v-if="chapterData.practicalApplications && chapterData.practicalApplications.length > 0"
        title="Practical Applications" :initiallyExpanded="false" class="applications-card">
        <template #preview>
          <div class="card-preview">
            <div class="preview-item"
              v-if="chapterData.practicalApplications && chapterData.practicalApplications.length">
              <span class="preview-label">Applications</span>
              <span class="preview-count">{{ chapterData.practicalApplications.length }}</span>
            </div>
          </div>
        </template>

        <div class="applications-container">
          <div v-for="(application, aIndex) in chapterData.practicalApplications" :key="aIndex"
            class="content-block application-item">
            <h3>{{ application.context }}</h3>
            <div class="application-description">
              <TypewriterText :text="application.description"></TypewriterText>
            </div>
          </div>
        </div>
      </CollapsibleCard>

      <!-- Mathematical Heritage -->
      <CollapsibleCard v-if="chapterData.mathematicalHeritage" title="Mathematical Heritage" :initiallyExpanded="false"
        class="heritage-card">
        <template #preview>
          <div class="card-preview">
            <div class="preview-item" v-if="chapterData.mathematicalHeritage.historicalContext">
              <span class="preview-label">Historical Context</span>
            </div>
            <div class="preview-item"
              v-if="chapterData.mathematicalHeritage.indianContributions && chapterData.mathematicalHeritage.indianContributions.length">
              <span class="preview-label">Indian Contributions</span>
              <span class="preview-count">{{ chapterData.mathematicalHeritage.indianContributions.length }}</span>
            </div>
          </div>
        </template>

        <div v-if="chapterData.mathematicalHeritage.historicalContext" class="content-block historical-context">
          <h3>Historical Context</h3>
          <TypewriterText :text="chapterData.mathematicalHeritage.historicalContext"></TypewriterText>
        </div>

        <div
          v-if="chapterData.mathematicalHeritage.indianContributions && chapterData.mathematicalHeritage.indianContributions.length > 0"
          class="content-block indian-contributions">
          <h3>Indian Contributions</h3>
          <div class="contributions-list">
            <div v-for="(contribution, cIndex) in chapterData.mathematicalHeritage.indianContributions" :key="cIndex"
              class="contribution-item">
              <TypewriterText :text="contribution"></TypewriterText>
            </div>
          </div>
        </div>

        <div v-if="chapterData.mathematicalHeritage.culturalSignificance" class="content-block cultural-significance">
          <h3>Cultural Significance</h3>
          <TypewriterText :text="chapterData.mathematicalHeritage.culturalSignificance"></TypewriterText>
        </div>
      </CollapsibleCard>

      <!-- Visual Learning Resources -->
      <CollapsibleCard title="Visual Learning Resources" :initiallyExpanded="false" class="visual-resources-card">
        <template #preview>
          <div class="card-preview">
            <div class="preview-item">
              <span class="preview-label">Images & Videos</span>
              <span class="preview-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                  <line x1="7" y1="2" x2="7" y2="22"></line>
                  <line x1="17" y1="2" x2="17" y2="22"></line>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <line x1="2" y1="7" x2="7" y2="7"></line>
                  <line x1="2" y1="17" x2="7" y2="17"></line>
                  <line x1="17" y1="17" x2="22" y2="17"></line>
                  <line x1="17" y1="7" x2="22" y2="7"></line>
                </svg>
              </span>
            </div>
          </div>
        </template>

        <div class="content-block">
          <GoogleSearchResults :initialQuery="chapterTitle" :searchContext="subject" :apiKey="googleApiKey"
            :searchEngineId="googleSearchEngineId" />
        </div>
      </CollapsibleCard>
    </div>
  </div>
</template>

<script>
import IvisLabsLogo from '../components/IvisLabsLogo.vue'
import TypewriterText from '../components/TypewriterText.vue'
import CollapsibleCard from '../components/CollapsibleCard.vue'
import GoogleSearchResults from '../components/GoogleSearchResults.vue'
import AIExercises from '../components/AIExercises.vue'

export default {
  name: 'ContentPage',
  components: {
    IvisLabsLogo,
    TypewriterText,
    CollapsibleCard,
    GoogleSearchResults,
    AIExercises
  },
  data() {
    return {
      isLoading: true,
      chapterData: {},
      chapterTitle: '',
      error: null,
      googleApiKey: process.env.VUE_APP_GOOGLE_API_KEY || '',
      googleSearchEngineId: process.env.VUE_APP_GOOGLE_SEARCH_ENGINE_ID || ''
    }
  },
  computed: {
    classNum() {
      return parseInt(this.$route.params.classNum) || 10;
    },
    subject() {
      // Format the subject name from route param
      const rawSubject = this.$route.params.subject || '';
      return rawSubject
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    subjectParam() {
      return this.$route.params.subject || '';
    },
    textbookId() {
      return this.$route.params.textbookId || '';
    },
    chapterId() {
      return this.$route.params.chapterId || '';
    }
  },
  mounted() {
    this.fetchChapterData();
  },
  methods: {
    async fetchChapterData() {
      this.isLoading = true;
      this.error = null;

      try {
        // Build the path to the JSON file
        const chapterId = this.chapterId || 'chapter1'; // Default to chapter1 if not specified

        // Use fetch to get the JSON file from the public directory
        const response = await fetch(`/data/class${this.classNum}/${this.subjectParam}/${chapterId}.json`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON data
        this.chapterData = await response.json();

        // Set chapter title from the metadata
        this.chapterTitle = this.chapterData.chapterMetadata?.title || 'Chapter Content';
      } catch (error) {
        console.error('Error fetching chapter data:', error);
        const chapterIdForError = this.chapterId || 'chapter1';
        const filePath = `/data/class${this.classNum}/${this.subjectParam}/${chapterIdForError}.json`;
        this.error = `Unable to load the chapter content from "${filePath}". Please make sure the file exists in the public directory and try again. (${error.message})`;
      } finally {
        this.isLoading = false;
      }
    },

    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.content-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #121212;
  min-height: 100vh;
  color: #e0e0e0;
}

.navbar {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #2c2c2c;
}

.nav-logo {
  text-decoration: none;
}

.nav-pulse {
  margin-left: 15px;
  font-size: 1.8rem;
  font-weight: 600;
  color: #ffffff;
}

.breadcrumbs {
  margin-left: auto;
  font-size: 0.9rem;
  color: #b0b0b0;
}

.breadcrumbs a {
  color: #17b5b5;
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

header {
  text-align: center;
  margin-bottom: 50px;
}

header h1 {
  font-size: 2.5rem;
  color: #17b5b5;
  margin-bottom: 15px;
}

.chapter-meta {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.chapter-meta span {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.subject-tag {
  background-color: rgba(23, 181, 181, 0.2);
  color: #17b5b5;
}

.grade-tag {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.strand-tag {
  background-color: rgba(255, 255, 255, 0.05);
  color: #b0b0b0;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Ensure all content blocks stack vertically */
.content-block {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
}

/* Container classes for vertical stacking */
.concepts-container,
.theorems-container,
.examples-container,
.vocabulary-container,
.misconceptions-container,
.applications-container,
.contributions-list,
.objectives-list,
.prerequisites-list,
.properties-list,
.examples-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Individual item classes */
.concept-item,
.theorem-item,
.example-item,
.vocabulary-item,
.misconception-item,
.application-item,
.contribution-item,
.objective-item,
.prerequisite-item,
.property-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  line-height: 1.6;
}

.concept-item:last-child,
.theorem-item:last-child,
.example-item:last-child,
.vocabulary-item:last-child,
.misconception-item:last-child,
.application-item:last-child,
.contribution-item:last-child,
.objective-item:last-child,
.prerequisite-item:last-child,
.property-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

/* Ensure text content displays line by line */
.concept-description,
.vocabulary-definition,
.application-description,
.example-content,
.example-context,
.misconception-content,
.correction-content {
  display: block;
  width: 100%;
  line-height: 1.6;
  margin-bottom: 10px;
}

.concept-properties,
.concept-examples,
.theorem-explanation,
.theorem-proof {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
}

/* Card preview styles */
.card-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.preview-label {
  color: #b0b0b0;
}

.preview-count {
  background-color: rgba(23, 181, 181, 0.2);
  color: #17b5b5;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 0.75rem;
  padding: 0 6px;
}

.preview-icon {
  color: #17b5b5;
  display: flex;
  align-items: center;
}

h3 {
  color: #ffffff;
  margin: 25px 0 15px;
  font-size: 1.4rem;
}

h4 {
  color: #17b5b5;
  margin: 15px 0 10px;
  font-size: 1.2rem;
}

h5 {
  color: #b0b0b0;
  margin: 10px 0 5px;
  font-size: 1.1rem;
  font-weight: 500;
}

.section-summary {
  margin-bottom: 25px;
  line-height: 1.6;
  color: #e0e0e0;
}

.key-concepts,
.theorems,
.examples,
.exercises,
.key-vocabulary,
.misconceptions {
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.theorem-statement {
  padding: 15px;
  background-color: rgba(23, 181, 181, 0.08);
  border-radius: 8px;
  margin-bottom: 15px;
  display: block;
  width: 100%;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(23, 181, 181, 0.1);
  border-left-color: #17b5b5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  padding: 50px 20px;
  background-color: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid #2c2c2c;
}

.error-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background-color: rgba(244, 67, 54, 0.1);
  color: #F44336;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.error-message h2 {
  color: #F44336;
  margin-bottom: 15px;
}

.error-message p {
  color: #b0b0b0;
  margin-bottom: 25px;
}

.back-button {
  background-color: #17b5b5;
  color: #121212;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #1ec7c7;
}

.misconception-title {
  color: #f44336;
}

.correction-title {
  color: #4CAF50;
}

.historical-context,
.indian-contributions,
.cultural-significance {
  margin-bottom: 30px;
}

.visual-resources-card {
  margin-bottom: 60px;
}

/* Force text to wrap and display line by line */
* {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Ensure TypewriterText components display block */
.content-block>>>.typewriter-text {
  display: block;
  width: 100%;
  white-space: pre-wrap;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .breadcrumbs {
    display: none;
  }

  header h1 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.3rem;
  }

  h4 {
    font-size: 1.1rem;
  }

  .card-preview {
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
  }

}
</style>