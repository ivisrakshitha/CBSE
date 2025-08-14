<!-- src/views/subjects/EnglishContentPage.vue -->
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
                <router-link :to="`/class/${classNum}/subject/english`">English</router-link> /
                <span>{{ chapterTitle }}</span>
            </div>
        </nav>

        <!-- Chapter Header -->
        <header>
            <h1>{{ chapterTitle.toUpperCase() }}</h1>
            <div class="chapter-meta">
                <span class="subject-tag">English</span>
                <span class="grade-tag">Class {{ classNum }}</span>
                <span v-if="chapterData.chapterMetadata && chapterData.chapterMetadata.genre" class="genre-tag">
                    {{ chapterData.chapterMetadata.genre }}
                </span>
                <span v-if="chapterData.chapterMetadata && chapterData.chapterMetadata.author" class="author-tag">
                    by {{ chapterData.chapterMetadata.author }}
                </span>
            </div>
        </header>

        <!-- Section Navigation Bar -->
        <nav class="section-nav">
            <div class="nav-items">
                <button @click="activeSection = 'overview'" :class="{ active: activeSection === 'overview' }"
                    class="nav-item">
                    Story Overview
                </button>
                <button @click="activeSection = 'reading'" :class="{ active: activeSection === 'reading' }"
                    class="nav-item">
                    Reading Content
                </button>
                <button @click="activeSection = 'comprehension'" :class="{ active: activeSection === 'comprehension' }"
                    class="nav-item">
                    Comprehension
                </button>
                <button @click="activeSection = 'vocabulary'" :class="{ active: activeSection === 'vocabulary' }"
                    class="nav-item">
                    Vocabulary
                </button>
                <button @click="activeSection = 'grammar'" :class="{ active: activeSection === 'grammar' }"
                    class="nav-item">
                    Grammar Focus
                </button>
                <button @click="activeSection = 'writing'" :class="{ active: activeSection === 'writing' }"
                    class="nav-item">
                    Writing Activities
                </button>
                <button @click="activeSection = 'speaking'" :class="{ active: activeSection === 'speaking' }"
                    class="nav-item">
                    Speaking & Listening
                </button>
                <button @click="activeSection = 'visual'" :class="{ active: activeSection === 'visual' }"
                    class="nav-item">
                    Visual Resources
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
                <!-- Chapter Navigation -->
                <div class="sidebar-section">
                    <h4>Story Sections</h4>
                    <nav class="topics-nav">
                        <button 
                            v-for="(section, index) in chapterData.storySections" 
                            :key="'section-' + index"
                            @click="scrollToSection(index)" 
                            :class="{ active: activeTopicIndex === index }"
                            class="topic-item">
                            {{ section.title }}
                        </button>
                    </nav>
                </div>

                <!-- Chapter Contents -->
                <div class="sidebar-header">
                    <h3>Chapter Contents</h3>
                </div>

                <!-- Before You Read -->
                <div class="sidebar-section" v-if="chapterData.beforeYouRead">
                    <h4>Before You Read</h4>
                    <div class="intro-content">
                        <TypewriterText :text="chapterData.beforeYouRead.introduction">
                        </TypewriterText>
                    </div>
                    <div v-if="chapterData.beforeYouRead.thinkingQuestions && chapterData.beforeYouRead.thinkingQuestions.length > 0"
                        class="thinking-questions">
                        <h5>Think About</h5>
                        <ul>
                            <li v-for="(question, index) in chapterData.beforeYouRead.thinkingQuestions"
                                :key="index">
                                {{ question }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Character Overview -->
                <div class="sidebar-section" v-if="chapterData.characters && chapterData.characters.length > 0">
                    <h4>Main Characters</h4>
                    <div class="characters-list">
                        <div v-for="(character, index) in chapterData.characters" :key="index"
                            class="character-item">
                            <h5>{{ character.name }}</h5>
                            <p>{{ character.description }}</p>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Content Area -->
            <main class="content-area">
                <!-- Story Overview Section -->
                <div v-show="activeSection === 'overview'" class="content-section">
                    <h2>Story Overview</h2>
                    
                    <!-- Story Summary -->
                    <div v-if="chapterData.storySummary" class="content-block story-summary">
                        <h3>Summary</h3>
                        <TypewriterText :text="chapterData.storySummary"></TypewriterText>
                    </div>

                    <!-- Themes -->
                    <div v-if="chapterData.themes && chapterData.themes.length > 0" class="content-block themes">
                        <h3>Major Themes</h3>
                        <div class="themes-container">
                            <div v-for="(theme, index) in chapterData.themes" :key="index" class="theme-item">
                                <h4>{{ theme.name }}</h4>
                                <TypewriterText :text="theme.description"></TypewriterText>
                            </div>
                        </div>
                    </div>

                    <!-- Learning Objectives -->
                    <div v-if="chapterData.chapterMetadata && chapterData.chapterMetadata.learningObjectives && chapterData.chapterMetadata.learningObjectives.length > 0"
                        class="content-block learning-objectives">
                        <h3>Learning Objectives</h3>
                        <ul>
                            <li v-for="(objective, index) in chapterData.chapterMetadata.learningObjectives"
                                :key="index">
                                {{ objective }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Reading Content Section -->
                <div v-show="activeSection === 'reading'" class="content-section">
                    <h2>Reading Content</h2>
                    
                    <!-- Story Sections -->
                    <div v-for="(section, index) in chapterData.storySections" :key="'story-' + index"
                        :ref="'section-' + index" class="section-content">
                        <h3>{{ section.title }}</h3>
                        
                        <!-- Story Text -->
                        <div class="content-block story-text">
                            <div class="story-paragraphs">
                                <p v-for="(paragraph, pIndex) in section.content" :key="pIndex" class="story-paragraph">
                                    <TypewriterText :text="paragraph"></TypewriterText>
                                </p>
                            </div>
                        </div>

                        <!-- Word Meanings -->
                        <div v-if="section.wordMeanings && section.wordMeanings.length > 0" 
                            class="content-block word-meanings">
                            <h4>Word Meanings</h4>
                            <div class="meanings-container">
                                <div v-for="(meaning, mIndex) in section.wordMeanings" :key="mIndex"
                                    class="meaning-item">
                                    <strong>{{ meaning.word }}</strong>: {{ meaning.definition }}
                                </div>
                            </div>
                        </div>

                        <!-- Oral Comprehension Check -->
                        <div v-if="section.oralComprehensionCheck && section.oralComprehensionCheck.length > 0"
                            class="content-block comprehension-check">
                            <h4>Oral Comprehension Check</h4>
                            <div class="questions-container">
                                <ol>
                                    <li v-for="(question, qIndex) in section.oralComprehensionCheck" :key="qIndex"
                                        class="comprehension-question">
                                        {{ question }}
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Comprehension Section -->
                <div v-show="activeSection === 'comprehension'" class="content-section">
                    <h2>Thinking About the Text</h2>
                    
                    <div v-if="chapterData.thinkingAboutText && chapterData.thinkingAboutText.length > 0"
                        class="content-block thinking-questions">
                        <div class="questions-container">
                            <div v-for="(question, index) in chapterData.thinkingAboutText" :key="index"
                                class="thinking-question">
                                <div class="question-number">{{ index + 1 }}.</div>
                                <div class="question-content">
                                    <TypewriterText :text="question.question"></TypewriterText>
                                    <div v-if="question.hints && question.hints.length > 0" class="question-hints">
                                        <h5>Hints:</h5>
                                        <ul>
                                            <li v-for="(hint, hIndex) in question.hints" :key="hIndex">
                                                {{ hint }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vocabulary Section -->
                <div v-show="activeSection === 'vocabulary'" class="content-section">
                    <h2>Vocabulary & Language Work</h2>
                    
                    <!-- Vocabulary Exercises -->
                    <div v-if="chapterData.vocabularyExercises && chapterData.vocabularyExercises.length > 0"
                        class="content-block vocabulary-exercises">
                        <div v-for="(exercise, index) in chapterData.vocabularyExercises" :key="index"
                            class="vocabulary-exercise">
                            <h3>{{ exercise.title }}</h3>
                            <div class="exercise-instructions">
                                <TypewriterText :text="exercise.instructions"></TypewriterText>
                            </div>
                            
                            <!-- Different exercise types -->
                            <div v-if="exercise.type === 'matching'" class="matching-exercise">
                                <div class="matching-columns">
                                    <div class="column-a">
                                        <h4>Column A</h4>
                                        <div v-for="(item, itemIndex) in exercise.columnA" :key="itemIndex"
                                            class="matching-item">
                                            {{ itemIndex + 1 }}. {{ item }}
                                        </div>
                                    </div>
                                    <div class="column-b">
                                        <h4>Column B</h4>
                                        <div v-for="(item, itemIndex) in exercise.columnB" :key="itemIndex"
                                            class="matching-item">
                                            {{ item }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else-if="exercise.type === 'fill-blanks'" class="fill-blanks-exercise">
                                <div v-for="(sentence, sIndex) in exercise.sentences" :key="sIndex"
                                    class="blank-sentence">
                                    {{ sIndex + 1 }}. {{ sentence }}
                                </div>
                                <div v-if="exercise.wordBank" class="word-bank">
                                    <h5>Word Bank:</h5>
                                    <div class="words">
                                        <span v-for="(word, wIndex) in exercise.wordBank" :key="wIndex"
                                            class="bank-word">{{ word }}</span>
                                    </div>
                                </div>
                            </div>

                            <div v-else-if="exercise.type === 'definitions'" class="definitions-exercise">
                                <div v-for="(term, tIndex) in exercise.terms" :key="tIndex"
                                    class="definition-item">
                                    <strong>{{ term.word }}</strong>
                                    <div v-if="term.pronunciation" class="pronunciation">/{{ term.pronunciation }}/</div>
                                    <div class="definition">{{ term.definition }}</div>
                                    <div v-if="term.example" class="example">
                                        <em>Example: {{ term.example }}</em>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Grammar Focus Section -->
                <div v-show="activeSection === 'grammar'" class="content-section">
                    <h2>Grammar Focus</h2>
                    
                    <div v-if="chapterData.grammarTopics && chapterData.grammarTopics.length > 0"
                        class="grammar-topics">
                        <div v-for="(topic, index) in chapterData.grammarTopics" :key="index"
                            class="content-block grammar-topic">
                            <h3>{{ topic.title }}</h3>
                            
                            <!-- Explanation -->
                            <div class="grammar-explanation">
                                <TypewriterText :text="topic.explanation"></TypewriterText>
                            </div>

                            <!-- Examples from text -->
                            <div v-if="topic.examplesFromText && topic.examplesFromText.length > 0"
                                class="text-examples">
                                <h4>Examples from the Story</h4>
                                <ul>
                                    <li v-for="(example, eIndex) in topic.examplesFromText" :key="eIndex"
                                        class="text-example">
                                        {{ example }}
                                    </li>
                                </ul>
                            </div>

                            <!-- Grammar Exercises -->
                            <div v-if="topic.exercises && topic.exercises.length > 0" class="grammar-exercises">
                                <h4>Practice Exercises</h4>
                                <div v-for="(exercise, exIndex) in topic.exercises" :key="exIndex"
                                    class="grammar-exercise">
                                    <div class="exercise-instruction">{{ exercise.instruction }}</div>
                                    <ol>
                                        <li v-for="(item, iIndex) in exercise.items" :key="iIndex">
                                            {{ item }}
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Writing Activities Section -->
                <div v-show="activeSection === 'writing'" class="content-section">
                    <h2>Writing Activities</h2>
                    
                    <div v-if="chapterData.writingActivities && chapterData.writingActivities.length > 0"
                        class="writing-activities">
                        <div v-for="(activity, index) in chapterData.writingActivities" :key="index"
                            class="content-block writing-activity">
                            <h3>{{ activity.title }}</h3>
                            <div class="activity-instructions">
                                <TypewriterText :text="activity.instructions"></TypewriterText>
                            </div>
                            
                            <div v-if="activity.prompts && activity.prompts.length > 0" class="writing-prompts">
                                <h4>Writing Prompts</h4>
                                <ul>
                                    <li v-for="(prompt, pIndex) in activity.prompts" :key="pIndex">
                                        {{ prompt }}
                                    </li>
                                </ul>
                            </div>

                            <div v-if="activity.guidelines && activity.guidelines.length > 0" class="writing-guidelines">
                                <h4>Guidelines</h4>
                                <ul>
                                    <li v-for="(guideline, gIndex) in activity.guidelines" :key="gIndex">
                                        {{ guideline }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Speaking & Listening Section -->
                <div v-show="activeSection === 'speaking'" class="content-section">
                    <h2>Speaking & Listening Activities</h2>
                    
                    <!-- Speaking Activities -->
                    <div v-if="chapterData.speakingActivities && chapterData.speakingActivities.length > 0"
                        class="content-block speaking-activities">
                        <h3>Speaking Activities</h3>
                        <div v-for="(activity, index) in chapterData.speakingActivities" :key="index"
                            class="speaking-activity">
                            <h4>{{ activity.title }}</h4>
                            <div class="activity-description">
                                <TypewriterText :text="activity.description"></TypewriterText>
                            </div>
                            <div v-if="activity.instructions && activity.instructions.length > 0"
                                class="activity-instructions">
                                <h5>Instructions:</h5>
                                <ol>
                                    <li v-for="(instruction, iIndex) in activity.instructions" :key="iIndex">
                                        {{ instruction }}
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <!-- Listening Activities -->
                    <div v-if="chapterData.listeningActivities && chapterData.listeningActivities.length > 0"
                        class="content-block listening-activities">
                        <h3>Listening Activities</h3>
                        <div v-for="(activity, index) in chapterData.listeningActivities" :key="index"
                            class="listening-activity">
                            <h4>{{ activity.title }}</h4>
                            <div class="activity-description">
                                <TypewriterText :text="activity.description"></TypewriterText>
                            </div>
                            <div v-if="activity.comprehensionQuestions && activity.comprehensionQuestions.length > 0"
                                class="listening-questions">
                                <h5>Listen and Answer:</h5>
                                <ol>
                                    <li v-for="(question, qIndex) in activity.comprehensionQuestions" :key="qIndex">
                                        {{ question }}
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Visual Resources Section -->
                <div v-show="activeSection === 'visual'" class="content-section">
                    <h2>Visual Learning Resources</h2>
                    <div class="content-block">
                        <GoogleSearchResults :initialQuery="chapterTitle + ' English Literature'"
                            :searchContext="'English Literature'" :apiKey="googleApiKey"
                            :searchEngineId="googleSearchEngineId" />
                    </div>
                </div>

                <!-- Talk to Person Section -->
                <div v-show="activeSection === 'personalities'" class="content-section">
                    <h2>Talk to Person</h2>

                    <!-- Personality list (names only) -->
                    <div v-if="!selectedPersonality">
                        <ul>
                            <li v-for="personality in chapterData.personalities" 
                                :key="personality.id"
                                @click="selectPersonality(personality)"
                                class="personality-name">
                                {{ personality.name }}
                            </li>
                        </ul>
                    </div>

                    <!-- Chat view -->
                    <div v-else>
                        <PersonalityChat 
                            :personality="selectedPersonality" 
                            @back-to-list="selectedPersonality = null" />
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import IvisLabsLogo from '../../components/IvisLabsLogo.vue'
import TypewriterText from '../../components/TypewriterText.vue'
import GoogleSearchResults from '../../components/GoogleSearchResults.vue'
import PersonalityChat from '../../components/PersonalityChat.vue'

export default {
    name: 'EnglishContentPage',
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
            selectedPersonality: null,
            activeSection: 'overview',
            activeTopicIndex: 0,
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
        // Load the chapter JSON from /public/data/classX/english/chapterId.json
        async fetchChapterData() {
            this.isLoading = true;
            this.error = null;

            try {
                const chapterId = this.chapterId || 'chapter1'; 
                const subjectFolder = 'english';

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
                const subjectFolder = 'english';
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
            this.activeSection = 'reading'; 
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

        // Select a personality from list
        selectPersonality(personality) {
            if (!personality) return;
            this.selectedPersonality = personality;
            console.log('Selected personality:', personality.name);
        }
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
}
</style>