<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ShopDetailView from './ShopDetailView.vue'
import ReviewDetailView from './ReviewDetailView.vue'

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

interface Comment {
  id: number
  author: string
  content: string
  date: string
}

interface Props {
  shop: Shop | null
  isOpen: boolean
  selectedReviewId?: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// View state: 'shop' for shop details, 'review' for review detail
const currentView = ref<'shop' | 'review'>('shop')
const currentReviewId = ref<number | null>(null)

// Sample reviews data
const reviews = ref<Review[]>([
  { id: 1, author: '김철수', content: '사주를 정확하게 봐주셔서 감사합니다!', rating: 5, date: '2025-10-05', source: 'community' },
  { id: 2, author: '이영희', content: '친절하고 상세하게 설명해주셨어요', rating: 4.5, date: '2025-10-03', source: 'community' },
  { id: 3, author: '네이버유저', content: '분위기가 좋고 깔끔해요', rating: 4, date: '2025-09-28', source: 'naver' },
  { id: 4, author: '카카오유저', content: '다시 방문하고 싶습니다', rating: 5, date: '2025-09-25', source: 'kakao' }
])

// Watch for selectedReviewId prop
watch(() => props.selectedReviewId, (reviewId) => {
  if (reviewId) {
    showReviewDetail(reviewId)
  }
}, { immediate: true })

/**
 * Get current review
 */
const currentReview = computed(() => {
  if (!currentReviewId.value) return null
  return reviews.value.find(r => r.id === currentReviewId.value) || null
})

/**
 * Show review detail view
 */
const showReviewDetail = (reviewId: number) => {
  currentReviewId.value = reviewId
  currentView.value = 'review'
}

/**
 * Go back to shop detail view
 */
const backToShopDetail = () => {
  currentView.value = 'shop'
  currentReviewId.value = null
}

/**
 * Close modal when clicking outside or on close button
 */
const closeModal = () => {
  currentView.value = 'shop'
  currentReviewId.value = null
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
              <!-- 공유하기 버튼-->
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
                <span class="rating-star">★</span>
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
          <!-- Shop Detail View -->
          <ShopDetailView v-if="currentView === 'shop'" @showReview="showReviewDetail" />

          <!-- Review Detail View -->
          <ReviewDetailView
            v-if="currentView === 'review' && currentReview"
            :review="currentReview"
            @back="backToShopDetail"
          />
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
  color: #F37021;
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
}

@media (max-width: 768px) {
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
}
</style>
