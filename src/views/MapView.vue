<template>
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
          @click="() => { console.log('추천순 클릭'); activeFilter = '추천순'; }"
        >
          추천순
        </button>
        <button
          class="filters-button"
          :class="{ active: activeFilter === '거리순' }"
          @click="() => { console.log('거리순 클릭'); activeFilter = '거리순'; }"
        >
          거리순
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
        <div v-for="store in sortedStores" :key="store.id" class="store-card">
          <h3>{{ store.name }}</h3>
          <p>{{ store.address }}</p>
          <small>★ {{ store.rating }}점 | 리뷰 수: {{ store.reviewCount }}</small>

          <div class="reviews">
            <div v-for="review in store.reviews" :key="review.id" class="review-card">
              <strong>{{ review.author }}</strong> <small>{{ review.date }}</small>
              <p>{{ review.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const map = ref(null);
const markers = ref([]);
const hoveredStore = ref(null);
const activeFilter = ref('추천순'); // 기본값
const isPanelOpen = ref(true); // 패널 열림/닫힘 상태

const stores = ref([
  { 
    id: 1, name: "도깨비 사주풀이", address: "망원로 37-9", lat: 37.5546, lng: 126.9102,
    rating: 4.8, distance: 250,
    hours: "17:00 ~ 02:00", isOpen: true, reviewCount: 12,
    reviews: [
      { id: 1, author: "김철수", content: "신기해요. 친절해요.", date: "2025-10-09" },
      { id: 2, author: "이영희", content: "상세하게 설명해주세요. 추천합니다!", date: "2025-10-08" },
    ]
  },
  { 
    id: 2, name: "망리단길 사주카페", address: "포은로 118", lat: 37.5565, lng: 126.9145,
    rating: 4.7, distance: 320,
    hours: "12:00 ~ 21:00", isOpen: true, reviewCount: 15,
    reviews: [
      { id: 3, author: "최지우", content: "사주 정확해요!", date: "2025-10-09" },
      { id: 4, author: "정민호", content: "카페 분위기도 좋고 상담도 만족스러웠어요.", date: "2025-10-08" },
    ]
  },
  { 
    id: 3, name: "연남동 타로&사주", address: "동교로 204", lat: 37.5625, lng: 126.9235,
    rating: 4.9, distance: 580,
    hours: "13:00 ~ 22:00", isOpen: true, reviewCount: 23,
    reviews: [
      { id: 5, author: "한소희", content: "정말 신기했어요. 추천합니다!", date: "2025-10-08" },
      { id: 6, author: "강민지", content: "친절하고 자세하게 봐주셨어요.", date: "2025-10-07" },
      { id: 7, author: "윤서준", content: "고민 해결에 도움 됐습니다.", date: "2025-10-06" },
    ]
  },
  { 
    id: 4, name: "홍대 운명풀이", address: "와우산로 29길 18", lat: 37.5575, lng: 126.9265,
    rating: 4.6, distance: 710,
    hours: "14:00 ~ 23:00", isOpen: true, reviewCount: 18,
    reviews: [
      { id: 8, author: "이준호", content: "상담 시간이 넉넉해서 좋았어요.", date: "2025-10-09" },
      { id: 9, author: "박서연", content: "재방문 의사 있습니다!", date: "2025-10-07" },
    ]
  },
  { 
    id: 5, name: "합정 별자리 사주방", address: "양화로 45", lat: 37.5495, lng: 126.9135,
    rating: 4.4, distance: 420,
    hours: "11:00 ~ 20:00", isOpen: false, reviewCount: 10,
    reviews: [
      { id: 10, author: "김유진", content: "조용하고 프라이빗해요.", date: "2025-10-06" },
    ]
  },
]);

const sortedStores = computed(() => {
  return [...stores.value].sort((a, b) => {
    if (activeFilter.value === "추천순") return b.rating - a.rating;
    if (activeFilter.value === "거리순") return a.distance - b.distance;
    return 0;
  });
});

onMounted(() => {
  // 카카오맵 스크립트 로드 확인
  if (typeof kakao === 'undefined') {
    console.error('카카오맵 API가 로드되지 않았습니다.');
    // 스크립트 동적 로드
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
</script>

<style scoped>
.main-container {
  display: flex;
  gap: 16px;
  position: relative;
}

.map {
  flex: 2;
  height: 100vh;
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
  max-height: 100vh;
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

/* 클릭된 상태 */
.filters-button.active {
  background-color: #F37021;
  color: #fff;
  border-color: #F37021;
}

/* 호버 시 효과 (활성 상태가 아닐 때만) */
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
}

.review-card:hover {
  background: #fff3e6;
}

.hover-info {
  background: #fff;
  border: 1px solid #F37021;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(243, 112, 33, 0.2);
}
</style>