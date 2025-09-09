<template>
  <div class="typewriter-container">
    <div ref="textContainer" class="typewriter-text">
      <div v-for="(line, index) in displayLines" :key="index" class="line">
        <span>{{ line.text }}</span>
        <span v-if="showCursor && index === currentLineIndex" class="cursor"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TypewriterText",
  props: {
    text: {
      type: [String, Array],
      required: true,
      default: ''
    },
    charDelay: {
      type: Number,
      default: 50
    },
    lineDelay: {
      type: Number,
      default: 500
    },
    delay: {
      type: Number,
      default: 100
    },
    startOnIntersect: {
      type: Boolean,
      default: true
    },
    shouldStart: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      displayLines: [],
      currentLineIndex: 0,
      currentCharIndex: 0,
      isTyping: false,
      showCursor: false,
      hasStarted: false,
      timeoutId: null,
      observer: null,
      allLines: []
    };
  },
  mounted() {
    console.log('TypewriterText mounted with text:', this.text);
    this.initializeLines();
    this.setupStart();
  },
  beforeUnmount() {
    this.cleanup();
  },
  watch: {
    text: {
      handler(newText) {
        console.log('Text changed:', newText);
        this.reset();
        this.initializeLines();
        this.setupStart();
      },
      immediate: false
    }
  },
  methods: {
    initializeLines() {
      // Convert text to lines array
      if (!this.text) {
        this.allLines = [];
        return;
      }

      if (Array.isArray(this.text)) {
        this.allLines = this.text.join('\n').split('\n').filter(line => line.trim() !== '');
      } else {
        this.allLines = String(this.text).split('\n').filter(line => line.trim() !== '');
      }

      console.log('Initialized lines:', this.allLines);

      // Initialize display lines as empty
      this.displayLines = this.allLines.map(() => ({ text: '' }));
    },

    setupStart() {
      if (!this.shouldStart || this.hasStarted || this.allLines.length === 0) {
        return;
      }

      if (this.startOnIntersect) {
        this.setupIntersectionObserver();
      } else {
        setTimeout(() => this.startTyping(), this.delay);
      }
    },

    startTyping() {
      if (this.isTyping || this.hasStarted || this.allLines.length === 0) {
        return;
      }

      console.log('Starting typewriter animation');
      this.hasStarted = true;
      this.isTyping = true;
      this.showCursor = true;
      this.currentLineIndex = 0;
      this.currentCharIndex = 0;

      this.typeCurrentLine();
    },

    typeCurrentLine() {
      if (this.currentLineIndex >= this.allLines.length) {
        // Finished all lines
        this.finishTyping();
        return;
      }

      const currentLine = this.allLines[this.currentLineIndex];

      if (this.currentCharIndex < currentLine.length) {
        // Add next character
        this.displayLines[this.currentLineIndex].text = currentLine.substring(0, this.currentCharIndex + 1);
        this.currentCharIndex++;

        // Continue with next character
        this.timeoutId = setTimeout(() => this.typeCurrentLine(), this.charDelay);
      } else {
        // Finished current line, move to next
        this.currentCharIndex = 0;
        this.currentLineIndex++;

        if (this.currentLineIndex < this.allLines.length) {
          // Move to next line after delay
          this.timeoutId = setTimeout(() => this.typeCurrentLine(), this.lineDelay);
        } else {
          // All lines completed
          this.finishTyping();
        }
      }
    },

    finishTyping() {
      this.isTyping = false;
      this.showCursor = false;
      console.log('Typewriter animation finished');
      this.$emit('finished');
    },

    reset() {
      this.cleanup();
      this.displayLines = [];
      this.currentLineIndex = 0;
      this.currentCharIndex = 0;
      this.isTyping = false;
      this.showCursor = false;
      this.hasStarted = false;
      this.allLines = [];
    },

    setupIntersectionObserver() {
      if (!this.$refs.textContainer) {
        // If ref is not ready, try again
        this.$nextTick(() => this.setupIntersectionObserver());
        return;
      }

      const options = {
        root: null,
        threshold: 0.2
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasStarted) {
            console.log('Element intersected, starting typewriter');
            setTimeout(() => this.startTyping(), this.delay);
          }
        });
      }, options);

      this.observer.observe(this.$refs.textContainer);
    },

    cleanup() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }
  }
};
</script>

<style scoped>
.typewriter-container {
  display: block;
  width: 100%;
}

.typewriter-text {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.line {
  margin-bottom: 0.2em;
  min-height: 1.5em;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: #333;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 1s infinite;
}

@keyframes blink {

  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0;
  }
}
</style>