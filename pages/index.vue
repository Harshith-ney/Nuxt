<script setup lang="ts">
const user = useSupabaseUser()

watch(user, () => {
  if (!user.value) {
    navigateTo('/login')
  }
}, { immediate: true })

const entries = ref<any[]>([])
const userRole = ref<string>('basic')
const loading = ref(true)

async function loadData() {
  if (!user.value) return
  
  // Get user's role from profiles
  const profile = await $fetch('/api/getProfile', {
    method: 'POST',
    body: { user_id: user.value.id }
  })
  
  userRole.value = profile?.role || 'basic'
  
  // Get entries based on role
  const data = await $fetch('/api/getEntries', {
    method: 'POST',
    body: { 
      user_id: user.value.id,
      role: userRole.value
    }
  })
  
  entries.value = data || []
  loading.value = false
}

loadData()
</script>

<template>
  <Header />
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">My Entries</h1>
      <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded">
        Role: {{ userRole }}
      </span>
    </div>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else-if="entries.length === 0" class="text-gray-500">
      No entries yet. Go to Add Data to create one.
    </div>

    <table v-else class="w-full border-collapse border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-3 text-left">ID</th>
          <th class="border p-3 text-left">Title</th>
          <th class="border p-3 text-left">Content</th>
          <th v-if="userRole === 'admin'" class="border p-3 text-left">User ID</th>
          <th class="border p-3 text-left">Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.id">
          <td class="border p-3">{{ entry.id }}</td>
          <td class="border p-3">{{ entry.title }}</td>
          <td class="border p-3">{{ entry.content }}</td>
          <td v-if="userRole === 'admin'" class="border p-3 text-xs">{{ entry.user_id }}</td>
          <td class="border p-3">{{ new Date(entry.created_at).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>