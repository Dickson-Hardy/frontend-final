// Simple test script to verify API connection
const API_BASE_URL = 'https://octopus-app-3jhrw.ondigitalocean.app'

async function testAPI() {
  console.log('🧪 Testing API connection...')
  console.log('📍 Base URL:', API_BASE_URL)
  
  // Test the corrected URL format
  const correctedURL = `${API_BASE_URL.replace(/\/$/, '')}/api/v1/statistics/journal`
  console.log('🔗 Testing URL:', correctedURL)
  
  try {
    const response = await fetch(correctedURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log('📊 Response status:', response.status)
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Success! Data:', data)
    } else {
      const errorText = await response.text()
      console.log('❌ Error response:', errorText)
    }
  } catch (error) {
    console.error('🚨 Network error:', error.message)
  }
}

// Test the old problematic URL format
async function testProblematicURL() {
  console.log('\n🧪 Testing problematic URL format...')
  const problematicURL = `${API_BASE_URL}/api/v1/statistics/journal`
  console.log('🔗 Problematic URL:', problematicURL)
  
  try {
    const response = await fetch(problematicURL)
    console.log('📊 Response status:', response.status)
    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Error response:', errorText)
    }
  } catch (error) {
    console.error('🚨 Network error:', error.message)
  }
}

// Run tests
testAPI()
testProblematicURL()