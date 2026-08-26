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
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Cormorant+Garamond:wght@400;700&family=Bebas+Neue&family=Space+Grotesk:wght@400;700&family=Baloo+2:wght@400;700&display=swap",
        },
      ],
    },
  },
})