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
                <router-link :to="`/class/${classNum}/subject/science`">Science</router-link> /
                <span>{{ chapterTitle }}</span>
            </div>
        </nav>

        <!-- Chapter Header -->
        <header>
            <h1>{{ chapterTitle.toUpperCase() }}</h1>
            <div class="chapter-meta">
                <span class="subject-tag">{{ chapterData.chapterMetadata?.subject || 'Science' }}</span>
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
                <button @click="activeSection = 'activities'" :class="{ active: activeSection === 'activities' }"
                    class="nav-item">
                    Laboratory Activities
                </button>
                <button @click="activeSection = 'resources'" :class="{ active: activeSection === 'resources' }"
                    class="nav-item">
                    Teaching Resources
                </button>
                <button @click="activeSection = 'applications'" :class="{ active: activeSection === 'applications' }"
                    class="nav-item">
                    Real-world Applications
                </button>
                <button @click="activeSection = 'heritage'" :class="{ active: activeSection === 'heritage' }"
                    class="nav-item">
                    Scientific Heritage
                </button>
                <button @click="activeSection = 'visual'" :class="{ active: activeSection === 'visual' }"
                    class="nav-item">
                    Visual Resources
                </button>
                <button @click="activeSection = 'exercises'" :class="{ active: activeSection === 'exercises' }"
                    class="nav-item">
                    Practice Problems
                </button>
                <button @click="activeSection = 'personalities'" :class="{ active: activeSection === 'personalities' }"
                    class="nav-item">
                    Talk to Scientist
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
                    <h4>Chapter Topics</h4>
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
                            :text="'This chapter explores ' + chapterData.chapterMetadata.title + ' in Science for Class ' + chapterData.chapterMetadata.grade + ', focusing on fundamental chemical processes and their applications.'">
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

                    <div v-if="chapterData.chapterMetadata.ncertScientificProcess" class="scientific-process">
                        <h5>Scientific Process Skills</h5>
                        <div class="process-item"
                            v-if="chapterData.chapterMetadata.ncertScientificProcess.problemSolving">
                            <strong>Problem Solving:</strong> {{
                                chapterData.chapterMetadata.ncertScientificProcess.problemSolving }}
                        </div>
                        <div class="process-item"
                            v-if="chapterData.chapterMetadata.ncertScientificProcess.progressiveApproach">
                            <strong>Progressive Approach:</strong> {{
                                chapterData.chapterMetadata.ncertScientificProcess.progressiveApproach }}
                        </div>
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

                                    <div v-if="concept.notation" class="concept-notation">
                                        <h5>Notation:</h5>
                                        <div class="notation-text">
                                            <TypewriterText :text="concept.notation"></TypewriterText>
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

                                    <!-- Special handling for balancing steps -->
                                    <div v-if="concept.balancingSteps" class="balancing-steps">
                                        <h5>{{ concept.balancingSteps.method }}</h5>
                                        <div class="steps-container">
                                            <div v-for="(step, sIndex) in concept.balancingSteps.steps" :key="sIndex"
                                                class="step-item">
                                                <h6>Step {{ step.stepNumber }}: {{ step.title }}</h6>
                                                <TypewriterText :text="step.description"></TypewriterText>
                                                <div v-if="step.example" class="step-example">
                                                    <strong>Example:</strong> {{ step.example }}
                                                </div>
                                                <div v-if="step.note" class="step-note">
                                                    <strong>Note:</strong> {{ step.note }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Scientific Laws/Theorems -->
                        <div v-if="section.theorems && section.theorems.length > 0" class="content-block theorems">
                            <h3>Scientific Laws & Principles</h3>
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
                                        <h5>Evidence/Demonstration:</h5>
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
                                        <TypewriterText :text="'Application: ' + example.context"></TypewriterText>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Visual Elements -->
                        <div v-if="section.visualElements && section.visualElements.length > 0"
                            class="content-block visual-elements">
                            <h3>Laboratory Activities & Demonstrations</h3>
                            <div class="visual-elements-container">
                                <div v-for="(element, vIndex) in section.visualElements" :key="vIndex"
                                    class="visual-element-item">
                                    <div class="visual-type">{{ element.type }}</div>
                                    <div class="visual-description">
                                        <TypewriterText :text="element.description"></TypewriterText>
                                    </div>
                                    <div v-if="element.interactivityHint" class="interaction-hint">
                                        <strong>Activity Hint:</strong> {{ element.interactivityHint }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Laboratory Activities Section -->
                <div v-show="activeSection === 'activities'" class="content-section">
                    <h2>Laboratory Activities & Experiments</h2>
                    <div class="activities-container">
                        <!-- Display dedicated laboratory activities if they exist -->
                        <div v-if="chapterData.laboratoryActivities && chapterData.laboratoryActivities.length > 0"
                            class="content-block dedicated-activities">
                            <h3>Hands-on Laboratory Experiments</h3>
                            <div v-for="(activity, aIndex) in chapterData.laboratoryActivities" :key="'lab-' + aIndex"
                                class="activity-item">
                                <h4>Activity {{ aIndex + 1 }}: {{ activity.title || activity.name }}</h4>

                                <div v-if="activity.objective" class="activity-objective">
                                    <h5>Objective:</h5>
                                    <TypewriterText :text="activity.objective"></TypewriterText>
                                </div>

                                <div v-if="activity.materials && activity.materials.length > 0"
                                    class="activity-materials">
                                    <h5>Materials Required:</h5>
                                    <ul>
                                        <li v-for="(material, mIndex) in activity.materials" :key="mIndex">
                                            {{ material }}
                                        </li>
                                    </ul>
                                </div>

                                <div v-if="activity.procedure && activity.procedure.length > 0"
                                    class="activity-procedure">
                                    <h5>Procedure:</h5>
                                    <ol>
                                        <li v-for="(step, sIndex) in activity.procedure" :key="sIndex">
                                            <TypewriterText :text="step"></TypewriterText>
                                        </li>
                                    </ol>
                                </div>

                                <div v-if="activity.observation" class="activity-observation">
                                    <h5>Observation:</h5>
                                    <TypewriterText :text="activity.observation"></TypewriterText>
                                </div>

                                <div v-if="activity.result" class="activity-result">
                                    <h5>Result:</h5>
                                    <TypewriterText :text="activity.result"></TypewriterText>
                                </div>

                                <div v-if="activity.conclusion" class="activity-conclusion">
                                    <h5>Conclusion:</h5>
                                    <TypewriterText :text="activity.conclusion"></TypewriterText>
                                </div>

                                <div v-if="activity.safetyPrecautions && activity.safetyPrecautions.length > 0"
                                    class="safety-precautions">
                                    <h5>Safety Precautions:</h5>
                                    <ul>
                                        <li v-for="(precaution, pIndex) in activity.safetyPrecautions" :key="pIndex">
                                            {{ precaution }}
                                        </li>
                                    </ul>
                                </div>

                                <div v-if="activity.questions && activity.questions.length > 0"
                                    class="activity-questions">
                                    <h5>Questions for Analysis:</h5>
                                    <ol>
                                        <li v-for="(question, qIndex) in activity.questions" :key="qIndex">
                                            {{ question }}
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <!-- Display section-based visual elements/activities -->
                        <div v-for="(section, index) in chapterData.sections" :key="'activity-section-' + index">
                            <div v-if="section.visualElements && section.visualElements.length > 0"
                                class="content-block section-activities">
                                <h3>{{ section.title }} - Demonstrations & Activities</h3>
                                <div v-for="(element, vIndex) in section.visualElements" :key="vIndex"
                                    class="activity-item">
                                    <h4>{{ element.type }}</h4>
                                    <div class="activity-description">
                                        <TypewriterText :text="element.description"></TypewriterText>
                                    </div>
                                    <div v-if="element.interactivityHint" class="activity-instructions">
                                        <h5>Instructions:</h5>
                                        <TypewriterText :text="element.interactivityHint"></TypewriterText>
                                    </div>
                                    <div v-if="element.materials" class="activity-materials">
                                        <h5>Materials:</h5>
                                        <TypewriterText :text="element.materials"></TypewriterText>
                                    </div>
                                    <div v-if="element.procedure" class="activity-procedure">
                                        <h5>Procedure:</h5>
                                        <TypewriterText :text="element.procedure"></TypewriterText>
                                    </div>
                                    <div v-if="element.expectedOutcome" class="expected-outcome">
                                        <h5>Expected Outcome:</h5>
                                        <TypewriterText :text="element.expectedOutcome"></TypewriterText>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Display experiments if they exist as a separate section -->
                        <div v-if="chapterData.experiments && chapterData.experiments.length > 0"
                            class="content-block experiments-section">
                            <h3>Scientific Experiments</h3>
                            <div v-for="(experiment, eIndex) in chapterData.experiments" :key="'exp-' + eIndex"
                                class="activity-item experiment-item">
                                <h4>Experiment {{ eIndex + 1 }}: {{ experiment.title || experiment.name }}</h4>

                                <div v-if="experiment.hypothesis" class="experiment-hypothesis">
                                    <h5>Hypothesis:</h5>
                                    <TypewriterText :text="experiment.hypothesis"></TypewriterText>
                                </div>

                                <div v-if="experiment.variables" class="experiment-variables">
                                    <h5>Variables:</h5>
                                    <div v-if="experiment.variables.independent" class="variable-item">
                                        <strong>Independent Variable:</strong> {{ experiment.variables.independent }}
                                    </div>
                                    <div v-if="experiment.variables.dependent" class="variable-item">
                                        <strong>Dependent Variable:</strong> {{ experiment.variables.dependent }}
                                    </div>
                                    <div v-if="experiment.variables.controlled" class="variable-item">
                                        <strong>Controlled Variables:</strong> {{ experiment.variables.controlled }}
                                    </div>
                                </div>

                                <!-- Include all the same fields as laboratory activities -->
                                <div v-if="experiment.materials && experiment.materials.length > 0"
                                    class="activity-materials">
                                    <h5>Materials Required:</h5>
                                    <ul>
                                        <li v-for="(material, mIndex) in experiment.materials" :key="mIndex">
                                            {{ material }}
                                        </li>
                                    </ul>
                                </div>

                                <div v-if="experiment.procedure && experiment.procedure.length > 0"
                                    class="activity-procedure">
                                    <h5>Procedure:</h5>
                                    <ol>
                                        <li v-for="(step, sIndex) in experiment.procedure" :key="sIndex">
                                            <TypewriterText :text="step"></TypewriterText>
                                        </li>
                                    </ol>
                                </div>

                                <div v-if="experiment.dataCollection" class="data-collection">
                                    <h5>Data Collection:</h5>
                                    <TypewriterText :text="experiment.dataCollection"></TypewriterText>
                                </div>

                                <div v-if="experiment.analysis" class="experiment-analysis">
                                    <h5>Analysis:</h5>
                                    <TypewriterText :text="experiment.analysis"></TypewriterText>
                                </div>

                                <div v-if="experiment.conclusion" class="activity-conclusion">
                                    <h5>Conclusion:</h5>
                                    <TypewriterText :text="experiment.conclusion"></TypewriterText>
                                </div>
                            </div>
                        </div>

                        <!-- Fallback message if no activities are found -->
                        <div v-if="!hasAnyActivities" class="content-block no-activities">
                            <h3>No Laboratory Activities Found</h3>
                            <p>Laboratory activities for this chapter are not currently available in the data structure.
                                Please check the JSON file structure or add activities under 'laboratoryActivities',
                                'experiments', or 'visualElements' in the section data.</p>
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
                            <h3>Scientific Vocabulary</h3>
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
                            <h3>Common Student Misconceptions</h3>
                            <div class="misconceptions-container">
                                <div v-for="(misconception, mIndex) in chapterData.teachingResources.commonMisconceptions"
                                    :key="mIndex" class="misconception-item">
                                    <div class="misconception-content">
                                        <h4 class="misconception-title">Misconception:</h4>
                                        <TypewriterText :text="misconception.misconception"></TypewriterText>
                                    </div>
                                    <div class="correction-content">
                                        <h4 class="correction-title">Scientific Explanation:</h4>
                                        <TypewriterText :text="misconception.correction"></TypewriterText>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Assessment Ideas -->
                        <div v-if="chapterData.teachingResources.assessmentIdeas && chapterData.teachingResources.assessmentIdeas.length > 0"
                            class="content-block assessment-ideas">
                            <h3>Assessment Questions</h3>
                            <div class="assessment-container">
                                <div v-for="(assessment, aIndex) in chapterData.teachingResources.assessmentIdeas"
                                    :key="aIndex" class="assessment-item">
                                    <div class="question-type">{{ assessment.questionType }}</div>
                                    <div class="question-content">
                                        <strong>Question:</strong> {{ assessment.question }}
                                    </div>
                                    <div class="answer-content">
                                        <strong>Answer:</strong> {{ assessment.answer }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Differentiation Tips -->
                        <div v-if="chapterData.teachingResources.differentiationTips"
                            class="content-block differentiation">
                            <h3>Teaching Strategies</h3>
                            <div v-if="chapterData.teachingResources.differentiationTips.support"
                                class="support-strategies">
                                <h4>Support Strategies</h4>
                                <ul>
                                    <li v-for="(tip, tIndex) in chapterData.teachingResources.differentiationTips.support"
                                        :key="tIndex">
                                        {{ tip }}
                                    </li>
                                </ul>
                            </div>
                            <div v-if="chapterData.teachingResources.differentiationTips.extension"
                                class="extension-strategies">
                                <h4>Extension Activities</h4>
                                <ul>
                                    <li v-for="(tip, tIndex) in chapterData.teachingResources.differentiationTips.extension"
                                        :key="tIndex">
                                        {{ tip }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Real-world Applications Section -->
                <div v-show="activeSection === 'applications'" class="content-section">
                    <h2>Real-world Applications</h2>
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

                <!-- Scientific Heritage Section -->
                <div v-show="activeSection === 'heritage'" class="content-section">
                    <h2>Scientific Heritage</h2>
                    <div v-if="chapterData.scientificHeritage">
                        <div v-if="chapterData.scientificHeritage.historicalContext"
                            class="content-block historical-context">
                            <h3>Historical Development</h3>
                            <TypewriterText :text="chapterData.scientificHeritage.historicalContext"></TypewriterText>
                        </div>
                        <div v-if="chapterData.scientificHeritage.indianContributions && chapterData.scientificHeritage.indianContributions.length > 0"
                            class="content-block indian-contributions">
                            <h3>Indian Scientific Contributions</h3>
                            <div class="contributions-list">
                                <div v-for="(contribution, cIndex) in chapterData.scientificHeritage.indianContributions"
                                    :key="cIndex" class="contribution-item">
                                    <TypewriterText :text="contribution"></TypewriterText>
                                </div>
                            </div>
                        </div>
                        <div v-if="chapterData.scientificHeritage.culturalSignificance"
                            class="content-block cultural-significance">
                            <h3>Cultural & Societal Impact</h3>
                            <TypewriterText :text="chapterData.scientificHeritage.culturalSignificance">
                            </TypewriterText>
                        </div>
                    </div>
                </div>

                <!-- Visual Learning Resources Section -->
                <div v-show="activeSection === 'visual'" class="content-section">
                    <h2>Visual Learning Resources</h2>
                    <div class="content-block">
                        <GoogleSearchResults :initialQuery="chapterTitle + ' Science Chemistry'"
                            :searchContext="'Science Chemistry'" :apiKey="googleApiKey"
                            :searchEngineId="googleSearchEngineId" />
                    </div>
                </div>

                <!-- Practice Problems Section -->
                <div v-show="activeSection === 'exercises'" class="content-section">
                    <h2>Practice Problems</h2>
                    <div v-for="(section, index) in chapterData.sections" :key="'exercise-' + index"
                        class="content-block">
                        <h3>{{ section.title }} - Problems</h3>
                        <div v-if="section.exercises && section.exercises.length > 0" class="exercises-container">
                            <div v-for="(exercise, eIndex) in section.exercises" :key="eIndex" class="exercise-item">
                                <div class="exercise-type">{{ exercise.type }} - {{ exercise.difficulty }}</div>
                                <div class="exercise-problem">
                                    <strong>Problem:</strong> {{ exercise.problem }}
                                </div>
                                <div class="exercise-skill">
                                    <strong>Skill Targeted:</strong> {{ exercise.skillTargeted }}
                                </div>
                            </div>
                        </div>
                        <AIExercises :sectionData="section" :chapterMetadata="chapterData.chapterMetadata" />
                    </div>
                </div>

                <!-- Talk to Scientist Section -->
                <div v-show="activeSection === 'personalities'" class="content-section">
                    <div class="section-header-with-actions">
                        <h2>Talk to Scientist</h2>
                        <button @click="openPersonalitiesModal" class="enlarge-button">
                            <span class="enlarge-icon">⛶</span>
                            Open Fullscreen
                        </button>
                    </div>

                    <!-- Scientist list (names only) -->
                    <div v-if="!selectedPersonality">
                        <ul class="personality-list">
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
            </main>
        </div>

        <!-- Fullscreen Modal for Talk to Scientist -->
        <div v-if="showPersonalitiesModal" class="fullscreen-modal" @click="closePersonalitiesModal">
            <div class="modal-content" @click.stop>
                <!-- Modal Header -->
                <div class="modal-header">
                    <h2>Talk to Scientist</h2>
                    <button @click="closePersonalitiesModal" class="close-button">
                        <span>&times;</span>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body">
                    <!-- Scientist list (names only) -->
                    <div v-if="!modalSelectedPersonality">
                        <ul class="personality-list modal-list">
                            <li v-for="personality in chapterData.personalities" :key="personality.id"
                                @click="selectModalPersonality(personality)" class="personality-name modal-personality">
                                {{ personality.name }}
                            </li>
                        </ul>
                    </div>

                    <!-- Chat view -->
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
import AIExercises from '../../components/AIExercises.vue'
import PersonalityChat from '../../components/PersonalityChat.vue'

export default {
    name: 'ScienceContentPage',
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
            modalSelectedPersonality: null,
            userMessage: '',
            chatHistory: [],
            activeSection: 'overview',
            activeTopicIndex: 0,
            showPersonalitiesModal: false,
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
        },
        hasAnyActivities() {
            const hasLabActivities = this.chapterData.laboratoryActivities && this.chapterData.laboratoryActivities.length > 0;
            const hasExperiments = this.chapterData.experiments && this.chapterData.experiments.length > 0;
            const hasVisualElements = this.chapterData.sections && this.chapterData.sections.some(section =>
                section.visualElements && section.visualElements.length > 0
            );

            return hasLabActivities || hasExperiments || hasVisualElements;
        }

    },
    mounted() {
        this.fetchChapterData();
    },
    methods: {
        // Load the chapter JSON from /public/data/classX/science/chapterId.json
        async fetchChapterData() {
            this.isLoading = true;
            this.error = null;

            try {
                const chapterId = this.chapterId || 'chapter1';
                const subjectFolder = 'science';

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
                const subjectFolder = 'science';
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

        // Select a personality from list
        selectPersonality(personality) {
            if (!personality) return;
            this.selectedPersonality = personality;
            // Reset chat UI for new selection
            this.chatHistory = [];
            this.userMessage = '';
            console.log('Selected personality:', personality.name);
        },

        // Select a personality from modal list
        selectModalPersonality(personality) {
            if (!personality) return;
            this.modalSelectedPersonality = personality;
            console.log('Selected modal personality:', personality.name);
        },

        // Open fullscreen modal
        openPersonalitiesModal() {
            this.showPersonalitiesModal = true;
            this.modalSelectedPersonality = null;
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        },

        // Close fullscreen modal
        closePersonalitiesModal() {
            this.showPersonalitiesModal = false;
            this.modalSelectedPersonality = null;
            // Restore body scrolling
            document.body.style.overflow = 'auto';
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
                this.chatHistory.push({ sender: 'bot', text: 'This is not related to the scientific context of this chapter.' });
            }

            // Clear user input
            this.userMessage = '';
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

/* Section Header with Actions */
.section-header-with-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.enlarge-button {
    background: linear-gradient(135deg, #17b5b5, #1ec7c7);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 15px rgba(23, 181, 181, 0.3);
}

.enlarge-button:hover {
    background: linear-gradient(135deg, #1ec7c7, #17b5b5);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(23, 181, 181, 0.4);
}

.enlarge-icon {
    font-size: 1.1rem;
}

/* Personality List */
.personality-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
}

.personality-name {
    background: rgba(30, 30, 30, 0.8);
    border: 1px solid #2c2c2c;
    border-radius: 10px;
    padding: 1rem 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #e0e0e0;
    font-weight: 500;
    text-align: center;
}

.personality-name:hover {
    background: rgba(23, 181, 181, 0.1);
    border-color: #17b5b5;
    color: #17b5b5;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(23, 181, 181, 0.2);
}

/* Fullscreen Modal */
.fullscreen-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    z-index: 9999;
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
    background: #121212;
    border: 1px solid #2c2c2c;
    border-radius: 15px;
    width: 95vw;
    height: 90vh;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #2c2c2c;
    background: rgba(30, 30, 30, 0.95);
    border-radius: 15px 15px 0 0;
}

.modal-header h2 {
    color: #17b5b5;
    margin: 0;
    font-size: 1.8rem;
}

.close-button {
    background: none;
    border: none;
    color: #b0b0b0;
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.close-button:hover {
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
}

.modal-body {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    background: #121212;
    border-radius: 0 0 15px 15px;
}

.modal-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.modal-personality {
    background: rgba(30, 30, 30, 0.9);
    padding: 1.5rem 2rem;
    font-size: 1.1rem;
}

.modal-chat-container {
    height: 100%;
    display: flex;
    flex-direction: column;
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

    .section-header-with-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .section-header-with-actions h2 {
        margin-bottom: 0;
    }

    .modal-content {
        width: 100vw;
        height: 100vh;
        border-radius: 0;
    }

    .modal-header {
        border-radius: 0;
    }

    .modal-body {
        padding: 1rem;
        border-radius: 0;
    }

    .modal-list {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}
</style>