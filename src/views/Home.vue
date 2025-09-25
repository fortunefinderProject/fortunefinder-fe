<script setup lang="ts">
// Landing page for all users (no login required)

// Handle fortune type selection
const selectFortuneType = (type: string) => {
  console.log(`Selected fortune type: ${type}`)
  // TODO: Implement navigation or store selection
}

// Handle search
const handleSearch = () => {
  console.log('Search clicked')
  // TODO: Implement search functionality
}

// Handle place registration
const handlePlaceRegistration = () => {
  console.log('Place registration clicked')
  // TODO: Implement place registration functionality
}

// Handle post registration
const handlePostRegistration = () => {
  console.log('Post registration clicked')
  // TODO: Implement post registration functionality
}

// Sample posts data
const posts = [
  {
    id: 1,
    title: '강남역 근처 유명한 사주카페 후기',
    author: '운세좋은날',
    date: '2024-03-15',
    category: '사주',
    likes: 24,
    comments: 8,
    preview: '강남역 3번 출구에서 도보 5분 거리에 있는 사주카페에 다녀왔습니다. 정말 정확하고 친절하게 봐주셔서...'
  },
  {
    id: 2,
    title: '홍대 타로샵 추천합니다!',
    author: '타로마니아',
    date: '2024-03-14',
    category: '타로',
    likes: 18,
    comments: 12,
    preview: '홍대에서 타로를 정말 잘 보는 곳을 발견했어요. 분위기도 좋고 해석도 정확해서 만족스러웠습니다...'
  },
  {
    id: 3,
    title: '신점 처음 봤는데 신기했어요',
    author: '호기심많은이',
    date: '2024-03-13',
    category: '신점',
    likes: 31,
    comments: 15,
    preview: '친구 추천으로 신점을 처음 봤는데 정말 신기한 경험이었습니다. 무당님이 말씀하신 것들이...'
  }
]
</script>

<template>
  <div class="landing-page">
    <main class="main-content">
      <section class="hero-section">
        <h1 class="hero-title">Fortune Finder</h1>
        <p class="hero-description">
          사주, 신점, 타로에 대한 모든 정보를 한 곳에서 만나보세요
        </p>
        <div class="search-row">
          <input type="text" class="search-input" placeholder="장소명 또는 키워드를 입력하세요">
          <button class="search-button" @click="handleSearch">검색</button>
        </div>
        
        <!-- Fortune type selection buttons -->
        <div class="fortune-selection">
          <button class="fortune-button" @click="selectFortuneType('사주')">사주</button>
          <button class="fortune-button" @click="selectFortuneType('신점')">신점</button>
          <button class="fortune-button" @click="selectFortuneType('타로')">타로</button>
        </div>
      </section>

      <!-- Posts Section -->
      <section class="posts-section">
        <div class="posts-header">
          <h2 class="posts-title">최근 후기</h2>
          <button class="register-post-button" @click="handlePostRegistration">
            후기 작성하기
          </button>
        </div>
        
        <div class="posts-grid">
          <article 
            v-for="post in posts" 
            :key="post.id" 
            class="post-card"
          >
            <div class="post-category">{{ post.category }}</div>
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-preview">{{ post.preview }}</p>
            <div class="post-meta">
              <div class="post-author">{{ post.author }}</div>
              <div class="post-date">{{ post.date }}</div>
            </div>
            <div class="post-stats">
              <span class="post-likes">👍 {{ post.likes }}</span>
              <span class="post-comments">💬 {{ post.comments }}</span>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.landing-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

.hero-section {
  text-align: center;
  padding: 4rem 0 3rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.fortune-selection {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.fortune-button {
  padding: 1rem 2rem;
  border: 2px solid #F37021;
  background-color: transparent;
  color: #F37021;
  border-radius: 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.fortune-button:hover {
  background-color: #F37021;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(243, 112, 33, 0.3);
}

.fortune-button:active {
  transform: translateY(0);
}



.search-row {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}


.search-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-width: 300px;
  flex: 1;
  max-width: 400px;
}

.search-input:focus {
  outline: none;
  border-color: #F37021;
}

.search-button {
  padding: 0.75rem 2rem;
  background-color: #F37021;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: #e85d0e;
}

/* Posts Section */
.posts-section {
  margin-top: 4rem;
  padding: 2rem 0;
}

.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.posts-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.register-post-button {
  padding: 0.75rem 1.5rem;
  background-color: #F37021;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.register-post-button:hover {
  background-color: #e85d0e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(243, 112, 33, 0.3);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.post-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #F37021;
}

.post-category {
  display: inline-block;
  background-color: #F37021;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.post-preview {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #9ca3af;
}

.post-author {
  font-weight: 500;
}

.post-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.post-likes,
.post-comments {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}


/* Responsive design */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-button {
    width: 100%;
    max-width: 300px;
  }
  
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    min-width: 100%;
    max-width: 100%;
  }
  
  .search-button {
    width: 100%;
  }
  
  .posts-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .posts-title {
    font-size: 1.75rem;
  }
  
  .register-post-button {
    width: 100%;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>