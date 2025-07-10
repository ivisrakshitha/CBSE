<!-- src/views/CbsePage.vue -->
<template>
  <div class="cbse-page">
    <nav class="navbar">
      <router-link to="/" class="nav-logo">
        <IvisLabsLogo />
      </router-link>
      <div class="nav-pulse">PULSE</div>
    </nav>
    
    <header>
      <h1>CBSE Classes</h1>
      <p>Select a class to get started</p>
    </header>
    
    <div class="class-grid">
      <div 
        v-for="classNum in 10" 
        :key="classNum" 
        class="class-card"
        :class="{ 'disabled': classNum < 10 }"
        @click="classNum === 10 ? selectClass(classNum) : null"
      >
        <div class="class-content">
          <h2>Class {{ classNum }}</h2>
          <p>Explore curriculum, resources, and more</p>
          <span class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </span>
          <div v-if="classNum < 10" class="coming-soon-tag">Coming Soon</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IvisLabsLogo from '../components/IvisLabsLogo.vue'

export default {
  name: 'CbsePage',
  components: {
    IvisLabsLogo
  },
  methods: {
    selectClass(classNum) {
      if (classNum === 10) {
        // Navigate to Class 10 subjects page
        this.$router.push(`/class/${classNum}/subjects`);
      } else {
        // For future classes when they become available
        console.log(`Selected Class ${classNum}`);
      }
    }
  }
}
</script>

<style scoped>
.cbse-page {
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

.class-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.class-card {
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #2c2c2c;
}

.class-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(23, 181, 181, 0.15);
  border-color: #17b5b5;
}

.class-content {
  padding: 25px;
  position: relative;
}

.class-card h2 {
  font-size: 1.5rem;
  color: #17b5b5;
  margin-bottom: 10px;
}

.class-card p {
  color: #b0b0b0;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.card-icon {
  display: inline-block;
  color: #17b5b5;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .class-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
.class-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(50%);
}

.class-card.disabled:hover {
  transform: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-color: #2c2c2c;
}

.coming-soon-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #17b5b5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}
</style>