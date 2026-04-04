export default defineNuxtRouteMiddleware(async () => {
  const { hydrateSession } = useAdmin()
  await hydrateSession()
})
