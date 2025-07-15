<!-- src/components/LandingPage.vue -->
<template>
  <div class="landing-page">
    <div class="hero-section">
      <div class="content">
        <div class="logo-wrapper">
          <img src="../assets/PULSE.png" alt="Ivis Labs Logo" class="nav-logo" width="100"/>

          <h5>By</h5>

          <IvisLabsLogo />
        </div>
        <p class="tagline">Preparing Tomorrow's Bright Minds with Today's Intelligent Solutions</p>
        <router-link to="/cbse" class="get-started-btn">Get Started</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import IvisLabsLogo from './IvisLabsLogo.vue'

export default {
  name: 'LandingPage',
  components: {
    IvisLabsLogo
  }
}
</script>

<style scoped>
.landing-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #121212;
  color: #ffffff;
  text-align: center;
}

.hero-section {
  max-width: 800px;
  padding: 0 20px;
}

.logo-wrapper {
  margin-bottom: 1rem;
}

.pulse-text {
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
  margin-top: 0.5rem;
}

.tagline {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  font-weight: 300;
  line-height: 1.5;
  color: #e0e0e0;
}

.get-started-btn {
  display: inline-block;
  background-color: #17b5b5;
  color: #121212;
  padding: 15px 35px;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(23, 181, 181, 0.3);
}

.get-started-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(23, 181, 181, 0.5);
  background-color: #1ec7c7;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  
  .tagline {
    font-size: 1.2rem;
  }
}
</style>