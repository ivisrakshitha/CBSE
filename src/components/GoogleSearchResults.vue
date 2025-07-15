<!-- src/components/GoogleSearchResults.vue -->
<template>
    <div class="google-search-results">
      <div class="search-container">
        <div class="search-input-container">
          <input 
            v-model="searchQuery" 
            @keyup.enter="performSearch"
            type="text" 
            placeholder="Search for related content..."
            class="search-input"
          />
          <button @click="performSearch" class="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        
        <div class="search-filters">
          <button 
            @click="setFilter('all')" 
            :class="{ active: currentFilter === 'all' }"
          >All</button>
          <button 
            @click="setFilter('images')" 
            :class="{ active: currentFilter === 'images' }"
          >Images</button>
          <button 
            @click="setFilter('videos')" 
            :class="{ active: currentFilter === 'videos' }"
          >Videos</button>
        </div>
      </div>
      
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Searching for content...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="searchResults.length === 0 && searchPerformed" class="no-results">
        <p>No results found for "{{ searchQuery }}". Try a different search term.</p>
      </div>
      
      <div v-else-if="searchPerformed" class="results-container">
        <!-- Images Results -->
        <div v-if="filteredResults.images.length > 0" class="result-section">
          <h3 v-if="currentFilter === 'all'">Images</h3>
          <div class="image-grid">
            <div 
              v-for="(image, index) in filteredResults.images" 
              :key="'img-' + index" 
              class="image-card"
              @click="openImageModal(image)"
            >
              <div class="image-card-inner">
                <img :src="image.thumbnailUrl" :alt="image.title" class="thumbnail" />
                <div class="image-card-title">{{ truncateText(image.title, 50) }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Videos Results -->
        <div v-if="filteredResults.videos.length > 0" class="result-section">
          <h3 v-if="currentFilter === 'all'">Videos</h3>
          <div class="video-grid">
            <div 
              v-for="(video, index) in filteredResults.videos" 
              :key="'vid-' + index" 
              class="video-card"
              @click="openVideoModal(video)"
            >
              <div class="video-card-inner">
                <div class="thumbnail-container">
                  <img :src="video.thumbnailUrl" :alt="video.title" class="thumbnail" />
                  <div class="play-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div class="video-card-info">
                  <div class="video-card-title">{{ truncateText(video.title, 70) }}</div>
                  <div class="video-card-channel">{{ video.channelTitle }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Image Modal -->
      <div class="modal" v-if="modalContent.image" @click="closeModal">
        <div class="modal-content image-modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ modalContent.image.title }}</h3>
            <button class="close-button" @click="closeModal">×</button>
          </div>
          <div class="modal-body">
            <img :src="modalContent.image.fullSizeUrl || modalContent.image.thumbnailUrl" :alt="modalContent.image.title" class="full-size-image" />
            <div class="image-details">
              <p v-if="modalContent.image.description">{{ modalContent.image.description }}</p>
              <p class="image-source">Source: <a :href="modalContent.image.sourceUrl" target="_blank">{{ modalContent.image.sourceName }}</a></p>
            </div>
          </div>
          <div class="modal-footer">
            <a :href="modalContent.image.sourceUrl" target="_blank" class="source-link">Visit Source</a>
          </div>
        </div>
      </div>
      
      <!-- Video Modal -->
      <div class="modal" v-if="modalContent.video" @click="closeModal">
        <div class="modal-content video-modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ modalContent.video.title }}</h3>
            <button class="close-button" @click="closeModal">×</button>
          </div>
          <div class="modal-body">
            <div class="video-embed">
              <iframe 
                :src="'https://www.youtube.com/embed/' + getYoutubeId(modalContent.video.videoUrl)" 
                frameborder="0" 
                allowfullscreen
              ></iframe>
            </div>
            <div class="video-details">
              <p class="video-channel">{{ modalContent.video.channelTitle }}</p>
              <p v-if="modalContent.video.description">{{ modalContent.video.description }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <a :href="modalContent.video.videoUrl" target="_blank" class="source-link">Watch on YouTube</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'GoogleSearchResults',
    props: {
      initialQuery: {
        type: String,
        default: ''
      },
      searchContext: {
        type: String,
        default: ''
      },
      apiKey: {
        type: String,
        required: true
      },
      searchEngineId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        searchQuery: this.initialQuery,
        searchResults: [],
        currentFilter: 'all', // 'all', 'images', 'videos'
        isLoading: false,
        error: null,
        searchPerformed: false,
        modalContent: {
          image: null,
          video: null
        }
      }
    },
    computed: {
      filteredResults() {
        return {
          images: this.currentFilter === 'all' || this.currentFilter === 'images' 
            ? this.searchResults.filter(item => item.type === 'image')
            : [],
          videos: this.currentFilter === 'all' || this.currentFilter === 'videos'
            ? this.searchResults.filter(item => item.type === 'video')
            : []
        }
      }
    },
    mounted() {
      // If there's an initial query, perform search on mount
      if (this.initialQuery && this.initialQuery.trim() !== '') {
        // Combine initial query with context if provided
        this.searchQuery = this.searchContext 
          ? `${this.initialQuery} ${this.searchContext}` 
          : this.initialQuery;
        this.performSearch();
      }
      
      // Add event listener for escape key to close modal
      document.addEventListener('keydown', this.handleKeyDown);
    },
    beforeUnmount() {
      // Remove event listener
      document.removeEventListener('keydown', this.handleKeyDown);
    },
    methods: {
      async performSearch() {
        if (!this.searchQuery.trim()) {
          this.error = 'Please enter a search term';
          return;
        }
        
        this.isLoading = true;
        this.error = null;
        this.searchResults = [];
        
        try {
          // First, search for images
          const imageResults = await this.searchImages();
          
          // Then search for videos
          const videoResults = await this.searchVideos();
          
          // Combine results
          this.searchResults = [...imageResults, ...videoResults];
          this.searchPerformed = true;
        } catch (err) {
          console.error('Search error:', err);
          this.error = `Error performing search: ${err.message}`;
        } finally {
          this.isLoading = false;
        }
      },
      
      async searchImages() {
        try {
          const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
              key: this.apiKey,
              cx: this.searchEngineId,
              q: this.searchQuery,
              searchType: 'image',
              num: 10
            }
          });
          
          if (!response.data.items) {
            return [];
          }
          
          return response.data.items.map(item => ({
            type: 'image',
            title: item.title,
            thumbnailUrl: item.image.thumbnailLink,
            fullSizeUrl: item.link,
            sourceUrl: item.image.contextLink,
            sourceName: new URL(item.image.contextLink).hostname.replace('www.', ''),
            description: item.snippet
          }));
        } catch (error) {
          console.error('Error searching for images:', error);
          return [];
        }
      },
      
      async searchVideos() {
        try {
          // Search specifically for YouTube videos by adding "youtube" to the query
          const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
              key: this.apiKey,
              cx: this.searchEngineId,
              q: `${this.searchQuery} youtube`,
              num: 10
            }
          });
          
          if (!response.data.items) {
            return [];
          }
          
          // Filter for YouTube results and format them
          return response.data.items
            .filter(item => item.link.includes('youtube.com/watch'))
            .map(item => {
              // Extract video ID
              const videoId = this.getYoutubeId(item.link);
              
              return {
                type: 'video',
                title: item.title,
                videoUrl: item.link,
                thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                channelTitle: item.pagemap?.videoobject?.[0]?.channelTitle || 'YouTube',
                description: item.snippet
              };
            });
        } catch (error) {
          console.error('Error searching for videos:', error);
          return [];
        }
      },
      
      setFilter(filter) {
        this.currentFilter = filter;
      },
      
      truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
      },
      
      getYoutubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
      },
      
      openImageModal(image) {
        this.modalContent.image = image;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      },
      
      openVideoModal(video) {
        this.modalContent.video = video;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      },
      
      closeModal() {
        this.modalContent.image = null;
        this.modalContent.video = null;
        document.body.style.overflow = ''; // Restore scrolling
      },
      
      handleKeyDown(e) {
        if (e.key === 'Escape') {
          this.closeModal();
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .google-search-results {
    margin-bottom: 40px;
    color: #e0e0e0;
  }
  
  .search-container {
    margin-bottom: 20px;
  }
  
  .search-input-container {
    display: flex;
    margin-bottom: 10px;
  }
  
  .search-input {
    flex: 1;
    padding: 12px 16px;
    font-size: 1rem;
    border: 1px solid #2c2c2c;
    border-radius: 8px 0 0 8px;
    background-color: #252525;
    color: #e0e0e0;
  }
  
  .search-button {
    padding: 0 18px;
    background-color: #17b5b5;
    color: #121212;
    border: none;
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }
  
  .search-button:hover {
    background-color: #1ec7c7;
  }
  
  .search-filters {
    display: flex;
    gap: 10px;
  }
  
  .search-filters button {
    padding: 8px 16px;
    background-color: #1e1e1e;
    color: #b0b0b0;
    border: 1px solid #2c2c2c;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .search-filters button.active,
  .search-filters button:hover {
    background-color: #252525;
    color: #17b5b5;
    border-color: #17b5b5;
  }
  
  .loading-state, .error-state, .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    text-align: center;
    color: #b0b0b0;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(23, 181, 181, 0.1);
    border-left-color: #17b5b5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .error-state {
    color: #f44336;
  }
  
  .result-section {
    margin-bottom: 30px;
  }
  
  .result-section h3 {
    font-size: 1.3rem;
    color: #17b5b5;
    margin-bottom: 15px;
    border-bottom: 1px solid #2c2c2c;
    padding-bottom: 8px;
  }
  
  /* Image grid */
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 15px;
  }
  
  .image-card {
    background-color: #1e1e1e;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
    height: 100%;
  }
  
  .image-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .image-card-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .image-card img.thumbnail {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }
  
  .image-card-title {
    padding: 10px;
    font-size: 0.9rem;
    flex: 1;
  }
  
  /* Video grid */
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .video-card {
    background-color: #1e1e1e;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
    height: 100%;
  }
  
  .video-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .video-card-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .thumbnail-container {
    position: relative;
  }
  
  .video-card img.thumbnail {
    width: 100%;
    height: 158px;
    object-fit: cover;
  }
  
  .play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.8;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s, background-color 0.2s;
  }
  
  .video-card:hover .play-icon {
    opacity: 1;
    background-color: rgba(23, 181, 181, 0.7);
  }
  
  .video-card-info {
    padding: 12px;
    flex: 1;
  }
  
  .video-card-title {
    font-size: 0.95rem;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .video-card-channel {
    font-size: 0.8rem;
    color: #b0b0b0;
  }
  
  /* Modal styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }
  
  .modal-content {
    background-color: #1e1e1e;
    border-radius: 12px;
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .modal-header {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #2c2c2c;
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #17b5b5;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #b0b0b0;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s, color 0.2s;
  }
  
  .close-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  
  .modal-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
  }
  
  .full-size-image {
    max-width: 100%;
    max-height: 60vh;
    display: block;
    margin: 0 auto 20px;
    border-radius: 8px;
  }
  
  .image-details, .video-details {
    color: #d0d0d0;
    line-height: 1.5;
  }
  
  .image-source {
    margin-top: 15px;
    font-size: 0.9rem;
    color: #b0b0b0;
  }
  
  .image-source a {
    color: #17b5b5;
    text-decoration: none;
  }
  
  .image-source a:hover {
    text-decoration: underline;
  }
  
  .video-embed {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 ratio */
    height: 0;
    overflow: hidden;
    margin-bottom: 20px;
  }
  
  .video-embed iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
  
  .video-channel {
    font-weight: 500;
    color: #17b5b5;
    margin-bottom: 10px;
  }
  
  .modal-footer {
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #2c2c2c;
  }
  
  .source-link {
    padding: 8px 16px;
    background-color: #17b5b5;
    color: #121212;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .source-link:hover {
    background-color: #1ec7c7;
  }
  
  @media (max-width: 768px) {
    .image-grid {
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    }
    
    .video-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
    
    .modal-content {
      width: 95%;
    }
  }
  </style>