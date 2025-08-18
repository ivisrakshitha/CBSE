<!-- src/components/IvisLabsLogo.vue -->
<template>
    <div class="logo-container">
      <h1 class="text-teal font-expletus text-xl md:text-2xl tracking-widest hover:text-teal-light 
             transition-colors duration-300 dark:hover:text-teal-dark">IVIS LABS</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: 'IvisLabsLogo'
  }
  </script>
  
  <style scoped>
  .logo-container {
    display: inline-block;
  }
  
  .logo-text {
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: 4px;
    font-family: expletus;
    color: #17b5b5; /* The teal color from the IVIS LABS logo */
  }
  
  @media (max-width: 768px) {
    .logo-text {
      font-size: 2rem;
    }
  }
  </style>