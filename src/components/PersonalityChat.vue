<template>
  <div class="chat-container" :class="{ 'fullscreen-mode': isFullscreen }">
    <!-- Fullscreen Personality Display (Only visible in fullscreen) -->
    <div v-if="isFullscreen" class="fullscreen-personality">
      <img :src="personality.image" alt="personality" class="personality-full-image" />
      <!-- Removed the description overlay as requested -->
    </div>

    <!-- Chat Section -->
    <div class="chat-section" :class="{ 'fullscreen-chat': isFullscreen }">
      <div class="chat-header">
        <button class="back-btn" @click="$emit('back-to-list')" v-if="!isFullscreen">⬅ Back</button>

        <!-- Personality DP like WhatsApp (Only in normal mode) -->
        <div class="header-profile" v-if="!isFullscreen">
          <img :src="personality.image" alt="profile" class="profile-pic" />
          <h3>{{ personality.name }}</h3>
        </div>

        <!-- Fullscreen Title (Only in fullscreen mode) -->
        <div class="fullscreen-header" v-if="isFullscreen">
          <h3>Chat with {{ personality.name }}</h3>
        </div>

        <!-- Controls -->
        <div class="header-controls">
          <button @click="toggleWallpaper" class="wallpaper-btn"
            :title="wallpaperEnabled ? 'Remove Wallpaper' : 'Set as Wallpaper'" v-if="!isFullscreen">
            {{ wallpaperEnabled ? '🚫' : '🎨' }}
          </button>

          <button @click="toggleFullscreen" class="fullscreen-btn"
            :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'">
            {{ isFullscreen ? '🗗' : '🗖' }}
          </button>

          <button class="back-btn" @click="$emit('back-to-list')" v-if="isFullscreen">❌</button>
        </div>
      </div>

      <div class="chat-messages" ref="messagesContainer" :style="chatBackgroundStyle">
        <!-- Wallpaper overlay for better text readability (Only in normal mode) -->
        <div v-if="wallpaperEnabled && !isFullscreen" class="wallpaper-overlay"></div>

        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.sender]">
          <!-- Bot message with DP -->
          <div v-if="msg.sender === 'bot'" class="msg-with-dp">
            <img :src="personality.image" alt="bot-dp" class="msg-dp" v-if="!isFullscreen" />
            <div class="bubble">
              {{ msg.text }}
              <!-- Play audio button for bot messages -->
              <button v-if="msg.text !== 'Sorry, I couldn\'t process your question right now.'"
                @click="speakText(msg.text)" class="speak-btn" :disabled="isSpeaking">
                {{ isSpeaking ? '🔊' : '🔈' }}
              </button>
            </div>
          </div>

          <!-- User message without DP -->
          <div v-else class="bubble">{{ msg.text }}</div>
        </div>

        <!-- Loading animation -->
        <div v-if="isLoading" class="message bot">
          <div class="msg-with-dp">
            <img :src="personality.image" alt="bot-dp" class="msg-dp" v-if="!isFullscreen" />
            <div class="bubble loading-bubble">
              <div class="typing-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <input v-model="input" @keyup.enter="send"
          :placeholder="isFullscreen ? `Ask ${personality.name} something...` : 'Ask something...'"
          :disabled="isLoading || isListening" />

        <!-- Voice input button -->
        <button @click="toggleVoiceInput" class="voice-btn" :class="{ 'listening': isListening }" :disabled="isLoading">
          {{ isListening ? '🎙️' : '🎤' }}
        </button>

        <button @click="send" class="send-btn" :disabled="isLoading || isListening">
          {{ isLoading ? '...' : 'Send' }}
        </button>
      </div>

      <!-- Voice input status -->
      <div v-if="isListening" class="voice-status">
        🎙️ Listening... Speak now!
      </div>

      <!-- TTS Controls -->
      <div v-if="isSpeaking" class="tts-controls">
        <button @click="stopSpeaking" class="stop-speak-btn">
          🔇 Stop Speaking
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["personality"],
  data() {
    return {
      input: "",
      messages: [],
      isLoading: false,
      isListening: false,
      isSpeaking: false,
      recognition: null,
      synthesis: null,
      wallpaperEnabled: false,
      isFullscreen: false
    };
  },
  computed: {
    chatBackgroundStyle() {
      if (this.wallpaperEnabled && this.personality.image && !this.isFullscreen) {
        return {
          backgroundImage: `url(${this.personality.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'local'
        };
      }
      return {};
    }
  },
  mounted() {
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
    this.loadWallpaperSetting();

    // Handle ESC key to exit fullscreen
    document.addEventListener('keydown', this.handleKeyPress);
  },
  methods: {
    async send() {
      if (!this.input.trim() || this.isLoading) return;

      const question = this.input.trim();
      this.messages.push({ sender: "user", text: question });
      this.input = "";
      this.isLoading = true;

      // Scroll to bottom
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      try {
        const botReply = await this.getOllamaAnswer(
          question,
          this.personality.description
        );
        this.messages.push({ sender: "bot", text: botReply });

        // Auto-speak bot reply in fullscreen mode for immersive experience
        if (this.isFullscreen) {
          this.speakText(botReply);
        }
      } catch (error) {
        console.error(error);
        this.messages.push({
          sender: "bot",
          text: "Sorry, I couldn't process your question right now."
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    async getOllamaAnswer(question, description) {
      const OLLAMA_API_KEY = "sk-bf725748416143d88b7ea444d68f0c90";
      const OLLAMA_MODEL = "llama3.2-vision:latest";

      let personalityPrompt = "";
      try {
        personalityPrompt = (await import(`../prompts/personalityPrompts/${this.personality.id}Prompt.js`)).default;
      } catch (err) {
        console.warn("No specific prompt found, using description.");
        personalityPrompt = description; // fallback
      }

      const prompt = `
${personalityPrompt}

Question: ${question}
  `;

      const response = await fetch(
        "https://chat.ivislabs.in/api/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OLLAMA_API_KEY}`
          },
          body: JSON.stringify({
            model: OLLAMA_MODEL,
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: prompt }
            ],
            temperature: 0.2
          })
        }
      );
 
      const data = await response.json();

      if (data?.choices?.length > 0) {
        return data.choices[0].message.content.trim();
      } else {
        return "I couldn't find anything related to your question.";
      }
    },

    // Speech Recognition (Speech-to-Text)
    initializeSpeechRecognition() {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          this.isListening = true;
        };

        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          this.input = transcript;
          this.isListening = false;
        };

        this.recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          this.isListening = false;
          alert('Speech recognition error. Please try again.');
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    },

    // Speech Synthesis (Text-to-Speech)
    initializeSpeechSynthesis() {
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      } else {
        console.warn('Speech synthesis not supported in this browser');
      }
    },

    toggleVoiceInput() {
      if (!this.recognition) {
        alert('Speech recognition is not supported in your browser');
        return;
      }

      if (this.isListening) {
        this.recognition.stop();
      } else {
        this.recognition.start();
      }
    },

    speakText(text) {
      if (!this.synthesis) {
        alert('Text-to-speech is not supported in your browser');
        return;
      }

      // Stop any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        console.error('Speech synthesis error');
      };

      this.synthesis.speak(utterance);
    },

    stopSpeaking() {
      if (this.synthesis) {
        this.synthesis.cancel();
        this.isSpeaking = false;
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    // Wallpaper functionality using personality image
    toggleWallpaper() {
      this.wallpaperEnabled = !this.wallpaperEnabled;
      this.saveWallpaperSetting();
    },

    saveWallpaperSetting() {
      const wallpaperKey = `wallpaper_enabled_${this.personality.id}`;
      try {
        if (!this.$root.wallpaperSettings) {
          this.$root.wallpaperSettings = {};
        }
        this.$root.wallpaperSettings[wallpaperKey] = this.wallpaperEnabled;
      } catch (error) {
        console.warn('Could not save wallpaper setting:', error);
      }
    },

    loadWallpaperSetting() {
      const wallpaperKey = `wallpaper_enabled_${this.personality.id}`;
      try {
        if (this.$root.wallpaperSettings && this.$root.wallpaperSettings[wallpaperKey] !== undefined) {
          this.wallpaperEnabled = this.$root.wallpaperSettings[wallpaperKey];
        }
      } catch (error) {
        console.warn('Could not load wallpaper setting:', error);
      }
    },

    // Fullscreen functionality
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;

      // Prevent/restore body scroll when entering/exiting fullscreen
      if (this.isFullscreen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    },

    handleKeyPress(event) {
      if (event.key === 'Escape' && this.isFullscreen) {
        this.isFullscreen = false;
        document.body.style.overflow = 'auto';
      }
    }
  },

  beforeUnmount() {
    // Cleanup
    if (this.recognition) {
      this.recognition.stop();
    }
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    document.removeEventListener('keydown', this.handleKeyPress);
    // Restore body scroll on unmount
    document.body.style.overflow = 'auto';
  }
};
</script>

<style scoped>
/* Personality Selection UI */
.personality-list {
  padding: 20px;
  background-color: #121212;
  color: #e0e0e0;
}

.personality-list h2 {
  text-align: center;
  margin-bottom: 20px;
}

.personality-card {
  display: flex;
  align-items: center;
  background-color: #1e1e1e;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: 1px solid #2c2c2c;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.personality-card:hover {
  background-color: rgba(23, 181, 181, 0.15);
  transform: translateY(-2px);
}

.list-profile-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #17b5b5;
}

.personality-info {
  margin-left: 12px;
}

.personality-info h4 {
  margin: 0;
  font-size: 1.1rem;
}

.personality-info p {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #b0b0b0;
}

/* NORMAL MODE */
.chat-container {
  max-width: 800px;
  margin: auto;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid #2c2c2c;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

/* FULLSCREEN MODE */
.chat-container.fullscreen-mode {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: none;
  height: 100vh;
  border-radius: 0;
  z-index: 1000;
  margin: 0;
}

/* FULLSCREEN PERSONALITY DISPLAY (3/4 of screen) - No overlay text */
.fullscreen-personality {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}


.personality-full-image {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  object-position: center;
}

/* CHAT SECTION */
.chat-section {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fullscreen-chat {
  height: 25vh;
  border-top: 2px solid #17b5b5;
}

/* HEADER */
.chat-header {
  background-color: rgba(23, 181, 181, 0.1);
  border-bottom: 1px solid #2c2c2c;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.fullscreen-mode .chat-header {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.fullscreen-header {
  flex: 1;
}

.fullscreen-header h3 {
  font-size: 1.5rem;
  margin: 0;
  color: #fff;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.header-controls {
  display: flex;
  gap: 8px;
}

.wallpaper-btn,
.fullscreen-btn {
  background: none;
  border: 1px solid #2c2c2c;
  color: #e0e0e0;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.fullscreen-mode .wallpaper-btn,
.fullscreen-mode .fullscreen-btn {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

.wallpaper-btn:hover,
.fullscreen-btn:hover {
  background-color: rgba(23, 181, 181, 0.15);
  border-color: #17b5b5;
}

.profile-pic {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #17b5b5;
}

.chat-header h3 {
  font-size: 1.2rem;
  margin: 0;
  color: #e0e0e0;
  font-weight: 600;
}

.back-btn {
  background: none;
  border: none;
  color: #17b5b5;
  font-size: 1rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.fullscreen-mode .back-btn {
  color: #fff;
  font-size: 1.2rem;
}

.back-btn:hover {
  background-color: rgba(23, 181, 181, 0.15);
}

/* MESSAGES - Fixed Height Container */
.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #1e1e1e;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  min-height: 0;
}

.fullscreen-mode .chat-messages {
  background-color: rgba(0, 0, 0, 0.9);
  padding: 10px 15px;
  gap: 8px;
}

.wallpaper-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.6) 100%);
  pointer-events: none;
  z-index: 1;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: #17b5b5;
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-track {
  background-color: rgba(44, 44, 44, 0.3);
}

.message {
  display: flex;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.msg-with-dp {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.msg-dp {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #17b5b5;
  flex-shrink: 0;
}

.fullscreen-mode .msg-dp {
  width: 30px;
  height: 30px;
}

.bubble {
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 70%;
  font-size: 0.95rem;
  word-wrap: break-word;
  line-height: 1.4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  position: relative;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.fullscreen-mode .bubble {
  font-size: 0.9rem;
  padding: 10px 14px;
  max-width: 80%;
}

.user .bubble {
  background-color: rgba(23, 181, 181, 0.9);
  color: #fff;
  border-bottom-right-radius: 4px;
  border: 1px solid rgba(23, 181, 181, 0.3);
}

.bot .bubble {
  background-color: rgba(44, 44, 44, 0.9);
  color: #e0e0e0;
  border-bottom-left-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.fullscreen-mode .user .bubble {
  background-color: rgba(23, 181, 181, 0.95);
}

.fullscreen-mode .bot .bubble {
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
}

/* Loading Animation */
.loading-bubble {
  padding: 16px 20px;
}

.fullscreen-mode .loading-bubble {
  padding: 12px 16px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  background-color: #17b5b5;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {

  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }

  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Speak button */
.speak-btn {
  background: none;
  border: none;
  color: #17b5b5;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 8px;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.fullscreen-mode .speak-btn {
  color: #666;
}

.speak-btn:hover {
  background-color: rgba(23, 181, 181, 0.15);
}

.speak-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* INPUT AREA - Fixed at Bottom */
.chat-input {
  display: flex;
  border-top: 1px solid #2c2c2c;
  background-color: #181818;
  padding: 12px;
  gap: 10px;
  flex-shrink: 0;
}

.fullscreen-mode .chat-input {
  background-color: rgba(0, 0, 0, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.chat-input input {
  flex: 1;
  background-color: #252525;
  border: 1px solid #2c2c2c;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 1rem;
  color: #e0e0e0;
  outline: none;
}

.fullscreen-mode .chat-input input {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.fullscreen-mode .chat-input input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.chat-input input:focus {
  border-color: #17b5b5;
}

.chat-input input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.voice-btn {
  background-color: #2c2c2c;
  color: #e0e0e0;
  border: 1px solid #17b5b5;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.fullscreen-mode .voice-btn {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(23, 181, 181, 0.7);
}

.voice-btn:hover {
  background-color: #17b5b5;
}

.voice-btn.listening {
  background-color: #ff4444;
  border-color: #ff4444;
  animation: pulse 1s infinite;
}

.voice-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.send-btn {
  background-color: #17b5b5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background-color: #139999;
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #666;
}

/* Voice status */
.voice-status {
  background-color: #17b5b5;
  color: #fff;
  text-align: center;
  padding: 8px;
  font-size: 0.9rem;
  animation: pulse 1s infinite;
  flex-shrink: 0;
}

.fullscreen-mode .voice-status {
  background-color: rgba(23, 181, 181, 0.9);
}

/* TTS Controls */
.tts-controls {
  background-color: #2c2c2c;
  padding: 8px;
  text-align: center;
  border-top: 1px solid #444;
  flex-shrink: 0;
}

.fullscreen-mode .tts-controls {
  background-color: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stop-speak-btn {
  background-color: #ff4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9rem;
}

.stop-speak-btn:hover {
  background-color: #cc3333;
}

@media (max-width: 600px) {
  .chat-container {
    border-radius: 0;
    height: 100vh;
  }

  .bubble {
    max-width: 90%;
  }

  .chat-input {
    flex-wrap: wrap;
    padding: 8px;
  }

  .voice-btn {
    font-size: 1rem;
    padding: 8px 10px;
  }

  .header-controls {
    flex-wrap: wrap;
    gap: 4px;
  }

  .wallpaper-btn,
  .fullscreen-btn {
    font-size: 0.8rem;
    padding: 4px 6px;
  }

  .fullscreen-header h3 {
    font-size: 1.2rem;
  }
}
</style>