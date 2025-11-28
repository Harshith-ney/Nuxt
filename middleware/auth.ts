export default defineNuxtRouteMiddleware(async (to) => {
    const client = useSupabaseClient()
    const { data: { session } } = await client.auth.getSession()
    
    // If not logged in and not on login page, redirect to login
    if (!session && to.path !== '/login') {
      return navigateTo('/login')
    }
    
    // If logged in and on login page, redirect to home
    if (session && to.path === '/login') {
      return navigateTo('/')
    }
  })