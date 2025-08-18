<template>
    <div class="content-page">
        <!-- Header Navigation -->
        <header class="page-header">
            <div class="header-content">
                <div class="nav-section">
                    <router-link to="/" class="nav-logo">
                        <IvisLabsLogo />
                    </router-link>
                    <div class="nav-pulse">PULSE</div>
                </div>

                <div class="breadcrumbs">
                    <router-link to="/cbse">CBSE</router-link>
                    <span class="separator">›</span>
                    <router-link :to="`/class/${classNum}/subjects`">Class {{ classNum }}</router-link>
                    <span class="separator">›</span>
                    <router-link :to="`/class/${classNum}/subject/social-science`">Social Science</router-link>
                    <span class="separator">›</span>
                    <span class="current">{{ chapterTitle }}</span>
                </div>
            </div>
        </header>

        <!-- Compact Chapter Title Section -->
        <section class="chapter-hero">
            <div class="hero-content">
                <div class="chapter-info">
                    <h1 class="chapter-title"> {{ chapterTitle }}</h1>
                    <div class="chapter-meta">
                        <div class="chapter-badges">
                            <span class="badge subject-badge">
                                {{ chapterData.chapterMetadata?.subject || 'Social Science' }}
                            </span>

                            <span class="badge grade-badge">Class {{ classNum }}</span>
                            <span v-if="chapterData.chapterMetadata?.discipline" class="badge discipline-badge">
                                {{ chapterData.chapterMetadata.discipline }}
                            </span>
                        </div>
                        <div v-if="chapterData.chapterMetadata?.timePeriodsOrRegions" class="period-tag">
                            {{ chapterData.chapterMetadata.timePeriodsOrRegions[0] }}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading chapter content...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
            <div class="error-content">
                <div class="error-icon"></div>
                <h2>Content Not Available</h2>
                <p>{{ error }}</p>
                <button @click="goBack" class="retry-button">Go Back</button>
            </div>
        </div>

        <!-- Main Content -->
        <div v-else class="main-container">
            <!-- Navigation Tabs -->
            <nav class="content-nav">
                <button v-for="tab in navigationTabs" :key="tab.id" @click="activeSection = tab.id"
                    :class="{ active: activeSection === tab.id }" class="nav-tab">
                    <span class="tab-icon">{{ tab.icon }}</span>
                    <span class="tab-label">{{ tab.label }}</span>
                </button>
            </nav>

            <!-- Content Sections -->
            <main class="content-main">
                <!-- Overview Section -->
                <section v-show="activeSection === 'overview'" class="content-section">
                    <div class="section-header">
                        <h2>Chapter Overview</h2>
                        <p class="section-description">Explore the key concepts and themes of this chapter</p>
                    </div>

                    <!-- Learning Objectives -->
                    <div v-if="chapterData.chapterMetadata?.learningObjectives" class="content-card objectives-card">
                        <h3> Learning Objectives</h3>
                        <ul class="objectives-list">
                            <li v-for="(objective, index) in chapterData.chapterMetadata.learningObjectives"
                                :key="index">
                                <TypewriterText :text="objective" />
                            </li>
                        </ul>
                    </div>

                    <!-- Chapter Sections -->
                    <div v-for="(section, index) in chapterData.sections" :key="index"
                        class="content-card section-card">
                        <div class="section-title">
                            <h3>{{ section.title }}</h3>
                            <span class="section-number">{{ index + 1 }}</span>
                        </div>

                        <div class="section-summary">
                            <TypewriterText :text="section.summary" />
                        </div>

                        <!-- Key Concepts -->
                        <div v-if="section.keyConcepts?.length" class="concepts-grid">
                            <h4>Key Concepts</h4>
                            <div class="concepts-container">
                                <div v-for="(concept, cIndex) in section.keyConcepts" :key="cIndex"
                                    class="concept-card">
                                    <h5>{{ concept.name }}</h5>
                                    <TypewriterText :text="concept.description" />
                                </div>
                            </div>
                        </div>

                        <!-- Historical Examples -->
                        <div v-if="section.examples?.length" class="examples-section">
                            <h4>Historical Examples</h4>
                            <div class="examples-grid">
                                <div v-for="(example, eIndex) in section.examples" :key="eIndex" class="example-card">
                                    <TypewriterText :text="example.content" />
                                    <div v-if="example.context" class="example-context">
                                        <strong>Context:</strong> {{ example.context }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Primary Sources Section -->
                <section v-show="activeSection === 'sources'" class="content-section">
                    <div class="section-header">
                        <h2> Primary Sources</h2>
                        <p class="section-description">Examine original historical documents and texts</p>
                    </div>

                    <div v-for="(section, sIndex) in chapterData.sections" :key="sIndex">
                        <div v-if="section.primarySources?.length" class="sources-container">
                            <div v-for="(source, sourceIndex) in section.primarySources" :key="sourceIndex"
                                class="source-card">
                                <div class="source-header">
                                    <h3>{{ source.title }}</h3>
                                    <span class="source-type">Primary Source</span>
                                </div>

                                <div class="source-excerpt">
                                    <TypewriterText :text="source.excerpt" />
                                </div>

                                <div class="source-attribution">
                                    <strong>— {{ source.attribution }}</strong>
                                </div>

                                <div v-if="source.analysisPrompts?.length" class="analysis-section">
                                    <h4> Analysis Questions</h4>
                                    <div class="analysis-questions">
                                        <div v-for="(prompt, pIndex) in source.analysisPrompts" :key="pIndex"
                                            class="question-item">
                                            <TypewriterText :text="prompt" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Resources Section -->
                <section v-show="activeSection === 'resources'" class="content-section">
                    <div class="section-header">
                        <h2> Learning Resources</h2>
                        <p class="section-description">Essential vocabulary and teaching materials</p>
                    </div>

                    <div v-if="chapterData.teachingResources">
                        <!-- Key Vocabulary -->
                        <div v-if="chapterData.teachingResources.keyVocabulary?.length"
                            class="content-card vocabulary-card">
                            <h3> Key Vocabulary</h3>
                            <div class="vocabulary-grid">
                                <div v-for="(term, vIndex) in chapterData.teachingResources.keyVocabulary" :key="vIndex"
                                    class="vocab-item">
                                    <div class="vocab-term">{{ term.term }}</div>
                                    <div class="vocab-definition">
                                        <TypewriterText :text="term.definition" />
                                    </div>
                                    <div v-if="term.historicalContext" class="vocab-context">
                                        <strong>Historical Context:</strong>
                                        <TypewriterText :text="term.historicalContext" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Common Misconceptions -->
                        <div v-if="chapterData.teachingResources.commonMisconceptions?.length"
                            class="content-card misconceptions-card">
                            <h3>Common Misconceptions</h3>
                            <div class="misconceptions-list">
                                <div v-for="(misconception, mIndex) in chapterData.teachingResources.commonMisconceptions"
                                    :key="mIndex" class="misconception-item">
                                    <div class="misconception-wrong">
                                        <h4> Misconception</h4>
                                        <TypewriterText :text="misconception.misconception" />
                                    </div>
                                    <div class="misconception-correct">
                                        <h4>✅ Correction</h4>
                                        <TypewriterText :text="misconception.correction" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Cultural Perspectives Section -->
                <section v-show="activeSection === 'perspectives'" class="content-section">
                    <div class="section-header">
                        <h2>Cultural Perspectives</h2>
                        <p class="section-description">Explore diverse viewpoints and global contexts</p>
                    </div>

                    <div v-if="chapterData.culturalConsiderations">
                        <div v-if="chapterData.culturalConsiderations.diversePerspectives?.length"
                            class="content-card perspectives-card">
                            <h3>Diverse Perspectives</h3>
                            <div class="perspectives-grid">
                                <div v-for="(perspective, pIndex) in chapterData.culturalConsiderations.diversePerspectives"
                                    :key="pIndex" class="perspective-item">
                                    <h4>{{ perspective.group }}</h4>
                                    <TypewriterText :text="perspective.impact" />
                                </div>
                            </div>
                        </div>

                        <div v-if="chapterData.culturalConsiderations.globalContext" class="content-card global-card">
                            <h3>Global Context</h3>
                            <TypewriterText :text="chapterData.culturalConsiderations.globalContext" />
                        </div>
                    </div>
                </section>

                <!-- Visual Sources Section -->
                <section v-show="activeSection === 'visual'" class="content-section">
                    <div class="section-header">
                        <h2>Visual Sources</h2>
                        <p class="section-description">Explore historical images and visual materials</p>
                    </div>

                    <div class="content-card visual-card">
                        <GoogleSearchResults :initialQuery="chapterTitle + ' Social Science History'"
                            :searchContext="'Social Science History'" :apiKey="googleApiKey"
                            :searchEngineId="googleSearchEngineId" />
                    </div>
                </section>

                <!-- Assessment Section -->
                <section v-show="activeSection === 'assessment'" class="content-section">
                    <div class="section-header">
                        <h2>Assessment & Practice</h2>
                        <p class="section-description">Test your understanding and practice skills</p>
                    </div>

                    <div v-if="chapterData.teachingResources?.assessmentIdeas?.length"
                        class="content-card assessment-card">
                        <h3> Assessment Questions</h3>
                        <div class="assessment-list">
                            <div v-for="(assessment, aIndex) in chapterData.teachingResources.assessmentIdeas"
                                :key="aIndex" class="assessment-item">
                                <div class="question-type-badge">{{ assessment.questionType }}</div>
                                <div class="question-content">
                                    <TypewriterText :text="assessment.question" />
                                </div>
                                <div class="answer-guide">
                                    <h5> Answer Guide</h5>
                                    <TypewriterText :text="assessment.answer" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Talk to Person Section -->
                <section v-show="activeSection === 'personalities'" class="content-section">
                    <div class="section-header">
                        <div class="section-header-with-actions">
                            <div class="section-title-content">
                                <h2>Talk to Historical Personalities</h2>
                                <p class="section-description">Engage in conversations with historical figures from this chapter</p>
                            </div>
                            <button @click="openFullscreenModal" class="enlarge-button">
                                <span class="enlarge-icon">⛶</span>
                                <span class="enlarge-text">Open Fullscreen</span>
                            </button>
                        </div>
                    </div>

                    <!-- Personality list (names only) -->
                    <div v-if="!selectedPersonality" class="content-card personalities-card">
                        <h3>Available Historical Personalities</h3>
                        <div v-if="chapterData.personalities?.length" class="personalities-grid">
                            <div v-for="personality in chapterData.personalities" :key="personality.id"
                                @click="selectPersonality(personality)" class="personality-item">
                                <div class="personality-avatar">
                                    <span class="avatar-icon">👤</span>
                                </div>
                                <div class="personality-info">
                                    <h4 class="personality-name">{{ personality.name }}</h4>
                                    <p class="personality-title" v-if="personality.title">{{ personality.title }}</p>
                                    <p class="personality-period" v-if="personality.period">{{ personality.period }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="no-personalities">
                            <p>No historical personalities available for this chapter.</p>
                        </div>
                    </div>

                    <!-- Chat view - PersonalityChat handles its own fullscreen -->
                    <div v-else class="chat-container">
                        <PersonalityChat :personality="selectedPersonality"
                            @back-to-list="selectedPersonality = null" />
                    </div>
                </section>
            </main>
        </div>

        <!-- Fullscreen Modal -->
        <div v-if="showFullscreenModal" class="fullscreen-modal" @click="closeFullscreenModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2>Talk to Historical Personalities</h2>
                    <button @click="closeFullscreenModal" class="modal-close-button">×</button>
                </div>
                
                <div class="modal-body">
                    <!-- Personality list in modal -->
                    <div v-if="!modalSelectedPersonality" class="modal-personalities-section">
                        <h3>Available Historical Personalities</h3>
                        <div v-if="chapterData.personalities?.length" class="modal-personalities-grid">
                            <div v-for="personality in chapterData.personalities" :key="personality.id"
                                @click="selectModalPersonality(personality)" class="modal-personality-item">
                                <div class="personality-avatar">
                                    <span class="avatar-icon">👤</span>
                                </div>
                                <div class="personality-info">
                                    <h4 class="personality-name">{{ personality.name }}</h4>
                                    <p class="personality-title" v-if="personality.title">{{ personality.title }}</p>
                                    <p class="personality-period" v-if="personality.period">{{ personality.period }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="no-personalities">
                            <p>No historical personalities available for this chapter.</p>
                        </div>
                    </div>

                    <!-- Chat view in modal -->
                    <div v-else class="modal-chat-container">
                        <PersonalityChat :personality="modalSelectedPersonality"
                            @back-to-list="modalSelectedPersonality = null" />
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
import PersonalityChat from '../../components/PersonalityChat.vue'

export default {
    name: 'SocialScienceContentPage',
    components: {
        IvisLabsLogo,
        TypewriterText,
        GoogleSearchResults,
        PersonalityChat
    },
    data() {
        return {
            isLoading: true,
            chapterData: {},
            chapterTitle: '',
            error: null,
            activeSection: 'overview',
            selectedPersonality: null,
            modalSelectedPersonality: null,
            showFullscreenModal: false,
            userMessage: '',
            chatHistory: [],
            googleApiKey: process.env.VUE_APP_GOOGLE_API_KEY || '',
            googleSearchEngineId: process.env.VUE_APP_GOOGLE_SEARCH_ENGINE_ID || '',
            navigationTabs: [
                { id: 'overview', label: 'Overview', icon: '' },
                { id: 'sources', label: 'Primary Sources', icon: '' },
                { id: 'resources', label: 'Resources', icon: '' },
                { id: 'perspectives', label: 'Perspectives', icon: '' },
                { id: 'visual', label: 'Visual Sources', icon: '' },
                { id: 'assessment', label: 'Assessment', icon: '' },
                { id: 'personalities', label: 'Talk to Person', icon: '' }
            ]
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
        async fetchChapterData() {
            this.isLoading = true;
            this.error = null;
            try {
                const chapterId = this.chapterId || 'chapter1';
                const response = await fetch(`/data/class${this.classNum}/social-science/${chapterId}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.chapterData = await response.json();
                this.chapterTitle = this.chapterData.chapterMetadata?.title || 'Chapter Content';
                console.log('Loaded chapter data:', this.chapterData);
            } catch (error) {
                console.error('Error fetching chapter data:', error);
                const chapterIdForError = this.chapterId || 'chapter1';
                const filePath = `/data/class${this.classNum}/social-science/${chapterIdForError}.json`;
                this.error = `Unable to load the chapter content from "${filePath}". Please make sure the file exists in the public directory and try again. (${error.message})`;
            } finally {
                this.isLoading = false;
            }
        },

        goBack() {
            this.$router.go(-1);
        },

        // Regular section personality selection
        selectPersonality(personality) {
            if (!personality) return;
            this.selectedPersonality = personality;
            this.chatHistory = [];
            this.userMessage = '';
            console.log('Selected personality:', personality.name);
        },

        // Modal functionality
        openFullscreenModal() {
            this.showFullscreenModal = true;
            this.modalSelectedPersonality = null;
            document.body.style.overflow = 'hidden';
        },

        closeFullscreenModal() {
            this.showFullscreenModal = false;
            this.modalSelectedPersonality = null;
            document.body.style.overflow = 'auto';
        },

        // Modal personality selection
        selectModalPersonality(personality) {
            if (!personality) return;
            this.modalSelectedPersonality = personality;
            console.log('Selected modal personality:', personality.name);
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
    }
}
</script>

<style scoped>
/* Global Styles */
.content-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    color: #e0e0e0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Header */
.page-header {
    background: rgba(20, 20, 20, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid #2a2a2a;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-section {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.nav-pulse {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.1em;
}

.breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #888;
}

.breadcrumbs a {
    color: #17b5b5;
    text-decoration: none;
    transition: color 0.2s;
}

.breadcrumbs a:hover {
    color: #20d4d4;
}

.separator {
    color: #555;
}

.current {
    color: #fff;
    font-weight: 500;
}

/* Chapter Hero */
.chapter-hero {
    max-width: 1400px;
    margin: 0 auto;
    padding: 3rem 2rem;
}

.hero-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
}

.chapter-info {
    flex: 1;
}

.chapter-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 1rem 0;
    line-height: 1.2;
}

.chapter-badges {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid transparent;
}

.subject-badge {
    background: linear-gradient(135deg, #17b5b5, #20d4d4);
    color: #000;
}

.grade-badge {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: #333;
}

.discipline-badge {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border-color: #ffc107;
}

.time-period-card {
    background: rgba(30, 30, 30, 0.8);
    padding: 1.5rem;
    border-radius: 15px;
    border: 1px solid #333;
    min-width: 250px;
}

.time-period-card h3 {
    color: #17b5b5;
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
}

.period-info {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 500;
}

/* Loading and Error States */
.loading-container,
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #333;
    border-top: 3px solid #17b5b5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-content {
    max-width: 500px;
    padding: 2rem;
    background: rgba(30, 30, 30, 0.8);
    border-radius: 15px;
    border: 1px solid #333;
}

.error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.retry-button {
    background: #17b5b5;
    color: #000;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.retry-button:hover {
    background: #20d4d4;
    transform: translateY(-2px);
}

/* Main Container */
.main-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem 2rem;
}

/* Navigation Tabs */
.content-nav {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(20, 20, 20, 0.8);
    border-radius: 15px;
    border: 1px solid #2a2a2a;
    overflow-x: auto;
}

.nav-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border: none;
    background: transparent;
    color: #888;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    font-size: 0.9rem;
}

.nav-tab:hover {
    background: rgba(23, 181, 181, 0.1);
    color: #17b5b5;
}

.nav-tab.active {
    background: #17b5b5;
    color: #000;
    font-weight: 500;
}

.tab-icon {
    font-size: 1.1rem;
}

/* Content Main */
.content-main {
    min-height: 600px;
}

.content-section {
    animation: fadeIn 0.3s ease-in-out;
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

.section-header {
    text-align: center;
    margin-bottom: 2rem;
}

.section-header-with-actions {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    text-align: left;
}

.section-title-content {
    flex: 1;
}

.section-header h2 {
    font-size: 2rem;
    color: #ffffff;
    margin: 0 0 0.5rem 0;
}

.section-description {
    color: #888;
    font-size: 1.1rem;
    margin: 0;
}

/* Enlarge Button */
.enlarge-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #17b5b5, #20d4d4);
    color: #000;
    border: none;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(23, 181, 181, 0.3);
    white-space: nowrap;
}

.enlarge-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(23, 181, 181, 0.4);
    background: linear-gradient(135deg, #20d4d4, #17b5b5);
}

.enlarge-icon {
    font-size: 1.2rem;
    font-weight: bold;
}

.enlarge-text {
    font-size: 0.9rem;
}

/* Fullscreen Modal */
.fullscreen-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.modal-content {
    width: 95vw;
    height: 95vh;
    max-width: 1200px;
    background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
    border-radius: 20px;
    border: 1px solid #333;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalSlideIn 0.3s ease-out;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

@keyframes modalSlideIn {
    from {
        transform: scale(0.9) translateY(20px);
        opacity: 0;
    }
    to {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #333;
    background: rgba(30, 30, 30, 0.8);
}

.modal-header h2 {
    color: #ffffff;
    margin: 0;
    font-size: 1.5rem;
}

.modal-close-button {
    background: none;
    border: none;
    color: #888;
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
}

.modal-close-button:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
}

.modal-body {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

.modal-personalities-section h3 {
    color: #17b5b5;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
}

.modal-personalities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.modal-personality-item {
    background: rgba(30, 30, 30, 0.8);
    border: 1px solid #333;
    border-radius: 15px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.modal-personality-item:hover {
    border-color: #17b5b5;
    background: rgba(23, 181, 181, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(23, 181, 181, 0.2);
}

.modal-chat-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* Content Cards */
.content-card {
    background: rgba(30, 30, 30, 0.8);
    border: 1px solid #333;
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 2rem;
    transition: all 0.2s;
}

.content-card:hover {
    border-color: #17b5b5;
    box-shadow: 0 5px 20px rgba(23, 181, 181, 0.1);
}

.content-card h3 {
    color: #17b5b5;
    margin: 0 0 1.5rem 0;
    font-size: 1.3rem;
}

.content-card h4 {
    color: #fff;
    margin: 1.5rem 0 1rem 0;
    font-size: 1.1rem;
}

.content-card h5 {
    color: #17b5b5;
    margin: 0.5rem 0;
    font-size: 1rem;
}

/* Section Cards */
.section-card {
    position: relative;
    overflow: hidden;
}

.section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.section-title h3 {
    margin: 0;
    color: #ffffff;
}

.section-number {
    background: #17b5b5;
    color: #000;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
}

.section-summary {
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    border-radius: 10px;
    border-left: 4px solid #17b5b5;
    margin-bottom: 1.5rem;
}

/* Concepts Grid */
.concepts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.concept-card {
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid #333;
}

.concept-card h5 {
    color: #17b5b5;
    margin: 0 0 0.5rem 0;
}

/* Examples Grid */
.examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.example-card {
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    border-radius: 10px;
    border-left: 4px solid #ffc107;
}

.example-context {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #333;
    color: #888;
    font-size: 0.9rem;
}

/* Sources */
.source-card {
    background: rgba(0, 0, 0, 0.3);
    padding: 2rem;
    border-radius: 15px;
    border: 1px solid #333;
    margin-bottom: 2rem;
}

.source-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.source-type {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
}

.source-excerpt {
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 10px;
    border-left: 4px solid #17b5b5;
    margin-bottom: 1rem;
    font-style: italic;
}

.source-attribution {
    text-align: right;
    color: #888;
    margin-bottom: 1.5rem;
}

.analysis-questions {
    display: grid;
    gap: 1rem;
    margin-top: 1rem;
}

.question-item {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 8px;
    border-left: 3px solid #17b5b5;
}

/* Vocabulary */
.vocabulary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.vocab-item {
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid #333;
}

.vocab-term {
    color: #17b5b5;
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.vocab-definition {
    margin-bottom: 1rem;
}

.vocab-context {
    padding-top: 1rem;
    border-top: 1px solid #333;
    color: #888;
    font-size: 0.9rem;
}

/* Misconceptions */
.misconceptions-list {
    display: grid;
    gap: 1.5rem;
    margin-top: 1rem;
}

.misconception-item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid #333;
}

.misconception-wrong {
    border-left: 4px solid #ff4444;
    padding-left: 1rem;
}

.misconception-correct {
    border-left: 4px solid #44ff44;
    padding-left: 1rem;
}

.misconception-wrong h4 {
    color: #ff6666;
    margin: 0 0 0.5rem 0;
}

.misconception-correct h4 {
    color: #66ff66;
    margin: 0 0 0.5rem 0;
}

/* Personalities */
.personalities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.personality-item {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #333;
    border-radius: 15px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.personality-item:hover {
    border-color: #17b5b5;
    background: rgba(23, 181, 181, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(23, 181, 181, 0.2);
}

.personality-avatar {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #17b5b5, #20d4d4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
}

.avatar-icon {
    color: #000;
}

.personality-info {
    flex: 1;
}

.personality-name {
    color: #ffffff;
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    font-weight: 600;
}

.personality-title {
    color: #17b5b5;
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
}

.personality-period {
    color: #888;
    margin: 0;
    font-size: 0.8rem;
}

.no-personalities {
    text-align: center;
    color: #888;
    padding: 2rem;
    font-style: italic;
}

/* Assessment */
.assessment-list {
    display: grid;
    gap: 1.5rem;
    margin-top: 1rem;
}

.assessment-item {
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid #333;
}

.question-type-badge {
    background: rgba(23, 181, 181, 0.2);
    color: #17b5b5;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    display: inline-block;
    margin-bottom: 1rem;
}

.question-content {
    margin-bottom: 1rem;
    font-weight: 500;
}

.answer-guide {
    background: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border-radius: 8px;
    border-left: 3px solid #17b5b5;
}

/* Perspectives */
.perspectives-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.perspective-item {
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid #333;
}

.perspective-item h4 {
    color: #17b5b5;
    margin: 0 0 1rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .breadcrumbs {
        display: none;
    }

    .chapter-hero {
        padding: 2rem 1rem;
    }

    .chapter-title {
        font-size: 2rem;
    }

    .main-container {
        padding: 0 1rem 2rem;
    }

    .content-nav {
        padding: 0.5rem;
        gap: 0.25rem;
    }

    .nav-tab {
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
    }

    .tab-label {
        display: none;
    }

    .content-card {
        padding: 1.5rem;
    }

    .section-header h2 {
        font-size: 1.5rem;
    }

    .section-header-with-actions {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }

    .enlarge-button {
        align-self: flex-start;
    }

    .modal-content {
        width: 98vw;
        height: 98vh;
        border-radius: 10px;
    }

    .modal-header {
        padding: 1rem;
    }

    .modal-body {
        padding: 1rem;
    }

    .modal-personalities-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .personalities-grid {
        grid-template-columns: 1fr;
    }

    .concepts-container,
    .examples-grid,
    .vocabulary-grid,
    .perspectives-grid {
        grid-template-columns: 1fr;
    }

    .misconception-item {
        grid-template-columns: 1fr;
    }
}
</style>