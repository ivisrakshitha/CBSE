<!-- src/components/TypewriterText.vue -->
<template>
    <div class="typewriter-container">
      <span ref="textContainer" class="typewriter-text">{{ displayedText }}</span>
      <span class="cursor" v-if="isTyping"></span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TypewriterText',
    props: {
      text: {
        type: String,
        required: true
      },
      speed: {
        type: Number,
        default: 30 // milliseconds per character
      },
      delay: {
        type: Number,
        default: 0 // delay before starting animation in milliseconds
      },
      startOnIntersect: {
        type: Boolean,
        default: true // start typing when component comes into view
      }
    },
    data() {
      return {
        displayedText: '',
        currentIndex: 0,
        isTyping: false,
        timeoutId: null,
        observer: null
      }
    },
    mounted() {
      if (this.startOnIntersect) {
        // Use Intersection Observer to detect when the element is visible
        this.setupIntersectionObserver();
      } else {
        // Start typing immediately after the specified delay
        setTimeout(() => {
          this.startTyping();
        }, this.delay);
      }
    },
    beforeUnmount() {
      this.cleanup();
    },
    methods: {
      startTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        this.currentIndex = 0;
        this.displayedText = '';
        this.typeNextCharacter();
      },
      
      typeNextCharacter() {
        if (this.currentIndex < this.text.length) {
          this.displayedText += this.text.charAt(this.currentIndex);
          this.currentIndex++;
          
          // Schedule the next character
          this.timeoutId = setTimeout(() => {
            this.typeNextCharacter();
          }, this.speed);
        } else {
          // Typing is complete
          this.isTyping = false;
        }
      },
      
      setupIntersectionObserver() {
        const options = {
          root: null, // viewport
          rootMargin: '0px',
          threshold: 0.1 // trigger when at least 10% of the element is visible
        };
        
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.isTyping && this.currentIndex === 0) {
              setTimeout(() => {
                this.startTyping();
              }, this.delay);
            }
          });
        }, options);
        
        this.observer.observe(this.$refs.textContainer);
      },
      
      cleanup() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        
        if (this.observer) {
          this.observer.disconnect();
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .typewriter-container {
    display: inline-block;
    line-height: 1.6;
  }
  
  .typewriter-text {
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  .cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: #17b5b5;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: blink 0.7s infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  </style>