<script setup lang="ts">
const user = useSupabaseUser()

watch(user, () => {
  if (!user.value) {
    navigateTo('/login')
  }
}, { immediate: true })

const formState = reactive({
  title: '',
  content: ''
})
const loading = ref(false)
const success = ref(false)
const error = ref('')

async function submitData() {
  loading.value = true
  success.value = false
  error.value = ''

  try {
    await $fetch('/api/postData', {
      method: 'POST',
      body: {
        title: formState.title,
        content: formState.content,
        user_id: user.value?.id
      }
    })
    
    success.value = true
    formState.title = ''
    formState.content = ''
  } catch (e: any) {
    error.value = e.message || 'Failed to submit'
  }
  
  loading.value = false
}
</script>

<template>
  <Header />
  <div class="flex flex-col items-center justify-center p-8">
    <h1 class="text-2xl font-bold mb-6">Add New Entry</h1>

    <div v-if="success" class="bg-green-100 text-green-700 p-3 rounded mb-4 w-96">
      Entry added successfully!
    </div>

    <div v-if="error" class="bg-red-100 text-red-700 p-3 rounded mb-4 w-96">
      {{ error }}
    </div>

    <div class="flex flex-col gap-4 w-96">
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input 
          type="text" 
          v-model="formState.title" 
          class="w-full border rounded px-3 py-2"
          placeholder="Enter title"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Content</label>
        <textarea 
          v-model="formState.content" 
          class="w-full border rounded px-3 py-2 h-32"
          placeholder="Enter content"
        ></textarea>
      </div>

      <button 
        @click="submitData"
        :disabled="loading || !formState.title"
        class="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ loading ? 'Submitting...' : 'Submit' }}
      </button>
    </div>
  </div>
</template>