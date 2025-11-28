<script setup lang="ts">
const user = useSupabaseUser()

watch(user, () => {
  if (!user.value) {
    navigateTo('/login')
  }
}, { immediate: true })

const users = ref<any[]>([])
const userRole = ref<string>('basic')
const loading = ref(true)

const newUser = reactive({
  email: '',
  password: '',
  role: 'basic'
})
const addingUser = ref(false)
const error = ref('')
const success = ref('')

async function loadData() {
  if (!user.value) return
  
  // Get current user's role
  const profile = await $fetch('/api/getProfile', {
    method: 'POST',
    body: { user_id: user.value.id }
  })
  
  userRole.value = profile?.role || 'basic'
  
  // If not admin, redirect
  if (userRole.value !== 'admin') {
    navigateTo('/')
    return
  }
  
  // Get all users
  const data = await $fetch('/api/getUsers', {
    method: 'POST'
  })
  
  users.value = data || []
  loading.value = false
}

async function addUser() {
  addingUser.value = true
  error.value = ''
  success.value = ''
  
  try {
    await $fetch('/api/addUser', {
      method: 'POST',
      body: {
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
      }
    })
    
    success.value = 'User added successfully!'
    newUser.email = ''
    newUser.password = ''
    newUser.role = 'basic'
    loadData()
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to add user'
  }
  
  addingUser.value = false
}

async function toggleBan(userId: string, currentBanned: boolean) {
  await $fetch('/api/banUser', {
    method: 'POST',
    body: {
      user_id: userId,
      banned: !currentBanned
    }
  })
  loadData()
}

loadData()
</script>

<template>
  <Header />
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">User Management</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else>
      <!-- Add User Form -->
      <div class="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 class="text-xl font-semibold mb-4">Add New User</h2>
        
        <div v-if="error" class="bg-red-100 text-red-700 p-3 rounded mb-4">
          {{ error }}
        </div>
        
        <div v-if="success" class="bg-green-100 text-green-700 p-3 rounded mb-4">
          {{ success }}
        </div>

        <div class="flex gap-4 items-end">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              v-model="newUser.email" 
              class="border rounded px-3 py-2 w-64"
              placeholder="user@example.com"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              v-model="newUser.password" 
              class="border rounded px-3 py-2 w-48"
              placeholder="Password"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Role</label>
            <select v-model="newUser.role" class="border rounded px-3 py-2">
              <option value="basic">Basic</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button 
            @click="addUser"
            :disabled="addingUser || !newUser.email || !newUser.password"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {{ addingUser ? 'Adding...' : 'Add User' }}
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <table class="w-full border-collapse border">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-3 text-left">Email</th>
            <th class="border p-3 text-left">Role</th>
            <th class="border p-3 text-left">Status</th>
            <th class="border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td class="border p-3">{{ u.email }}</td>
            <td class="border p-3">{{ u.role }}</td>
            <td class="border p-3">
              <span :class="u.banned ? 'text-red-600' : 'text-green-600'">
                {{ u.banned ? 'Banned' : 'Active' }}
              </span>
            </td>
            <td class="border p-3">
              <button 
                @click="toggleBan(u.id, u.banned)"
                :class="u.banned ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'"
                class="text-white px-3 py-1 rounded text-sm"
              >
                {{ u.banned ? 'Unban' : 'Ban' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>