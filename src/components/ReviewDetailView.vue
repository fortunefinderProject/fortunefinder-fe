<script setup lang="ts">
import { ref, computed } from 'vue'

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
  review: Review
}

const props = defineProps<Props>()
const emit = defineEmits<{
  back: []
}>()

// Comments data for reviews
const reviewComments = ref<Record<number, Comment[]>>({
  1: [
    { id: 1, author: '이영희', content: '저도 같은 경험이에요!', date: '2025-10-06' },
    { id: 2, author: '박민수', content: '정말 좋은 리뷰 감사합니다', date: '2025-10-07' }
  ],
  2: [
    { id: 3, author: '최지우', content: '유용한 정보네요', date: '2025-10-04' }
  ]
})

// New comment input
const newComment = ref('')

/**
 * Get comments for current review
 */
const currentComments = computed(() => {
  if (!props.review?.id) return []
  return reviewComments.value[props.review.id] || []
})

/**
 * Add comment to current review
 */
const addComment = () => {
  if (!newComment.value.trim() || !props.review?.id) {
    alert('댓글 내용을 입력해주세요')
    return
  }

  const reviewId = props.review.id
  if (!reviewComments.value[reviewId]) {
    reviewComments.value[reviewId] = []
  }

  const newId = Math.max(...Object.values(reviewComments.value).flat().map(c => c.id), 0) + 1
  reviewComments.value[reviewId].push({
    id: newId,
    author: '나',
    content: newComment.value,
    date: new Date().toISOString().split('T')[0]
  })

  newComment.value = ''
  alert('댓글이 등록되었습니다')
}

/**
 * Get source badge style
 */
const getSourceBadgeClass = (source: Review['source']) => {
  return `source-badge source-${source}`
}

/**
 * Go back to shop detail
 */
const goBack = () => {
  emit('back')
}
</script>

<template>
  <div class="review-detail-full">
    <!-- Back Button -->
    <button class="back-button-content" @click="goBack">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      뒤로 가기
    </button>

    <!-- Review Content -->
    <div class="review-detail-content">
      <div class="review-detail-header">
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
      <p class="review-full-content">{{ review.content }}</p>
    </div>

    <!-- Comments Section -->
    <div class="comments-section">
      <h4 class="comments-title">댓글 {{ currentComments.length }}</h4>
      <div class="comments-list">
        <div v-for="comment in currentComments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-date">{{ comment.date }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
        <div v-if="currentComments.length === 0" class="no-comments">
          첫 댓글을 남겨보세요!
        </div>
      </div>

      <!-- Add Comment Form -->
      <div class="add-comment-form">
        <textarea
          v-model="newComment"
          placeholder="댓글을 입력하세요..."
          rows="3"
          class="comment-textarea"
        ></textarea>
        <button class="submit-comment-button" @click="addComment">
          댓글 등록
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Review Detail Full Width View */
.review-detail-full {
  grid-column: 1 / -1; /* Span all columns */
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Back Button in Content Area */
.back-button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #6b7280;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  width: fit-content;
}

.back-button-content:hover {
  background-color: #f9fafb;
  border-color: #F37021;
  color: #F37021;
}

.back-button-content svg {
  width: 1.25rem;
  height: 1.25rem;
}

.review-detail-content {
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.review-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.review-author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.review-author {
  font-weight: 600;
  color: #1f2937;
  font-size: 1.125rem;
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
  margin-bottom: 1rem;
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 1.25rem;
  color: #F37021;
  opacity: 0.3;
}

.star.filled {
  opacity: 1;
}

.review-full-content {
  color: #4b5563;
  line-height: 1.8;
  margin: 0;
  font-size: 1.0625rem;
  white-space: pre-wrap;
}

/* Comments Section */
.comments-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comments-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #F37021;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  padding: 1.25rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.comment-item:hover {
  background-color: #fff7ed;
  border-color: #F37021;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
}

.comment-date {
  font-size: 0.875rem;
  color: #9ca3af;
}

.comment-content {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.no-comments {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
  font-size: 1rem;
}

/* Add Comment Form */
.add-comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background-color: #fff7ed;
  border-radius: 0.75rem;
  border: 1px solid #F37021;
}

.comment-textarea {
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

.comment-textarea:focus {
  outline: none;
  border-color: #F37021;
  box-shadow: 0 0 0 3px rgba(243, 112, 33, 0.1);
}

.submit-comment-button {
  padding: 0.75rem 1.25rem;
  background-color: #F37021;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-end;
}

.submit-comment-button:hover {
  background-color: #e85d0e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(243, 112, 33, 0.3);
}
</style>
