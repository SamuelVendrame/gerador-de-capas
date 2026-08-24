export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
    components: [
    { path: '~/components', pathPrefix: false }
  ],
  app: {
    head: {
      link: [
              {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Tilt+Neon&display=swap",
            },
          ],
        },
      },
    })
