import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  // TODO: add process.env vars
  // related https://github.com/nuxt/framework/issues/3317
  // publicRuntimeConfig: {
  //   authProfileId: process.env.NUXT_ENV_AUTH_PROFILE_ID,
  //   apiEndpoint: process.env.NUXT_ENV_API_ENDPOINT,
  // }
})
