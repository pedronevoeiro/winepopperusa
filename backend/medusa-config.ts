import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3000",
      authCors: process.env.AUTH_CORS || "http://localhost:3000",
      jwtSecret: process.env.JWT_SECRET || "supersecret-jwt",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret-cookie",
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },
  modules: [
    // Stripe Payment Provider
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY || "",
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
              automatic_payment_methods: true,
              capture: true,
            },
          },
        ],
      },
    },
    // S3-compatible File Storage (Cloudflare R2)
    {
      resolve: "@medusajs/file-s3",
      options: {
        file_url: process.env.S3_FILE_URL || "",
        access_key_id: process.env.S3_ACCESS_KEY_ID || "",
        secret_access_key: process.env.S3_SECRET_ACCESS_KEY || "",
        region: process.env.S3_REGION || "auto",
        bucket: process.env.S3_BUCKET || "winepopper-media",
        endpoint: process.env.S3_ENDPOINT || "",
        additional_config: {
          forcePathStyle: true,
        },
      },
    },
  ],
})
