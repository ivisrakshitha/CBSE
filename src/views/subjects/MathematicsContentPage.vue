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
                <router-link :to="`/class/${classNum}/subject/mathematics`">Mathematics</router-link> /
                <span>{{ chapterTitle }}</span>
            </div>
        </nav>
        <!-- Chapter Header -->
        <header>
            <h1>{{ chapterTitle.toUpperCase() }}</h1>
            <div class="chapter-meta">
                <span class="subject-tag">Mathematics</span>
                <span class="grade-tag">Class {{ classNum }}</span>
                <span v-if="chapterData.chapterMetadata && chapterData.chapterMetadata.strand" class="strand-tag">
                    {{ chapterData.chapterMetadata.strand }}
                </span>
            </div>
        </header>
        <!-- Section Navigation Bar -->
        <nav class="section-nav">
            <div class="nav-items">
                <button @click="activeSection = 'overview'" :class="{ active: activeSection === 'overview' }"
                    class="nav-item">
                    Chapter Overview
                </button>
                <button @click="activeSection = 'resources'" :class="{ active: activeSection === 'resources' }"
                    class="nav-item">
                    Teaching Resources
                </button>
                <button @click="activeSection = 'applications'" :class="{ active: activeSection === 'applications' }"
                    class="nav-item">
                    Practical Applications
                </button>
                <button @click="activeSection = 'heritage'" :class="{ active: activeSection === 'heritage' }"
                    class="nav-item">
                    Mathematical Heritage
                </button>
                <button @click="activeSection = 'visual'" :class="{ active: activeSection === 'visual' }"
                    class="nav-item">
                    Visual Resources
                </button>
                <button @click="activeSection = 'exercises'" :class="{ active: activeSection === 'exercises' }"
                    class="nav-item">
                    Exercises
                </button>
                <button @click="activeSection = 'personalities'" :class="{ active: activeSection === 'personalities' }"
                    class="nav-item">
                    Talk to Person
                </button>
            </div>
        </nav>
        <!-- Loading State -->
        <div class="main-content" v-if="isLoading">
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Loading chapter content...</p>
            </div>
        </div>
        <!-- Error State -->
        <div class="main-content" v-else-if="error">
            <div class="error-message">
                <div class="error-icon">!</div>
                <h2>Failed to load chapter content</h2>
                <p>{{ error }}</p>
                <button @click="goBack" class="back-button">Go Back</button>
            </div>
        </div>
        <!-- Main Content with Sidebar -->
        <div class="main-content" v-else>
            <!-- Sidebar -->
            <aside class="sidebar">

                <!-- Main Topics Navigation (moved to top) -->
                <div class="sidebar-section">
                    <h4>Main Topics</h4>
                    <nav class="topics-nav">
                        <button v-for="(section, index) in chapterData.sections" :key="'topic-' + index"
                            @click="scrollToSection(index)" :class="{ active: activeTopicIndex === index }"
                            class="topic-item">
                            {{ section.title }}
                        </button>
                    </nav>
                </div>

                <!-- Chapter Contents -->
                <div class="sidebar-header">
                    <h3>Chapter Contents</h3>
                </div>

                <!-- Chapter Overview in Sidebar -->
                <div class="sidebar-section" v-if="chapterData.chapterMetadata">
                    <h4>Introduction</h4>
                    <div class="intro-content">
                        <TypewriterText
                            :text="'This chapter covers ' + chapterData.chapterMetadata.title + ' in Mathematics for Class ' + chapterData.chapterMetadata.grade + '.'">
                        </TypewriterText>
                    </div>
                    <div v-if="chapterData.chapterMetadata.learningObjectives && chapterData.chapterMetadata.learningObjectives.length > 0"
                        class="learning-objectives">
                        <h5>Learning Objectives</h5>
                        <ul>
                            <li v-for="(objective, index) in chapterData.chapterMetadata.learningObjectives"
                                :key="index">
                                {{ objective }}
                            </li>
                        </ul>
                    </div>
                </div>

            </aside>

            <!-- Content Area -->
            <main class="content-area">
                <!-- Chapter Overview Section -->
                <div v-show="activeSection === 'overview'" class="content-section">
                    <h2>Chapter Overview</h2>
                    <div v-if="chapterData.chapterMetadata && chapterData.chapterMetadata.prerequisites && chapterData.chapterMetadata.prerequisites.length > 0"
                        class="content-block prerequisites">
                        <h3>Prerequisites</h3>
                        <div class="prerequisites-list">
                            <div v-for="(prerequisite, index) in chapterData.chapterMetadata.prerequisites" :key="index"
                                class="prerequisite-item">
                                <TypewriterText :text="prerequisite"></TypewriterText>
                            </div>
                        </div>
                    </div>
                    <!-- Section Content -->
                    <div v-for="(section, index) in chapterData.sections" :key="'section-' + index"
                        :ref="'section-' + index" class="section-content">
                        <h2>{{ section.title }}</h2>
                        <div class="content-block section-summary">
                            <TypewriterText :text="section.summary"></TypewriterText>
                        </div>
                        <!-- Key Concepts -->
                        <div v-if="section.keyConcepts && section.keyConcepts.length > 0"
                            class="content-block key-concepts">
                            <h3>Key Concepts</h3>
                            <div class="concepts-container">
                                <div v-for="(concept, cIndex) in section.keyConcepts" :key="cIndex"
                                    class="concept-item">
                                    <h4>{{ concept.name }}</h4>
                                    <div class="concept-description">
                                        <TypewriterText :text="concept.description"></TypewriterText>
                                    </div>
                                    <div v-if="concept.properties && concept.properties.length > 0"
                                        class="concept-properties">
                                        <h5>Properties:</h5>
                                        <div class="properties-list">
                                            <div v-for="(property, pIndex) in concept.properties" :key="pIndex"
                                                class="property-item">
                                                <TypewriterText :text="property"></TypewriterText>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="concept.examples && concept.examples.length > 0"
                                        class="concept-examples">
                                        <h5>Examples:</h5>
                                        <div class="examples-list">
                                            <div v-for="(example, eIndex) in concept.examples" :key="eIndex"
                                                class="example-item">
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
                    </div>
                </div>
                <!-- Teaching Resources Section -->
                <div v-show="activeSection === 'resources'" class="content-section">
                    <h2>Teaching Resources</h2>
                    <div v-if="chapterData.teachingResources">
                        <!-- Key Vocabulary -->
                        <div v-if="chapterData.teachingResources.keyVocabulary && chapterData.teachingResources.keyVocabulary.length > 0"
                            class="content-block key-vocabulary">
                            <h3>Key Vocabulary</h3>
                            <div class="vocabulary-container">
                                <div v-for="(term, vIndex) in chapterData.teachingResources.keyVocabulary" :key="vIndex"
                                    class="vocabulary-item">
                                    <h4>{{ term.term }} <span v-if="term.symbol" class="term-symbol">{{ term.symbol
                                    }}</span></h4>
                                    <div class="vocabulary-definition">
                                        <TypewriterText :text="term.definition"></TypewriterText>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Common Misconceptions -->
                        <div v-if="chapterData.teachingResources.commonMisconceptions && chapterData.teachingResources.commonMisconceptions.length > 0"
                            class="content-block misconceptions">
                            <h3>Common Misconceptions</h3>
                            <div class="misconceptions-container">
                                <div v-for="(misconception, mIndex) in chapterData.teachingResources.commonMisconceptions"
                                    :key="mIndex" class="misconception-item">
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
                    </div>
                </div>
                <!-- Practical Applications Section -->
                <div v-show="activeSection === 'applications'" class="content-section">
                    <h2>Practical Applications</h2>
                    <div v-if="chapterData.practicalApplications && chapterData.practicalApplications.length > 0"
                        class="applications-container">
                        <div v-for="(application, aIndex) in chapterData.practicalApplications" :key="aIndex"
                            class="content-block application-item">
                            <h3>{{ application.context }}</h3>
                            <div class="application-description">
                                <TypewriterText :text="application.description"></TypewriterText>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Mathematical Heritage Section -->
                <div v-show="activeSection === 'heritage'" class="content-section">
                    <h2>Mathematical Heritage</h2>
                    <div v-if="chapterData.mathematicalHeritage">
                        <div v-if="chapterData.mathematicalHeritage.historicalContext"
                            class="content-block historical-context">
                            <h3>Historical Context</h3>
                            <TypewriterText :text="chapterData.mathematicalHeritage.historicalContext"></TypewriterText>
                        </div>
                        <div v-if="chapterData.mathematicalHeritage.indianContributions && chapterData.mathematicalHeritage.indianContributions.length > 0"
                            class="content-block indian-contributions">
                            <h3>Indian Contributions</h3>
                            <div class="contributions-list">
                                <div v-for="(contribution, cIndex) in chapterData.mathematicalHeritage.indianContributions"
                                    :key="cIndex" class="contribution-item">
                                    <TypewriterText :text="contribution"></TypewriterText>
                                </div>
                            </div>
                        </div>
                        <div v-if="chapterData.mathematicalHeritage.culturalSignificance"
                            class="content-block cultural-significance">
                            <h3>Cultural Significance</h3>
                            <TypewriterText :text="chapterData.mathematicalHeritage.culturalSignificance">
                            </TypewriterText>
                        </div>
                    </div>
                </div>
                <!-- Visual Learning Resources Section -->
                <div v-show="activeSection === 'visual'" class="content-section">
                    <h2>Visual Learning Resources</h2>
                    <div class="content-block">
                        <GoogleSearchResults :initialQuery="chapterTitle + ' Mathematics'"
                            :searchContext="'Mathematics'" :apiKey="googleApiKey"
                            :searchEngineId="googleSearchEngineId" />
                    </div>
                </div>
                <!-- Exercises Section -->
                <div v-show="activeSection === 'exercises'" class="content-section">
                    <h2>Exercises</h2>
                    <div v-for="(section, index) in chapterData.sections" :key="'exercise-' + index"
                        class="content-block">
                        <h3>{{ section.title }} - Exercises</h3>
                        <AIExercises :sectionData="section" :chapterMetadata="chapterData.chapterMetadata" />
                    </div>
                </div>

                <!-- Talk to Person Section -->
                <div v-show="activeSection === 'personalities'" class="content-section">
                    <div class="section-header-with-button">
                        <h2>Talk to Person</h2>
                        <button @click="openPersonalityPopup" class="enlarge-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3">
                                </path>
                            </svg>
                            Open Fullscreen
                        </button>
                    </div>

                    <!-- Regular inline view -->
                    <div class="personalities-inline-view">
                        <!-- Personality list (names only) -->
                        <div v-if="!selectedPersonality">
                            <ul>
                                <li v-for="personality in chapterData.personalities" :key="personality.id"
                                    @click="selectPersonality(personality)" class="personality-name">
                                    {{ personality.name }}
                                </li>
                            </ul>
                        </div>

                        <!-- Chat view -->
                        <div v-else>
                            <PersonalityChat :personality="selectedPersonality"
                                @back-to-list="selectedPersonality = null" />
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Fullscreen Personality Popup -->
        <div v-if="isPersonalityPopupOpen" class="personality-popup-overlay" @click.self="closePersonalityPopup">
            <div class="personality-popup-container">
                <!-- Popup Header -->
                <div class="personality-popup-header">
                    <h1>Talk to Person - Interactive Learning</h1>
                    <div class="popup-controls">
                        <button @click="closePersonalityPopup" class="close-popup-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Popup Content -->
                <div class="personality-popup-content">
                    <!-- Personality list in popup -->
                    <div v-if="!selectedPersonalityPopup" class="personalities-grid">
                        <h3>Choose a Historical Figure to Learn From</h3>
                        <div class="personality-cards-grid">
                            <div v-for="personality in chapterData.personalities" :key="personality.id"
                                @click="selectPersonalityPopup(personality)" class="personality-card">
                                <div class="personality-avatar">
                                    {{ personality.name.charAt(0) }}
                                </div>
                                <h4>{{ personality.name }}</h4>
                                <p class="personality-brief">
                                    {{ personality.description || 'Learn from this mathematical genius' }}
                                </p>

                            </div>
                        </div>
                    </div>

                    <!-- Chat view in popup -->
                    <div v-else class="personality-chat-popup">
                        <PersonalityChat :personality="selectedPersonalityPopup"
                            @back-to-list="selectedPersonalityPopup = null" :isFullscreen="true" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IvisLabsLogo from '../../components/IvisLabsLogo.vue'
import TypewriterText from '../../components/TypewriterText.vue'
import GoogleSearchResults from '../../components/GoogleSearchResults.vue'
import AIExercises from '../../components/AIExercises.vue'
import PersonalityChat from '../../components/PersonalityChat.vue'

export default {
    name: 'ContentPage',
    components: {
        IvisLabsLogo,
        TypewriterText,
        GoogleSearchResults,
        AIExercises,
        PersonalityChat
    },
    data() {
        return {
            isLoading: true,
            chapterData: {},
            chapterTitle: '',
            error: null,
            selectedPersonality: null,
            selectedPersonalityPopup: null,
            userMessage: '',
            chatHistory: [],
            activeSection: 'overview',
            activeTopicIndex: 0,
            isPersonalityPopupOpen: false,
            googleApiKey: process.env.VUE_APP_GOOGLE_API_KEY || '',
            googleSearchEngineId: process.env.VUE_APP_GOOGLE_SEARCH_ENGINE_ID || ''
        }
    },
    computed: {
        classNum() {
            return parseInt(this.$route.params.classNum) || 10;
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
        // Load the chapter JSON from /public/data/classX/mathematics/chapterId.json
        async fetchChapterData() {
            this.isLoading = true;
            this.error = null;

            try {
                const chapterId = this.chapterId || 'chapter1';
                // Since 'mathematics' is static in route, hardcode
                const subjectFolder = 'mathematics';

                const filePath = `/data/class${this.classNum}/${subjectFolder}/${chapterId}.json`;
                console.log('Fetching chapter data from:', filePath);

                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parse and save data
                this.chapterData = await response.json();
                console.log('Loaded chapter data:', this.chapterData);

                // Set title
                this.chapterTitle = this.chapterData.chapterMetadata?.title || 'Chapter Content';
            } catch (error) {
                console.error('Error fetching chapter data:', error);
                const subjectFolder = 'mathematics';
                const chapterIdForError = this.chapterId || 'chapter1';
                const filePath = `/data/class${this.classNum}/${subjectFolder}/${chapterIdForError}.json`;
                this.error = `Unable to load the chapter content from "${filePath}". Please make sure the file exists in the public directory and try again. (${error.message})`;
            } finally {
                this.isLoading = false;
            }
        },

        // Scroll in Overview tab to a specific section
        scrollToSection(index) {
            this.activeTopicIndex = index;
            this.activeSection = 'overview';
            this.$nextTick(() => {
                const element = this.$refs[`section-${index}`];
                if (element && element[0]) {
                    element[0].scrollIntoView({ behavior: 'smooth' });
                }
            });
        },

        // Browser back
        goBack() {
            this.$router.go(-1);
        },

        // Select a personality from list (regular inline view)
        selectPersonality(personality) {
            if (!personality) return;
            this.selectedPersonality = personality;
            // Reset chat UI for new selection
            this.chatHistory = [];
            this.userMessage = '';
            console.log('Selected personality:', personality.name);
        },

        // Open the fullscreen popup
        openPersonalityPopup() {
            this.isPersonalityPopupOpen = true;
            this.selectedPersonalityPopup = null;
            // Prevent body scroll when popup is open
            document.body.style.overflow = 'hidden';
        },

        // Close the fullscreen popup
        closePersonalityPopup() {
            this.isPersonalityPopupOpen = false;
            this.selectedPersonalityPopup = null;
            // Restore body scroll
            document.body.style.overflow = 'auto';
        },

        // Select a personality from list (popup view)
        selectPersonalityPopup(personality) {
            if (!personality) return;
            this.selectedPersonalityPopup = personality;
            console.log('Selected personality in popup:', personality.name);
        },

        // Send a message in chatbot mode
        sendMessage() {
            if (!this.userMessage.trim() || !this.selectedPersonality) return;

            const question = this.userMessage.trim();
            // Add user message
            this.chatHistory.push({ sender: 'user', text: question });

            // Find exact match (case-insensitive) in selected person's chat Q&A
            let foundQA = null;
            if (Array.isArray(this.selectedPersonality.chat)) {
                foundQA = this.selectedPersonality.chat.find(
                    qa => qa.question.toLowerCase() === question.toLowerCase()
                );
            }

            // Add bot response
            if (foundQA) {
                this.chatHistory.push({ sender: 'bot', text: foundQA.answer });
            } else {
                this.chatHistory.push({ sender: 'bot', text: 'This is not related to the context' });
            }

            // Clear user input
            this.userMessage = '';
        }
    },

    // Clean up when component is destroyed
    beforeUnmount() {
        // Restore body scroll if component is destroyed while popup is open
        document.body.style.overflow = 'auto';
    }
}
</script>

<style scoped>
/* Dark Theme for Content Page */
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

/* Section Navigation */
.section-nav {
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #2c2c2c;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-items {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.nav-item {
    background: transparent;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    color: #b0b0b0;
    white-space: nowrap;
}

.nav-item:hover {
    background: rgba(23, 181, 181, 0.1);
    color: #17b5b5;
}

.nav-item.active {
    background: #17b5b5;
    color: #121212;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(23, 181, 181, 0.3);
}

/* Main Content Layout */
.main-content {
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    gap: 2rem;
    min-height: calc(100vh - 200px);
}

/* Sidebar */
.sidebar {
    width: 300px;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 1.5rem;
    height: fit-content;
    position: sticky;
    top: 120px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid #2c2c2c;
}

.sidebar-header h3 {
    margin: 0 0 1rem 0;
    color: #ffffff;
    font-size: 1.2rem;
}

.sidebar-section {
    margin-bottom: 2rem;
}

.sidebar-section h4 {
    color: #17b5b5;
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
}

.sidebar-section h5 {
    color: #b0b0b0;
    margin: 1rem 0 0.5rem 0;
    font-size: 0.9rem;
}

.intro-content {
    font-size: 0.9rem;
    color: #b0b0b0;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.learning-objectives ul {
    list-style: none;
    padding: 0;
}

.learning-objectives li {
    padding: 0.25rem 0;
    font-size: 0.85rem;
    color: #b0b0b0;
    border-left: 3px solid #17b5b5;
    padding-left: 0.5rem;
    margin-bottom: 0.5rem;
}

.topics-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.topic-item {
    background: transparent;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    font-size: 0.9rem;
    color: #b0b0b0;
    border-left: 3px solid transparent;
}

.topic-item:hover {
    background: rgba(23, 181, 181, 0.1);
    color: #17b5b5;
    border-left-color: #17b5b5;
}

.topic-item.active {
    background: rgba(23, 181, 181, 0.15);
    color: #17b5b5;
    border-left-color: #17b5b5;
    font-weight: 600;
}

/* Content Area */
.content-area {
    flex: 1;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    min-height: 600px;
    border: 1px solid #2c2c2c;
}

.content-section {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.content-section h2 {
    color: #ffffff;
    margin-bottom: 1.5rem;
    font-size: 2rem;
    border-bottom: 3px solid #17b5b5;
    padding-bottom: 0.5rem;
}

.section-content {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-content:last-child {
    border-bottom: none;
}

/* Section Header with Button */
.section-header-with-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.enlarge-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #17b5b5, #1ec7c7);
    color: #121212;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(23, 181, 181, 0.2);
}

.enlarge-button:hover {
    background: linear-gradient(135deg, #1ec7c7, #23d5d5);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(23, 181, 181, 0.3);
}

.enlarge-button svg {
    transition: transform 0.3s ease;
}

.enlarge-button:hover svg {
    transform: scale(1.1);
}

/* Personality Names List */
.personality-name {
    list-style: none;
    padding: 15px 20px;
    margin: 10px 0;
    background: rgba(23, 181, 181, 0.1);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-left: 4px solid #17b5b5;
    color: #ffffff;
    font-weight: 500;
}

.personality-name:hover {
    background: rgba(23, 181, 181, 0.2);
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(23, 181, 181, 0.2);
}

/* Fullscreen Personality Popup */
.personality-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeInOverlay 0.3s ease-out;
}

@keyframes fadeInOverlay {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.personality-popup-container {
    width: 100%;
    max-width: 1400px;
    height: 90vh;
    background: #121212;
    border-radius: 20px;
    border: 2px solid #17b5b5;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideInPopup 0.4s ease-out;
}

@keyframes slideInPopup {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.personality-popup-header {
    background: linear-gradient(135deg, #1e1e1e, #2c2c2c);
    padding: 25px 30px;
    border-bottom: 2px solid #17b5b5;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.personality-popup-header h1 {
    color: #17b5b5;
    font-size: 1.8rem;
    margin: 0;
    font-weight: 700;
}

.popup-controls {
    display: flex;
    gap: 15px;
}

.close-popup-button {
    background: rgba(244, 67, 54, 0.1);
    border: 2px solid #f44336;
    color: #f44336;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.close-popup-button:hover {
    background: #f44336;
    color: #ffffff;
    transform: scale(1.1);
}

.personality-popup-content {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
    background: #121212;
}

/* Personalities Grid in Popup */
.personalities-grid h3 {
    color: #ffffff;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.5rem;
}

.personality-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
    max-width: 1000px;
    margin: 0 auto;
}

.personality-card {
    background: linear-gradient(135deg, #1e1e1e, #2c2c2c);
    border: 2px solid rgba(23, 181, 181, 0.3);
    border-radius: 15px;
    padding: 25px;
    cursor: pointer;
    transition: all 0.4s ease;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.personality-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(23, 181, 181, 0.1), transparent);
    transition: left 0.6s ease;
}

.personality-card:hover::before {
    left: 100%;
}

.personality-card:hover {
    border-color: #17b5b5;
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(23, 181, 181, 0.2);
}

.personality-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #17b5b5, #1ec7c7);
    color: #121212;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    margin: 0 auto 20px;
    transition: all 0.3s ease;
}

.personality-card:hover .personality-avatar {
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(23, 181, 181, 0.4);
}

.personality-card h4 {
    color: #ffffff;
    margin: 0 0 10px;
    font-size: 1.2rem;
    font-weight: 600;
}

.personality-brief {
    color: #b0b0b0;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
}

/* Chat Popup */
.personality-chat-popup {
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* Content Blocks */
.content-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

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

/* Text content styling */
.concept-description,
.vocabulary-definition,
.application-description,
.example-content,
.example-context,
.misconception-content,
.correction-content,
.section-summary {
    display: block;
    width: 100%;
    line-height: 1.6;
    margin-bottom: 10px;
    color: #e0e0e0;
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

/* Typography */
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

/* Content block specific styles */
.content-block h3 {
    color: #17b5b5;
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

.content-block h4 {
    color: #ffffff;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
}

.content-block h5 {
    color: #b0b0b0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
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

.prerequisites {
    margin-bottom: 25px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.term-symbol {
    color: #17b5b5;
    font-weight: 600;
    margin-left: 10px;
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

/* Loading and Error States */
.loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #2c2c2c;
    border-top: 3px solid #17b5b5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
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
    transform: translateY(-2px);
}

/* Text wrapping and display */
* {
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.content-block .typewriter-text {
    display: block;
    width: 100%;
    white-space: pre-wrap;
    line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
    .main-content {
        flex-direction: column;
        padding: 1rem;
    }

    .sidebar {
        width: 100%;
        position: static;
        margin-bottom: 1rem;
    }

    .nav-items {
        gap: 1rem;
    }

    .nav-item {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }

    .content-section h2 {
        font-size: 1.5rem;
    }

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

    .content-page {
        padding: 20px 10px;
    }

    .section-header-with-button {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .personality-popup-container {
        height: 95vh;
        margin: 10px;
        border-radius: 15px;
    }

    .personality-popup-header {
        padding: 20px;
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .personality-popup-header h1 {
        font-size: 1.4rem;
    }

    .personality-cards-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .personality-popup-content {
        padding: 20px;
    }
}

/* Additional Responsive for very small screens */
@media (max-width: 480px) {
    .personality-popup-overlay {
        padding: 10px;
    }

    .personality-popup-container {
        height: 100vh;
        max-height: none;
        border-radius: 0;
        margin: 0;
    }

    .enlarge-button {
        font-size: 0.9rem;
        padding: 10px 16px;
    }
}
</style>