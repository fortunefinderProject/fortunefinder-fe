<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter() // 페이지 이동 등 라우팅 동작(push, replace, go 등) 수행
const route = useRoute() // 현재 활성화된 라우트 정보(params, query) 읽을 때 사용

// 라우트에서 type param 가져오기
const categoryType = computed(() => route.params.type || '카테고리')

// 선택한 지역
const selectedRegion = ref('')
const selectedCity = ref('서울') // 기본값 서울

// 드롭다운 상태
const showDropdown = ref(false)

// 최근 선택 지역 (최대 5개)
const recentRegions = ref<string[]>([])

// 시/구 데이터
const cities = [
  {
    name: '서울',
    districts: ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구']
  },
  {
    name: '경기',
    districts: ['수원시','성남시','고양시','용인시','부천시','안산시','안양시','남양주시','화성시','평택시','의정부시','시흥시','파주시','광명시','김포시','광주시','군포시','양주시','오산시','구리시','하남시','이천시','안성시','포천시','의왕시','여주시','양평군','동두천시','가평군','연천군']
  },
  {
    name: '인천',
    districts: ['계양구','남동구','동구','미추홀구','부평구','서구','연수구','중구','강화군','옹진군']
  }
]

// 드롭다운 열기/닫기
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 1차 선택: 시 선택
const selectCity = (city: string) => {
  selectedCity.value = city
}

// 2차 선택: 구 선택
const selectDistrict = (district: string) => {
  if (!selectedCity.value) return
  const region = `${selectedCity.value} ${district}`
  selectedRegion.value = region
  showDropdown.value = false

  // 최근 선택 지역 업데이트
  if (!recentRegions.value.includes(region)) {
    recentRegions.value.unshift(region)
    if (recentRegions.value.length > 5) recentRegions.value.pop()
  }
}

// 최근 선택 지역 삭제
const removeRecentRegion = (index: number) => {
  recentRegions.value.splice(index, 1)
}

// 현재 위치 기반 선택
const useCurrentLocation = () => {
  console.log('현재 위치 기반 선택')
  router.push({ name: 'map' }) // 단순히 MapView로 이동
}
</script>

<template>
  <div class="category-page">
    <section class="location-selection">
      <p class="section-label">어디로 갈까요?</p>

      <div class="selection-row">
        <div class="dropdown-wrapper">
          <div class="dropdown" @click="toggleDropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"> <path fill="currentColor" fill-rule="evenodd" d="M4 10a8 8 0 1 1 16 0c0 2.453-1.069 4.852-2.345 6.855-1.284 2.015-2.827 3.706-3.884 4.761a2.48 2.48 0 0 1-3.54-.006c-1.055-1.061-2.599-2.762-3.883-4.778C5.07 14.828 4 12.433 4 10m8.002 2.049q1.033 0 1.765-.735.733-.735.733-1.768t-.735-1.764a2.41 2.41 0 0 0-1.767-.733q-1.033 0-1.765.735A2.41 2.41 0 0 0 9.5 9.55q0 1.032.735 1.765.736.733 1.767.733" clip-rule="evenodd"></path> </svg>
            <span>{{ selectedRegion || '지역선택' }}</span>
            <i class="arrow">></i>
          </div>

          <div v-if="showDropdown" class="dropdown-list grid-dropdown">
            <!-- 왼쪽: 시 목록 -->
            <div class="city-list">
              <div
                v-for="city in cities"
                :key="city.name"
                class="city-item"
                :class="{ selected: city.name === selectedCity }"
                @click="selectCity(city.name)"
              >
                {{ city.name }}
              </div>
            </div>

            <!-- 오른쪽: 선택된 시의 구 목록 -->
            <div class="district-list">
              <div v-if="selectedCity">
                <div
                  v-for="district in cities.find(c => c.name === selectedCity)?.districts || []"
                  :key="district"
                  class="district-item"
                  @click="selectDistrict(district)"
                >
                  {{ district }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="current-location" @click="useCurrentLocation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15.4" fill="none" viewBox="0 0 23 23"> <path fill="currentColor" d="M18.74 4.022a.975.975 0 0 1 1.257 1.257l-6.059 16.047c-.308.816-1.45.848-1.803.052l-2.06-6.938a.98.98 0 0 0-.495-.495l-6.938-2.06c-.797-.354-.764-1.496.051-1.804z"></path> <path fill="currentColor" fill-rule="evenodd" d="m11.485 13.92 1.606 5.406 5.093-13.49-13.49 5.093 5.406 1.605.088.04c.56.249 1.009.697 1.258 1.257zm-8.843-2.036c-.797-.353-.764-1.495.051-1.803l16.048-6.059a.975.975 0 0 1 1.256 1.257l-6.059 16.047c-.308.816-1.45.848-1.803.052l-2.06-6.938a.98.98 0 0 0-.495-.495z" clip-rule="evenodd"></path> </svg>
          내 주변
        </button>
      </div>

      <div class="recent-regions" v-if="recentRegions.length">
        <span class="recent-label">최근 선택 지역</span>
        <div class="tags">
          <span v-for="(region, index) in recentRegions" :key="index" class="tag">
            {{ region }}
            <button class="remove-tag" @click="removeRecentRegion(index)">✕</button>
          </span>
        </div>
      </div>
    </section>
  </div>
</template>


<style scoped>
.category-page {
  max-width: 650px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: sans-serif;
}

.section-label {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.recent-label {
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 0.35rem;
  display: block;
  color: #555;
}

.selection-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  justify-content: center;
}

.dropdown-wrapper {
  flex: none; /* 검색바 너비 고정 */
  width: 75%;
  position: relative; /* 드롭다운 기준 */
}

.dropdown {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
}

.dropdown span {
  flex: 1;
  text-align: left;
}

.arrow {
  font-size: 0.75rem;
}

.dropdown-list {
  position: absolute;
  top: 100%;          /* 검색바 바로 아래 */
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  z-index: 9999; /* 맨 앞으로 */
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.current-location {
  width: 13%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.05rem;
  padding: 0.3rem 0.3rem;
  background-color: #F37021;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.recent-regions {
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.remove-tag {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
}

.location-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  width: 100%;
}

.grid-dropdown {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  z-index: 9999;
  max-height: 350px;
  overflow-y: auto;
}

.city-list {
  width: 30%;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.city-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.city-item.selected {
  background-color: #f3f4f6;
  font-weight: bold;
}

.district-list {
  width: 70%;
  display: flex;
  flex-direction: column;
}

.district-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.district-item:hover {
  background-color: #f3f4f6;
}
</style>