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
                <span class="subject-tag">Language Arts</span>
                <span class="grade-tag">Class {{ classNum }}</span>
                <span v-if="chapterData.chapterMetadata && chapterData.chapterMetadata.focus" class="focus-tag">
                    {{ chapterData.chapterMetadata.focus }}
                </span>
                <span v-if="chapterData.chapterMetadata && chapterData.chapterMetadata.genre" class="genre-tag">
                    {{ chapterData.chapterMetadata.genre }}
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
                <button @click="activeSection = 'cultural'" :class="{ active: activeSection === 'cultural' }"
                    class="nav-item">
                    Cultural Context
                </button>
                <button @click="activeSection = 'skills'" :class="{ active: activeSection === 'skills' }"
                    class="nav-item">
                    Communication Skills
                </button>
                <button @click="activeSection = 'portfolio'" :class="{ active: activeSection === 'portfolio' }"
                    class="nav-item">
                    Language Portfolio
                </button>
                <button @click="activeSection = 'digital'" :class="{ active: activeSection === 'digital' }"
                    class="nav-item">
                    Digital Literacy
                </button>
                <button @click="activeSection = 'visual'" :class="{ active: activeSection === 'visual' }"
                    class="nav-item">
                    Visual Resources
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
                <!-- Main Topics Navigation -->
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
                            :text="'This chapter focuses on ' + chapterData.chapterMetadata.focus + ' in English Language Arts for Class ' + chapterData.chapterMetadata.grade + '.'">
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
                    <div v-if="chapterData.chapterMetadata.ncertLanguageApproach" class="language-approach">
                        <h5>NCERT Language Approach</h5>
                        <div v-if="chapterData.chapterMetadata.ncertLanguageApproach.culturalLiteracy"
                            class="cultural-literacy">
                            <p><strong>Cultural Context:</strong> {{
                                chapterData.chapterMetadata.ncertLanguageApproach.culturalLiteracy }}</p>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Content Area -->
            <main class="content-area">
                <!-- Chapter Overview Section -->
                <div v-show="activeSection === 'overview'" class="content-section">
                    <h2>Chapter Overview</h2>

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
                                </div>
                            </div>
                        </div>

                        <!-- Text Excerpts -->
                        <div v-if="section.textExcerpts && section.textExcerpts.length > 0"
                            class="content-block text-excerpts">
                            <h3>Text Excerpts</h3>
                            <div class="excerpts-container">
                                <div v-for="(excerpt, eIndex) in section.textExcerpts" :key="eIndex"
                                    class="excerpt-item">
                                    <div class="excerpt-content">
                                        <blockquote>
                                            <TypewriterText :text="excerpt.excerpt"></TypewriterText>
                                        </blockquote>
                                        <cite v-if="excerpt.source">— {{ excerpt.source }}</cite>
                                    </div>
                                    <div v-if="excerpt.analysisPrompts && excerpt.analysisPrompts.length > 0"
                                        class="analysis-prompts">
                                        <h5>Analysis Questions:</h5>
                                        <ul>
                                            <li v-for="(prompt, pIndex) in excerpt.analysisPrompts" :key="pIndex">
                                                {{ prompt }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Visual Elements -->
                        <div v-if="section.visualElements && section.visualElements.length > 0"
                            class="content-block visual-elements">
                            <h3>Visual Learning Elements</h3>
                            <div class="visual-container">
                                <div v-for="(visual, vIndex) in section.visualElements" :key="vIndex"
                                    class="visual-item">
                                    <h4>{{ visual.type }}</h4>
                                    <p>{{ visual.description }}</p>
                                    <div class="interactivity-hint">
                                        <strong>Interactive Feature:</strong> {{ visual.interactivityHint }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Activities -->
                        <div v-if="section.activities && section.activities.length > 0"
                            class="content-block activities">
                            <h3>Activities</h3>
                            <div class="activities-container">
                                <div v-for="(activity, aIndex) in section.activities" :key="aIndex"
                                    class="activity-item">
                                    <h4>{{ activity.title }} <span class="activity-type">({{ activity.type }})</span>
                                    </h4>
                                    <div class="activity-description">
                                        <TypewriterText :text="activity.description"></TypewriterText>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Exercises -->
                        <div v-if="section.exercises && section.exercises.length > 0" class="content-block exercises">
                            <h3>Exercises</h3>
                            <div class="exercises-container">
                                <div v-for="(exercise, exIndex) in section.exercises" :key="exIndex"
                                    class="exercise-item">
                                    <div class="exercise-header">
                                        <h4>{{ exercise.type }}</h4>
                                        <div class="exercise-meta">
                                            <span class="difficulty-badge"
                                                :class="'difficulty-' + exercise.difficulty.toLowerCase()">
                                                {{ exercise.difficulty }}
                                            </span>
                                            <span class="skill-badge">{{ exercise.skillTargeted }}</span>
                                        </div>
                                    </div>
                                    <div class="exercise-prompt">
                                        <TypewriterText :text="exercise.prompt"></TypewriterText>
                                    </div>
                                    <div v-if="exercise.assessment" class="exercise-assessment">
                                        <strong>Assessment:</strong> {{ exercise.assessment }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Oral Language Activity -->
                        <div v-if="section.oralLanguageActivity" class="content-block oral-activity">
                            <h3>Speaking & Listening Activity</h3>
                            <div class="oral-activity-content">
                                <h4>{{ section.oralLanguageActivity.title }}</h4>
                                <div class="activity-description">
                                    <TypewriterText :text="section.oralLanguageActivity.description"></TypewriterText>
                                </div>
                                <div v-if="section.oralLanguageActivity.preparation" class="preparation-steps">
                                    <h5>Preparation Steps:</h5>
                                    <ul>
                                        <li v-for="(step, sIndex) in section.oralLanguageActivity.preparation"
                                            :key="sIndex">
                                            {{ step }}
                                        </li>
                                    </ul>
                                </div>
                                <div v-if="section.oralLanguageActivity.listeningPrompts" class="listening-prompts">
                                    <h5>Listening Focus Points:</h5>
                                    <ul>
                                        <li v-for="(prompt, lIndex) in section.oralLanguageActivity.listeningPrompts"
                                            :key="lIndex">
                                            {{ prompt }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- Creativity Corner -->
                        <div v-if="section.creativityCorner" class="content-block creativity-corner">
                            <h3>Creativity Corner</h3>
                            <div class="creativity-content">
                                <div class="creativity-prompt">
                                    <TypewriterText :text="section.creativityCorner.prompt"></TypewriterText>
                                </div>
                                <div v-if="section.creativityCorner.guidelines" class="creativity-guidelines">
                                    <h5>Guidelines:</h5>
                                    <ul>
                                        <li v-for="(guideline, gIndex) in section.creativityCorner.guidelines"
                                            :key="gIndex">
                                            {{ guideline }}
                                        </li>
                                    </ul>
                                </div>
                                <div v-if="section.creativityCorner.exemplars" class="creativity-exemplars">
                                    <h5>Example Approaches:</h5>
                                    <ul>
                                        <li v-for="(exemplar, eIndex) in section.creativityCorner.exemplars"
                                            :key="eIndex">
                                            {{ exemplar }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- Multilingual Connections -->
                        <div v-if="section.multilingualConnections" class="content-block multilingual">
                            <h3>Multilingual Connections</h3>
                            <div class="multilingual-content">
                                <div v-if="section.multilingualConnections.translations" class="translations">
                                    <h5>Key Terms in Multiple Languages:</h5>
                                    <ul>
                                        <li v-for="(translation, tIndex) in section.multilingualConnections.translations"
                                            :key="tIndex">
                                            {{ translation }}
                                        </li>
                                    </ul>
                                </div>
                                <div v-if="section.multilingualConnections.etymologyNotes" class="etymology">
                                    <h5>Etymology Notes:</h5>
                                    <ul>
                                        <li v-for="(note, nIndex) in section.multilingualConnections.etymologyNotes"
                                            :key="nIndex">
                                            {{ note }}
                                        </li>
                                    </ul>
                                </div>
                                <div v-if="section.multilingualConnections.culturalContext" class="cultural-context">
                                    <h5>Cultural Context:</h5>
                                    <p>{{ section.multilingualConnections.culturalContext }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Teaching Resources Section -->
                <div v-show="activeSection === 'resources'" class="content-section">
                    <h2>Teaching Resources</h2>
                    <div v-if="chapterData.teachingResources">
                        <!-- Key Vocabulary - MODIFIED SECTION -->
                        <div v-if="chapterData.teachingResources.keyVocabulary && chapterData.teachingResources.keyVocabulary.length > 0"
                            class="content-block key-vocabulary">
                            <h3>Key Vocabulary</h3>
                            <div class="vocabulary-container">
                                <div v-for="(term, vIndex) in chapterData.teachingResources.keyVocabulary" :key="vIndex"
                                    class="vocabulary-item">
                                    <div class="vocabulary-term-header" @click="toggleVocabulary(vIndex)"
                                        :class="{ 'expanded': expandedVocabulary[vIndex] }">
                                        <h4>{{ term.term }}</h4>
                                        <span class="vocabulary-toggle-icon">
                                            {{ expandedVocabulary[vIndex] ? '▼' : '▶' }}
                                        </span>
                                    </div>

                                    <div v-show="expandedVocabulary[vIndex]" class="vocabulary-details">
                                        <div class="vocabulary-definition">
                                            <TypewriterText :text="term.definition"></TypewriterText>
                                        </div>
                                        <div v-if="term.etymology" class="vocabulary-etymology">
                                            <strong>Etymology:</strong> {{ term.etymology }}
                                        </div>
                                        <div v-if="term.usage" class="vocabulary-usage">
                                            <strong>Usage:</strong> <em>{{ term.usage }}</em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Literary Devices -->
                        <div v-if="chapterData.teachingResources.literaryDevices && chapterData.teachingResources.literaryDevices.length > 0"
                            class="content-block literary-devices">
                            <h3>Literary Devices</h3>
                            <div class="devices-container">
                                <div v-for="(device, dIndex) in chapterData.teachingResources.literaryDevices"
                                    :key="dIndex" class="device-item">
                                    <div class="device-term-header" @click="toggleLiteraryDevice(dIndex)"
                                        :class="{ 'expanded': expandedLiteraryDevices[dIndex] }">
                                        <h4>{{ device.device }}</h4>
                                        <span class="device-toggle-icon">
                                            {{ expandedLiteraryDevices[dIndex] ? '▼' : '▶' }}
                                        </span>
                                    </div>

                                    <div v-show="expandedLiteraryDevices[dIndex]" class="device-details">
                                        <div class="device-definition">
                                            <TypewriterText :text="device.definition"></TypewriterText>
                                        </div>
                                        <div v-if="device.effect" class="device-effect">
                                            <strong>Effect:</strong> {{ device.effect }}
                                        </div>
                                        <div v-if="device.example" class="device-example">
                                            <strong>Example:</strong> <em>{{ device.example }}</em>
                                        </div>
                                        <div v-if="device.etymology" class="device-etymology">
                                            <strong>Etymology:</strong> {{ device.etymology }}
                                        </div>
                                        <div v-if="device.usage" class="device-usage">
                                            <strong>Usage:</strong> <em>{{ device.usage }}</em>
                                        </div>
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
                                    <div class="misconception-term-header" @click="toggleMisconception(mIndex)"
                                        :class="{ 'expanded': expandedMisconceptions[mIndex] }">
                                        <h4>{{ misconception.misconception }}</h4>
                                        <span class="misconception-toggle-icon">
                                            {{ expandedMisconceptions[mIndex] ? '▼' : '▶' }}
                                        </span>
                                    </div>

                                    <div v-show="expandedMisconceptions[mIndex]" class="misconception-details">
                                        <div class="correction-content">
                                            <h4 class="correction-title">Correction:</h4>
                                            <TypewriterText :text="misconception.correction"></TypewriterText>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Assessment Ideas -->
                        <div v-if="chapterData.teachingResources.assessmentIdeas && chapterData.teachingResources.assessmentIdeas.length > 0"
                            class="content-block assessment-ideas">
                            <h3>Assessment Ideas</h3>
                            <div class="assessments-container">
                                <div v-for="(assessment, aIndex) in chapterData.teachingResources.assessmentIdeas"
                                    :key="aIndex" class="assessment-item">
                                    <h4>{{ assessment.questionType }}</h4>
                                    <div class="assessment-question">
                                        <strong>Question:</strong> {{ assessment.question }}
                                    </div>
                                    <div v-if="assessment.answer" class="assessment-answer">
                                        <strong>Expected Answer:</strong> {{ assessment.answer }}
                                    </div>
                                    <div v-if="assessment.rubric && assessment.rubric.length > 0"
                                        class="assessment-rubric">
                                        <h5>Evaluation Criteria:</h5>
                                        <ul>
                                            <li v-for="(criterion, cIndex) in assessment.rubric" :key="cIndex">
                                                {{ criterion }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Differentiation Tips -->
                        <div v-if="chapterData.teachingResources.differentiationTips"
                            class="content-block differentiation">
                            <h3>Differentiation Strategies</h3>
                            <div class="differentiation-content">
                                <div v-if="chapterData.teachingResources.differentiationTips.support"
                                    class="support-strategies">
                                    <h4>Support Strategies</h4>
                                    <ul>
                                        <li v-for="(strategy, sIndex) in chapterData.teachingResources.differentiationTips.support"
                                            :key="sIndex">
                                            {{ strategy }}
                                        </li>
                                    </ul>
                                </div>
                                <div v-if="chapterData.teachingResources.differentiationTips.extension"
                                    class="extension-strategies">
                                    <h4>Extension Activities</h4>
                                    <ul>
                                        <li v-for="(activity, eIndex) in chapterData.teachingResources.differentiationTips.extension"
                                            :key="eIndex">
                                            {{ activity }}
                                        </li>
                                    </ul>
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

                <!-- Cultural Context Section -->
                <div v-show="activeSection === 'cultural'" class="content-section">
                    <h2>Cultural Context</h2>
                    <div v-if="chapterData.culturalContext">
                        <!-- Diverse Texts -->
                        <div v-if="chapterData.culturalContext.diverseTexts && chapterData.culturalContext.diverseTexts.length > 0"
                            class="content-block diverse-texts">
                            <h3>Recommended Diverse Texts</h3>
                            <div class="texts-container">
                                <div v-for="(text, tIndex) in chapterData.culturalContext.diverseTexts" :key="tIndex"
                                    class="text-item">
                                    <h4>{{ text.title }} by {{ text.author }}</h4>
                                    <div class="text-background">
                                        <strong>Background:</strong> {{ text.background }}
                                    </div>
                                    <div class="text-connection">
                                        <strong>Connection to Chapter:</strong> {{ text.connection }}
                                    </div>

                                    <!-- Images Section -->
                                    <div v-if="text.images && text.images.length > 0" class="text-images">
                                        <h5>Visual References</h5>
                                        <div class="images-grid">
                                            <div v-for="(image, iIndex) in text.images" :key="iIndex"
                                                class="image-item">
                                                <img :src="image.url" :alt="image.category" class="cultural-image"
                                                    loading="lazy">
                                                <div class="image-caption">{{ image.category }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Indian Traditions -->
                        <div v-if="chapterData.culturalContext.indianTraditions"
                            class="content-block indian-traditions">
                            <h3>Indian Literary Traditions</h3>
                            <div class="traditions-content">
                                <div v-if="chapterData.culturalContext.indianTraditions.literaryForms"
                                    class="literary-forms">
                                    <h4>Traditional Literary Forms</h4>
                                    <ul>
                                        <li v-for="(form, fIndex) in chapterData.culturalContext.indianTraditions.literaryForms"
                                            :key="fIndex">
                                            {{ form }}
                                        </li>
                                    </ul>
                                </div>
                                <div v-if="chapterData.culturalContext.indianTraditions.culturalReferences"
                                    class="cultural-references">
                                    <h4>Cultural References</h4>
                                    <ul>
                                        <li v-for="(reference, rIndex) in chapterData.culturalContext.indianTraditions.culturalReferences"
                                            :key="rIndex">
                                            {{ reference }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- Representation Considerations -->
                        <div v-if="chapterData.culturalContext.representationConsiderations"
                            class="content-block representation">
                            <h3>Inclusive Teaching Notes</h3>
                            <div class="representation-content">
                                <TypewriterText :text="chapterData.culturalContext.representationConsiderations">
                                </TypewriterText>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Updated Communication Skills Section -->
                <div v-show="activeSection === 'skills'" class="content-section">
                    <h2>Communication Skills Development</h2>
                    <div v-if="chapterData.communicationSkills" class="skills-container">
                        <!-- Writing Skills -->
                        <div v-if="chapterData.communicationSkills.writing && chapterData.communicationSkills.writing.length > 0"
                            class="content-block writing-skills">
                            <div class="skill-header" @click="toggleSkillSection('writing')"
                                :class="{ 'expanded': expandedSkills.writing }">
                                <h3>Writing Skills</h3>
                                <span class="skill-toggle-icon">
                                    {{ expandedSkills.writing ? '▼' : '▶' }}
                                </span>
                            </div>

                            <div v-show="expandedSkills.writing" class="skill-content">
                                <div v-for="(skill, wIndex) in chapterData.communicationSkills.writing" :key="wIndex"
                                    class="skill-item">
                                    <h4>{{ skill.topic }}</h4>

                                    <!-- Examples for Writing Skills -->
                                    <div v-if="skill.examples" class="skill-examples">
                                        <!-- Formal Letter Example -->
                                        <div v-if="skill.examples.formalLetter" class="example-item formal-example">
                                            <h5>{{ skill.examples.formalLetter.title }}</h5>
                                            <div class="example-content">
                                                <pre
                                                    class="letter-format">{{ skill.examples.formalLetter.content }}</pre>
                                            </div>
                                        </div>

                                        <!-- Informal Letter Example -->
                                        <div v-if="skill.examples.informalLetter" class="example-item informal-example">
                                            <h5>{{ skill.examples.informalLetter.title }}</h5>
                                            <div class="example-content">
                                                <pre
                                                    class="letter-format">{{ skill.examples.informalLetter.content }}</pre>
                                            </div>
                                        </div>

                                        <!-- Short Paragraph Example -->
                                        <div v-if="skill.examples.shortParagraph"
                                            class="example-item paragraph-example">
                                            <h5>Descriptive Writing Sample</h5>
                                            <div class="example-content">
                                                <TypewriterText :text="skill.examples.shortParagraph"></TypewriterText>
                                            </div>
                                        </div>

                                        <!-- Metaphor Use Example -->
                                        <div v-if="skill.examples.metaphorUse" class="example-item metaphor-example">
                                            <h5>Using Metaphors</h5>
                                            <div class="example-content">
                                                <TypewriterText :text="skill.examples.metaphorUse"></TypewriterText>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Speaking Skills -->
                        <div v-if="chapterData.communicationSkills.speaking && chapterData.communicationSkills.speaking.length > 0"
                            class="content-block speaking-skills">
                            <div class="skill-header" @click="toggleSkillSection('speaking')"
                                :class="{ 'expanded': expandedSkills.speaking }">
                                <h3>Speaking Skills</h3>
                                <span class="skill-toggle-icon">
                                    {{ expandedSkills.speaking ? '▼' : '▶' }}
                                </span>
                            </div>

                            <div v-show="expandedSkills.speaking" class="skill-content">
                                <div v-for="(skill, sIndex) in chapterData.communicationSkills.speaking" :key="sIndex"
                                    class="skill-item">
                                    <h4>{{ skill.topic }}</h4>

                                    <!-- Examples for Speaking Skills -->
                                    <div v-if="skill.examples" class="skill-examples">
                                        <div v-if="skill.examples.activity" class="example-item activity-example">
                                            <h5>Activity</h5>
                                            <div class="example-content">
                                                <TypewriterText :text="skill.examples.activity"></TypewriterText>
                                            </div>
                                        </div>

                                        <div v-if="skill.examples.sampleLine" class="example-item sample-example">
                                            <h5>Sample Practice</h5>
                                            <div class="example-content">
                                                <TypewriterText :text="skill.examples.sampleLine"></TypewriterText>
                                            </div>
                                        </div>

                                        <div v-if="skill.examples.expectedSkills" class="example-item skills-example">
                                            <h5>Skills Developed</h5>
                                            <div class="example-content">
                                                <TypewriterText :text="skill.examples.expectedSkills"></TypewriterText>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Listening Skills -->
                        <div v-if="chapterData.communicationSkills.listening && chapterData.communicationSkills.listening.length > 0"
                            class="content-block listening-skills">
                            <div class="skill-header" @click="toggleSkillSection('listening')"
                                :class="{ 'expanded': expandedSkills.listening }">
                                <h3>Listening Skills</h3>
                                <span class="skill-toggle-icon">
                                    {{ expandedSkills.listening ? '▼' : '▶' }}
                                </span>
                            </div>

                            <div v-show="expandedSkills.listening" class="skill-content">
                                <div v-for="(skill, lIndex) in chapterData.communicationSkills.listening" :key="lIndex"
                                    class="skill-item">
                                    <h4>{{ skill.topic }}</h4>

                                    <!-- Examples for Listening Skills -->
                                    <div v-if="skill.examples" class="skill-examples">
                                        <div v-if="skill.examples.activity" class="example-item activity-example">
                                            <h5>Activity</h5>
                                            <div class="example-content">
                                                <TypewriterText :text="skill.examples.activity"></TypewriterText>
                                            </div>
                                        </div>

                                        <div v-if="skill.examples.skillsDeveloped" class="example-item skills-example">
                                            <h5>Skills Developed</h5>
                                            <div class="example-content">
                                                <TypewriterText :text="skill.examples.skillsDeveloped"></TypewriterText>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Media Literacy -->
                        <div v-if="chapterData.communicationSkills.mediaLiteracy && chapterData.communicationSkills.mediaLiteracy.length > 0"
                            class="content-block media-literacy">
                            <div class="skill-header" @click="toggleSkillSection('mediaLiteracy')"
                                :class="{ 'expanded': expandedSkills.mediaLiteracy }">
                                <h3>Media Literacy Skills</h3>
                                <span class="skill-toggle-icon">
                                    {{ expandedSkills.mediaLiteracy ? '▼' : '▶' }}
                                </span>
                            </div>

                            <div v-show="expandedSkills.mediaLiteracy" class="skill-content">
                                <div v-for="(skill, mIndex) in chapterData.communicationSkills.mediaLiteracy"
                                    :key="mIndex" class="skill-item">
                                    <h4>{{ skill.topic }}</h4>

                                    <!-- Examples for Media Literacy -->
                                    <div v-if="skill.examples" class="skill-examples">
                                        <div v-if="skill.examples.activity" class="example-item activity-example">
                                            <h5>Activity</h5>
                                            <div class="example-content">
                                                <TypewriterText :text="skill.examples.activity"></TypewriterText>
                                            </div>
                                        </div>

                                        <div v-if="skill.examples.skillsDeveloped" class="example-item skills-example">
                                            <h5>Skills Developed</h5>
                                            <div class="example-content">
                                                <TypewriterText :text="skill.examples.skillsDeveloped"></TypewriterText>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Language Portfolio Section -->
                <div v-show="activeSection === 'portfolio'" class="content-section">
                    <h2>Language Portfolio</h2>
                    <div v-if="chapterData.languagePortfolio" class="portfolio-container">
                        <!-- Collection Items -->
                        <div v-if="chapterData.languagePortfolio.collectionItems && chapterData.languagePortfolio.collectionItems.length > 0"
                            class="content-block collection-items">
                            <h3>Portfolio Collection Items</h3>
                            <ul>
                                <li v-for="(item, iIndex) in chapterData.languagePortfolio.collectionItems"
                                    :key="iIndex">
                                    {{ item }}
                                </li>
                            </ul>
                        </div>

                        <!-- Reflection Prompts -->
                        <div v-if="chapterData.languagePortfolio.reflectionPrompts && chapterData.languagePortfolio.reflectionPrompts.length > 0"
                            class="content-block reflection-prompts">
                            <h3>Self-Assessment Questions</h3>
                            <ul>
                                <li v-for="(prompt, pIndex) in chapterData.languagePortfolio.reflectionPrompts"
                                    :key="pIndex">
                                    {{ prompt }}
                                </li>
                            </ul>
                        </div>

                        <!-- Growth Tracking -->
                        <div v-if="chapterData.languagePortfolio.growthTracking" class="content-block growth-tracking">
                            <h3>Growth Tracking</h3>
                            <div class="growth-content">
                                <TypewriterText :text="chapterData.languagePortfolio.growthTracking"></TypewriterText>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Digital Literacy Section -->
                <div v-show="activeSection === 'digital'" class="content-section">
                    <h2>Digital Literacy</h2>
                    <div v-if="chapterData.digitalLiteracy" class="digital-container">
                        <!-- Online Resources -->
                        <div v-if="chapterData.digitalLiteracy.onlineResources && chapterData.digitalLiteracy.onlineResources.length > 0"
                            class="content-block online-resources">
                            <div class="digital-header">
                                <h3>Online Resources</h3>
                            </div>
                            <div class="digital-content">
                                <div v-for="(resource, rIndex) in chapterData.digitalLiteracy.onlineResources"
                                    :key="rIndex" class="resource-item">
                                    <div class="resource-header">
                                        <h4>{{ resource.title }}</h4>
                                        <a :href="resource.url" target="_blank" rel="noopener noreferrer"
                                            class="resource-link">
                                            <span class="link-icon">🔗</span>
                                            Visit Resource
                                        </a>
                                    </div>
                                    <div class="resource-description">
                                        <TypewriterText :text="resource.description"></TypewriterText>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Media Production -->
                        <div v-if="chapterData.digitalLiteracy.mediaProduction && chapterData.digitalLiteracy.mediaProduction.length > 0"
                            class="content-block media-production">
                            <div class="digital-header">
                                <h3>Digital Creation Opportunities</h3>
                            </div>
                            <div class="digital-content">
                                <div v-for="(opportunity, oIndex) in chapterData.digitalLiteracy.mediaProduction"
                                    :key="oIndex" class="production-item">
                                    <h4>{{ opportunity.title }}</h4>
                                    <div class="production-description">
                                        <TypewriterText :text="opportunity.description"></TypewriterText>
                                    </div>
                                    <div v-if="opportunity.tools && opportunity.tools.length > 0"
                                        class="production-tools">
                                        <h5>Recommended Tools:</h5>
                                        <div class="tools-list">
                                            <a v-for="(tool, tIndex) in opportunity.tools" :key="tIndex" :href="tool"
                                                target="_blank" rel="noopener noreferrer" class="tool-link">
                                                <span class="tool-icon">🛠️</span>
                                                {{ extractDomainName(tool) }}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Critical Evaluation -->
                        <div v-if="chapterData.digitalLiteracy.criticalEvaluation && chapterData.digitalLiteracy.criticalEvaluation.length > 0"
                            class="content-block critical-evaluation">
                            <div class="digital-header">
                                <h3>Critical Information Assessment</h3>
                            </div>
                            <div class="digital-content">
                                <div class="evaluation-list">
                                    <div v-for="(skill, sIndex) in chapterData.digitalLiteracy.criticalEvaluation"
                                        :key="sIndex" class="evaluation-item">
                                        <div class="evaluation-icon">🔍</div>
                                        <div class="evaluation-text">
                                            <TypewriterText :text="skill"></TypewriterText>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Visual Learning Resources Section -->
                <div v-show="activeSection === 'visual'" class="content-section">
                    <h2>Visual Learning Resources</h2>
                    <div class="content-block">
                        <GoogleSearchResults :initialQuery="chapterTitle + ' English Literature'"
                            :searchContext="'English Language Arts'" :apiKey="googleApiKey"
                            :searchEngineId="googleSearchEngineId" />
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

export default {
    name: 'EnglishContentPage',
    components: {
        IvisLabsLogo,
        TypewriterText,
        GoogleSearchResults
    },
    data() {
        return {
            isLoading: true,
            chapterData: {},
            chapterTitle: '',
            error: null,
            activeSection: 'overview',
            activeTopicIndex: 0,
            googleApiKey: process.env.VUE_APP_GOOGLE_API_KEY || '',
            googleSearchEngineId: process.env.VUE_APP_GOOGLE_SEARCH_ENGINE_ID || '',
            expandedVocabulary: {},
            expandedLiteraryDevices: {},
            expandedMisconceptions: {},
            expandedSkills: {
                writing: false,
                speaking: false,
                listening: false,
                mediaLiteracy: false
            },
            expandedDigital: {
                resources: false,
                production: false,
                evaluation: false
            }
            // Use reactive() for better reactivity tracking
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

        // Toggle vocabulary item expanded state
        toggleVocabulary(index) {
            this.expandedVocabulary[index] = !this.expandedVocabulary[index];
        },

        // Toggle literary device item expanded state (new)
        toggleLiteraryDevice(index) {
            this.expandedLiteraryDevices[index] = !this.expandedLiteraryDevices[index];
        },
        // Toggle misconception item expanded state
        toggleMisconception(index) {
            this.expandedMisconceptions[index] = !this.expandedMisconceptions[index];
        },
        toggleSkillSection(skillType) {
            this.expandedSkills[skillType] = !this.expandedSkills[skillType];
        },

        // Extract domain name from URL for display
        extractDomainName(url) {
            try {
                const domain = new URL(url).hostname;
                return domain.replace('www.', '');
            } catch (e) {
                return url;
            }
        },
    }
}
</script>

<style scoped>
/* Digital Literacy Interactive Styles */
/* Digital Literacy Interactive Styles - Updated to Match Vocabulary Theme */
.digital-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 1rem;
    background-color: rgba(23, 181, 181, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid rgba(23, 181, 181, 0.1);
    margin-bottom: 0.5rem;
}

.digital-header:hover {
    background-color: rgba(23, 181, 181, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(23, 181, 181, 0.15);
}

.digital-header.expanded {
    background-color: rgba(23, 181, 181, 0.15);
    border-color: rgba(23, 181, 181, 0.3);
}

.digital-header h3 {
    margin: 0;
    color: #17b5b5;
    font-size: 1.1rem;
    font-weight: 600;
}

.digital-toggle-icon {
    color: #17b5b5;
    font-size: 1.2rem;
    font-weight: bold;
    transition: transform 0.3s ease;
    user-select: none;
}

.digital-header.expanded .digital-toggle-icon {
    transform: rotate(90deg);
}

.digital-content {
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    animation: slideDown 0.3s ease;
    margin-bottom: 1rem;
}

/* Resource Items */
.resource-item {
    margin-bottom: 1.5rem;
    padding: 1.2rem;
    background: rgba(76, 175, 80, 0.08);
    border-radius: 8px;
    border-left: 4px solid #4CAF50;
    transition: background 0.3s ease;
}

.resource-item:hover {
    background: rgba(76, 175, 80, 0.12);
}

.resource-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.resource-header h4 {
    color: #ffffff;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    flex: 1;
}

.resource-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    background: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 18px;
    font-size: 0.85rem;
    font-weight: 500;
    transition: background 0.3s ease;
}

.resource-link:hover {
    background: #45a049;
}

.resource-description {
    color: #e0e0e0;
    line-height: 1.5;
}

/* Production Items */
.production-item {
    margin-bottom: 1.5rem;
    padding: 1.2rem;
    background: rgba(156, 39, 176, 0.08);
    border-radius: 8px;
    border-left: 4px solid #9c27b0;
    transition: background 0.3s ease;
}

.production-item:hover {
    background: rgba(156, 39, 176, 0.12);
}

.production-item h4 {
    color: #ffffff;
    margin-bottom: 0.8rem;
    font-size: 1rem;
    font-weight: 600;
}

.production-description {
    color: #e0e0e0;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.production-tools h5 {
    color: #9c27b0;
    margin-bottom: 0.8rem;
    font-size: 0.95rem;
    font-weight: 600;
}

.tools-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tool-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    background: #9c27b0;
    color: white;
    text-decoration: none;
    border-radius: 18px;
    font-size: 0.8rem;
    font-weight: 500;
    transition: background 0.3s ease;
}

.tool-link:hover {
    background: #8e24aa;
}

/* Evaluation Items */
.evaluation-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.evaluation-item {
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    padding: 1rem;
    background: rgba(255, 193, 7, 0.08);
    border-radius: 8px;
    border-left: 4px solid #ffc107;
    transition: background 0.3s ease;
}

.evaluation-item:hover {
    background: rgba(255, 193, 7, 0.12);
}

.evaluation-text {
    color: #e0e0e0;
    line-height: 1.5;
    flex: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {

    .digital-header,
    .digital-content,
    .resource-item,
    .production-item {
        padding: 1rem;
    }

    .resource-header {
        flex-direction: column;
        align-items: stretch;
    }

    .resource-link,
    .tool-link {
        align-self: flex-start;
    }

    .evaluation-item {
        flex-direction: column;
        gap: 0.5rem;
    }
}

/* Communication Skills Interactive Styles */
.skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(23, 181, 181, 0.08), rgba(23, 181, 181, 0.03));
    border-radius: 12px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid rgba(23, 181, 181, 0.1);
    margin-bottom: 1rem;
    position: relative;
    overflow: hidden;
}

.skill-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transition: left 0.6s;
}

.skill-header:hover::before {
    left: 100%;
}

.skill-header:hover {
    background: linear-gradient(135deg, rgba(23, 181, 181, 0.15), rgba(23, 181, 181, 0.08));
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(23, 181, 181, 0.2);
    border-color: rgba(23, 181, 181, 0.3);
}

.skill-header.expanded {
    background: linear-gradient(135deg, rgba(23, 181, 181, 0.2), rgba(23, 181, 181, 0.1));
    border-color: rgba(23, 181, 181, 0.4);
    box-shadow: 0 5px 20px rgba(23, 181, 181, 0.25);
}

.skill-header h3 {
    margin: 0;
    color: #17b5b5;
    font-size: 1.3rem;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.skill-toggle-icon {
    color: #17b5b5;
    font-size: 1.4rem;
    font-weight: bold;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(23, 181, 181, 0.1);
}

.skill-header.expanded .skill-toggle-icon {
    transform: rotate(90deg);
    background: rgba(23, 181, 181, 0.2);
}

.skill-content {
    padding: 1.5rem;
    background: rgba(30, 30, 30, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    margin-bottom: 1rem;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-15px);
        max-height: 0;
    }

    to {
        opacity: 1;
        transform: translateY(0);
        max-height: 2000px;
    }
}

.skill-item {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    border-left: 4px solid #17b5b5;
    transition: all 0.3s ease;
}

.skill-item:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateX(5px);
}

.skill-item:last-child {
    margin-bottom: 0;
}

.skill-item h4 {
    color: #ffffff;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
}

.skill-examples {
    margin-top: 1.5rem;
}

.example-item {
    margin-bottom: 1.5rem;
    padding: 1.2rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
}

.example-item:last-child {
    margin-bottom: 0;
}

/* Different styles for different example types */
.formal-example {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.08), rgba(76, 175, 80, 0.03));
    border-left: 4px solid #4CAF50;
}

.informal-example {
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.08), rgba(156, 39, 176, 0.03));
    border-left: 4px solid #9c27b0;
}

.paragraph-example,
.metaphor-example {
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.08), rgba(255, 193, 7, 0.03));
    border-left: 4px solid #ffc107;
}

.activity-example {
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.08), rgba(33, 150, 243, 0.03));
    border-left: 4px solid #2196F3;
}

.sample-example,
.skills-example {
    background: linear-gradient(135deg, rgba(255, 87, 34, 0.08), rgba(255, 87, 34, 0.03));
    border-left: 4px solid #FF5722;
}

.example-item h5 {
    color: #17b5b5;
    margin-bottom: 0.8rem;
    font-size: 1rem;
    font-weight: 600;
}

.example-content {
    color: #e0e0e0;
    line-height: 1.6;
}

/* Letter format styling */
.letter-format {
    background: rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    white-space: pre-wrap;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.9rem;
    line-height: 1.5;
    overflow-x: auto;
}

/* Hover effects for example items */
.example-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.formal-example:hover {
    box-shadow: 0 5px 15px rgba(76, 175, 80, 0.2);
}

.informal-example:hover {
    box-shadow: 0 5px 15px rgba(156, 39, 176, 0.2);
}

.paragraph-example:hover,
.metaphor-example:hover {
    box-shadow: 0 5px 15px rgba(255, 193, 7, 0.2);
}

.activity-example:hover {
    box-shadow: 0 5px 15px rgba(33, 150, 243, 0.2);
}

.sample-example:hover,
.skills-example:hover {
    box-shadow: 0 5px 15px rgba(255, 87, 34, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .skill-header {
        padding: 1rem;
    }

    .skill-content {
        padding: 1rem;
    }

    .skill-item {
        padding: 1rem;
    }

    .example-item {
        padding: 1rem;
    }

    .letter-format {
        font-size: 0.8rem;
        padding: 1rem;
    }
}

/* Cultural Context Images Styles */
.text-images {
    margin-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 15px;
}

.text-images h5 {
    color: #17b5b5;
    margin-bottom: 15px;
    font-size: 1rem;
    font-weight: 600;
}

.images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    margin-top: 10px;
}

.image-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(23, 181, 181, 0.2);
}

.cultural-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
}

.image-item:hover .cultural-image {
    transform: scale(1.05);
}

.image-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
    padding: 10px;
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .images-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
    }

    .cultural-image {
        height: 150px;
    }
}

.device-term-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 1rem;
    background-color: rgba(23, 181, 181, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid rgba(23, 181, 181, 0.1);
    margin-bottom: 0.5rem;
}

.device-term-header:hover {
    background-color: rgba(23, 181, 181, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(23, 181, 181, 0.15);
}

.device-term-header.expanded {
    background-color: rgba(23, 181, 181, 0.15);
    border-color: rgba(23, 181, 181, 0.3);
}

.device-term-header h4 {
    margin: 0;
    color: #17b5b5;
    font-size: 1.1rem;
    font-weight: 600;
}

.device-toggle-icon {
    color: #17b5b5;
    font-size: 1.2rem;
    font-weight: bold;
    transition: transform 0.3s ease;
    user-select: none;
}

.device-term-header.expanded .device-toggle-icon {
    transform: rotate(90deg);
}

.device-details {
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.device-definition {
    margin-bottom: 12px;
    line-height: 1.6;
    color: #ffffff;
}

.device-effect {
    margin-bottom: 10px;
    color: #ffffff;
}

.device-example {
    margin-bottom: 10px;
    color: #ffffff;
}

.device-etymology {
    margin-bottom: 10px;
    color: #ffffff;
    font-size: 0.95em;
}

.device-usage {
    color: #ffffff;
    font-size: 0.95em;
}

/* Common Misconceptions Interactive Styles */
.misconception-term-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 1rem;
    background-color: rgba(23, 181, 181, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid rgba(23, 181, 181, 0.1);
    margin-bottom: 0.5rem;
}

.misconception-term-header:hover {
    background-color: rgba(23, 181, 181, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(23, 181, 181, 0.15);
}

.misconception-term-header.expanded {
    background-color: rgba(23, 181, 181, 0.15);
    border-color: rgba(23, 181, 181, 0.3);
}

.misconception-term-header h4 {
    margin: 0;
    color: #17b5b5;
    font-size: 1.1rem;
    font-weight: 600;
}

.misconception-toggle-icon {
    color: #17b5b5;
    font-size: 1.2rem;
    font-weight: bold;
    transition: transform 0.3s ease;
    user-select: none;
}

.misconception-term-header.expanded .misconception-toggle-icon {
    transform: rotate(90deg);
}

.misconception-details {
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    animation: slideDown 0.3s ease;
}

.correction-content {
    color: #ffffff;
}

.correction-title {
    color: #17b5b5;
    margin-bottom: 8px;
}


/* Dark Theme for English Content Page */
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

.focus-tag {
    background-color: rgba(156, 39, 176, 0.2);
    color: #9c27b0;
}

.genre-tag {
    background-color: rgba(255, 193, 7, 0.2);
    color: #ffc107;
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
    gap: 1.5rem;
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
    font-size: 0.9rem;
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

.language-approach {
    margin-top: 1rem;
}

.cultural-literacy {
    font-size: 0.85rem;
    color: #b0b0b0;
    line-height: 1.4;
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
.content-block {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
}

/* Container classes for vertical stacking */
.concepts-container,
.excerpts-container,
.visual-container,
.activities-container,
.exercises-container,
.vocabulary-container,
.devices-container,
.misconceptions-container,
.assessments-container,
.applications-container,
.texts-container,
.skills-container,
.portfolio-container,
.digital-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* Individual item classes */
.concept-item,
.excerpt-item,
.visual-item,
.activity-item,
.exercise-item,
.device-item,
.misconception-item,
.assessment-item,
.application-item,
.text-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    line-height: 1.6;
}

/* Updated vocabulary item styles for clickable functionality */
.vocabulary-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    border-bottom: none;
    padding-bottom: 0;
}

.concept-item:last-child,
.excerpt-item:last-child,
.visual-item:last-child,
.activity-item:last-child,
.exercise-item:last-child,
.device-item:last-child,
.misconception-item:last-child,
.assessment-item:last-child,
.application-item:last-child,
.text-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

/* Key Vocabulary Interactive Styles */
.vocabulary-term-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 1rem;
    background-color: rgba(23, 181, 181, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid rgba(23, 181, 181, 0.1);
    margin-bottom: 0.5rem;
}

.vocabulary-term-header:hover {
    background-color: rgba(23, 181, 181, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(23, 181, 181, 0.15);
}

.vocabulary-term-header.expanded {
    background-color: rgba(23, 181, 181, 0.15);
    border-color: rgba(23, 181, 181, 0.3);
}

.vocabulary-term-header h4 {
    margin: 0;
    color: #17b5b5;
    font-size: 1.1rem;
    font-weight: 600;
}

.vocabulary-toggle-icon {
    color: #17b5b5;
    font-size: 1.2rem;
    font-weight: bold;
    transition: transform 0.3s ease;
    user-select: none;
}

.vocabulary-term-header.expanded .vocabulary-toggle-icon {
    transform: rotate(90deg);
}

.vocabulary-details {
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Text Excerpts */
.excerpt-content blockquote {
    background-color: rgba(23, 181, 181, 0.08);
    border-left: 4px solid #17b5b5;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
    font-style: italic;
}

.excerpt-content cite {
    display: block;
    text-align: right;
    margin-top: 0.5rem;
    color: #b0b0b0;
    font-size: 0.9rem;
}

.analysis-prompts {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.analysis-prompts h5 {
    color: #17b5b5;
    margin-bottom: 0.5rem;
}

.analysis-prompts ul {
    list-style-type: none;
    padding-left: 0;
}

.analysis-prompts li {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
    border-left: 3px solid #17b5b5;
}

/* Visual Elements */
.interactivity-hint {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: rgba(156, 39, 176, 0.1);
    border-radius: 5px;
    font-size: 0.9rem;
    color: #b0b0b0;
}

/* Activities */
.activity-type {
    font-size: 0.8rem;
    background-color: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    padding: 2px 8px;
    border-radius: 10px;
    margin-left: 10px;
    font-weight: normal;
}

/* Exercises */
.exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.exercise-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.difficulty-badge,
.skill-badge {
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
}

.difficulty-basic {
    background-color: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
}

.difficulty-intermediate {
    background-color: rgba(255, 193, 7, 0.2);
    color: #ffc107;
}

.difficulty-advanced {
    background-color: rgba(244, 67, 54, 0.2);
    color: #f44336;
}

.skill-badge {
    background-color: rgba(156, 39, 176, 0.2);
    color: #9c27b0;
}

.exercise-assessment {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    font-size: 0.9rem;
}

/* Oral Activities */
.oral-activity-content {
    background-color: rgba(23, 181, 181, 0.05);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(23, 181, 181, 0.2);
}

.preparation-steps,
.listening-prompts {
    margin-top: 1rem;
}

.preparation-steps h5,
.listening-prompts h5 {
    color: #17b5b5;
    margin-bottom: 0.5rem;
}

.preparation-steps ul,
.listening-prompts ul {
    list-style-type: none;
    padding-left: 0;
}

.preparation-steps li,
.listening-prompts li {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
    position: relative;
    padding-left: 2rem;
}

.preparation-steps li:before,
.listening-prompts li:before {
    content: "→";
    color: #17b5b5;
    position: absolute;
    left: 0.5rem;
    font-weight: bold;
}

/* Creativity Corner */
.creativity-corner {
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05));
    border-radius: 15px;
    padding: 2rem;
    border: 2px solid rgba(156, 39, 176, 0.2);
}

.creativity-content h3 {
    color: #9c27b0;
}

.creativity-guidelines,
.creativity-exemplars {
    margin-top: 1rem;
}

.creativity-guidelines h5,
.creativity-exemplars h5 {
    color: #9c27b0;
    margin-bottom: 0.5rem;
}

/* Multilingual Connections */
.multilingual-content {
    background-color: rgba(255, 193, 7, 0.05);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 193, 7, 0.2);
}

.translations h5,
.etymology h5 {
    color: #ffc107;
}

.cultural-context h5 {
    color: #ffc107;
    margin-bottom: 0.5rem;
}

/* Vocabulary and Literary Devices */
.vocabulary-etymology,
.vocabulary-usage,
.device-effect,
.device-example {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 5px;
    font-size: 0.9rem;
}

.vocabulary-usage {
    font-style: italic;
}

/* Assessment Ideas */
.assessment-question,
.assessment-answer {
    margin: 0.5rem 0;
}

.assessment-rubric {
    margin-top: 1rem;
}

.assessment-rubric h5 {
    color: #17b5b5;
}

.assessment-rubric ul {
    list-style-type: none;
    padding-left: 0;
}

.assessment-rubric li {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
    border-left: 3px solid #17b5b5;
}

/* Differentiation Tips */
.differentiation-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.support-strategies,
.extension-strategies {
    padding: 1rem;
    border-radius: 10px;
}

.support-strategies {
    background-color: rgba(76, 175, 80, 0.05);
    border: 1px solid rgba(76, 175, 80, 0.2);
}

.support-strategies h4 {
    color: #4CAF50;
}

.extension-strategies {
    background-color: rgba(244, 67, 54, 0.05);
    border: 1px solid rgba(244, 67, 54, 0.2);
}

.extension-strategies h4 {
    color: #f44336;
}

/* Traditions and Cultural Elements */
.traditions-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.literary-forms,
.cultural-references {
    padding: 1rem;
    background-color: rgba(255, 193, 7, 0.05);
    border-radius: 8px;
    border-left: 4px solid #ffc107;
}

.literary-forms h4,
.cultural-references h4 {
    color: #ffc107;
    margin-bottom: 0.5rem;
}

/* Text content styling */
.concept-description,
.vocabulary-definition,
.device-definition,
.application-description,
.activity-description,
.exercise-prompt,
.creativity-prompt,
.section-summary,
.representation-content,
.growth-content {
    display: block;
    width: 100%;
    line-height: 1.6;
    margin-bottom: 10px;
    color: #e0e0e0;
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

.misconception-title {
    color: #f44336;
}

.correction-title {
    color: #4CAF50;
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

/* Lists styling */
ul {
    list-style-type: none;
    padding-left: 0;
}

li {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
    border-left: 3px solid #17b5b5;
    line-height: 1.4;
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

    .exercise-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .differentiation-content {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .content-page {
        padding: 20px 10px;
    }
}
</style>