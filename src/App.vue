<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #121212;
  color: #e0e0e0;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  color: #e0e0e0;
}

/* Styling for links across the app */
a {
  color: #17b5b5;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #1ec7c7;
}

/* Custom scrollbar for dark mode */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #1e1e1e;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #17b5b5;
}
</style>