<script setup lang="ts">
import { ref } from 'vue'
import ShopDetailModal from './ShopDetailModal.vue'

// Props to receive the selected fortune type
interface Props {
  fortuneType?: string
}

const props = withDefaults(defineProps<Props>(), {
  fortuneType: '사주'
})

interface Shop {
  id: number
  name: string
  address: string
  rating: number
  reviewCount: number
  priceRange: '$' | '$$' | '$$$'
}

// State for flip animation
const isFlipped = ref(false)

// Modal state
const isModalOpen = ref(false)
const selectedShop = ref<Shop | null>(null)

// Toggle flip state
const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

// Sample popular places data - would come from API in production
const popularPlaces = ref<Shop[]>([
  { id: 1, name: '강남 사주카페', rating: 4.8, reviewCount: 128, address: '서울특별시 강남구 테헤란로 123', priceRange: '$$' },
  { id: 2, name: '명동 점집', rating: 4.9, reviewCount: 256, address: '서울특별시 중구 명동길 45', priceRange: '$$$' },
  { id: 3, name: '홍대 타로샵', rating: 4.7, reviewCount: 95, address: '서울특별시 마포구 홍익로 78', priceRange: '$' },
  { id: 4, name: '신촌 운세방', rating: 4.6, reviewCount: 73, address: '서울특별시 서대문구 신촌로 90', priceRange: '$$' },
  { id: 5, name: '이태원 점술소', rating: 4.8, reviewCount: 142, address: '서울특별시 용산구 이태원로 234', priceRange: '$$$' }
])

// Handle place click - open modal with shop details
const handlePlaceClick = (place: Shop) => {
  selectedShop.value = place
  isModalOpen.value = true
}

// Close modal
const closeModal = () => {
  isModalOpen.value = false
  selectedShop.value = null
}
</script>

<template>
  <div class="popular-places-widget">
    <div class="flip-container" :class="{ 'flipped': isFlipped }">
      <!-- Front: Circle button -->
      <div class="flip-front">
        <button class="circle-button" @click="toggleFlip" :title="`인기 ${fortuneType} 장소`">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <!-- Back: Popular places list -->
      <div class="flip-back">
        <div class="places-card">
          <div class="places-header">
            <h3 class="places-title">인기 {{ fortuneType }} 장소</h3>
            <button class="close-button" @click="toggleFlip" title="닫기">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="places-list">
            <div
              v-for="place in popularPlaces"
              :key="place.id"
              class="place-item"
              @click="handlePlaceClick(place)"
            >
              <div class="place-info">
                <div class="place-name">{{ place.name }}</div>
                <div class="place-stats">
                  <span class="rating">⭐ {{ place.rating }}</span>
                  <span class="reviews">리뷰 {{ place.reviewCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Shop Detail Modal -->
    <ShopDetailModal
      :shop="selectedShop"
      :is-open="isModalOpen"
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.popular-places-widget {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.flip-container {
  position: relative;
  width: 60px;
  height: 60px;
  transition: all 0.4s ease;
  perspective: 1000px;
  transform-origin: bottom right;
}

.flip-container.flipped {
  width: calc(100vw - 4rem);
  height: 160px;
  right: 0;
}

.flip-front,
.flip-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: transform 0.6s ease;
}

.flip-front {
  transform: rotateX(0deg);
}

.flip-container.flipped .flip-front {
  transform: rotateX(180deg);
}

.flip-back {
  transform: rotateX(-180deg);
}

.flip-container.flipped .flip-back {
  transform: rotateX(0deg);
}

/* Circle button (front) */
.circle-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #F37021;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(243, 112, 33, 0.4);
  transition: all 0.3s ease;
}

.circle-button:hover {
  background-color: #e85d0e;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(243, 112, 33, 0.5);
}

.circle-button svg {
  width: 28px;
  height: 28px;
  color: white;
}

/* Places card (back) */
.places-card {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.places-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #F37021;
  color: white;
}

.places-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.close-button {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.close-button svg {
  width: 20px;
  height: 20px;
  color: white;
}

.places-list {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.place-item {
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f9fafb;
  min-width: 200px;
  flex-shrink: 0;
}

.place-item:hover {
  background-color: #fff7ed;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(243, 112, 33, 0.15);
}

.place-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.place-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.place-stats {
  display: flex;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.reviews {
  color: #9ca3af;
}

/* Scrollbar styling */
.places-list::-webkit-scrollbar {
  height: 6px;
}

.places-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.places-list::-webkit-scrollbar-thumb {
  background: #F37021;
  border-radius: 10px;
}

.places-list::-webkit-scrollbar-thumb:hover {
  background: #e85d0e;
}

/* Responsive design */
@media (max-width: 768px) {
  .popular-places-widget {
    bottom: 1rem;
    right: 1rem;
  }

  .flip-container.flipped {
    width: calc(100vw - 2rem);
    height: 140px;
  }

  .places-title {
    font-size: 1rem;
  }

  .place-item {
    min-width: 160px;
    padding: 0.75rem;
  }

  .place-name {
    font-size: 0.9rem;
  }

  .place-stats {
    font-size: 0.8rem;
  }
}
</style>
