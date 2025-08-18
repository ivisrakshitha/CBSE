<!-- src/views/SubjectsPage.vue -->
<template>
  <div class="subjects-page">
    <nav class="navbar">
      <router-link to="/" class="nav-logo">
        <IvisLabsLogo />
      </router-link>
      <div class="nav-pulse">PULSE</div>
      <div class="breadcrumbs">
        <router-link to="/cbse">CBSE</router-link> / 
        <span>Class {{ classNum }}</span>
      </div>
    </nav>
    
    <header>
      <h1>Class {{ classNum }} Subjects</h1>
      <p>Select a subject to explore curriculum and resources</p>
    </header>
    
    <div class="subjects-grid">
      <div 
        v-for="(subject, index) in subjects" 
        :key="index" 
        class="subject-card"
        @click="selectSubject(subject)"
      >
        <div class="subject-content">
          <div class="subject-icon" :class="'icon-' + subject.toLowerCase().replace(' ', '-')">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <h2>{{ subject }}</h2>
          <p>Explore {{ subject }} curriculum, practice exercises, and learning resources</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IvisLabsLogo from '../components/IvisLabsLogo.vue'

export default {
  name: 'SubjectsPage',
  components: {
    IvisLabsLogo
  },
  data() {
    return {
      subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Kannada', 'Hindi']
    }
  },
  computed: {
    classNum() {
      return parseInt(this.$route.params.classNum) || 10;
    }
  },
  methods: {
    selectSubject(subject) {
      // Navigate to subject's textbooks page
      this.$router.push({
        name: 'Textbooks',
        params: {
          classNum: this.classNum,
          subject: subject.toLowerCase().replace(' ', '-')
        }
      });
    }
  }
}
</script>

<style scoped>
.subjects-page {
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

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.subject-card {
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #2c2c2c;
}

.subject-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(23, 181, 181, 0.15);
  border-color: #17b5b5;
}

.subject-content {
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.subject-icon {
  width: 80px;
  height: 80px;
  background-color: rgba(23, 181, 181, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #17b5b5;
}

.subject-card h2 {
  font-size: 1.8rem;
  color: #17b5b5;
  margin-bottom: 15px;
}

.subject-card p {
  color: #b0b0b0;
  font-size: 1rem;
  line-height: 1.5;
}

/* Subject-specific styling for icons */
.icon-mathematics svg {
  content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%2317b5b5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>');
}

.icon-science svg {
  content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%2317b5b5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"></path><path d="M14 9.3V1.99"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path><path d="M5.58 16.5h12.85"></path></svg>');
}

.icon-social-science svg {
  content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%2317b5b5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>');
}

.icon-english svg {
  content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%2317b5b5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>');
}

.icon-kannada svg, .icon-hindi svg {
  content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%2317b5b5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>');
}

@media (max-width: 768px) {
  .subjects-grid {
    grid-template-columns: 1fr;
  }
  
  .breadcrumbs {
    display: none;
  }
}
</style>