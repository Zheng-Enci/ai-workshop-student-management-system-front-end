import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(false)
  const autoThemeEnabled = ref(true)

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    autoThemeEnabled.value = false
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    localStorage.setItem('autoTheme', 'false')
    updateDocumentTheme()
  }

  const setTheme = (theme) => {
    isDarkMode.value = theme === 'dark'
    autoThemeEnabled.value = false
    localStorage.setItem('theme', theme)
    localStorage.setItem('autoTheme', 'false')
    updateDocumentTheme()
  }

  const enableAutoTheme = () => {
    autoThemeEnabled.value = true
    localStorage.setItem('autoTheme', 'true')
    checkTimeBasedTheme()
  }

  const checkTimeBasedTheme = () => {
    if (!autoThemeEnabled.value) return
    
    const hour = new Date().getHours()
    const shouldBeDark = hour < 6 || hour >= 18
    
    if (isDarkMode.value !== shouldBeDark) {
      isDarkMode.value = shouldBeDark
      updateDocumentTheme()
    }
  }

  const initTheme = () => {
    const savedAutoTheme = localStorage.getItem('autoTheme')
    const savedTheme = localStorage.getItem('theme')
    
    if (savedAutoTheme === 'true') {
      autoThemeEnabled.value = true
      checkTimeBasedTheme()
    } else if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
      autoThemeEnabled.value = false
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDarkMode.value = prefersDark
      autoThemeEnabled.value = true
      localStorage.setItem('autoTheme', 'true')
    }
    
    updateDocumentTheme()
    
    setInterval(checkTimeBasedTheme, 60000)
  }

  const updateDocumentTheme = () => {
    const html = document.documentElement
    if (isDarkMode.value) {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }
  }

  const currentTheme = computed(() => isDarkMode.value ? 'dark' : 'light')

  return {
    isDarkMode,
    autoThemeEnabled,
    currentTheme,
    toggleTheme,
    setTheme,
    enableAutoTheme,
    initTheme
  }
})
