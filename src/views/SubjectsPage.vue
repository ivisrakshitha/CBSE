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
          'animated': animatedCards.includes(index)
        }"
        :style="{ 
          '--index': index,
          '--delay': index * 150 + 'ms',
          'left': `calc(50% + ${(index - centerIndex) * 140}px)`
        }"
        @mouseenter="hoverIndex = index"
        @mouseleave="hoverIndex = -1"
        @click="selectSubject(subject)"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="subject-header">
            <h2>{{ subject }}</h2>
            <p>Explore curriculum, resources and more</p>
          </div>
        </div>
        
        <!-- Card Body -->
        <div class="card-body">
          <div class="subject-icon" :class="'icon-' + subject.toLowerCase().replace(' ', '-')">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
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
    },
    centerIndex() {
      return (this.subjects.length - 1) / 2;
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
        }, index * 150); // Stagger animation by 150ms
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
  margin-bottom: 60px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
  min-height: 500px;
  width: 100%;
  position: relative;
  margin-top: 30px;
}

.subject-card {
  position: absolute;
  width: 300px;
  height: 400px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  transform-origin: center center;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(50, 50, 50, 0.2);
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.3),
    0 5px 15px rgba(23, 181, 181, 0.1),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  overflow: hidden;
  /* Initial position - off-screen to the right */
  transform: rotateY(-15deg) translateZ(0px) translateX(calc(100vw + 50px));
  opacity: 0;
  top: 50%;
  margin-top: -200px;
}

.subject-card.animated {
  /* Final position - centered and visible */
  transform: rotateY(-15deg) translateZ(0px) translateX(-50%);
  opacity: 1;
  transition-delay: var(--delay);
}

.subject-card.active {
  transform: rotateY(0deg) translateZ(50px) scale(1.05) translateX(-50%);
  opacity: 1;
  z-index: 10;
  border-color: rgba(77, 210, 210, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 10px 25px rgba(23, 181, 181, 0.2),
    0 0 30px rgba(77, 210, 210, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
}

/* Glassy Card Header */ 
.card-header {
    background: #4bb3c8; /* Pure white color instead of linear gradient or blur backdrop filter*/
    padding: 25px 30px 20px 30px;  
     position: relative;     
         border-radius: 17px;       
             height: auto;         
                 display: flex;           
                     justify-content: center;      
                         align-items: stretch;              
                             box-shadow: none;                /* Remove any added shadow */                           
                                 }                      #remove{ border :none;} 


.subject-header {
  z-index: 2;
}

.subject-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subject-header p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Glassy Card Body */
.card-body {
  background: linear-gradient(135deg, rgba(165, 163, 163, 0.3) 0%, rgba(45, 45, 45, 0.4) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 30px;
  height: calc(100% - 120px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 17px 17px;
  border: 1px solid rgba(77, 210, 210, 0.3);
  border-top: none;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

.subject-card.active .card-body {
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.3),
    0 5px 15px rgba(23, 181, 181, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.subject-icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(23, 181, 181, 0.15) 0%, rgba(23, 181, 181, 0.08) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #17b5b5;
  border: 2px solid rgba(77, 210, 210, 0.3);
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.subject-card.active .subject-icon {
  transform: scale(1.1);
  background: linear-gradient(135deg, rgba(23, 181, 181, 0.25) 0%, rgba(23, 181, 181, 0.15) 100%);
  border-color: rgba(77, 210, 210, 0.5);
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(23, 181, 181, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
}

.subject-icon svg {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Subject-specific styling for icons */
.icon-mathematics svg,
.icon-science svg,
.icon-social-science svg,
.icon-english svg,
.icon-kannada svg,
.icon-hindi svg {
  stroke: #17b5b5;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .subject-card {
    width: 280px;
    height: 370px;
    margin-top: -185px;
  }
  
  .subject-card.animated {
    transform: rotateY(-15deg) translateZ(0px) translateX(-50%);
  }
  
  .subject-header h2 {
    font-size: 2rem;
  }
  
  .card-header {
    height: 110px;
  }
  
  .card-body {
    height: calc(100% - 110px);
  }
}

@media (max-width: 1200px) {
  .subjects-container {
    overflow-x: auto;
    justify-content: flex-start;
    padding: 0 50px;
  }
  
  .subject-card {
    width: 250px;
    height: 340px;
    margin-top: -170px;
  }
  
  .subject-card.animated {
    transform: rotateY(-15deg) translateZ(0px) translateX(-50%);
  }
  
  .subject-header h2 {
    font-size: 1.8rem;
  }
  
  .subject-header p {
    font-size: 0.85rem;
  }
  
  .card-header {
    height: 100px;
  }
  
  .card-body {
    height: calc(100% - 100px);
  }
  
  .subject-icon {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 1024px) {
  .subject-card {
    width: 220px;
    height: 310px;
    margin-top: -155px;
  }
  
  .subject-header h2 {
    font-size: 1.6rem;
  }
  
  .card-header {
    height: 90px;
  }
  
  .card-body {
    height: calc(100% - 90px);
  }
  
  header h1 {
    font-size: 2.5rem;
  }
}

@media (max-width: 900px) {
  .subject-card {
    width: 200px;
    height: 280px;
    margin-top: -140px;
  }
  
  .subject-header h2 {
    font-size: 1.5rem;
  }
  
  .card-header {
    height: 85px;
  }
  
  .card-body {
    height: calc(100% - 85px);
  }
  
  .subject-icon {
    width: 80px;
    height: 80px;
  }
  
  .subject-icon svg {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 768px) {
  .subject-card {
    width: 180px;
    height: 260px;
    margin-top: -130px;
  }
  
  .subject-header h2 {
    font-size: 1.4rem;
  }
  
  .subject-header p {
    font-size: 0.8rem;
  }
  
  header h1 {
    font-size: 2.5rem;
  }
  
  .card-header {
    height: 80px;
    padding: 20px 25px 15px 25px;
  }
  
  .card-body {
    height: calc(100% - 80px);
    padding: 25px;
  }
  
  .breadcrumbs {
    display: none;
  }
}

@media (max-width: 600px) {
  .subject-card {
    width: 160px;
    height: 240px;
    margin-top: -120px;
  }
  
  .subject-header h2 {
    font-size: 1.3rem;
  }
  
  .card-header {
    height: 75px;
  }
  
  .card-body {
    height: calc(100% - 75px);
  }
  
  header h1 {
    font-size: 2.2rem;
  }
  
  header p {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .subjects-page {
    padding: 20px 15px;
  }
  
  .subject-card {
    width: 140px;
    height: 220px;
    margin-top: -110px;
  }
  
  .subject-header h2 {
    font-size: 1.2rem;
  }
  
  .subject-header p {
    font-size: 0.7rem;
  }
  
  header h1 {
    font-size: 2rem;
  }
  
  header p {
    font-size: 1.1rem;
  }
  
  .card-header {
    height: 70px;
    padding: 15px 20px 10px 20px;
  }
  
  .card-body {
    height: calc(100% - 70px);
    padding: 20px;
  }
  
  .subject-icon {
    width: 70px;
    height: 70px;
  }
  
  .subject-icon svg {
    width: 32px;
    height: 32px;
  }
}
</style>