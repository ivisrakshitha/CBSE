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
    
    <div class="subjects-container">
      <div 
        v-for="(subject, index) in subjects" 
        :key="index" 
        class="subject-card"
        :class="{ 
          'active': hoverIndex === index,
          'animated': animatedCards.includes(index),
          'large-card': subject === 'Mathematics',
          [`card-${subject.toLowerCase().replace(' ', '-')}`]: true
        }"
        :style="{ 
          '--index': index,
          '--delay': index * 150 + 'ms'
        }"
        @mouseenter="hoverIndex = index"
        @mouseleave="hoverIndex = -1"
        @click="selectSubject(subject)"
      >
        <!-- Card Content -->
        <div class="card-content">
          <div class="subject-header">
            <h2>{{ subject }}</h2>
            <p>Explore curriculum, resources and more</p>
          </div>
          
          <div class="subject-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          
          <div class="bottom-text">
            <p>Explore curriculum, resources and more</p>
          </div>
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
      subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Kannada', 'Hindi'],
      hoverIndex: -1,
      animatedCards: []
    }
  },
  mounted() {
    this.animateCards();
  },
  computed: {
    classNum() {
      return parseInt(this.$route.params.classNum) || 10;
    }
  },
  methods: {
    selectSubject(subject) {
      this.$router.push({
        name: 'Textbooks',
        params: {
          classNum: this.classNum,
          subject: subject.toLowerCase().replace(' ', '-')
        }
      });
    },
    animateCards() {
      this.subjects.forEach((subject, index) => {
        setTimeout(() => {
          this.animatedCards.push(index);
        }, index * 150);
      });
    }
  }
}
</script>

<style scoped>
.subjects-page {
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  min-height: 100vh;
  overflow: hidden;
}

.navbar {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #2c2c2c;
}

.nav-logo {
  text-decoration: none;
}

.nav-pulse {
  margin-left: 15px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
}

.breadcrumbs {
  margin-left: auto;
  font-size: 1rem;
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
  margin-bottom: 80px;
}

header h1 {
  font-size: 3rem;
  color: #17b5b5;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(23, 181, 181, 0.4);
}

header p {
  font-size: 1.3rem;
  color: #e0e0e0;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.subjects-container {
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
}

.subject-card {
  position: absolute;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 24px;
  background: rgba(23, 181, 181, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(23, 181, 181, 0.3);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(23, 181, 181, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  /* Initial animation state */
  transform: scale(0.8) translateY(50px);
  opacity: 0;
}

.subject-card.animated {
  opacity: 1;
  transition-delay: var(--delay);
}

.subject-card.active {
  transform: scale(1.1) translateY(-30px) !important;
  border-color: rgba(23, 181, 181, 0.8);
  background: rgba(23, 181, 181, 0.15);
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.4),
    0 20px 40px rgba(23, 181, 181, 0.3),
    0 0 60px rgba(23, 181, 181, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  z-index: 10 !important;
}

/* Card Size Classes */
/* Large cards - Mathematics and Science */
.card-mathematics,
.card-science {
  width: 290px;
  height: 390px;
  z-index: 6;
}

/* Medium cards - Kannada and Social Science */
.card-kannada,
.card-social-science {
  width: 250px;
  height: 340px;
  z-index: 4;
}

/* Small cards - English and Hindi */
.card-english,
.card-hindi {
  width: 220px;
  height: 300px;
  z-index: 2;
}

/* Single Line Pack of Cards Arrangement */
/* New Order: English->Kannada->Mathematics->Science->Social Science->Hindi */

/* Card 1 - English (leftmost) */
.card-english {
  left: calc(28% - 300px);
  top: 50%;
  transform: translate(-50%, -50%) rotateY(35deg) scale(0.8) translateY(50px);
}

.card-english.animated {
  transform: translate(-50%, -50%) rotateY(70deg) scale(1) translateY(0);
}

/* Card 2 - Kannada (medium) */
.card-kannada {
  left: calc(35% - 180px);
  top: 50%;
  transform: translate(-50%, -50%) rotateY(12deg) scale(0.8) translateY(50px);
}

.card-kannada.animated {
  transform: translate(-50%, -50%) rotateY(60deg) scale(1) translateY(0);
}

/* Card 3 - Mathematics (center, large) */
/* Card 3 - Mathematics (center, large) */
.card-mathematics {
  left: calc(44.5% - 60px);
  top: 50%;
  transform: translate(-50%, -50%) rotateY(8deg) scale(0.8) translateY(50px);
}

.card-mathematics.animated {
  transform: translate(-50%, -50%) rotateY(30deg) scale(1) translateY(0);
}

/* Card 4 - Science (large) */
.card-science {
  left: calc(55.5% + 60px);
  top: 50%;
  transform: translate(-50%, -50%) rotateY(4deg) scale(0.8) translateY(50px);
}

.card-science.animated {
  transform: translate(-50%, -50%) rotateY(-30deg) scale(1) translateY(0);
}

/* Card 5 - Social Science (medium) */
.card-social-science {
  left: calc(65% + 180px);
  top: 50%;
  transform: translate(-50%, -50%) rotateY(0deg) scale(0.8) translateY(50px);
}

.card-social-science.animated {
  transform: translate(-50%, -50%) rotateY(-60deg) scale(1) translateY(0);
}

/* Card 6 - Hindi (rightmost, small) */
.card-hindi {
  left: calc(72% + 300px);
  top: 50%;
  transform: translate(-50%, -50%) rotateY(-4deg) scale(0.8) translateY(50px);
}

.card-hindi.animated {
  transform: translate(-50%, -50%) rotateY(-70deg) scale(1) translateY(0);
}

.card-content {
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.subject-header {
  flex-shrink: 0;
}

.subject-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Typography adjustments for different card sizes */
/* Large cards - Mathematics and Science */
.card-mathematics .subject-header h2,
.card-science .subject-header h2 {
  font-size: 2.2rem;
}

.card-mathematics .subject-header p,
.card-science .subject-header p {
  font-size: 1rem;
}

.card-mathematics .subject-icon,
.card-science .subject-icon {
  width: 110px;
  height: 110px;
}

.card-mathematics .subject-icon svg,
.card-science .subject-icon svg {
  width: 52px;
  height: 52px;
}

/* Medium cards - Kannada and Social Science */
.card-kannada .subject-header h2,
.card-social-science .subject-header h2 {
  font-size: 1.9rem;
}

.card-kannada .subject-header p,
.card-social-science .subject-header p {
  font-size: 0.95rem;
}

.card-kannada .subject-icon,
.card-social-science .subject-icon {
  width: 100px;
  height: 100px;
}

.card-kannada .subject-icon svg,
.card-social-science .subject-icon svg {
  width: 48px;
  height: 48px;
}

/* Small cards - English and Hindi */
.card-english .subject-header h2,
.card-hindi .subject-header h2 {
  font-size: 1.7rem;
}

.card-english .subject-header p,
.card-hindi .subject-header p {
  font-size: 0.85rem;
}

.card-english .subject-icon,
.card-hindi .subject-icon {
  width: 90px;
  height: 90px;
}

.card-english .subject-icon svg,
.card-hindi .subject-icon svg {
  width: 44px;
  height: 44px;
}

.subject-header p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.subject-icon {
  background: rgba(23, 181, 181, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #17b5b5;
  border: 2px solid rgba(23, 181, 181, 0.4);
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(23, 181, 181, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.subject-card.active .subject-icon {
  transform: scale(1.1);
  background: rgba(23, 181, 181, 0.25);
  border-color: rgba(23, 181, 181, 0.6);
  box-shadow: 
    0 12px 30px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(23, 181, 181, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.2);
}

.subject-icon svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.bottom-text {
  flex-shrink: 0;
}

.bottom-text p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Adjust bottom text for different card sizes */
.card-mathematics .bottom-text p,
.card-science .bottom-text p {
  font-size: 0.9rem;
}

.card-kannada .bottom-text p,
.card-social-science .bottom-text p {
  font-size: 0.85rem;
}

.card-english .bottom-text p,
.card-hindi .bottom-text p {
  font-size: 0.8rem;
}

/* Enhanced hover effects */
.subject-card:hover:not(.active) {
  transform: translateY(-15px) scale(1.02) !important;
  border-color: rgba(23, 181, 181, 0.5);
  z-index: 8;
}

/* Specific hover transforms for each card to maintain their rotation */
.card-english:hover:not(.active) {
  transform: translate(-50%, -50%) rotateY(15deg) scale(1.02) translateY(-15px) !important;
}

.card-kannada:hover:not(.active) {
  transform: translate(-50%, -50%) rotateY(12deg) scale(1.02) translateY(-15px) !important;
}

.card-mathematics:hover:not(.active) {
  transform: translate(-50%, -50%) rotateY(8deg) scale(1.02) translateY(-15px) !important;
}

.card-science:hover:not(.active) {
  transform: translate(-50%, -50%) rotateY(4deg) scale(1.02) translateY(-15px) !important;
}

.card-social-science:hover:not(.active) {
  transform: translate(-50%, -50%) rotateY(0deg) scale(1.02) translateY(-15px) !important;
}

.card-hindi:hover:not(.active) {
  transform: translate(-50%, -50%) rotateY(-4deg) scale(1.02) translateY(-15px) !important;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .subjects-container {
    height: 480px;
  }
  
  /* Large cards */
  .card-mathematics,
  .card-science {
    width: 280px;
    height: 370px;
  }
  
  /* Medium cards */
  .card-kannada,
  .card-social-science {
    width: 250px;
    height: 330px;
  }
  
  /* Small cards */
  .card-english,
  .card-hindi {
    width: 220px;
    height: 290px;
  }
  
  /* Adjust spacing for smaller screens */
  .card-english {
    left: calc(50% - 260px);
  }
  
  .card-kannada {
    left: calc(50% - 156px);
  }
  
  .card-mathematics {
    left: calc(50% - 52px);
  }
  
  .card-science {
    left: calc(50% + 52px);
  }
  
  .card-social-science {
    left: calc(50% + 156px);
  }
  
  .card-hindi {
    left: calc(50% + 260px);
  }
}

@media (max-width: 1200px) {
  .subjects-container {
    height: 450px;
  }
  
  /* Large cards */
  .card-mathematics,
  .card-science {
    width: 260px;
    height: 340px;
  }
  
  /* Medium cards */
  .card-kannada,
  .card-social-science {
    width: 230px;
    height: 300px;
  }
  
  /* Small cards */
  .card-english,
  .card-hindi {
    width: 200px;
    height: 260px;
  }
  
  /* Typography adjustments */
  .card-mathematics .subject-header h2,
  .card-science .subject-header h2 {
    font-size: 2rem;
  }
  
  .card-kannada .subject-header h2,
  .card-social-science .subject-header h2 {
    font-size: 1.7rem;
  }
  
  .card-english .subject-header h2,
  .card-hindi .subject-header h2 {
    font-size: 1.5rem;
  }
  
  /* Further adjust spacing */
  .card-english {
    left: calc(50% - 220px);
  }
  
  .card-kannada {
    left: calc(50% - 132px);
  }
  
  .card-mathematics {
    left: calc(50% - 44px);
  }
  
  .card-science {
    left: calc(50% + 44px);
  }
  
  .card-social-science {
    left: calc(50% + 132px);
  }
  
  .card-hindi {
    left: calc(50% + 220px);
  }
}

@media (max-width: 1024px) {
  .subjects-container {
    height: 800px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 30px;
    align-items: center;
    justify-items: center;
    perspective: none;
  }
  
  .subject-card {
    position: relative !important;
    left: auto !important;
    right: auto !important;
    top: auto !important;
    bottom: auto !important;
    transform: scale(0.8) translateY(50px) !important;
  }
  
  .subject-card.animated {
    transform: scale(1) translateY(0) !important;
  }
  
  .subject-card.active {
    transform: scale(1.05) translateY(-10px) !important;
  }
  
  .subject-card:hover:not(.active) {
    transform: scale(1.02) translateY(-5px) !important;
  }
  
  /* Uniform sizes for tablet */
  .card-mathematics,
  .card-science {
    width: 280px;
    height: 340px;
    grid-column: 1 / -1;
    justify-self: center;
  }
  
  .card-kannada,
  .card-social-science,
  .card-english,
  .card-hindi {
    width: 260px;
    height: 320px;
  }
  
  /* Grid order for tablet layout - maintaining the new order */
  .card-english {
    order: 1;
  }
  
  .card-kannada {
    order: 2;
  }
  
  .card-mathematics {
    order: 3;
    grid-column: 1 / -1;
  }
  
  .card-science {
    order: 4;
    grid-column: 1 / -1;
  }
  
  .card-social-science {
    order: 5;
  }
  
  .card-hindi {
    order: 6;
  }
}

@media (max-width: 768px) {
  .subjects-container {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, auto);
    height: auto;
    gap: 25px;
    padding: 20px 10px;
  }
  
  .subject-card {
    width: 100%;
    max-width: 320px;
    height: 280px;
    grid-column: 1 !important;
  }
  
  .card-mathematics,
  .card-science {
    height: 300px;
  }
  
  .subject-header h2 {
    font-size: 1.7rem;
  }
  
  header h1 {
    font-size: 2.5rem;
  }
  
  .breadcrumbs {
    display: none;
  }
  
  /* Mobile order - maintaining the new sequence */
  .card-english { order: 1; }
  .card-kannada { order: 2; }
  .card-mathematics { order: 3; }
  .card-science { order: 4; }
  .card-social-science { order: 5; }
  .card-hindi { order: 6; }
}

@media (max-width: 480px) {
  .subjects-page {
    padding: 20px 15px;
  }
  
  .subjects-container {
    gap: 20px;
  }
  
  .subject-card {
    height: 260px;
  }
  
  .card-mathematics,
  .card-science {
    height: 280px;
  }
  
  .subject-header h2 {
    font-size: 1.5rem;
  }
  
  .subject-header p {
    font-size: 0.85rem;
  }
  
  .subject-icon {
    width: 90px;
    height: 90px;
  }
  
  .subject-icon svg {
    width: 40px;
    height: 40px;
  }
  
  header h1 {
    font-size: 2rem;
  }
  
  header p {
    font-size: 1.1rem;
  }
  
  .card-content {
    padding: 25px;
  }
}

/* Enhanced visual effects for the card line */
.subjects-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1200px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(23, 181, 181, 0.02) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

@media (max-width: 1024px) {
  .subjects-container::before {
    display: none;
  }
}

/* Subtle line effect behind cards */
.subjects-container::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 900px;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(23, 181, 181, 0.1) 10%, 
    rgba(23, 181, 181, 0.2) 50%, 
    rgba(23, 181, 181, 0.1) 90%, 
    transparent 100%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { 
    opacity: 0.3;
  }
  50% { 
    opacity: 0.6;
  }
}

@media (max-width: 1024px) {
  .subjects-container::after {
    display: none;
  }
}
</style>