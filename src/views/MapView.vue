<template>
  <div class="page-wrapper">
    <!-- MapView 전용 헤더 (AppHeader 스타일 기반) -->
    <header class="app-header">
      <div class="header-container">
        <!-- Left section: Logo + Search bar -->
        <div class="header-left">
          <!-- Logo -->
          <div class="logo" @click="clickLogo">
            <img src="/images/fflogo.svg" alt="FortuneFinder" class="logo-image">
            FortuneFinder
          </div>

          <!-- Search bar -->
          <div class="search-bar">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="업체, 주소 검색"
              @keyup.enter="handleSearch"
            />
            <button class="search-button" @click="handleSearch">
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Right section: Login button -->
        <button class="login-btn" @click="handleLogin">
          Login
        </button>
      </div>
    </header>

    <!-- 메인 컨테이너 -->
    <div class="main-container">
      <!-- 지도 영역 -->
      <div id="map" class="map"></div>

      <!-- 접기/펼치기 버튼 -->
      <button class="toggle-button" @click="isPanelOpen = !isPanelOpen">
        {{ isPanelOpen ? '>' : '<' }}
      </button>

      <!-- 사이드 패널 -->
      <div class="side-panel" :class="{ closed: !isPanelOpen }">
        <!-- 리스트 정렬 필터 -->
        <div class="filters">
          <button
            class="filters-button"
            :class="{ active: activeFilter === '추천순' }"
            @click="activeFilter = '추천순'"
          >
            추천순
          </button>
          <button
            class="filters-button"
            :class="{ active: activeFilter === '리뷰순' }"
            @click="activeFilter = '리뷰순'"
          >
            리뷰순
          </button>
        </div>

        <!-- 마커 호버 시 정보 표시 -->
        <div v-if="hoveredStore" class="hover-info">
          <h3>{{ hoveredStore.name }}</h3>
          <p>ID: {{ hoveredStore.id }}</p>
          <p>주소: {{ hoveredStore.address }}</p>
          <p>좌표: ({{ hoveredStore.lat }}, {{ hoveredStore.lng }})</p>
          <p>운영시간: {{ hoveredStore.hours }}</p>
          <p>영업중: {{ hoveredStore.isOpen ? '예' : '아니오' }}</p>
          <p>리뷰 수: {{ hoveredStore.reviewCount }}</p>
          <p>평점: ★ {{ hoveredStore.rating }}</p>
        </div>

        <!-- 카드형 리스트 -->
        <div class="store-list">
          <div v-for="store in sortedStores" :key="store.id" class="store-card" @click="openShopDetail(store)">
            <h3>{{ store.name }}</h3>
            <p>{{ store.address }}</p>
            <small>★ {{ store.rating }}점 | 리뷰 수: {{ store.reviewCount }}</small>

            <div class="reviews">
              <div v-for="review in store.reviews" :key="review.id" class="review-card" @click.stop="openReviewDetail(store, review)">
                <strong>{{ review.author }}</strong> <small>{{ review.date }}</small>
                <p>{{ review.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Shop Detail Modal -->
      <ShopDetailModal
        :shop="selectedShop"
        :isOpen="isModalOpen"
        :selectedReviewId="selectedReviewId"
        @close="closeShopDetail"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import ShopDetailModal from "@/components/ShopDetailModal.vue";

const router = useRouter();
const map = ref(null);
const markers = ref([]);
const hoveredStore = ref(null);
const activeFilter = ref('추천순');
const isPanelOpen = ref(true);
const selectedShop = ref(null);
const isModalOpen = ref(false);
const selectedReviewId = ref(null);
const searchQuery = ref('');

const stores = ref([
  {
    id: 1, name: "도깨비 사주풀이", address: "망원로 37-9", lat: 37.5546, lng: 126.9102,
    rating: 4.5, distance: 250, priceRange: '$$',
    hours: "17:00 ~ 02:00", isOpen: true, reviewCount: 20,
    reviews: [
      { id: 1, author: "김철수", content: "신기해요. 친절해요.", date: "2025-10-09" },
      { id: 2, author: "이영희", content: "상세하게 설명해주세요. 추천합니다!", date: "2025-10-08" },
      { id: 3, author: "이지현", content: "너무 소름돋아요... 제가 지금까지 여러 곳을 가봤었는데 여기는 진짜 추천해요. 한 번 가보세요..", date: "2025-10-08" }
    ]
  },
  {
    id: 2, name: "망리단길 사주카페", address: "포은로 118", lat: 37.5565, lng: 126.9145,
    rating: 4.7, distance: 320, priceRange: '$$$',
    hours: "12:00 ~ 21:00", isOpen: true, reviewCount: 15,
    reviews: [
      { id: 4, author: "최지우", content: "사주 정확해요!", date: "2025-10-09" },
      { id: 5, author: "정민호", content: "카페 분위기도 좋고 상담도 만족스러웠어요.", date: "2025-10-08" },
    ]
  },
  {
    id: 3, name: "연남동 타로&사주", address: "동교로 204", lat: 37.5625, lng: 126.9235,
    rating: 4.9, distance: 580, priceRange: '$$',
    hours: "13:00 ~ 22:00", isOpen: true, reviewCount: 23,
    reviews: [
      { id: 6, author: "한소희", content: "정말 신기했어요. 추천합니다!", date: "2025-10-08" },
      { id: 7, author: "강민지", content: "친절하고 자세하게 봐주셨어요.", date: "2025-10-07" },
      { id: 8, author: "윤서준", content: "고민 해결에 도움 됐습니다.", date: "2025-10-06" },
    ]
  },
  {
    id: 4, name: "홍대 운명풀이", address: "와우산로 29길 18", lat: 37.5575, lng: 126.9265,
    rating: 4.6, distance: 710, priceRange: '$',
    hours: "14:00 ~ 23:00", isOpen: true, reviewCount: 18,
    reviews: [
      { id: 9, author: "이준호", content: "상담 시간이 넉넉해서 좋았어요.", date: "2025-10-09" },
      { id: 10, author: "박서연", content: "재방문 의사 있습니다!", date: "2025-10-07" },
    ]
  },
  {
    id: 5, name: "합정 별자리 사주방", address: "양화로 45", lat: 37.5495, lng: 126.9135,
    rating: 4.4, distance: 420, priceRange: '$$',
    hours: "11:00 ~ 20:00", isOpen: false, reviewCount: 10,
    reviews: [
      { id: 11, author: "김유진", content: "조용하고 프라이빗해요.", date: "2025-10-06" },
    ]
  },
]);

const sortedStores = computed(() => {
  let filtered = stores.value;
  
  // 검색어 필터링
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(store => 
      store.name.toLowerCase().includes(query) || 
      store.address.toLowerCase().includes(query)
    );
  }
  
  // 정렬 (리뷰순 수정)
  return [...filtered].sort((a, b) => {
    if (activeFilter.value === "추천순") return b.rating - a.rating;
    if (activeFilter.value === "리뷰순") return b.reviewCount - a.reviewCount;
    return 0;
  });
});

// 라우터 네비게이션
const clickLogo = () => {
  router.push({ name: 'home' });
};

const handleLogin = () => {
  router.push({ name: 'login' });
};

const handleSearch = () => {
  console.log('검색:', searchQuery.value);
};

onMounted(() => {
  if (typeof kakao === 'undefined') {
    console.error('카카오맵 API가 로드되지 않았습니다.');
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&autoload=false';
    script.onload = () => {
      kakao.maps.load(initMap);
    };
    document.head.appendChild(script);
  } else {
    initMap();
  }
});

function initMap() {
  map.value = new kakao.maps.Map(document.getElementById("map"), {
    center: new kakao.maps.LatLng(37.5546, 126.9102),
    level: 4
  });

  stores.value.forEach(store => {
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(store.lat, store.lng),
      title: store.name,
      map: map.value
    });

    const infoContent = `
      <div style="padding:10px; min-width:200px; font-size:14px;">
        <strong>${store.name}</strong><br>
        ID: ${store.id}<br>
        주소: ${store.address}<br>
        좌표: (${store.lat}, ${store.lng})<br>
        운영시간: ${store.hours}<br>
        영업중: ${store.isOpen ? '예' : '아니오'}<br>
        리뷰 수: ${store.reviewCount}<br>
        평점: ★ ${store.rating}
      </div>
    `;

    const infowindow = new kakao.maps.InfoWindow({ content: infoContent });

    kakao.maps.event.addListener(marker, "mouseover", () => {
      infowindow.open(map.value, marker);
      hoveredStore.value = store;
    });
    kakao.maps.event.addListener(marker, "mouseout", () => {
      infowindow.close();
      hoveredStore.value = null;
    });

    markers.value.push({ storeId: store.id, marker });
  });
}

function openShopDetail(store) {
  selectedShop.value = store;
  selectedReviewId.value = null;
  isModalOpen.value = true;
}

function openReviewDetail(store, review) {
  selectedShop.value = store;
  selectedReviewId.value = review.id;
  isModalOpen.value = true;
}

function closeShopDetail() {
  isModalOpen.value = false;
  selectedShop.value = null;
  selectedReviewId.value = null;
}
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* AppHeader 스타일 그대로 유지 */
.app-header {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.75rem 2rem;
}

/* Left section: Logo + Search bar */
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 480;
  color: #1f2937;
  cursor: pointer;
  white-space: nowrap;
}

.logo-image {
  height: 2rem;
  width: auto;
}

/* 검색바 (로고 바로 옆) */
.search-bar {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 24px;
  padding: 12.5px 16px;
  flex: 1;
  max-width: 500px;
}

.search-bar input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  padding: 0;
}

.search-button {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  display: flex;
  align-items: center;
  color: #666;
  transition: color 0.2s ease;
}

.search-button:hover {
  color: #F37021;
}

.login-btn {
  background-color: #F37021;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-btn:hover {
  background-color: #e85d0e;
}

.login-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(243, 112, 33, 0.1);
}

/* 메인 컨테이너 */
.main-container {
  flex: 1;
  display: flex;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.map {
  flex: 2;
  height: 100%;
}

.toggle-button {
  position: absolute;
  right: 466px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #F37021;
  background: white;
  color: #F37021;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1000;
}

.main-container:has(.side-panel.closed) .toggle-button {
  right: 16px;
}

.toggle-button:hover {
  background: #F37021;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.side-panel {
  flex: 0 0 450px;
  overflow-y: auto;
  max-height: 100%;
  transition: all 0.3s ease;
}

.side-panel.closed {
  flex: 0 0 0;
  overflow: hidden;
  opacity: 0;
  width: 0;
}

/* 정렬 필터 */
.filters {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}

.filters-button {
  flex: 1;
  padding: 6px 0;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filters-button.active {
  background-color: #F37021;
  color: #fff;
  border-color: #F37021;
}

.filters-button:not(.active):hover {
  background-color: #F37021;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(243, 112, 33, 0.3);
}

.filters-button:active {
  transform: translateY(0);
}

.store-list {
  margin-top: 16px;
}

.store-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
  cursor: pointer;
}

.store-card:hover {
  border-color: #F37021;
  box-shadow: 0 6px 15px rgba(243,112,33,0.3);
}

.store-card h3 {
  margin: 0 0 6px;
  transition: color 0.3s ease;
}

.store-card:hover h3 {
  color: #F37021;
}

.review-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
  margin-top: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.review-card:hover {
  background: #fff3e6;
  border: 1px solid #F37021;
  transform: translateX(4px);
}

.hover-info {
  background: #fff;
  border: 1px solid #F37021;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(243, 112, 33, 0.2);
}

.reviews {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 12px;
  padding-right: 4px;
}

.reviews::-webkit-scrollbar {
  width: 6px;
}

.reviews::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.reviews::-webkit-scrollbar-thumb {
  background: #F37021;
  border-radius: 10px;
}

.reviews::-webkit-scrollbar-thumb:hover {
  background: #d65a15;
}
</style>