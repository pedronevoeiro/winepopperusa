import { defineConfig, loadEnv, Modules } from "@medusajs/framework/utils"

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
    disable: true,
  },
  modules: [
    // Stripe Payment Provider
    {
      key: Modules.PAYMENT,
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
    // EasyPost Fulfillment Provider
    {
      key: Modules.FULFILLMENT,
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "./src/modules/easypost",
            id: "easypost",
            options: {
              apiKey: process.env.EASYPOST_API_KEY || "",
            },
          },
        ],
      },
    },
    // Resend Email Notification Provider
    {
      key: Modules.NOTIFICATION,
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend-notification",
            id: "resend",
            options: {
              channels: ["email"],
              apiKey: process.env.RESEND_API_KEY || "",
              fromEmail: process.env.EMAIL_FROM || "orders@winepopperusa.com",
            },
          },
        ],
      },
    },
    // S3-compatible File Storage (Cloudflare R2)
    ...(process.env.S3_ACCESS_KEY_ID ? [{
      key: Modules.FILE,
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-s3",
            id: "s3",
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
      },
    }] : []),
  ],
})
