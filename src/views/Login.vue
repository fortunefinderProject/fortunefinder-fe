<script setup lang="ts">
// 로그인 버튼 클릭 핸들러
const handleKakaoLogin = () => {
  console.log("카카오 로그인 시도");
  // TODO: 카카오 OAuth redirect 로직 추가
};

const handleNaverLogin = () => {
  console.log("네이버 로그인 시도");
  // TODO: 네이버 OAuth redirect 로직 추가
};
</script>

<template>
  <div class="login-page">
    <!-- 로고 -->
    <div class="logo-box">
      <img src="/images/fflogo.png" alt="FortuneFinder" class="logo-image">
      FortuneFinder
    </div>

    <!-- 로그인/회원가입 타이틀 -->
    <div class="login__title">
      <span class="line"></span>
      <span class="caption">로그인/회원가입</span>
      <span class="line"></span>
    </div>

    <!-- 로그인 버튼 영역 -->
    <div class="login-buttons">
      <button class="login-button kakao" @click="handleKakaoLogin">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="#3C1E1E" viewBox="0 0 21 21"><path fill="current" d="M10.5 3.217c4.514 0 8 2.708 8 6.004 0 3.758-4.045 6.184-8 5.892-1.321-.093-1.707-.17-2.101-.23-1.425.814-2.728 2.344-3.232 2.334-.325-.19.811-2.896.533-3.114-.347-.244-3.157-1.329-3.2-4.958 0-3.199 3.486-5.928 8-5.928Z"></path></svg>
        카카오로 시작하기
      </button>
      <button class="login-button naver" @click="handleNaverLogin">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21"><path fill="#fff" d="M4 16.717h4.377V9.98l4.203 6.737H17v-13h-4.377v6.737l-4.16-6.737H4v13Z"></path></svg>
        네이버로 시작하기
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  width: 100%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 2rem;
}

.logo-box {
  font-size: 2rem;
  font-weight: 480;
  color: #1f2937;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 로그인/회원가입 타이틀 */
.login__title {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 360px; /* 버튼과 동일한 최대 너비 */
  margin: 0 auto 2rem;
  opacity: 65%;
}

.login__title .caption {
  padding: 0 0.8rem; /* 패딩 최소화 */
  color: #888888;
  font-weight: 500;
  font-size: 1rem;
  white-space: nowrap;
  text-align: center;
  box-sizing: border-box;
}

/* 텍스트 좌우 실선 */
.login__title .line {
  flex: 1;             /* 남은 공간만큼 선 길이 확장 */
  height: 1px;         /* 선 두께 */
  background-color: #cccccc;
}

.login-buttons {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border: none;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* 카카오 버튼 */
.kakao {
  background-color: #fee500;
  color: #3c1e1e;
}

/* 네이버 버튼 */
.naver {
  background-color: #03c75a;
  color: #ffffff;
}

/* 아이콘 크기 조절 */
.icon {
  font-size: 1.25rem;
}

.logo-image {
  height: 8rem;
  padding: 0 3.5rem;
  width: auto;
}
</style>
