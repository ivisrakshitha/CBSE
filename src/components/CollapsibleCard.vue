<!-- src/components/CollapsibleCard.vue -->
<template>
  <div class="collapsible-card" :class="{ 'card-expanded': isExpanded }">
    <div class="card-header" @click="toggleExpand">
      <h2>{{ title }}</h2>
      <div class="card-toggle-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          :class="{ 'rotate-icon': isExpanded }">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>

    <!-- Preview content shown when card is collapsed -->
    <div class="card-preview-content" v-if="!isExpanded && $slots.preview">
      <slot name="preview"></slot>
    </div>

    <!-- Full content shown when card is expanded -->
    <div class="card-content" v-if="isExpanded" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollapsibleCard',
  props: {
    title: {
      type: String,
      required: true
    },
    initiallyExpanded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isExpanded: this.initiallyExpanded
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    }
  }
}
</script>

<style scoped>
.collapsible-card {
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid #2c2c2c;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
}

.collapsible-card.card-expanded {
  border-color: #17b5b5;
  box-shadow: 0 8px 25px rgba(23, 181, 181, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  transition: background-color 0.3s ease;
}

.collapsible-card.card-expanded .card-header {
  border-bottom: 1px solid #2c2c2c;
}

.card-header h2 {
  color: #17b5b5;
  margin: 0;
  font-size: 1.8rem;
  transition: color 0.3s ease;
}

.card-toggle-icon {
  color: #17b5b5;
}

.card-toggle-icon svg {
  transition: transform 0.3s ease;
}

.rotate-icon {
  transform: rotate(-180deg);
}

.card-content {
  padding: 30px;
  animation: fadeIn 0.5s ease;

  /* Force vertical layout for content */
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-preview-content {
  padding: 0 30px 20px 30px;
  opacity: 0.8;
  animation: fadeIn 0.3s ease;

  /* Force vertical layout for preview content */
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Styles for JSON content display */
.card-content :deep(pre),
.card-preview-content :deep(pre) {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 15px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #e0e0e0;
}

.card-content :deep(code),
.card-preview-content :deep(code) {
  background: #2a2a2a;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #17b5b5;
}

/* Force any nested elements to stack vertically */
.card-content :deep(> *),
.card-preview-content :deep(> *) {
  display: block;
  margin-bottom: 10px;
  width: 100%;
}

.card-content :deep(> *:last-child),
.card-preview-content :deep(> *:last-child) {
  margin-bottom: 0;
}

/* Specific styling for JSON key-value pairs */
.card-content :deep(.json-item),
.card-preview-content :deep(.json-item) {
  display: block;
  padding: 8px 0;
  border-bottom: 1px solid #2c2c2c;
  word-break: break-word;
}

.card-content :deep(.json-item:last-child),
.card-preview-content :deep(.json-item:last-child) {
  border-bottom: none;
}

.card-content :deep(.json-key),
.card-preview-content :deep(.json-key) {
  color: #17b5b5;
  font-weight: bold;
  display: inline-block;
  margin-right: 10px;
  min-width: 120px;
}

.card-content :deep(.json-value),
.card-preview-content :deep(.json-value) {
  color: #e0e0e0;
  display: inline-block;
  word-break: break-word;
}

/* List styling for vertical display */
.card-content :deep(ul),
.card-content :deep(ol),
.card-preview-content :deep(ul),
.card-preview-content :deep(ol) {
  padding-left: 20px;
  margin: 10px 0;
}

.card-content :deep(li),
.card-preview-content :deep(li) {
  margin-bottom: 5px;
  line-height: 1.4;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.collapsible-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.collapsible-card.card-expanded:hover {
  box-shadow: 0 8px 25px rgba(23, 181, 181, 0.15);
}

@media (max-width: 768px) {
  .card-header {
    padding: 15px 20px;
  }

  .card-header h2 {
    font-size: 1.5rem;
  }

  .card-content {
    padding: 20px;
  }

  .card-preview-content {
    padding: 0 20px 15px 20px;
  }
}
</style>