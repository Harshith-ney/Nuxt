<script setup lang="ts">
definePageMeta({
  middleware: []
})

const client = useSupabaseClient()

const formState = reactive({
  email: '',
  password: ''
})
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  const { data, error: authError } = await client.auth.signInWithPassword({
    email: formState.email,
    password: formState.password
  })
  
  if (authError) {
    error.value = authError.message
    loading.value = false
    return
  }

  // Check if user is banned
  const { data: profile } = await client
    .from('profiles')
    .select('banned')
    .eq('id', data.user.id)
    .single()

  if (profile?.banned) {
    await client.auth.signOut()
    error.value = 'Your account has been banned. Contact admin.'
    loading.value = false
    return
  }
  
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <img src="../public/full_logo.png" alt="Clear Lakes Dental" class="w-48 mx-auto mb-6" />
      <h1 class="text-2xl font-bold text-center mb-6">Login</h1>
      
      <div v-if="error" class="bg-red-100 text-red-700 p-3 rounded mb-4">
        {{ error }}
      </div>
      
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            v-model="formState.email" 
            class="w-full border rounded px-3 py-2"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            v-model="formState.password" 
            class="w-full border rounded px-3 py-2"
            placeholder="Enter your password"
          />
        </div>
        
        <button 
          @click="handleLogin"
          :disabled="loading"
          class="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
    </div>
  </div>
</template>