<script setup lang="ts">
import { ref } from 'vue'

interface Review {
  id: number
  author: string
  content: string
  rating: number
  date: string
  source: 'community' | 'naver' | 'kakao'
}

interface PriceEntry {
  id: number
  author: string
  service: string
  price: number
  date: string
}

const emit = defineEmits<{
  showReview: [reviewId: number]
}>()

// Sample reviews data
const reviews = ref<Review[]>([
  { id: 1, author: '김철수', content: '사주를 정확하게 봐주셔서 감사합니다!', rating: 5, date: '2025-10-05', source: 'community' },
  { id: 2, author: '이영희', content: '친절하고 상세하게 설명해주셨어요', rating: 4.5, date: '2025-10-03', source: 'community' },
  { id: 3, author: '네이버유저', content: '분위기가 좋고 깔끔해요', rating: 4, date: '2025-09-28', source: 'naver' },
  { id: 4, author: '카카오유저', content: '다시 방문하고 싶습니다', rating: 5, date: '2025-09-25', source: 'kakao' }
])

// User review form
const userReview = ref({
  content: '',
  rating: 5
})

// Tab state
const activeTab = ref<'reviews' | 'prices'>('reviews')

// Sample price data
const prices = ref<PriceEntry[]>([
  { id: 1, author: '김철수', service: '사주팔자', price: 30000, date: '2025-10-05' },
  { id: 2, author: '이영희', service: '타로 상담', price: 20000, date: '2025-10-03' },
  { id: 3, author: '박민수', service: '종합 운세', price: 50000, date: '2025-09-28' },
  { id: 4, author: '최지우', service: '궁합 풀이', price: 40000, date: '2025-09-25' }
])

/**
 * Submit user review
 */
const submitReview = () => {
  if (!userReview.value.content.trim()) {
    alert('리뷰 내용을 입력해주세요')
    return
  }

  // TODO: Implement review submission API
  console.log('Submit review:', userReview.value)
  alert('리뷰가 등록되었습니다')
  userReview.value.content = ''
  userReview.value.rating = 5
}

/**
 * Get source badge style
 */
const getSourceBadgeClass = (source: Review['source']) => {
  return `source-badge source-${source}`
}

/**
 * Show review detail
 */
const showReviewDetail = (reviewId: number) => {
  emit('showReview', reviewId)
}
</script>

<template>
  <!-- Left: Reviews/Prices Section -->
  <div class="reviews-section">
    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'reviews' }"
        @click="activeTab = 'reviews'"
      >
        리뷰
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'prices' }"
        @click="activeTab = 'prices'"
      >
        가격표
      </button>
    </div>

    <!-- Reviews List -->
    <div v-if="activeTab === 'reviews'" class="reviews-list">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="review-item"
      >
        <div class="review-header">
          <div class="review-author-info">
            <span class="review-author">{{ review.author }}</span>
            <span :class="getSourceBadgeClass(review.source)">
              {{ review.source === 'community' ? '커뮤니티' : review.source }}
            </span>
          </div>
          <span class="review-date">{{ review.date }}</span>
        </div>
        <div class="review-rating">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
        </div>
        <p class="review-content">{{ review.content }}</p>
        <div class="review-footer">
          <button class="read-more-button" @click="showReviewDetail(review.id)">더보기</button>
        </div>
      </div>
    </div>

    <!-- Prices List -->
    <div v-if="activeTab === 'prices'" class="prices-list">
      <div
        v-for="price in prices"
        :key="price.id"
        class="price-item"
      >
        <div class="price-header">
          <span class="price-author">{{ price.author }}</span>
          <span class="price-date">{{ price.date }}</span>
        </div>
        <div class="price-service">{{ price.service }}</div>
        <div class="price-amount">{{ price.price.toLocaleString() }}원</div>
      </div>
    </div>
  </div>

  <!-- Right: Write Review Section -->
  <div class="write-review-section">
    <h3 class="section-title">리뷰 작성</h3>
    <div class="review-form">
      <div class="rating-input">
        <label>평점</label>
        <div class="star-rating">
          <button
            v-for="i in 5"
            :key="i"
            type="button"
            @click="userReview.rating = i"
            class="star-button"
            :class="{ active: i <= userReview.rating }"
          >
            ★
          </button>
        </div>
      </div>

      <div class="content-input">
        <label>리뷰 내용</label>
        <textarea
          v-model="userReview.content"
          placeholder="이곳을 방문한 경험을 공유해주세요"
          rows="8"
          class="review-textarea"
        ></textarea>
      </div>

      <button class="submit-button" @click="submitReview">
        리뷰 등록
      </button>
    </div>
  </div>
</template>

<style scoped>
.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.25rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #F37021;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  font-weight: 700;
  color: #9ca3af;
  padding: 0.5rem 1rem;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-button:hover {
  color: #6b7280;
}

.tab-button.active {
  color: #1f2937;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #F37021;
}

/* Reviews Section */
.reviews-section {
  display: flex;
  flex-direction: column;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.review-item {
  padding: 1.25rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.review-item:hover {
  background-color: #fff7ed;
  border-color: #F37021;
  box-shadow: 0 2px 8px rgba(243, 112, 33, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.review-author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.review-author {
  font-weight: 600;
  color: #1f2937;
}

.source-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.source-community {
  background-color: #F37021;
  color: white;
}

.source-naver {
  background-color: #03C75A;
  color: white;
}

.source-kakao {
  background-color: #FEE500;
  color: #3C1E1E;
}

.review-date {
  font-size: 0.875rem;
  color: #9ca3af;
}

.review-rating {
  margin-bottom: 0.5rem;
  display: flex;
  gap: 0.125rem;
}

.star {
  font-size: 0.875rem;
  color: #F37021;
  opacity: 0.3;
}

.star.filled {
  opacity: 1;
}

.review-content {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.review-footer{
  display: flex;
  justify-content: flex-end;
  margin-top: .5rem;
}

.read-more-button{
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color .2s;
}

.read-more-button:hover{
  color: #6b7280;
}

/* Prices Section */
.prices-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.price-item {
  padding: 1.25rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.price-item:hover {
  background-color: #fff7ed;
  border-color: #F37021;
  box-shadow: 0 2px 8px rgba(243, 112, 33, 0.1);
}

.price-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.price-author {
  font-weight: 600;
  color: #1f2937;
}

.price-date {
  font-size: 0.875rem;
  color: #9ca3af;
}

.price-service {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.price-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #F37021;
}

/* Write Review Section */
.write-review-section {
  display: flex;
  flex-direction: column;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rating-input,
.content-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-input label,
.content-input label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.star-rating {
  display: flex;
  gap: 0.5rem;
}

.star-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  color: #F37021;
  opacity: 0.3;
  transition: all 0.2s;
}

.star-button:hover,
.star-button.active {
  opacity: 1;
  transform: scale(1.1);
}

.review-textarea {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s;
}

.review-textarea:focus {
  outline: none;
  border-color: #F37021;
  box-shadow: 0 0 0 3px rgba(243, 112, 33, 0.1);
}

.submit-button {
  padding: 0.875rem 1.5rem;
  background-color: #F37021;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-button:hover {
  background-color: #e85d0e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(243, 112, 33, 0.3);
}
</style>
