<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const userRole = ref('basic')

async function loadRole() {
  if (user.value) {
    const { data } = await client
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single()
    userRole.value = data?.role || 'basic'
  }
}

async function logout() {
  await client.auth.signOut()
  navigateTo('/login')
}

loadRole()
</script>

<template>
  <div class="flex flex-row justify-between w-full px-4 pt-4">
    <img
      src="../public/full_logo.png"
      alt="Clear Lakes Dental"
      class="w-[256px] h-[152px]"
    />

    <div class="flex flex-row gap-8 h-fit pt-16 items-center">
      <h1
        class="text-3xl font-semibold border-2 border-[#a5dcb0] rounded-lg p-2 hover:bg-[#a5dcb0] hover:text-white cursor-pointer"
        @click="navigateTo('/')"
      >
        Main Page
      </h1>
      <h1
        class="text-3xl font-semibold border-2 border-[#9ad7db] rounded-lg p-2 hover:bg-[#9ad7db] hover:text-white cursor-pointer"
        @click="navigateTo('/addData')"
      >
        Add Data
      </h1>
      <h1
        v-if="userRole === 'admin'"
        class="text-3xl font-semibold border-2 border-[#d9a5dc] rounded-lg p-2 hover:bg-[#d9a5dc] hover:text-white cursor-pointer"
        @click="navigateTo('/users')"
      >
        Users
      </h1>
      <button
        @click="logout"
        class="text-xl font-semibold border-2 border-red-400 rounded-lg p-2 hover:bg-red-400 hover:text-white cursor-pointer"
      >
        Logout
      </button>
    </div>
  </div>
</template>