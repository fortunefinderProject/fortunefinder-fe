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
</script>

<template>
  <div class="landing-page">
    <main class="main-content">
      <section class="hero-section">
        <h1 class="hero-title">Fortune Finder</h1>
        <p class="hero-description">
          사주, 신점, 타로에 대한 모든 정보를 한 곳에서 만나보세요
        </p>
        
        <!-- Fortune type selection buttons -->
        <div class="fortune-selection">
          <button class="fortune-button" @click="selectFortuneType('사주')">사주</button>
          <button class="fortune-button" @click="selectFortuneType('신점')">신점</button>
          <button class="fortune-button" @click="selectFortuneType('타로')">타로</button>
        </div>
      </section>

      <section class="search-section">
        <h2 class="section-title">장소 검색</h2>
        
        <!-- Search controls row -->
        <div class="search-row">
          <select class="region-select">
            <option value="">지역 선택</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="부산">부산</option>
            <option value="대구">대구</option>
            <option value="대전">대전</option>
            <option value="광주">광주</option>
            <option value="울산">울산</option>
          </select>
          
          <input type="text" class="search-input" placeholder="장소명 또는 키워드를 입력하세요">
          
          <button class="search-button" @click="handleSearch">검색</button>
        </div>
        
        <!-- Place registration row -->
        <div class="register-row">
          <button class="register-button" @click="handlePlaceRegistration">장소등록하기</button>
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

.search-section {
  padding: 4rem 0;
  background-color: #f9fafb;
  border-radius: 1rem;
  margin: 2rem 0;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-bottom: 3rem;
}

.search-row {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.region-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  min-width: 120px;
}

.region-select:focus {
  outline: none;
  border-color: #F37021;
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

.register-row {
  display: flex;
  justify-content: center;
}

.register-button {
  padding: 0.75rem 2rem;
  background-color: transparent;
  color: #F37021;
  border: 2px solid #F37021;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.register-button:hover {
  background-color: #F37021;
  color: white;
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
}
</style>