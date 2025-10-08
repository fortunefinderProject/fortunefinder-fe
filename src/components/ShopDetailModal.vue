<script setup lang="ts">
import { ref } from 'vue'

interface Shop {
  id: number
  name: string
  address: string
  rating: number
  reviewCount: number
  priceRange: '$' | '$$' | '$$$'
}

interface Review {
  id: number
  author: string
  content: string
  rating: number
  date: string
  source: 'community' | 'naver' | 'kakao'
}

interface Props {
  shop: Shop | null
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
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

/**
 * Close modal when clicking outside or on close button
 */
const closeModal = () => {
  emit('close')
}

/**
 * Copy address to clipboard
 */
const copyAddress = async () => {
  if (!props.shop?.address) return

  try {
    await navigator.clipboard.writeText(props.shop.address)
    alert('주소가 복사되었습니다')
  } catch (err) {
    console.error('Failed to copy address:', err)
  }
}

/**
 * Share shop information
 */
const shareShop = () => {
  if (!props.shop) return

  // TODO: Implement sharing functionality
  console.log('Share shop:', props.shop.name)
  alert('공유 기능 준비중입니다')
}

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
 * Prevent modal close when clicking inside content
 */
const handleContentClick = (e: Event) => {
  e.stopPropagation()
}
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen && shop" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click="handleContentClick">
        <!-- Header Section -->
        <div class="modal-header">
          <div class="header-left">
            <h2 class="shop-name">{{ shop.name }}</h2>
            <div class="address-section">
              <span class="address-text">{{ shop.address }}</span>
              <button class="copy-button" @click="copyAddress" title="주소 복사">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="header-right">
            <div class="shop-info">
              <div class="rating-section">
                <span class="rating-star">⭐</span>
                <span class="rating-value">{{ shop.rating }}</span>
                <span class="review-count">({{ shop.reviewCount }})</span>
              </div>
              <div class="price-range">{{ shop.priceRange }}</div>
            </div>
            <button class="share-button" @click="shareShop" title="공유하기">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content Section -->
        <div class="modal-content">
          <!-- Left: Reviews Section -->
          <div class="reviews-section">
            <h3 class="section-title">리뷰</h3>
            <div class="reviews-list">
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
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">⭐</span>
                </div>
                <p class="review-content">{{ review.content }}</p>
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
                    ⭐
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
        </div>

        <!-- Close Button -->
        <button class="close-modal-button" @click="closeModal" title="닫기">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-container {
  position: relative;
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 1200px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* Header Section */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  gap: 2rem;
  background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%);
}

.header-left {
  flex: 1;
  min-width: 0;
}

.shop-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
}

.address-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.address-text {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
}

.copy-button {
  padding: 0.375rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-button:hover {
  background-color: rgba(243, 112, 33, 0.1);
}

.copy-button svg {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
}

.header-right {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.shop-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 1rem;
}

.rating-star {
  font-size: 1.25rem;
}

.rating-value {
  font-weight: 700;
  color: #1f2937;
}

.review-count {
  color: #6b7280;
  font-size: 0.9rem;
}

.price-range {
  font-size: 1.125rem;
  font-weight: 600;
  color: #F37021;
  letter-spacing: 0.05em;
}

.share-button {
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-button:hover {
  background-color: #F37021;
  border-color: #F37021;
}

.share-button:hover svg {
  color: white;
}

.share-button svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
  transition: color 0.2s;
}

/* Content Section */
.modal-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.25rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #F37021;
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

/* Close Button */
.close-modal-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.close-modal-button:hover {
  background-color: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.close-modal-button svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #1f2937;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* Scrollbar */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #F37021;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #e85d0e;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .modal-content {
    grid-template-columns: 1fr;
  }

  .write-review-section {
    order: -1;
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-header {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .shop-name {
    font-size: 1.5rem;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.125rem;
  }
}
</style>
