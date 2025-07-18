<!-- src/views/TextbooksPage.vue -->
<template>
  <div class="textbooks-page">
    <nav class="navbar">
      <router-link to="/" class="nav-logo">
        <IvisLabsLogo />
      </router-link>
      <div class="nav-pulse">PULSE</div>
      <div class="breadcrumbs">
        <router-link to="/cbse">CBSE</router-link> /
        <router-link :to="`/class/${classNum}/subjects`">Class {{ classNum }}</router-link> /
        <span>{{ subject }}</span>
      </div>
    </nav>

    <header>
      <h1>{{ subject.toUpperCase() }} - Class {{ classNum }}</h1>
      <p>Explore textbooks and chapters</p>
    </header>

    <div class="textbooks-container">
      <div v-for="(textbook, index) in textbooks" :key="index" class="textbook-card">
        <div class="textbook-header">
          <h2>{{ textbook.title }}</h2>
          <p class="publisher">{{ textbook.publisher }}</p>
        </div>

        <div class="chapters-list">
          <h3>Chapters</h3>
          <div class="chapter-card" v-for="(chapter, chapterIndex) in textbook.chapters" :key="chapterIndex"
            @click="openChapter(textbook, chapter)">
            <div class="chapter-number">{{ chapter.number }}</div>
            <div class="chapter-details">
              <h4>{{ chapter.title }}</h4>
              <p>{{ chapter.description }}</p>
            </div>
            <div class="chapter-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IvisLabsLogo from '../components/IvisLabsLogo.vue'

export default {
  name: 'TextbooksPage',
  components: {
    IvisLabsLogo
  },
  computed: {
    classNum() {
      return parseInt(this.$route.params.classNum) || 10;
    },
    subject() {
      // Get the subject from route params and format it properly
      const rawSubject = this.$route.params.subject || '';
      // Convert kebab-case to proper case (e.g., 'social-science' to 'Social Science')
      return rawSubject
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    subjectParam() {
      // Return the original subject parameter (kebab-case)
      return this.$route.params.subject || '';
    },
    // This would typically come from an API or Vuex store
    textbooks() {
      // Mock data for each subject
      const textbooksBySubject = {
        'mathematics': [
          {
            title: 'NCERT Mathematics Textbook',
            publisher: 'National Council of Educational Research and Training',
            chapters: [
              { number: '1', title: 'Real Numbers', description: 'Explore Euclid\'s division lemma, fundamental theorem of arithmetic, and more.' },
              { number: '2', title: 'Polynomials', description: 'Learn about polynomials in one variable, their degrees, and zeros.' },
              { number: '3', title: 'Pair of Linear Equations in Two Variables', description: 'Study graphical and algebraic methods of solution.' },
              { number: '4', title: 'Quadratic Equations', description: 'Explore quadratic equations and their solutions.' },
              { number: '5', title: 'Arithmetic Progressions', description: 'Understand arithmetic progressions and their applications.' }
            ]
          },
          {
            title: 'Mathematics Practice Book',
            publisher: 'IVIS LABS Educational Resources',
            chapters: [
              { number: '1', title: 'Real Numbers Practice', description: 'Practice problems and exercises for real numbers.' },
              { number: '2', title: 'Polynomials Practice', description: 'Problem-solving techniques for polynomials.' },
              { number: '3', title: 'Linear Equations Practice', description: 'Practice solving linear equations with various methods.' }
            ]
          }
        ],
        'science': [
          {
            title: 'NCERT Science Textbook',
            publisher: 'National Council of Educational Research and Training',
            chapters: [
              { number: '1', title: 'Chemical Reactions and Equations', description: 'Understand chemical reactions, their types, and balancing equations.' },
              { number: '2', title: 'Acids, Bases and Salts', description: 'Learn about acids, bases, their properties, and reactions.' },
              { number: '3', title: 'Metals and Non-metals', description: 'Study properties and reactions of metals and non-metals.' },
              { number: '4', title: 'Carbon and its Compounds', description: 'Exploring carbon\'s chemical characteristics through experimental activities.' },
              { number: '5', title: 'Life Processes', description: 'Explore nutrition, respiration, transport, and excretion in living organisms.' }
            ]
          }
        ],
        'social-science': [
          {
            title: 'NCERT History Textbook',
            publisher: 'National Council of Educational Research and Training',
            chapters: [
              { number: '1', title: 'The Rise of Nationalism in Europe', description: 'Study the growth of nationalism in Europe during the 19th century.' },
              { number: '2', title: 'Nationalism in India', description: 'Understand the development of Indian nationalism.' },
              { number: '3', title: 'The Making of a Global World', description: 'Explore the pre-modern world and the 19th century global economy.' }
            ]
          },
          {
            title: 'NCERT Geography Textbook',
            publisher: 'National Council of Educational Research and Training',
            chapters: [
              { number: '1', title: 'Resources and Development', description: 'Learn about types of resources and their development in India.' },
              { number: '2', title: 'Forest and Wildlife Resources', description: 'Study the importance and conservation of forest and wildlife.' }
            ]
          }
        ],
        'english': [
          {
            title: 'NCERT First Flight (Textbook)',
            publisher: 'National Council of Educational Research and Training',
            chapters: [
              { number: '1', title: 'A Letter to God', description: 'Story by G.L. Fuentes' },
              { number: '2', title: 'Nelson Mandela: Long Walk to Freedom', description: 'Autobiographical excerpt by Nelson Mandela' },
              { number: '3', title: 'Two Stories about Flying', description: 'Stories about the triumph of human spirit' }
            ]
          },
          {
            title: 'NCERT Footprints Without Feet (Supplementary Reader)',
            publisher: 'National Council of Educational Research and Training',
            chapters: [
              { number: '1', title: 'A Triumph of Surgery', description: 'Story by James Herriot' },
              { number: '2', title: 'The Thief\'s Story', description: 'Story by Ruskin Bond' }
            ]
          }
        ],
        'kannada': [
          {
            title: 'NCERT Kannada Textbook',
            publisher: 'National Council of Educational Research and Training',
            chapters: [
              { number: '1', title: 'ಪಾಠ ೧ - ಕನ್ನಡ ನಾಡು', description: 'Introduction to Kannada language and literature' },
              { number: '2', title: 'ಪಾಠ ೨ - ಕನ್ನಡ ಸಾಹಿತ್ಯ', description: 'Study of Kannada literature' },
              { number: '3', title: 'ಪಾಠ ೩ - ವ್ಯಾಕರಣ', description: 'Kannada grammar and syntax' }
            ]
          }
        ],
        'hindi': [
          {
            title: 'NCERT Kshitij (Hindi Textbook)',
            publisher: 'National Council of Educational Research and Training',
            chapters: [
              { number: '1', title: 'सूरदास', description: 'Works of Surdas and their significance' },
              { number: '2', title: 'तुलसीदास', description: 'Poetry of Tulsidas and its relevance' },
              { number: '3', title: 'देव', description: 'Literary contributions of Dev' }
            ]
          },
          {
            title: 'NCERT Kritika (Hindi Supplementary Reader)',
            publisher: 'National Council of Educational Research and Training',
            chapters: [
              { number: '1', title: 'माता का अंचल', description: 'Story by Shivpujan Sahay' },
              { number: '2', title: 'जॉर्ज पंचम की नाक', description: 'Satirical piece by Harishankar Parsai' }
            ]
          }
        ]
      };

      // Convert route param subject to lowercase for case-insensitive lookup
      const subjectKey = this.subjectParam.toLowerCase();
      return textbooksBySubject[subjectKey] || [];
    }
  },
  methods: {
    openChapter(textbook, chapter) {
      console.log(`Opening chapter "${chapter.title}" from "${textbook.title}"`);

      // Create textbook ID by converting title to kebab-case
      const textbookId = textbook.title.toLowerCase().replace(/\s+/g, '-');
      const chapterId = 'chapter' + chapter.number;

      // Map subjects to their corresponding route names
      const routeNames = {
        'mathematics': 'MathematicsContent',
        'science': 'ScienceContent',
        'social-science': 'SocialScienceContent',
        'english': 'EnglishContent',
        'kannada': 'KannadaContent',
        'hindi': 'HindiContent'
      };

      // Get the route name for current subject
      const routeName = routeNames[this.subjectParam];

      if (routeName) {
        // Navigate to the subject-specific chapter content page
        this.$router.push({
          name: routeName,
          params: {
            classNum: this.classNum,
            textbookId: textbookId,
            chapterId: chapterId
          }
        });
      } else {
        console.error(`No route found for subject: ${this.subjectParam}`);
      }
    }
  }
}
</script>

<style scoped>
.textbooks-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #121212;
  min-height: 100vh;
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
  margin-bottom: 10px;
}

header p {
  font-size: 1.2rem;
  color: #e0e0e0;
}

.textbooks-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.textbook-card {
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid #2c2c2c;
}

.textbook-header {
  padding: 25px;
  background-color: rgba(23, 181, 181, 0.1);
  border-bottom: 1px solid #2c2c2c;
}

.textbook-header h2 {
  font-size: 1.8rem;
  color: #17b5b5;
  margin-bottom: 5px;
}

.publisher {
  color: #b0b0b0;
  font-size: 0.9rem;
  font-style: italic;
}

.chapters-list {
  padding: 25px;
}

.chapters-list h3 {
  color: #e0e0e0;
  margin-bottom: 20px;
  font-size: 1.4rem;
  border-bottom: 1px solid #2c2c2c;
  padding-bottom: 10px;
}

.chapter-card {
  display: flex;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: #252525;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
}

.chapter-card:hover {
  background-color: #333;
  transform: translateX(5px);
}

.chapter-number {
  width: 40px;
  height: 40px;
  background-color: rgba(23, 181, 181, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #17b5b5;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.chapter-details {
  flex-grow: 1;
}

.chapter-details h4 {
  color: #17b5b5;
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.chapter-details p {
  color: #b0b0b0;
  font-size: 0.9rem;
}

.chapter-arrow {
  color: #17b5b5;
  transition: transform 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.chapter-card:hover .chapter-arrow {
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .breadcrumbs {
    display: none;
  }

  .textbook-header h2 {
    font-size: 1.5rem;
  }

  .chapter-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .chapter-number {
    margin-bottom: 10px;
  }

  .chapter-arrow {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>