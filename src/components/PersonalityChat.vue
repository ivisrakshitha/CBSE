<template>
  <div class="chat-container">
    <div class="chat-header">
      <button class="back-btn" @click="$emit('back-to-list')">⬅ Back</button>

      <!-- Personality DP like WhatsApp -->
      <div class="header-profile">
        <img :src="personality.image" alt="profile" class="profile-pic" />
        <h3>{{ personality.name }}</h3>
      </div>
    </div>

    <div class="chat-messages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.sender]"
      >
        <!-- Bot message with DP -->
        <div v-if="msg.sender === 'bot'" class="msg-with-dp">
          <img :src="personality.image" alt="bot-dp" class="msg-dp" />
          <div class="bubble">{{ msg.text }}</div>
        </div>

        <!-- User message without DP -->
        <div v-else class="bubble">{{ msg.text }}</div>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="input"
        @keyup.enter="send"
        placeholder="Ask something..."
      />
      <button @click="send" class="send-btn">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["personality"],
  data() {
    return {
      input: "",
      messages: []
    };
  },
  methods: {
    async send() {
      if (!this.input.trim()) return;

      const question = this.input.trim();
      this.messages.push({ sender: "user", text: question });
      this.input = "";

      try {
        const botReply = await this.getOllamaAnswer(
          question,
          this.personality.description
        );
        this.messages.push({ sender: "bot", text: botReply });
      } catch (error) {
        console.error(error);
        this.messages.push({
          sender: "bot",
          text: "Sorry, I couldn't process your question right now."
        });
      }
    },

    async getOllamaAnswer(question, description) {
      const OLLAMA_API_KEY = "sk-bf725748416143d88b7ea444d68f0c90";
      const OLLAMA_MODEL = "llama3.2-vision:latest";

      const prompt = `
You are an expert answering questions strictly based on the following personality description.

Personality Description:
${description}

Rules:
- Only answer using the information given in the description.
- If the question cannot be answered from the description, reply: "I couldn't find anything related to your question."
- Keep your answer concise and clear.

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
    }
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

.chat-container {
  max-width: 800px;
  margin: auto;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  border: 1px solid #2c2c2c;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* HEADER */
.chat-header {
  background-color: rgba(23, 181, 181, 0.1);
  border-bottom: 1px solid #2c2c2c;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-profile {
  display: flex;
  align-items: center;
  gap: 10px;
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
.back-btn:hover {
  background-color: rgba(23, 181, 181, 0.15);
}

/* MESSAGES */
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #1e1e1e;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}
.chat-messages::-webkit-scrollbar-thumb {
  background-color: #17b5b5;
  border-radius: 10px;
}

.message {
  display: flex;
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
}

.bubble {
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 70%;
  font-size: 0.95rem;
  word-wrap: break-word;
  line-height: 1.4;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.user .bubble {
  background-color: #17b5b5;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.bot .bubble {
  background-color: #2c2c2c;
  color: #e0e0e0;
  border-bottom-left-radius: 4px;
}

/* INPUT AREA */
.chat-input {
  display: flex;
  border-top: 1px solid #2c2c2c;
  background-color: #181818;
  padding: 12px;
  gap: 10px;
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
.chat-input input:focus {
  border-color: #17b5b5;
}
.send-btn {
  background-color: #17b5b5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  cursor: pointer;
  font-weight: bold;
}
.send-btn:hover {
  background-color: #139999;
}

@media (max-width: 600px) {
  .chat-container {
    border-radius: 0;
  }
  .bubble {
    max-width: 90%;
  }
}
</style>
