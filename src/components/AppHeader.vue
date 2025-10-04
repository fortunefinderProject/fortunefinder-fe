<script setup lang="ts">
// Handle login button click
const handleLogin = () => {
  console.log('Login clicked')
  // TODO: Implement login functionality
}

// Handle navigation clicks
const handleNavigation = (menu: string) => {
  console.log(`Navigating to: ${menu}`)
  // TODO: Implement navigation functionality
}
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo section -->
      <div class="logo" @click="clickLogo">
        <img src="/images/fflogo.svg" alt="FortuneFinder" class="logo-image">
        FortuneFinder
      </div>

      <!-- Login button -->
      <button class="login-btn" @click="handleLogin">
        Login
      </button>
    </div>
  </header>
</template>

<style scoped>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 480;
  color: #1f2937;
}

.logo-image {
  height: 2rem;
  width: auto;
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
</style>