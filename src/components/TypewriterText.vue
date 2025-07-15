<template>
  <div class="typewriter-container">
    <div ref="textContainer" class="typewriter-text">
      <div class="line" v-for="(line, index) in textLines" :key="index">
        <span v-if="index < currentLineIndex">{{ line }}</span>
        <span v-else-if="index === currentLineIndex">
          {{ line }}
          <span class="cursor" v-if="isTyping"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TypewriterText',
  props: {
    text: {
      type: String,
      required: true,
    },
    lineDelay: {
      type: Number,
      default: 1000,
    },
    delay: {
      type: Number,
      default: 0,
    },
    startOnIntersect: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      currentLineIndex: 0,
      isTyping: false,
      timeoutId: null,
      observer: null,
      textLines: []
    };
  },
  mounted() {
    this.prepareTextLines();

    if (this.startOnIntersect) {
      this.setupIntersectionObserver();
    } else {
      setTimeout(() => {
        this.startTyping();
      }, this.delay);
    }
  },
  beforeUnmount() {
    this.cleanup();
  },
  watch: {
    text(newVal) {
      this.prepareTextLines(newVal);
      this.reset();
    }
  },
  methods: {
    prepareTextLines(sourceText) {
      const input = sourceText || this.text;
      if (input && typeof input === 'string') {
        this.textLines = input.split('\n').filter(line => line.trim() !== '');
      } else {
        console.warn('TypewriterText: `text` prop is missing or not a string.');
        this.textLines = [];
      }
    },

    startTyping() {
      if (this.isTyping || this.currentLineIndex >= this.textLines.length) return;

      this.isTyping = true;
      this.typeNextLine();
    },

    typeNextLine() {
      if (this.currentLineIndex >= this.textLines.length) {
        this.isTyping = false;
        return;
      }

      this.timeoutId = setTimeout(() => {
        this.currentLineIndex++;
        this.typeNextLine();
      }, this.lineDelay);
    },

    reset() {
      this.cleanup();
      this.currentLineIndex = 0;
      this.isTyping = false;
    },

    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isTyping && this.currentLineIndex === 0) {
            setTimeout(() => {
              this.startTyping();
            }, this.delay);
          }
        });
      }, options);

      if (this.$refs.textContainer) {
        this.observer.observe(this.$refs.textContainer);
      }
    },

    cleanup() {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      if (this.observer) this.observer.disconnect();
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
  white-space: pre-wrap;
  word-break: break-word;
}

.line {
  margin-bottom: 0.5em;
}

.line:last-child {
  margin-bottom: 0;
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

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}
</style>
